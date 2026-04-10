import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const province = searchParams.get("province")

    const where: any = {}
    if (type) where.type = type
    if (province) where.provinceArea = province

    const universities = await prisma.university.findMany({
      where,
      orderBy: { university: 'asc' },
    })

    return NextResponse.json({ universities })
  } catch (error: any) {
    console.error("Universities Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
