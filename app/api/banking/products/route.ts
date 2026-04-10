import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bankId = searchParams.get("bankId")
    const category = searchParams.get("category")

    const where: any = {}
    if (bankId) where.bankId = bankId
    if (category) where.category = category

    const products = await prisma.bankingProduct.findMany({
      where,
      orderBy: { interestRate: 'desc' },
      include: {
        bank: {
          select: { name: true, logo: true, transparencyScore: true }
        }
      }
    })

    return NextResponse.json({ products })
  } catch (error: any) {
    console.error("Banking Products Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
