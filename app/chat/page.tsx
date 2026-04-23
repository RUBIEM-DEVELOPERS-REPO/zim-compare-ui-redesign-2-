"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
<<<<<<< Updated upstream
import { cn } from "@/lib/utils"

import { apiPost } from "@/lib/api"
=======
import { cn, formatDate } from "@/lib/utils"
import { processUserIntention } from "@/lib/engines/chat-ai"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, Sparkles, Plus, 
  Search, Bell, User, MessageSquare,
  Clock, X, Trash2, ArrowRight,
  Paperclip, ImagePlus, Mic, MicOff, FileText
} from "lucide-react"
>>>>>>> Stashed changes

export default function ChatPage() {
  const { 
    chatMessages, addChatMessage, clearChat, userName, 
    chatHistory, loadSession, deleteSession, saveCurrentSession 
  } = useAppStore()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [attachedImage, setAttachedImage] = useState<{ file: File; preview: string } | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSupported] = useState(() => typeof window !== "undefined" && "webkitSpeechRecognition" in window || "SpeechRecognition" in (window as any))
  const endRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

  // 1. Reset chat on initial load/refresh
  useEffect(() => {
    clearChat()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  function handleAction(type: string, payload: any) {
    if (type === "compare") {
      router.push(`/${payload.category}`)
    } else if (type === "transact") {
      router.push("/banking?tab=fees")
    } else if (type === "apply") {
      router.push("/insurance")
    } else if (type === "alert") {
      router.push("/dashboard")
    }
  }

  function handleFileAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAttachedFile(file)
    e.target.value = ""
  }

  function handleImageAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setAttachedImage({ file, preview })
    e.target.value = ""
  }

  function handleVoiceInput() {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(prev => prev ? prev + " " + transcript : transcript)
    }
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    
    addChatMessage(userMsg)
    const currentInput = input
    setInput("")
    setIsTyping(true)

<<<<<<< Updated upstream
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
=======
    setTimeout(() => {
      const response = processUserIntention(currentInput)
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date().toISOString(),
        actions: response.actions,
      })
      setIsTyping(false)
    }, 1000)
