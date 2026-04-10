import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    const schools = await prisma.school.findMany({
      where,
      orderBy: { transparencyScore: 'desc' },
    })

    return NextResponse.json({ schools })
  } catch (error: any) {
    console.error("Schools Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
