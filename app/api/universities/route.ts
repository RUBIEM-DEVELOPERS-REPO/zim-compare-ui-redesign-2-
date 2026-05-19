import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const province = searchParams.get("province")

    const where: any = {}
    if (type) where.type = type
    if (province) where.provinceArea = province

    const rawUniversities = await prisma.university.findMany({
      where,
      orderBy: { university: 'asc' },
    })

    const universities = filterVerifiedRecords(rawUniversities, "education")

    return NextResponse.json({ universities })
  } catch (error: any) {
    console.error("Universities API Error:", error)
    return NextResponse.json({ universities: [] }, { status: 500 })
  }
}
