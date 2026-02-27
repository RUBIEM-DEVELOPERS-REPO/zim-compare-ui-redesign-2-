"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const sampleResponses: Record<string, string> = {
  bank: "Based on your profile, I recommend **Stanbic Bank** for the best balance of transparency, digital features, and competitive fees. Their PureSave account offers 4.0% interest with goal savings features. For the lowest fees, POSB has ZIPIT at just $0.80 per transaction.",
  telecom: "For mobile, **Econet Wireless** has the best coverage (92%) but is pricier. If you're budget-conscious, **Telecel** offers the cheapest data at $1.33/GB on their 15GB monthly plan. For home internet, **Liquid Telecom** provides the best fibre value at $0.30/GB.",
  school: "For boarding schools, **Peterhouse Boys** leads with a 98% pass rate and 1:8 student-teacher ratio, though it costs $16,500/year. For a more affordable option, **Plumtree High School** at $4,200/year offers solid academics. Best day school is **Eaglesvale** with STEM focus.",
  insurance: "For motor insurance, **Old Mutual Comprehensive** offers the most complete cover at $45/month. For medical, **CIMAS Premier** has the fastest claims (7 days average) and broadest coverage. If budget matters, **FEMAS Silver** starts at just $45/month for basic medical.",
  default: "I can help you compare banks, telecoms, schools, and insurance in Zimbabwe. Try asking about the best bank for savings, cheapest data bundles, top schools, or most reliable insurance provider.",
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes("bank") || lower.includes("saving") || lower.includes("loan") || lower.includes("fee")) return sampleResponses.bank
  if (lower.includes("telecom") || lower.includes("data") || lower.includes("network") || lower.includes("bundle") || lower.includes("fibre")) return sampleResponses.telecom
  if (lower.includes("school") || lower.includes("education") || lower.includes("tuition") || lower.includes("boarding")) return sampleResponses.school
  if (lower.includes("insurance") || lower.includes("medical") || lower.includes("motor") || lower.includes("cover") || lower.includes("claims")) return sampleResponses.insurance
  return sampleResponses.default
}

export default function ChatPage() {
  const { chatMessages, addChatMessage, clearChat, role } = useAppStore()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    addChatMessage(userMsg)
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(userMsg.content)
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      })
      setIsTyping(false)
    }, 800)
  }

  const suggestedQuestions = [
    "Which bank has the lowest fees?",
    "Best data bundle for students?",
    "Compare boarding schools",
    "Cheapest motor insurance?",
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Ask ZimCompare</h1>
          <p className="text-sm text-muted-foreground">Get personalized guidance on banks, telecoms, schools & insurance</p>
        </div>
        {chatMessages.length > 0 && (
          <button
            onClick={clearChat}
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-sm text-muted-foreground">Start a conversation or try a suggested question:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[80%] rounded-xl p-3 text-sm",
              msg.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            )}
          >
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="max-w-[80%] rounded-xl bg-secondary p-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={role === "guest" ? "Sign in for personalized answers..." : "Ask about banks, telecoms, schools, or insurance..."}
          className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  )
}
