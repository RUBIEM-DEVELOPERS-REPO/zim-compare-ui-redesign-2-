"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { X, Minimize2, Maximize2, ExternalLink, Newspaper } from "lucide-react"


export function NewsPopup() {
    const { t } = useI18n()
    const { showNews, setShowNews, lastNewsSeenDate, setLastNewsSeen, news: storeNews } = useAppStore()
    const [minimized, setMinimized] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const today = new Date().toISOString().split("T")[0]

        // Auto-show logic
        if (lastNewsSeenDate !== today) {
            const timer = setTimeout(() => {
                setShowNews(true)
                setLastNewsSeen(today)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [lastNewsSeenDate, setShowNews, setLastNewsSeen])

    if (!mounted) return null
    if (!showNews && !minimized) return (
        <button
            onClick={() => setShowNews(true)}
            className="fixed bottom-24 right-8 z-40 flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4 teal-glow group"
        >
            <Newspaper size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">{t("dashboard.news")}</span>
        </button>
    )

    if (minimized) return (
        <button
            onClick={() => setMinimized(false)}
            title="Expand neural feed"
            aria-label="Expand news"
            className="fixed bottom-24 right-8 z-40 surface-glass p-4 rounded-2xl shadow-2xl hover:bg-primary/10 transition-all duration-500 teal-glow group"
        >
            <Newspaper className="text-primary group-hover:scale-110 transition-transform" size={20} />
        </button>
    )

    if (!showNews) return null

    return (
        <div className="fixed bottom-24 right-8 z-40 w-[230px] surface-glass border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 teal-glow">
            <div className="bg-primary/10 p-3.5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/20 rounded-lg shadow-inner border border-primary/30">
                        <Newspaper className="text-primary" size={12} />
                    </div>
                    <div>
                        <h4 className="font-display font-medium text-white text-sm tracking-tight">{t("dashboard.latestNews")}</h4>
                        <p className="text-[7.5px] font-medium text-primary/60 uppercase tracking-widest mt-0.5">Neural Signals Feed</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setMinimized(true)} title="Minimize feed" aria-label="Minimize news" className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                        <Minimize2 size={10} className="text-muted-foreground" />
                    </button>
                    <button onClick={() => setShowNews(false)} title="Terminate feed" aria-label="Close news" className="p-1 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                        <X size={10} />
                    </button>
                </div>
            </div>

            <div className="p-3.5 space-y-3.5 max-h-[240px] overflow-y-auto scrollbar-none scroll-smooth">

                {storeNews.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground text-center py-12 uppercase tracking-widest opacity-60 font-medium">{t("dashboard.noNews")}</p>
                ) : (
                    storeNews.map((news) => (
                        <div key={news.id} className="group/news relative">
                            <a
                                href={news.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2.5 -m-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                            >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span className="text-[7.5px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20 shadow-inner">
                                        {news.source}
                                    </span>
                                    {news.tag && (
                                        <span className={cn(
                                            "text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                                            news.tag === "New" ? "bg-emerald-500 text-black" :
                                            news.tag === "Promo" ? "bg-amber-500 text-black" : "bg-blue-500 text-white"
                                        )}>
                                            {news.tag}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] font-display font-medium text-white group-hover/news:text-primary transition-colors leading-relaxed">
                                    {news.title}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[7.5px] text-muted-foreground uppercase font-medium tracking-widest">{news.time}</span>
                                    <ExternalLink size={8} className="text-primary ml-auto opacity-0 group-hover/news:opacity-100 group-hover/news:translate-x-1 transition-all" />
                                </div>
                            </a>
                        </div>
                    ))
                )}
            </div>

            <div className="p-2.5 bg-white/5 border-t border-white/5 text-center px-3.5">
                <button className="w-full text-[8px] font-medium uppercase tracking-[0.2em] text-primary hover:text-white transition-all bg-primary/10 hover:bg-primary py-1.5 rounded-lg border border-primary/20 shadow-inner group/all">
                    {t("dashboard.viewAll")}
                </button>
            </div>
        </div>
    )
}

