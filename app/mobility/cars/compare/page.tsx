"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { vehicles } from "@/lib/mock/transport"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check, X, Sparkles, Car, Fuel, Settings, Zap, Shield, Wallet } from "lucide-react"
import Link from "next/link"
import { Vehicle } from "@/lib/types"

export default function CarComparePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { clearCompareTray } = useAppStore()
    const ids = searchParams.get("ids")?.split(",") || []

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const selectedVehicles = ids
        .map((id) => vehicles.find((v) => v.id === id))
        .filter((v): v is Vehicle => !!v)

    // Empty state
    if (selectedVehicles.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">No vehicles selected for comparison</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Please select at least 2 vehicles from the Mobility page to compare.
                    </p>
                    <Link
                        href="/mobility?tab=cars"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go back to Cars
                    </Link>
                </div>
            </div>
        )
    }

    // AI Insights logic
    const insights = generateCarInsights(selectedVehicles)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Vehicle Comparison</h1>
                    <p className="text-sm text-muted-foreground">
                        Comparing {selectedVehicles.length} vehicle{selectedVehicles.length > 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/mobility?tab=cars"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cars
                </Link>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="grid-dynamic-cols gap-4" data-columns={selectedVehicles.length}>
                        <div className="font-bold text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center col-span-1">
                            Specs
                        </div>
                        {selectedVehicles.map((v) => (
                            <div key={v.id} className="bg-primary/5 border border-primary/10 rounded-lg p-4 col-span-1">
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-1">{v.make} {v.model}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{v.year} • {v.location}</p>
                            </div>
                        ))}

                        {/* Price Row */}
                        <ComparisonRow label="Price" highlight>
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className="text-lg font-bold text-primary">
                                    ${v.price.toLocaleString()}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Condition */}
                        <ComparisonRow label="Condition">
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                                    v.condition === "new" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                )}>
                                    {v.condition}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Mileage */}
                        <ComparisonRow label="Mileage">
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className="text-xs font-medium">
                                    {v.mileage === 0 ? "Brand New" : `${v.mileage.toLocaleString()} km`}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Fuel Type */}
                        <ComparisonRow label="Fuel Type">
                            {selectedVehicles.map((v) => (
                                <div key={v.id} className="flex items-center gap-1.5">
                                    <Fuel size={12} className="text-muted-foreground" />
                                    <span className="text-xs font-medium capitalize">{v.fuelType}</span>
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Engine */}
                        <ComparisonRow label="Engine Size">
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className="text-xs font-medium">
                                    {v.engineCC} CC
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Transmission */}
                        <ComparisonRow label="Transmission">
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className="text-xs font-medium capitalize">
                                    {v.transmission}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Color */}
                        <ComparisonRow label="Color">
                            {selectedVehicles.map((v) => (
                                <div key={v.id} className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full border border-border" 
                                        ref={(el) => { if (el) el.style.backgroundColor = v.color.toLowerCase(); }}
                                    ></div>
                                    <span className="text-xs font-medium">{v.color}</span>
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Financing */}
                        <ComparisonRow label="Financing Available">
                            {selectedVehicles.map((v) => (
                                <div key={v.id}>
                                    {v.financingAvailable ? (
                                        <Check className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Range (for EV) */}
                        <ComparisonRow label="Range (EV Only)">
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className="text-xs font-medium">
                                    {v.range ? `${v.range} km` : "—"}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Battery (for EV) */}
                        <ComparisonRow label="Battery Size">
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className="text-xs font-medium">
                                    {v.batterySize ? `${v.batterySize} kWh` : "—"}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Ownership */}
                        <ComparisonRow label="Owners">
                            {selectedVehicles.map((v) => (
                                <span key={v.id} className="text-xs font-medium">
                                    {v.owners || 1}
                                </span>
                            ))}
                        </ComparisonRow>
                    </div>
                </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">AI Buyer Insights</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InsightCard
                        title="Best for Budget"
                        icon={<Wallet className="text-emerald-500" size={18} />}
                        value={insights.budget.name}
                        reason={insights.budget.reason}
                    />
                    <InsightCard
                        title="Best Performance"
                        icon={<Zap className="text-amber-500" size={18} />}
                        value={insights.performance.name}
                        reason={insights.performance.reason}
                    />
                    <InsightCard
                        title="Best Reliability"
                        icon={<Shield className="text-blue-500" size={18} />}
                        value={insights.reliability.name}
                        reason={insights.reliability.reason}
                    />
                </div>
            </div>
        </div>
    )
}

function ComparisonRow({ label, children, highlight = false }: { label: string; children: React.ReactNode; highlight?: boolean }) {
    const childArray = Array.isArray(children) ? children : [children]

    return (
        <>
            <div className={cn(
                "font-medium text-[10px] uppercase tracking-wider text-muted-foreground rounded-lg p-3 flex items-center bg-secondary/10",
                highlight && "text-primary font-bold"
            )}>
                {label}
            </div>
            {childArray.map((child, idx) => (
                <div key={idx} className={cn(
                    "rounded-lg p-4 flex items-center bg-card border border-border",
                    highlight && "bg-primary/5 border-primary/20"
                )}>
                    {child}
                </div>
            ))}
        </>
    )
}

function InsightCard({ title, icon, value, reason }: { title: string; icon: React.ReactNode; value: string; reason: string }) {
    return (
        <div className="bg-white dark:bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</span>
            </div>
            <p className="text-sm font-bold text-foreground mb-1">{value}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
        </div>
    )
}

function generateCarInsights(cars: Vehicle[]) {
    const sortedByPrice = [...cars].sort((a, b) => a.price - b.price)
    const budget = sortedByPrice[0]

    const sortedByPower = [...cars].sort((a, b) => (b.engineCC || 0) - (a.engineCC || 0))
    const performance = sortedByPower[0]

    const reliability = [...cars].sort((a, b) => b.price - a.price)[0] // simplified logic

    return {
        budget: {
            name: `${budget.make} ${budget.model}`,
            reason: `With a price of $${budget.price.toLocaleString()}, this is the most affordable option in your selection.`
        },
        performance: {
            name: `${performance.make} ${performance.model}`,
            reason: `The ${performance.engineCC}cc engine ${performance.fuelType === "electric" ? "(Range: " + performance.range + "km)" : ""} offers superior power output.`
        },
        reliability: {
            name: `${reliability.make} ${reliability.model}`,
            reason: `Modern features and ${reliability.condition} status make this a dependable choice for long-term ownership.`
        }
    }
}
