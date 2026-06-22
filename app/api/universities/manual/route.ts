import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Fetch existing manual university records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const universityName = searchParams.get("universityName")

    const where: any = {}
    if (universityName) where.universityName = universityName

    const records = await prisma.universityManualData.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ records })
  } catch (error: any) {
    console.error("University Manual Data GET Error:", error)
    return NextResponse.json({ error: "Failed to load records." }, { status: 500 })
  }
}

// POST: Create or update a university manual record (manual data overwrites DB)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      universityName,
      location,
      tuitionFee,
      currency,
      accommodationFee,
      applicationFee,
      labFee,
      libraryFee,
      studentUnionFee,
      annualFee,
      programmeDuration,
      programmeMatch,
      normalised,
      programs,
    } = body

    if (!universityName || !location) {
      return NextResponse.json({ error: "universityName and location are required." }, { status: 400 })
    }

    // Normalise the programs field — accept string or array
    let programsJson = "[]"
    if (programs) {
      if (typeof programs === "string") {
        programsJson = programs
      } else if (Array.isArray(programs)) {
        programsJson = JSON.stringify(programs)
      }
    }

    const data = {
      universityName,
      location,
      tuitionFee: parseFloat(tuitionFee) || 0,
      currency: currency ?? "USD",
      accommodationFee: accommodationFee != null ? parseFloat(accommodationFee) : null,
      applicationFee: applicationFee != null ? parseFloat(applicationFee) : null,
      labFee: labFee != null ? parseFloat(labFee) : null,
      libraryFee: libraryFee != null ? parseFloat(libraryFee) : null,
      studentUnionFee: studentUnionFee != null ? parseFloat(studentUnionFee) : null,
      annualFee: parseFloat(annualFee) || 0,
      programmeDuration: parseInt(programmeDuration) || 0,
      programmeMatch: parseFloat(programmeMatch) || 0,
      normalised: normalised != null ? parseFloat(normalised) : null,
      programs: programsJson,
      isManual: true,
      source: "manual-entry",
      lastManualUpdate: new Date(),
    }

    const record = await prisma.universityManualData.upsert({
      where: { universityName },
      update: data,
      create: data,
    })

    return NextResponse.json({ record })
  } catch (error: any) {
    console.error("University Manual Data POST Error:", error)
    return NextResponse.json({ error: "Failed to save record." }, { status: 500 })
  }
}
