import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { schools as mockSchools } from "@/lib/mock/schools"

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

    let schools = await prisma.school.findMany({
      where,
      orderBy: { transparencyScore: 'desc' },
    })

    if (schools.length === 0) {
      schools = mockSchools as any
      if (type) schools = schools.filter((s: any) => s.type === type) as any
      if (province) schools = schools.filter((s: any) => s.province === province) as any
      if (city) schools = schools.filter((s: any) => s.city === city) as any
    }

    return NextResponse.json({ schools })
  } catch (error: any) {
    console.error("Schools API Error, falling back to mocks:", error)
    return NextResponse.json({ schools: mockSchools })
  }
}
