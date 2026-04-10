import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const views = await prisma.recentView.findMany({
      where: { userId: payload.id },
      orderBy: { timestamp: 'desc' }
    })

    return NextResponse.json({ views })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const { name, category, itemId } = await request.json()

    const view = await prisma.recentView.create({
      data: {
        userId: payload.id,
        name: name || "Unnamed",
        category: category || "general",
        itemId: itemId || "unknown"
      }
    })

    return NextResponse.json({ view }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
