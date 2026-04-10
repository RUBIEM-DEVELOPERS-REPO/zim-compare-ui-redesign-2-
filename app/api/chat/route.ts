import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromHeader } from "@/lib/auth"

// Basic AI chat endpoint simulation
export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()
    const token = getTokenFromHeader(request.headers.get("authorization"))
    let userId = null
    
    if (token) {
      const payload = verifyToken(token)
      if (payload) userId = payload.id
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (userId) {
      // Record the user's message
      await prisma.chatMessage.create({
        data: {
          userId,
          content: message,
          role: "user"
        }
      })
    }

    // Dummy logic for a contextual response.
    // In reality this would call an LLM API (like GPT-4).
    let aiResponse = "I'm ZimCompare AI assistant. "
    const msg = message.toLowerCase()
    if (msg.includes("loan") || msg.includes("borrow")) {
      aiResponse += "If you're looking for loans, check out the Banking comparison page."
    } else if (msg.includes("data") || msg.includes("internet")) {
      aiResponse += "I can help you find cheap data! Tell me your budget or check our Telecom tab."
    } else if (msg.includes("how much") || msg.includes("price")) {
      aiResponse += "We list prices for nearly everything including banks, bundles, schools, and insurance."
    } else {
      aiResponse += "How can I help you compare items today?"
    }

    if (userId) {
      // Record AI response
      await prisma.chatMessage.create({
        data: {
          userId,
          content: aiResponse,
          role: "assistant"
        }
      })
    }

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
