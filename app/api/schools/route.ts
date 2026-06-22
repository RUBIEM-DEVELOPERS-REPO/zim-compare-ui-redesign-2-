import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const province = searchParams.get("province")
    const city = searchParams.get("city")

    const where: any = {}
    if (type) where.type = type
    if (province) where.province = province
    if (city) where.city = city

    const rawSchools = await prisma.school.findMany({
      where,
      orderBy: [
        { isManual: 'desc' },
        { transparencyScore: 'desc' }
      ],
    })

    const schools = filterVerifiedRecords(rawSchools, "education")

    const uniqueSchools = Array.from(
      new Map(
        schools.map((school) => [school.name, school])
      ).values()
    ).sort((a, b) => {
      if (a.isManual !== b.isManual) return b.isManual ? 1 : -1
      return (b.transparencyScore || 0) - (a.transparencyScore || 0)
    })

    return NextResponse.json({ schools: uniqueSchools })
  } catch (error: any) {
    console.error("Schools API Error:", error)
    return NextResponse.json({ schools: [] }, { status: 500 })
  }
}
