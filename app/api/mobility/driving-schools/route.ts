import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    const where = city ? { city } : {}

    const rawDrivingSchools = await prisma.drivingSchool.findMany({
      where,
      orderBy: { passRate: 'desc' },
    })

    const drivingSchools = filterVerifiedRecords(rawDrivingSchools, "mobility")

    return NextResponse.json({ drivingSchools })
  } catch (error: any) {
    console.error("Driving Schools API Error:", error)
    return NextResponse.json({ error: "Failed to load driving schools data. Please try again later." }, { status: 500 })
  }
}
