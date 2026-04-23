"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X, Layout, Type, Tag, MessageSquare, Image, Loader2, CheckCircle2 } from "lucide-react"

interface AddNewsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddNewsModal({ isOpen, onClose }: AddNewsModalProps) {
  const { addNews, setShowNews } = useAppStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "Banking",
    description: "",
    tag: "New" as "New" | "Promo" | "Update",
    image: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newAd = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      source: formData.category,
      category: formData.category,
      description: formData.description,
      tag: formData.tag,
      time: "Just now",
      link: "#",
      image: formData.image || undefined,
      createdAt: new Date().toISOString()
    }

    addNews(newAd)
    setIsSubmitting(false)
    setIsSuccess(true)

    // Show the feed immediately
    setTimeout(() => {
      setShowNews(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
        setFormData({
            title: "",
            category: "Banking",
            description: "",
            tag: "New",
            image: ""
        })
      }, 1000)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg glass-floating border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 teal-glow">
        
        {/* Success Overlay */}
        {isSuccess && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 teal-glow shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
                </div>
                <h3 className="text-2xl font-display font-medium text-white mb-2">Ad Published Successfully</h3>
                <p className="text-muted-foreground text-sm">Your update is now live in the Neural Signals feed.</p>
            </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-medium text-white text-lg tracking-tight">Create Institutional News</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">Broadcast updates to the ecosystem</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Title</label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Type size={16} />
                </div>
                <input 
                  required
                  placeholder="e.g. New Fixed Deposit Rates"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            {/* Category & Tag Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Category</label>
                    <select 
                        title="Select Category"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="Banking">Banking</option>
                        <option value="Telecom">Telecom</option>
                        <option value="Schools">Schools</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Utility">Utility</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Tag (Badge)</label>
                    <div className="flex gap-2">
                        {["New", "Promo", "Update"].map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setFormData({...formData, tag: tag as any})}
                                className={cn(
                                    "flex-1 py-3 text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all border",
                                    formData.tag === tag 
                                        ? "bg-primary/20 border-primary text-primary" 
                                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Description</label>
              <div className="group relative">
                <div className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <MessageSquare size={16} />
                </div>
                <textarea 
                  required
                  placeholder="Details of the announcement..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Optional Image (Mocked) */}
            <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Optional Image</label>
                <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center group/img cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Image className="w-6 h-6 text-muted-foreground group-hover/img:text-primary transition-colors mb-2" />
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium">Click to upload assets</p>
                </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-medium uppercase tracking-[0.2em] rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              Discard
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-4 text-[10px] font-medium uppercase tracking-[0.25em] rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all teal-glow flex items-center justify-center gap-2 group shadow-2xl shadow-primary/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Publish Now
                  <Layout className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
