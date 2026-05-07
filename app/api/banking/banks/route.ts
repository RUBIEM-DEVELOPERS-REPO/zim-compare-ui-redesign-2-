import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { bankingProducts } from "@/lib/mock/banks"

// Helper to get unique banks from products mock
const mockBanks = Array.from(new Set(bankingProducts.map(p => p.bankId))).map(id => {
  const product = bankingProducts.find(p => p.bankId === id)
  return {
    id: product?.bankId,
    name: product?.bankName,
    type: "commercial", // Default for mock
    transparencyScore: 85,
    logo: null
  }
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where = type ? { type } : {}

    let banks = await prisma.bank.findMany({
      where,
      orderBy: { transparencyScore: 'desc' }
    })

    if (banks.length === 0) {
      banks = mockBanks as any
      if (type) banks = banks.filter((b: any) => b.type === type) as any
    }

    return NextResponse.json({ banks })
  } catch (error: any) {
    console.error("Banking Banks API Error, falling back to mocks:", error)
    return NextResponse.json({ banks: mockBanks })
  }
}
