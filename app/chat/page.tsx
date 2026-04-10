"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

import { apiPost } from "@/lib/api"

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

    apiPost('/chat', { message: userMsg.content })
        .then(res => {
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: res.message || "I could not generate a response. Please try again.",
              timestamp: new Date().toISOString(),
            })
            setIsTyping(false)
        })
        .catch(() => {
            addChatMessage({
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
              timestamp: new Date().toISOString(),
            })
            setIsTyping(false)
        })
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
