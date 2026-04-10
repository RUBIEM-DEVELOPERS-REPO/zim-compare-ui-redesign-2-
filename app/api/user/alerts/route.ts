import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const alerts = await prisma.alert.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const { message, type, category, itemId } = await request.json()

    const alert = await prisma.alert.create({
      data: {
        userId: payload.id,
        message: message || "New alert",
        type: type || 'info',
        category: category || 'general',
        itemId: itemId || 'none',
      }
    })

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
