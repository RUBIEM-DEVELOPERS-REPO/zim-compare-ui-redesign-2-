import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ comparisons })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    const payload = token ? verifyToken(token) : null
    
    const { name, category, itemIds } = await request.json()

    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const comparison = await prisma.savedComparison.create({
      data: {
        userId: payload.id,
        name: name || "Saved Comparison",
        category: category || "general",
        itemIds: JSON.stringify(itemIds || [])
      }
    })

    return NextResponse.json({ comparison }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
