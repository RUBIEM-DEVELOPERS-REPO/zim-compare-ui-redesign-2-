import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Fetch existing manual school records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolName = searchParams.get("schoolName")

    const where: any = {}
    if (schoolName) where.schoolName = schoolName

    const records = await prisma.schoolManualData.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ records })
  } catch (error: any) {
    console.error("School Manual Data GET Error:", error)
    return NextResponse.json({ error: "Failed to load records." }, { status: 500 })
  }
}

// POST: Create or update a school manual record (upsert by schoolName)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      schoolName,
      location,
      schoolType,
      province,
      tuitionFee,
      currency,
      admissionFee,
      boardingFee,
      uniformCost,
      booksCost,
      examFee,
      passRate,
      numberOfTerms,
      annualFee,
      normalised,
    } = body

    if (!schoolName || !location) {
      return NextResponse.json({ error: "schoolName and location are required." }, { status: 400 })
    }

    const data = {
      schoolName,
      location,
      schoolType: schoolType ?? "day",
      province: province ?? "",
      tuitionFee: parseFloat(tuitionFee) || 0,
      currency: currency ?? "USD",
      admissionFee: admissionFee != null ? parseFloat(admissionFee) : null,
      boardingFee: boardingFee != null ? parseFloat(boardingFee) : null,
      uniformCost: uniformCost != null ? parseFloat(uniformCost) : null,
      booksCost: booksCost != null ? parseFloat(booksCost) : null,
      examFee: examFee != null ? parseFloat(examFee) : null,
      passRate: parseFloat(passRate) || 0,
      numberOfTerms: parseInt(numberOfTerms) || 3,
      annualFee: parseFloat(annualFee) || 0,
      normalised: normalised != null ? parseFloat(normalised) : null,
      isManual: true,
      source: "manual-entry",
      lastManualUpdate: new Date(),
    }

    const record = await prisma.schoolManualData.upsert({
      where: { schoolName },
      update: {
        ...data,
      },
      create: {
        ...data,
      },
    })

    return NextResponse.json({ record })
  } catch (error: any) {
    console.error("School Manual Data POST Error:", error)
    return NextResponse.json({ error: "Failed to save record." }, { status: 500 })
  }
}
