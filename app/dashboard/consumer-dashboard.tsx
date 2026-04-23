"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { NewsPopup } from "@/components/dashboard/news-popup"
import { AlertsModule } from "@/components/dashboard/alerts-module"
import { RecentViews } from "@/components/dashboard/recent-views"
import { MarketHighlights } from "@/components/dashboard/market-highlights"
import { useI18n } from "@/lib/i18n"
import { ChevronDown, FileCheck, Send, Plus } from "lucide-react"
import { validatePrice, validateRequired } from "@/lib/validation"

export function ConsumerDashboard() {
    const { addChatMessage, addTransaction } = useAppStore()
    const { t } = useI18n()
    const [chatInput, setChatInput] = useState("")
    const [txAmount, setTxAmount] = useState("")
    const [txErrors, setTxErrors] = useState<string[]>([])

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatInput.trim()) return
        addChatMessage({
            id: Date.now().toString(),
            role: "user",
            content: chatInput,
            timestamp: new Date().toISOString()
        })
        setChatInput("")
        setTimeout(() => {
            addChatMessage({
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I've analyzed the market. Currently, Econet has the best data bundles for your usage pattern.",
                timestamp: new Date().toISOString()
            })
        }, 1000)
    }

    const handleInitiateTx = (e: React.FormEvent) => {
        e.preventDefault()
        const errors: string[] = []
        const priceErr = validatePrice(txAmount, "Amount")
        const reqErr = validateRequired(txAmount, "Amount")
        if (priceErr) errors.push(priceErr.message)
        if (reqErr) errors.push(reqErr.message)

        if (errors.length > 0) {
            setTxErrors(errors)
            return
        }

        setTxErrors([])
        addTransaction({
            id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            userId: "u1",
            bankId: "cbz",
            methodId: "zipit",
            amount: parseFloat(txAmount),
            fee: 1.50,
            tax: 0.05,
            total: parseFloat(txAmount) + 1.55,
            status: "completed",
            createdAt: new Date().toISOString()
        })
        setTxAmount("")
    }

    return (
        /* Root: identical to banking/page.tsx */
        <div className="space-y-4">

            {/* ── 1. PAGE HEADER ── Banking uses: text-xl font-medium / text-sm text-muted-foreground */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-display font-normal text-foreground tracking-tight leading-tight mb-2">
                        Consumer Intelligence
                    </h1>
                    <p className="text-sm text-muted-foreground font-sans max-w-2xl">
                        High-fidelity summary of your personal economy and recommended market maneuvers.
                    </p>
                </div>

                <button
                    className="group flex items-center justify-center gap-3 px-8 h-12 rounded-[1.25rem] text-[10px] font-medium uppercase tracking-[0.2em] transition-all bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-white/10 shadow-2xl floating-hover"
                >
                    <FileCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Generate Intelligence Report
                </button>
            </div>

            {/* ── 3. FEATURED CARD ── Banking: glass-panel p-5 bg-primary/5 border-primary/20 */}
            {/* Typography from banking-overview: text-xs muted / text-lg font-medium / text-sm muted / text-xs muted */}
            <div
                className="glass-floating p-5 relative overflow-hidden group teal-glow"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-700" />
                
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-2 opacity-80">
                    Neural Core Insight
                </p>
                <h2 className="text-xl font-display font-normal text-foreground mt-1 leading-tight">
                    Optimized Savings Maneuver Identified
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-sans max-w-3xl line-clamp-2">
                    Based on your spending throughput, moving 15% of your liquidity to CBZ Bank&apos;s High-Yield account would yield an additional $24.50 monthly.
                </p>
                <p className="text-[9px] text-muted-foreground mt-4 italic opacity-50 font-sans">
                    * Recommendation based on T+30 historical liquidity analysis.
                </p>
            </div>

            {/* ── 4. SUMMARY CARDS ── Banking: grid gap-3 sm:grid-cols-2 lg:grid-cols-4 */}
            {/* Card typography: text-xs muted / text-sm font-medium / text-xs text-primary */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 dash-summary-row">
                {Object.entries({
                    "Market Health": { val: "Aggressive", det: "Balanced System" },
                    "Active Requests": { val: "3 Applications", det: "Pending Approval" },
                    "Top Provider": { val: "Econet Wireless", det: "Optimal Rate" },
                    "Liquidity Score": { val: "842 / 1000", det: "+12.4% Increase" }
                }).map(([label, { val, det }]) => (
                    <div key={label} className="glass-floating p-4 floating-hover">
                        <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{label}</p>
                        <p className="text-sm font-display font-medium text-foreground">{val}</p>
                        <p className="text-[9px] font-medium text-primary mt-1.5 uppercase tracking-tighter teal-glow bg-primary/5 px-2 py-0.5 rounded-full inline-block">{det}</p>
                    </div>
                ))}
            </div>

            {/* ── 5 & 6. SECTION HEADING + LOWER GRID ── Banking: h3 text-sm font-medium text-foreground mb-3 */}
            <section>
                {/* Banking: h3 className="text-sm font-medium text-foreground mb-3" */}
                <h3 className="text-sm font-medium text-foreground mb-3 dash-section-heading">
                    Market Intelligence
                </h3>

                {/* Banking lower grid: grid gap-3 sm:grid-cols-3 with glass-card p-4 */}
                <div className="grid gap-3 sm:grid-cols-3">

                    {/* Neural Assistant */}
                    <div className="glass-floating p-5 border-border/10 bg-secondary/30 floating-hover teal-glow flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-md font-display font-medium text-foreground tracking-tight uppercase">Neural Assistant</h4>
                                <p className="text-[8px] font-medium text-primary/60 uppercase tracking-widest mt-1">Core Logic Interface</p>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-primary teal-glow animate-pulse" />
                        </div>
                        <div className="flex items-center gap-2 mt-auto">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Query market core..."
                                className="flex-1 h-10 rounded-xl bg-secondary/50 border border-border/50 px-4 text-[10px] font-medium uppercase tracking-widest text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 outline-none transition-all shadow-inner"
                            />
                            <button
                                onClick={handleSendChat}
                                title="Send query"
                                className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl teal-glow"
                            >
                                <Send className="w-3.5 h-3.5" strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* ZIPIT Settlement */}
                    <div className="glass-floating p-5 border-border/10 bg-secondary/30 floating-hover flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-md font-display font-medium text-foreground tracking-tight uppercase">ZIPIT Settlement</h4>
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Real-time Node</p>
                            </div>
                            <Plus className="w-4 h-4 text-primary/40" />
                        </div>
                        <div className="flex items-center gap-2 mt-auto">
                             <div className="flex-1 glass-floating bg-primary/5 p-2.5 border-primary/20 shadow-inner group-hover:bg-primary/10 transition-colors duration-500 teal-glow">
                                <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest opacity-60 mb-0.5 block">Protocol</span>
                                <span className="text-sm font-display font-medium text-primary uppercase">Instant Transfer</span>
                             </div>
                             <button
                                onClick={handleInitiateTx}
                                title="Execute Transfer"
                                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl"
                            >
                                <Plus className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>
                        {txErrors.length > 0 && (
                            <p className="text-[9px] text-red-400 mt-4 font-medium uppercase tracking-widest text-center">{txErrors[0]}</p>
                        )}
                    </div>

                    {/* Alerts */}
                    <div className="sm:col-span-2">
                        <AlertsModule />
                    </div>

                    {/* Recent Views */}
                    <div className="sm:col-span-3">
                        <RecentViews />
                    </div>

                    {/* Market Highlights */}
                    <div className="sm:col-span-3">
                        <MarketHighlights />
                    </div>

                </div>
            </section>

            <NewsPopup />
        </div>
    )
}
