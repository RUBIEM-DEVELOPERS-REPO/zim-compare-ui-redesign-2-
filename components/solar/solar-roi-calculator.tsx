"use client"

import { useState } from "react"
import { Calculator, TrendingUp, DollarSign, Zap } from "lucide-react"

export function SolarRoiCalculator() {
    const [systemKW, setSystemKW] = useState(3)
    const [electricityCost, setElectricityCost] = useState(0.12)
    const [sunHours, setSunHours] = useState(5.5)
    const [systemPrice, setSystemPrice] = useState(3200)
    const [monthlySavings, setMonthlySavings] = useState<number | null>(null)
    const [paybackMonths, setPaybackMonths] = useState<number | null>(null)
    const [tenYearSavings, setTenYearSavings] = useState<number | null>(null)

    const calculate = () => {
        const dailyKWh = systemKW * sunHours * 0.8 // 80% efficiency
        const monthlyKWh = dailyKWh * 30
        const monthly = monthlyKWh * electricityCost
        const payback = Math.ceil(systemPrice / monthly)
        const tenYear = (monthly * 120) - systemPrice

        setMonthlySavings(Math.round(monthly * 100) / 100)
        setPaybackMonths(payback)
        setTenYearSavings(Math.round(tenYear))
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Solar ROI Calculator</p>
                </div>
                <p className="text-xs text-muted-foreground">Estimate your solar system payback period and savings based on your usage.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <h3 className="text-sm font-medium text-foreground">System Parameters</h3>

                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">System Size (kW)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={1}
                                max={20}
                                step={0.5}
                                value={systemKW}
                                onChange={e => setSystemKW(parseFloat(e.target.value))}
                                className="flex-1 accent-primary"
                            />
                            <span className="text-sm font-medium text-foreground w-12 text-right">{systemKW}kW</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">System Price (USD)</label>
                        <input
                            type="number"
                            value={systemPrice}
                            onChange={e => setSystemPrice(parseFloat(e.target.value))}
                            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Electricity Cost ($/kWh)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={0.05}
                                max={0.30}
                                step={0.01}
                                value={electricityCost}
                                onChange={e => setElectricityCost(parseFloat(e.target.value))}
                                className="flex-1 accent-primary"
                            />
                            <span className="text-sm font-medium text-foreground w-16 text-right">${electricityCost}/kWh</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Daily Sun Hours (Zimbabwe avg: 5.5)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={3}
                                max={8}
                                step={0.5}
                                value={sunHours}
                                onChange={e => setSunHours(parseFloat(e.target.value))}
                                className="flex-1 accent-primary"
                            />
                            <span className="text-sm font-medium text-foreground w-12 text-right">{sunHours}h</span>
                        </div>
                    </div>

                    <button
                        onClick={calculate}
                        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Calculate ROI
                    </button>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-medium text-foreground mb-4">Results</h3>
                    {monthlySavings === null ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <Calculator className="w-12 h-12 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">Enter your parameters and click Calculate ROI to see your estimated savings.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    <p className="text-xs text-muted-foreground">Monthly Savings</p>
                                </div>
                                <p className="text-3xl font-medium text-emerald-600 dark:text-emerald-400">${monthlySavings}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        <p className="text-xs text-muted-foreground">Payback Period</p>
                                    </div>
                                    <p className="text-xl font-medium text-foreground">{paybackMonths} months</p>
                                    <p className="text-xs text-muted-foreground">{(paybackMonths! / 12).toFixed(1)} years</p>
                                </div>
                                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap className="w-4 h-4 text-amber-500" />
                                        <p className="text-xs text-muted-foreground">10-Year Net Savings</p>
                                    </div>
                                    <p className="text-xl font-medium text-foreground">${tenYearSavings?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="rounded-lg bg-secondary/50 p-3">
                                <p className="text-xs text-muted-foreground">
                                    Based on a <strong className="text-foreground">{systemKW}kW</strong> system at{" "}
                                    <strong className="text-foreground">{sunHours}h</strong> daily sun with{" "}
                                    <strong className="text-foreground">${electricityCost}/kWh</strong> electricity cost.
                                    Actual results may vary based on weather and usage patterns.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

