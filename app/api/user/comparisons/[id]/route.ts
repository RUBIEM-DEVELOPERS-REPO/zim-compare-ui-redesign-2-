import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeader(request.headers.get("authorization"))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = (await params).id
    const comparison = await prisma.savedComparison.findUnique({ where: { id } })
    
    if (!comparison || comparison.userId !== payload.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 })
    }

    await prisma.savedComparison.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