>>>>>>> Stashed changes
  }

  return (
    <div className="flex flex-col h-screen w-full relative overflow-hidden bg-background scrollbar-hidden">
        {/* TOP OVERLAY CONTROLS */}
        <div className="absolute top-6 right-8 z-40 flex items-center gap-3">
            <button 
                onClick={() => setIsHistoryOpen(true)}
                className="w-10 h-10 rounded-xl glass-premium flex items-center justify-center text-primary shadow-lg hover:scale-105 active:scale-95 transition-all"
                title="View History"
            >
                <Clock size={20} />
            </button>
        </div>

        {/* TOP-CENTER HEADING — shown when chat is empty */}
        {chatMessages.length === 0 && (
          <div className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center text-center pt-14 pointer-events-none px-6">
            <h1 className="text-3xl md:text-4xl font-playfair font-medium text-foreground leading-tight tracking-tight">
              How can I assist <span className="text-primary">your finances</span> today?
            </h1>
            <p className="text-sm text-muted-foreground mt-2.5 font-medium max-w-lg">
              Ask about banking fees, cheapest telecoms, or medical aid comparisons with real-time Zimbabwe data.
            </p>
          </div>
        )}

        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full relative px-6">
            {/* MESSAGING AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden pt-6 pb-32">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full" />
              ) : (
                  <div className="space-y-8 pb-10">
                    {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex flex-col space-y-3 animate-in fade-in duration-500",
                            msg.role === "user" ? "ml-auto items-end max-w-[80%]" : "items-start max-w-[90%]"
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-2xl p-4 text-sm leading-relaxed",
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-muted/40 border border-border/20 text-foreground backdrop-blur-sm"
                            )}
                          >
                            {msg.content}
                          </div>
            
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {msg.actions.map((action, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleAction(action.type, action.payload)}
                                  className="px-4 py-2 rounded-xl bg-background border border-border/50 text-foreground hover:bg-primary hover:text-white transition-all text-[10px] font-medium uppercase tracking-widest shadow-sm"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                          <div className="flex items-center gap-1.5 p-4 rounded-2xl bg-muted/30 border border-border/50 w-16">
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                          </div>
                      )}
                      <div ref={endRef} />
                  </div>
              )}
            </div>

            {/* CHAT INPUT AREA */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
                <div className="max-w-[720px] mx-auto w-full pointer-events-auto">
                    <div className="relative group">

                        {/* Attachment previews above input */}
                        <AnimatePresence>
                          {(attachedFile || attachedImage) && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              className="flex items-center gap-2 mb-2 flex-wrap"
                            >
                              {attachedFile && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-medium text-primary max-w-[200px]">
                                  <FileText size={12} className="shrink-0" />
                                  <span className="truncate">{attachedFile.name}</span>
                                  <button onClick={() => setAttachedFile(null)} className="shrink-0 hover:text-destructive transition-colors" aria-label="Remove file">
                                    <X size={10} />
                                  </button>
                                </div>
                              )}
                              {attachedImage && (
                                <div className="relative">
                                  <img
                                    src={attachedImage.preview}
                                    alt="Preview"
                                    className="h-12 w-12 rounded-xl object-cover border border-border/40"
                                  />
                                  <button
                                    onClick={() => { URL.revokeObjectURL(attachedImage.preview); setAttachedImage(null) }}
                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center hover:scale-110 transition-all"
                                    aria-label="Remove image"
                                  >
                                    <X size={8} />
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Input bar */}
                        <form onSubmit={handleSend} className="h-14 rounded-2xl border border-border/30 bg-white/95 dark:bg-slate-900/95 shadow-2xl flex items-center px-4 gap-2 focus-within:ring-2 ring-primary/20 transition-all">

                            {/* Left actions */}
                            <div className="flex items-center gap-1 shrink-0">
                                {/* Hidden file inputs */}
                                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.xlsx" className="hidden" onChange={handleFileAttach} title="Upload document" />
                                <input ref={imageInputRef} type="file" accept="image/png,image/jpg,image/jpeg,image/webp" className="hidden" onChange={handleImageAttach} title="Upload image" />

                                {/* Attach file */}
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    attachedFile
                                      ? "bg-primary/20 text-primary"
                                      : "text-muted-foreground/50 hover:bg-primary/10 hover:text-primary active:scale-90"
                                  )}
                                  title="Attach document (PDF, DOCX, TXT, XLSX)"
                                  aria-label="Attach file"
                                >
                                  <Paperclip size={16} />
                                </button>

                                {/* Upload image */}
                                <button
                                  type="button"
                                  onClick={() => imageInputRef.current?.click()}
                                  className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    attachedImage
                                      ? "bg-primary/20 text-primary"
                                      : "text-muted-foreground/50 hover:bg-primary/10 hover:text-primary active:scale-90"
                                  )}
                                  title="Upload image (PNG, JPG, WEBP)"
                                  aria-label="Upload image"
                                >
                                  <ImagePlus size={16} />
                                </button>

                                {/* Voice input */}
                                <button
                                  type="button"
                                  onClick={handleVoiceInput}
                                  disabled={!recordingSupported}
                                  className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    isRecording
                                      ? "bg-red-500/20 text-red-500 animate-pulse"
                                      : recordingSupported
                                        ? "text-muted-foreground/50 hover:bg-primary/10 hover:text-primary active:scale-90"
                                        : "text-muted-foreground/20 cursor-not-allowed"
                                  )}
                                  title={isRecording ? "Stop recording" : "Voice input"}
                                  aria-label={isRecording ? "Stop recording" : "Start voice input"}
                                >
                                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                                </button>

                                {/* Divider */}
                                <div className="w-px h-4 bg-border/40 mx-1" />
                            </div>

                            {/* Text input */}
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isRecording ? "Listening..." : "Type your command..."}
                                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50 min-w-0"
                            />

                            {/* Send button */}
                            <button
                                type="submit"
                                title="Send Message"
                                aria-label="Send Message"
                                disabled={!input.trim() || isTyping}
                                className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-20 shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </form>

                        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/50 font-medium uppercase tracking-tighter">
                            <span className="flex items-center gap-1">
                                <Sparkles size={12} />
                                Verified Intelligence
                            </span>
                            <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" />
                            <button 
                                onClick={() => { saveCurrentSession(); clearChat(); }}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                New Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* HISTORY DRAWER */}
        <AnimatePresence>
            {isHistoryOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsHistoryOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[350px] glass-premium border-l border-white/20 z-[60] shadow-2xl p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-playfair font-medium text-foreground">Intelligence History</h2>
                            <button 
                                onClick={() => setIsHistoryOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
                                title="Close History"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-hidden space-y-3">
                            {chatHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                    <MessageSquare size={48} className="mb-4 text-muted-foreground" />
                                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">No History Found</p>
                                    <p className="text-[10px] mt-2 leading-relaxed">Your future financial maneuvers will be archived here.</p>
                                </div>
                            ) : (
                                chatHistory.map((session) => (
                                    <div 
                                        key={session.id}
                                        className="group relative"
                                    >
                                        <button 
                                            onClick={() => { loadSession(session.id); setIsHistoryOpen(false); }}
                                            className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col gap-1"
                                        >
                                            <span className="text-[10px] font-medium text-primary uppercase tracking-widest">{formatDate(session.timestamp)}</span>
                                            <p className="text-xs font-medium text-foreground line-clamp-2 leading-relaxed">{session.title}</p>
                                        </button>
                                        <button 
                                            onClick={() => deleteSession(session.id)}
                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                                            title="Delete Session"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <button 
                            onClick={() => { saveCurrentSession(); setIsHistoryOpen(false); }}
                            className="mt-6 w-full py-3 bg-primary text-white rounded-xl text-xs font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Start New Session
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

    </div>
  )
}

