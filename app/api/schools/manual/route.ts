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

    const cleanData = {
      schoolName,
      location,
      tuitionFee: parseFloat(tuitionFee) || 0,
      currency: currency ?? "USD",
      admissionFee: admissionFee != null ? parseFloat(admissionFee) : null,
      boardingFee: boardingFee != null ? parseFloat(boardingFee) : null,
      uniformCost: uniformCost != null ? parseFloat(uniformCost) : null,
      booksCost: booksCost != null ? parseFloat(booksCost) : null,
      examFee: examFee != null ? parseFloat(examFee) : null,
      effectiveDate: new Date(),
    }

    const existing = await prisma.schoolManualData.findFirst({
      where: { schoolName }
    })

    let record
    if (existing) {
      record = await prisma.schoolManualData.update({
        where: { id: existing.id },
        data: cleanData,
      })
    } else {
      record = await prisma.schoolManualData.create({
        data: cleanData,
      })
    }

    return NextResponse.json({ record })
  } catch (error: any) {
    console.error("School Manual Data POST Error:", error)
    return NextResponse.json({ error: "Failed to save record." }, { status: 500 })
  }
}
