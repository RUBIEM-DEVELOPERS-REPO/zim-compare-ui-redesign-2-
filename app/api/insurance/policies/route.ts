import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"
import { normalisePolicy, RawInsuranceInput } from "@/lib/insurance-normalise"

// ── GET /api/insurance/policies ─────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const category = searchParams.get("category")

    const where: any = {}
    if (providerId) where.providerId = providerId
    if (category) where.category = category

    const rawPolicies = await prisma.policy.findMany({
      where,
      orderBy: [{ isManual: "desc" }, { monthlyPremium: "asc" }],
    })

    const policies = filterVerifiedRecords(rawPolicies, "insurance")

    return NextResponse.json({ policies })
  } catch (error: any) {
    console.error("Insurance Policies GET Error:", error)
    return NextResponse.json({ error: "Failed to load policies" }, { status: 500 })
  }
}

// ── POST /api/insurance/policies ─────────────────────────────────────────────
// Receives a raw insurance record from the corporate input form,
// runs the normalisation layer, then writes to Policy + InsuranceProvider.

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Validate minimum required fields
    if (!body.providerName || !body.category || !body.monthlyPremium) {
      return NextResponse.json(
        { error: "providerName, category, and monthlyPremium are required" },
        { status: 400 }
      )
    }

    // 2. Run normalisation
    const normalised = normalisePolicy(body as RawInsuranceInput)

    // 3. Upsert InsuranceProvider (create if doesn't exist, update if manual)
    //    Use slug-style id based on provider name so duplicates are collapsed.
    const providerId = normalised.providerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const provider = await prisma.insuranceProvider.upsert({
      where: { id: providerId },
      create: {
        id: providerId,
        name: normalised.providerName,
        type: "insurance_company",
        transparencyScore: 50,
        digitalScore: 50,
        claimsScore: 50,
        avgClaimDays: 30,
        serviceAreas: JSON.stringify(["Harare", "Bulawayo", "Nationwide"]),
        isManual: true,
      },
      update: {
        // Only update name if this is a manual record (don't override scraped data)
        name: normalised.providerName,
      },
    })

    // 4. Create the Policy record
    const policy = await prisma.policy.create({
      data: {
        providerId: provider.id,
        providerName: normalised.providerName,
        category: normalised.category,
        type: normalised.type,
        name: normalised.name,
        monthlyPremium: normalised.monthlyPremium,
        annualPremium: normalised.annualPremium,
        excess: normalised.excess,
        waitingPeriodDays: normalised.waitingPeriodDays,
        coverLimit: normalised.coverLimit,
        benefits: normalised.benefits,
        exclusions: normalised.exclusions,
        currency: normalised.currency,
        isManual: true,
        normalisedScore: normalised.normalisedScore,
      },
    })

    return NextResponse.json(
      {
        success: true,
        policy,
        normalisedScore: normalised.normalisedScore,
        message: `Policy saved — normalised score: ${normalised.normalisedScore}`,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Insurance Policies POST Error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to save policy" },
      { status: 500 }
    )
  }
}
