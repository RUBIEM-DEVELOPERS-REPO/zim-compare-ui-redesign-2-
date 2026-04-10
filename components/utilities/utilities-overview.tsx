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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => {
                    const Icon = c.icon
                    return (
                        <div key={c.label} className="glass-card p-4 h-full">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className={`h-4 w-4 ${c.color}`} />
                                <p className="text-xs text-muted-foreground">{c.label}</p>
                            </div>
                            <p className="text-sm font-semibold text-foreground">{c.value}</p>
                            <p className="text-xs text-primary mt-1">{c.detail}</p>
                        </div>
                    )
                })}
            </div>

            {/* Smart recommendation badges */}
            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Smart Recommendations
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                    {smartBadges.map((b) => (
                        <div key={b.label} className={`glass-panel p-4 ${b.color}`}>
                            <p className="text-xs font-bold mb-1">{b.label}</p>
                            <p className="text-xs opacity-80">{b.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top electricity deals */}
            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Top Electricity Deals
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {topElectricity.map((p) => (
                        <div key={p.id} className="glass-card p-4 h-full">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                                {p.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800">
                                        {p.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{p.planType} · {p.customerType}</p>
                            <div className="flex gap-4 text-xs">
                                <div>
                                    <p className="text-muted-foreground">Per kWh</p>
                                    <p className="font-bold text-foreground">${p.tariffPerKwh.toFixed(3)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Fixed/mo</p>
                                    <p className="font-bold text-foreground">${p.fixedMonthlyCharge.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Reliability</p>
                                    <p className="font-bold text-foreground">{p.reliabilityScore}/100</p>
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
