"use client"

import { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X, MessageCircle, Send, Trash2, ChevronDown } from "lucide-react"

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

export function ChatWidget() {
    const { chatMessages, addChatMessage, clearChat } = useAppStore()
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const isMountedRef = useRef(true)
    const endRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setIsMounted(true)
        isMountedRef.current = true
        // Add welcome message if chat is empty
        if (chatMessages.length === 0) {
            addChatMessage({
                id: "welcome-msg",
                role: "assistant",
                content: "Hi! What would you like to compare today?",
                timestamp: new Date().toISOString(),
            })
        }
        return () => {
            isMountedRef.current = false
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            endRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [chatMessages, isOpen])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [input])

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!input.trim() || isTyping) return

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
            if (!isMountedRef.current) return
            const response = getResponse(userMsg.content)
            addChatMessage({
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                timestamp: new Date().toISOString(),
            })
            setIsTyping(false)
        }, 1000)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (!isMounted) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={cn(
                        "mb-4 overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-all duration-300",
                        "bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60",
                        "w-[calc(100vw-3rem)] sm:w-[360px] h-[500px] flex flex-col",
                        "animate-in slide-in-from-bottom-4 fade-in"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/50 bg-primary/10 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-sm font-semibold text-foreground">ZimCompare Assistant</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={clearChat}
                                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/50 hover:text-destructive transition-colors"
                                title="Clear Chat"
                                aria-label="Clear Chat"
                            >
                                <Trash2 size={16} aria-hidden="true" />
                                <span className="sr-only">Clear Chat</span>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                                title="Close Chat"
                                aria-label="Close Chat"
                            >
                                <X size={18} aria-hidden="true" />
                                <span className="sr-only">Close Chat</span>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                        {chatMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "max-w-[85%] rounded-2xl p-3 text-sm transition-all",
                                    msg.role === "user"
                                        ? "ml-auto bg-primary text-primary-foreground shadow-md shadow-primary/10"
                                        : "bg-secondary/50 text-foreground border border-border/30"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="max-w-[85%] rounded-2xl bg-secondary/50 p-3 border border-border/30">
                                <div className="flex gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-0" />
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-150" />
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-300" />
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-border/50 p-3 bg-secondary/20">
                        <form onSubmit={handleSend} className="relative flex items-end gap-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Type a message..."
                                className="min-h-[44px] max-h-[120px] scrollbar-none w-full resize-none rounded-xl border border-border/50 bg-background/50 px-4 py-3 pr-12 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all backdrop-blur-sm"
                            />
                            <button
                                type="submit"
                                title="Send Message"
                                aria-label="Send Message"
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 bottom-2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                            >
                                <Send size={18} aria-hidden="true" />
                                <span className="sr-only">Send Message</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Close Chat" : "Open Chat"}
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
                className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 active:scale-95",
                    isOpen
                        ? "bg-secondary text-foreground hover:bg-secondary/80"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30"
                )}
            >
                {isOpen ? <ChevronDown size={28} aria-hidden="true" /> : <MessageCircle size={28} aria-hidden="true" />}
                <span className="sr-only">{isOpen ? "Close Chat" : "Open Chat"}</span>
            </button>
        </div>
    )
}
