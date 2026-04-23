"use client"

import { solarPackages } from "@/lib/mock/solar"
import { TrendingUp } from "lucide-react"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
// Zimbabwe seasonal solar generation index (relative to peak)
const solarGenIndex = [0.85, 0.82, 0.80, 0.88, 0.92, 0.95, 0.98, 1.00, 0.97, 0.93, 0.88, 0.84]

function SimpleBarChart({ data, color, label, unit }: { data: number[]; color: string; label: string; unit: string }) {
    const max = Math.max(...data)
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">{label}</p>
            <div className="flex items-end gap-1 h-32">
                {data.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                            className="w-full rounded-t-sm transition-all"
                            style={{ height: `${(v / max) * 100}%`, backgroundColor: color }}
                        />
                        <span className="text-[9px] text-muted-foreground">{months[i]}</span>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-right">Unit: {unit}</p>
        </div>
    )
}

function ROITimelineChart() {
    const pkg = solarPackages[2] // 5kW system
    const months12 = Array.from({ length: 37 }, (_, i) => i)
    const cumulativeSavings = months12.map(m => m * pkg.monthlySavings)
    const breakEvenMonth = pkg.paybackMonths
    const max = cumulativeSavings[cumulativeSavings.length - 1]

    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">ROI Timeline — 5kW System (${pkg.price.toLocaleString()} investment)</p>
            <div className="relative h-40 flex items-end gap-0.5">
                {cumulativeSavings.map((v, i) => {
                    const isPastBreakeven = i >= breakEvenMonth
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full rounded-t-sm transition-all"
                                style={{
                                    height: `${(v / max) * 100}%`,
                                    backgroundColor: isPastBreakeven ? "rgb(20, 184, 166)" : "rgb(148, 163, 184)"
                                }}
                            />
                        </div>
                    )
                })}
                {/* Break-even line */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                    style={{ left: `${(breakEvenMonth / 36) * 100}%` }}
                >
                    <span className="absolute -top-5 -translate-x-1/2 text-[9px] text-amber-500 font-medium whitespace-nowrap">Break-even</span>
                </div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                <span>Month 0</span>
                <span>Month 18</span>
                <span>Month 36</span>
            </div>
            <div className="flex gap-3 mt-2">
                <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm bg-slate-400" /><span className="text-[10px] text-muted-foreground">Pre-payback</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm bg-teal-500" /><span className="text-[10px] text-muted-foreground">Post-payback (profit)</span></div>
                <div className="flex items-center gap-1"><div className="w-0.5 h-3 bg-amber-500" /><span className="text-[10px] text-muted-foreground">Break-even point</span></div>
            </div>
        </div>
    )
}

export function SolarRoiCharts() {
    const savingsData = solarPackages.map(p => p.monthlySavings)
    const costData = solarPackages.map(p => p.price)
    const solarGenData = solarGenIndex.map(v => v * 100)

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">ROI Charts & Trends</p>
                </div>
                <p className="text-xs text-muted-foreground">Visual analysis of solar investment returns and seasonal generation patterns in Zimbabwe.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                    <ROITimelineChart />
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Monthly Savings by Package (USD)</p>
                    <div className="flex items-end gap-2 h-32">
                        {solarPackages.map((pkg, i) => (
                            <div key={pkg.id} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-t-sm bg-teal-500"
                                    style={{ height: `${(pkg.monthlySavings / Math.max(...savingsData)) * 100}%` }}
                                />
                                <span className="text-[9px] text-muted-foreground text-center leading-tight">{pkg.systemKW}kW</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                        <span>$0</span>
                        <span>${Math.max(...savingsData)}/mo</span>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <SimpleBarChart
                        data={solarGenData}
                        color="rgb(251, 191, 36)"
                        label="Seasonal Solar Generation Index (Zimbabwe)"
                        unit="% of peak"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Peak generation in July–September. Lowest in March (rainy season).</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-3">System Cost vs Monthly Savings</p>
                    <div className="space-y-2">
                        {solarPackages.map(pkg => (
                            <div key={pkg.id} className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground w-16 shrink-0">{pkg.systemKW}kW</span>
                                <div className="flex-1 flex gap-1">
                                    <div
                                        className="h-5 rounded-sm bg-primary/30 flex items-center justify-end pr-1"
                                        style={{ width: `${(pkg.price / Math.max(...costData)) * 100}%` }}
                                    >
                                        <span className="text-[9px] text-primary font-medium">${pkg.price.toLocaleString()}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium w-16 text-right shrink-0">${pkg.monthlySavings}/mo</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

