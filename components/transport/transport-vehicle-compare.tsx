"use client"

import { vehicles } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { Car, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { SwitchSaveSimulator } from "@/components/dashboard/switch-save-simulator"

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
            <div className="glass-floating p-3 bg-primary/5 border-primary/20 shadow-xl rounded-xl group teal-glow">
                <div className="flex items-center gap-2 mb-1 relative z-10">
                    <Car className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[10px] font-medium text-white uppercase tracking-[0.2em] opacity-70">Neural Comparison Engine</p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60 relative z-10">Side-by-side strategic asset evaluation.</p>
            </div>

            {/* Vehicle selector */}
            <div>
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2.5 opacity-70">Select Assets ({selected.length}/3):</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {available.map(v => (
                        <button key={v.id} onClick={() => toggleSelect(v.id)}
                            className="glass-floating px-2.5 py-1 rounded-lg text-[9px] font-medium text-white uppercase tracking-widest bg-white/5 border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all">
                            {v.year} {v.make} {v.model}
                        </button>
                    ))}
                </div>
            </div>

            {selectedVehicles.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-white/10 p-10 text-center bg-white/5">
                    <Car className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Inject assets into the comparison matrix.</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[1fr,320px] gap-6 items-start">
                    <div className="glass-floating border-white/5 bg-white/5 rounded-xl overflow-hidden teal-glow">
                        <div className="overflow-x-auto scrollbar-premium">
                            <table className="w-full text-[9px] uppercase tracking-widest">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="px-3 py-2.5 text-left text-muted-foreground font-medium w-28">Specification</th>
                                        {selectedVehicles.map(v => (
                                            <th key={v.id} className="px-3 py-2.5 text-center bg-primary/5 border-l border-white/5">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <button 
                                                        onClick={() => toggleSelect(v.id)} 
                                                        className="self-end text-muted-foreground hover:text-destructive transition-colors"
                                                        title="Remove from comparison"
                                                    >
                                                        <X className="w-2.5 h-2.5" />
                                                    </button>
                                                    <p className="font-display font-medium text-white tracking-tight">{v.make} {v.model}</p>
                                                    <p className="text-primary/70 font-medium">{v.year}</p>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {specs.map(spec => (
                                        <tr key={spec.key} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-3 py-2 font-medium text-muted-foreground">{spec.label}</td>
                                            {selectedVehicles.map(v => (
                                                <td key={v.id} className={cn("px-3 py-2 text-center font-medium border-l border-white/5",
                                                    spec.key === "price" ? "text-white text-[11px] font-display" : "text-white/80"
                                                )}>
                                                    {spec.key === "fuelType" ? (
                                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-medium border ${fuelColors[v.fuelType].replace('bg-', 'border-').replace('/10', '/30')}`}>{v.fuelType}</span>
                                                    ) : spec.format(v)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <SwitchSaveSimulator
                        category="mobility"
                        current={selectedVehicles[0]}
                        recommended={[...selectedVehicles].sort((a,b) => a.price - b.price)[0]}
                    />
                </div>
            )}
        </div>
    )
}

