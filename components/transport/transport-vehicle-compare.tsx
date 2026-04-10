"use client"

import { vehicles } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { Car, X } from "lucide-react"
import { useAppStore } from "@/lib/store"

const fuelColors: Record<string, string> = {
    petrol: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    diesel: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hybrid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    electric: "bg-primary/10 text-primary",
}

export function TransportVehicleCompare() {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const selected = compareTray.ids

    const selectedVehicles = vehicles.filter(v => selected.includes(v.id))
    const available = vehicles.filter(v => !selected.includes(v.id))

    const toggleSelect = (id: string) => {
        if (selected.includes(id)) {
            removeFromCompareTray(id)
        } else {
            addToCompareTray("mobility", id, "cars")
        }
    }

    const specs = [
        { label: "Price", key: "price", format: (v: any) => `$${v.price.toLocaleString()}` },
        { label: "Year", key: "year", format: (v: any) => v.year.toString() },
        { label: "Engine", key: "engineCC", format: (v: any) => `${v.engineCC}cc` },
        { label: "Fuel Type", key: "fuelType", format: (v: any) => v.fuelType },
        { label: "Transmission", key: "transmission", format: (v: any) => v.transmission },
        { label: "Mileage", key: "mileage", format: (v: any) => v.mileage === 0 ? "New" : `${v.mileage.toLocaleString()}km` },
        { label: "Color", key: "color", format: (v: any) => v.color },
        { label: "Financing", key: "financingAvailable", format: (v: any) => v.financingAvailable ? "✓ Available" : "✗ Not available" },
        { label: "Condition", key: "condition", format: (v: any) => v.condition },
        { label: "Dealer", key: "dealershipName", format: (v: any) => v.dealershipName },
    ]

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-foreground mb-1">Vehicle Comparison</p>
                <p className="text-xs text-muted-foreground">Select up to 3 vehicles from the list below to compare side-by-side.</p>
            </div>

            {/* Vehicle selector */}
            <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Select vehicles to compare ({selected.length}/3):</p>
                <div className="flex flex-wrap gap-2">
                    {available.map(v => (
                        <button key={v.id} onClick={() => toggleSelect(v.id)}
                            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/30 hover:bg-secondary/50 transition-colors">
                            {v.year} {v.make} {v.model}
                        </button>
                    ))}
                </div>
            </div>

            {selectedVehicles.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Select vehicles above to start comparing.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-border bg-secondary/30">
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium w-32">Spec</th>
                                    {selectedVehicles.map(v => (
                                        <th key={v.id} className="px-4 py-3 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <button 
                                                    onClick={() => toggleSelect(v.id)} 
                                                    className="self-end text-muted-foreground hover:text-foreground"
                                                    title="Remove from comparison"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <p className="font-semibold text-foreground">{v.make} {v.model}</p>
                                                <p className="text-muted-foreground">{v.year}</p>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {specs.map(spec => (
                                    <tr key={spec.key} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-4 py-3 font-medium text-muted-foreground">{spec.label}</td>
                                        {selectedVehicles.map(v => (
                                            <td key={v.id} className={cn("px-4 py-3 text-center font-medium",
                                                spec.key === "price" ? "text-foreground text-sm font-bold" : "text-foreground"
                                            )}>
                                                {spec.key === "fuelType" ? (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fuelColors[v.fuelType]}`}>{v.fuelType}</span>
                                                ) : spec.format(v)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
