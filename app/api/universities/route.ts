import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { universities as mockUniversities } from "@/lib/mock/universities"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const province = searchParams.get("province")

    const where: any = {}
    if (type) where.type = type
    if (province) where.provinceArea = province

    let universities = await prisma.university.findMany({
      where,
      orderBy: { university: 'asc' },
    })

    if (universities.length === 0) {
      universities = mockUniversities as any
      if (type) universities = universities.filter((u: any) => u.type === type) as any
      if (province) universities = universities.filter((u: any) => u.provinceArea === province) as any
    }

    return NextResponse.json({ universities })
  } catch (error: any) {
    console.error("Universities API Error, falling back to mocks:", error)
    return NextResponse.json({ universities: mockUniversities })
  }
}
