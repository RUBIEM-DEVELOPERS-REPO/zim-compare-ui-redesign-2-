"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { X, Minimize2, Maximize2, ExternalLink, Newspaper } from "lucide-react"

const mockNews = [
    { id: "n1", title: "RBZ introduces new gold-backed currency tokens", source: "Banking", time: "2h ago", link: "#" },
    { id: "n2", title: "Econet increases 5G coverage in Bulawayo", source: "Telecom", time: "5h ago", link: "#" },
    { id: "n3", title: "CBZ Bank announces zero-fee student accounts", source: "Banking", time: "1d ago", link: "#" },
    { id: "n4", title: "New curriculum updates for 2026 academic year", source: "Schools", time: "2d ago", link: "#" },
]

export function NewsPopup() {
    const { t } = useI18n()
    const { showNews, setShowNews, lastNewsSeenDate, setLastNewsSeen } = useAppStore()
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
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform animate-in fade-in slide-in-from-bottom-4"
        >
            <Newspaper size={18} />
            <span className="text-sm font-medium">{t("dashboard.news")}</span>
        </button>
    )

    if (minimized) return (
        <button
            onClick={() => setMinimized(false)}
            title="Expand news"
            aria-label="Expand news"
            className="fixed bottom-24 right-6 z-40 bg-card border border-border p-3 rounded-full shadow-xl hover:bg-secondary transition-colors"
        >
            <Newspaper className="text-primary" size={20} />
        </button>
    )

    if (!showNews) return null

    return (
        <div className="fixed bottom-24 right-6 z-40 w-80 glass-panel shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-primary/5 p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Newspaper className="text-primary" size={18} />
                    <h4 className="font-semibold text-sm">{t("dashboard.latestNews")}</h4>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setMinimized(true)} title="Minimize news" aria-label="Minimize news" className="p-1 hover:bg-secondary rounded">
                        <Minimize2 size={14} className="text-muted-foreground" />
                    </button>
                    <button onClick={() => setShowNews(false)} title="Close news" aria-label="Close news" className="p-1 hover:bg-secondary rounded text-destructive">
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                {mockNews.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">{t("dashboard.noNews")}</p>
                ) : (
                    mockNews.map((news) => (
                        <div key={news.id} className="group relative">
                            <a
                                href={news.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:bg-secondary/50 p-2 -m-2 rounded-lg transition-colors"
                            >
                                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-relaxed">
                                    {news.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                        {news.source}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">{news.time}</span>
                                    <ExternalLink size={10} className="text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </a>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-secondary/30 border-t border-border text-center">
                <button className="text-xs font-medium text-primary hover:underline">
                    {t("dashboard.viewAll")}
                </button>
            </div>
        </div>
    )
}
