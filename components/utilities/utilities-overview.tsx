"use client"

import { electricityProviders, waterProviders, subscriptionServices } from "@/lib/mock/utilities"
import { Disclaimer } from "@/components/disclaimer"
import { Zap, Droplets, CreditCard, Star } from "lucide-react"

const summaryCards = [
    { label: "Best Electricity Deal", value: "Econet Solar", detail: "$0.065/kWh + 24/7 power", icon: Zap, color: "text-yellow-500" },
    { label: "Most Reliable Water", value: "Bulawayo City Council", detail: "55/100 reliability score", icon: Droplets, color: "text-blue-500" },
    { label: "Best Streaming Value", value: "Showmax", detail: "$7.99/month, local content", icon: CreditCard, color: "text-purple-500" },
]

const smartBadges = [
    { label: "Best for Families", description: "Econet Solar + Microsoft 365 Family + Showmax", color: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800" },
    { label: "Best for Business", description: "ZimSolar Business + Cimas Home Security + ZimPlumb Home Care", color: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" },
    { label: "Budget Friendly", description: "ZESA Prepaid + Showmax + Securico Basic", color: "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" },
]

export function UtilitiesOverview() {
    const topElectricity = electricityProviders.filter(p => p.badge)
    const topWater = waterProviders.filter(p => p.badge)
    const topSubs = subscriptionServices.filter(p => p.badge).slice(0, 3)

    return (
        <div className="space-y-8">
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {summaryCards.map((c) => {
                    const Icon = c.icon
                    return (
                        <div key={c.label} className="glass-floating p-5 group h-full floating-hover transition-all duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shadow-inner`}>
                                    <Icon className={`h-4 w-4 ${c.color} group-hover:scale-110 transition-transform`} />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-70 group-hover:text-primary transition-colors">{c.label}</p>
                            </div>
                            <p className="text-md font-display font-medium text-white mt-1 leading-tight">{c.value}</p>
                            <p className="text-[11px] text-primary mt-2 font-medium tracking-widest uppercase">{c.detail}</p>
                        </div>
                    )
                })}
            </div>

            {/* Smart recommendation badges */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Star size={16} className="text-yellow-500 fill-yellow-500/20" />
                    <h3 className="text-[10px] font-medium text-white uppercase tracking-[0.3em] opacity-70">Neural Recommendations</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    {smartBadges.map((b) => (
                        <div key={b.label} className={`glass-floating p-6 floating-hover border-white/5 teal-glow`}>
                            <p className="text-sm font-display font-medium text-white uppercase tracking-tight mb-2 leading-tight">{b.label}</p>
                            <p className="text-[11px] font-medium text-muted-foreground opacity-80 leading-relaxed font-sans">{b.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top electricity deals */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Zap size={16} className="text-yellow-500 fill-yellow-500/20" />
                    <h3 className="text-[10px] font-medium text-white uppercase tracking-[0.3em] opacity-70">High-Fidelity Power Deals</h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {topElectricity.map((p) => (
                        <div key={p.id} className="glass-floating p-6 transition-all duration-500 relative group flex flex-col floating-hover border-white/5">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-lg font-display font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">{p.name}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase mt-2 tracking-[0.1em] opacity-60 font-sans">{p.planType} · {p.customerType}</p>
                                </div>
                                {p.badge && (
                                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.15em] bg-white/5 text-muted-foreground px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">
                                        {p.badge}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-6 mt-auto border-t border-white/10 text-center">
                                <div>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase mb-1 opacity-60">PER kWh</p>
                                    <p className="text-sm font-display font-medium text-white tabular-nums">${p.tariffPerKwh.toFixed(3)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase mb-1 opacity-60">FIXED/mo</p>
                                    <p className="text-sm font-display font-medium text-primary tabular-nums">${p.fixedMonthlyCharge.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase mb-1 opacity-60">SIGNAL</p>
                                    <p className="text-sm font-display font-medium text-foreground tabular-nums">{p.reliabilityScore}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            <Disclaimer />
        </div>
    )
}

