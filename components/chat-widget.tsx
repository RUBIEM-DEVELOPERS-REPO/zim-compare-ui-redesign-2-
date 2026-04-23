"use client"

import { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X, MessageCircle, Send, Trash2, ChevronDown, Image, Music, Mic, Film, Paperclip, StopCircle } from "lucide-react"

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
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [attachments, setAttachments] = useState<any[]>([])
    
    const isMountedRef = useRef(true)
    const endRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setIsMounted(true)
        isMountedRef.current = true
        // Add welcome message if chat is empty and not already present
        if (chatMessages.length === 0 || !chatMessages.some(m => m.id === "welcome-msg")) {
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
            const newHeight = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
            textareaRef.current.style.height = newHeight
        }
    }, [input])

    useEffect(() => {
        if (isRecording) {
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1)
            }, 1000)
        } else {
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
            setRecordingTime(0)
        }
        return () => {
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
        }
    }, [isRecording])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleFileClick = (type: string) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = type === "image" ? "image/*" : type === "video" ? "video/*" : type === "audio" ? "audio/*" : "*"
            fileInputRef.current.click()
        }
    }

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        // Mock attachment
        const newAttachment = {
            id: Date.now().toString(),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            type: file.type.split("/")[0] as any,
            url: URL.createObjectURL(file)
        }
        setAttachments(prev => [...prev, newAttachment])
        if (e.target) e.target.value = ""
    }

    const toggleRecording = () => {
        if (!isRecording) {
            setIsRecording(true)
        } else {
            setIsRecording(false)
            // Mock voice attachment
            const newAttachment = {
                id: Date.now().toString(),
                name: `Voice Recording ${formatTime(recordingTime)}`,
                size: "Variable",
                type: "audio" as const,
                url: "#",
                isVoice: true
            }
            setAttachments(prev => [...prev, newAttachment])
        }
    }

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id))
    }

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if ((!input.trim() && attachments.length === 0) || isTyping || isRecording) return

        const userMsg = {
            id: Date.now().toString(),
            role: "user" as const,
            content: input.trim(),
            timestamp: new Date().toISOString(),
            attachments: attachments.length > 0 ? [...attachments] : undefined
        }
        addChatMessage(userMsg)
        setInput("")
        setAttachments([])
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
        <div className="chat-widget-wrapper">
            {/* Chat Window */}
            {isOpen && (
                <div className="chat-widget-window glass-floating shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/50 bg-primary/10 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-sm font-medium text-foreground">Fintech Assistant</p>
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
                                        ? "ml-auto bg-primary text-primary-foreground shadow-md"
                                        : "bg-white/5 text-foreground border border-white/10 backdrop-blur-md"
                                )}
                            >
                                <div className="space-y-2">
                                    {msg.content && <p>{msg.content}</p>}
                                    {msg.attachments && (
                                        <div className="grid gap-2 mt-2">
                                            {msg.attachments.map((atch: any, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/10">
                                                    {atch.type === "image" && <Image size={14} className="text-primary-foreground" />}
                                                    {atch.type === "video" && <Film size={14} className="text-primary-foreground" />}
                                                    {atch.type === "audio" && <Music size={14} className="text-primary-foreground" />}
                                                    {atch.type === "file" && <Paperclip size={14} className="text-primary-foreground" />}
                                                    <span className="text-[10px] truncate max-w-[120px]">{atch.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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

                    {/* Input Area */}
                    <div className="border-t border-border/50 p-4 bg-secondary/10">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileSelect}
                            className="hidden"
                            title="File upload input"
                            aria-label="File upload input"
                        />

                        {/* Attachment Previews */}
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3 attachment-preview-enter">
                                {attachments.map((atch) => (
                                    <div key={atch.id} className="relative group bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 flex items-center gap-2">
                                        {atch.type === "image" && <Image size={14} className="text-primary" />}
                                        {atch.type === "video" && <Film size={14} className="text-primary" />}
                                        {atch.type === "audio" && <Music size={14} className="text-primary" />}
                                        <span className="text-[10px] font-medium text-foreground truncate max-w-[80px]">{atch.name}</span>
                                        <button 
                                            onClick={() => removeAttachment(atch.id)}
                                            className="h-4 w-4 rounded-full bg-destructive/80 text-white flex items-center justify-center hover:bg-destructive"
                                            title="Remove attachment"
                                            aria-label="Remove attachment"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative glass-floating !rounded-2xl border-white/10 bg-white/5 overflow-hidden">
                            {isRecording ? (
                                <div className="flex items-center justify-between px-4 py-3 h-[52px] bg-primary/5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                                        <span className="text-sm font-medium text-foreground">{formatTime(recordingTime)}</span>
                                        <span className="text-xs text-muted-foreground ml-2">Recording voice...</span>
                                    </div>
                                    <button 
                                        onClick={toggleRecording}
                                        className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm"
                                        title="Stop recording"
                                        aria-label="Stop recording"
                                    >
                                        <StopCircle size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-end gap-1 px-2 py-2">
                                    {/* Small Left Icons Cluster */}
                                    <div className="flex items-center pb-1">
                                        <button 
                                            onClick={() => handleFileClick("image")}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                                            title="Attach Image"
                                        >
                                            <Image size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleFileClick("video")}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                                            title="Attach Video"
                                        >
                                            <Film size={18} />
                                        </button>
                                    </div>

                                    {/* Main Textarea */}
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        placeholder="Message assistant..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 max-h-[120px] resize-none overflow-y-auto scrollbar-none"
                                    />

                                    {/* Action Icons Right */}
                                    <div className="flex items-center gap-1 pb-1">
                                        <button 
                                            onClick={() => handleFileClick("audio")}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                                            title="Attach Audio"
                                        >
                                            <Music size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleFileClick("file")}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                                            title="Attach File"
                                        >
                                            <Paperclip size={18} />
                                        </button>
                                        <div className="w-px h-6 bg-white/10 mx-1" />
                                        <button 
                                            onClick={toggleRecording}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                isRecording ? "text-destructive bg-destructive/10 mic-pulse" : "text-primary hover:bg-primary/10"
                                            )}
                                            title="Record Voice"
                                        >
                                            <Mic size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleSend()}
                                            disabled={(!input.trim() && attachments.length === 0) || isTyping}
                                            className="p-2 ml-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:grayscale transition-all shadow-md"
                                            title="Send Message"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Close Chat" : "Open Chat"}
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
                className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-500 active:scale-95 floating-hover",
                    isOpen
                        ? "bg-secondary text-foreground hover:bg-secondary/80"
                        : "bg-primary text-primary-foreground hover:scale-110 shadow-lg"
                )}
            >
                {isOpen ? <ChevronDown size={28} aria-hidden="true" /> : <MessageCircle size={28} aria-hidden="true" />}
                <span className="sr-only">{isOpen ? "Close Chat" : "Open Chat"}</span>
            </button>
        </div>
    )
}

