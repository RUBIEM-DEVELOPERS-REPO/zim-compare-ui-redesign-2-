import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = (await params).id
    
    // update the read property
    const alert = await prisma.alert.update({
      where: { id },
      data: { read: true }
    })

    return NextResponse.json({ alert })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
