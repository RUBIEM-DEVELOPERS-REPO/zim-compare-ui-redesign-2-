"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { TransportBusRoutes } from "./transport-bus-routes"
import { TransportRouteSelector } from "./transport-route-selector"
import { TransportEmiCalculator } from "./transport-emi-calculator"
import { TransportCrossBorder } from "./transport-crossborder"

interface TransportBusSectionProps {
    location?: string
}

const subTabs = [
    { key: "routes", label: "Bus Routes" },
    { key: "crossborder", label: "Cross-Border" },
]

export function TransportBusSection({ location = "All Locations" }: TransportBusSectionProps) {
    const [activeSubTab, setActiveSubTab] = useState("routes")

    return (
        <div className="space-y-6">
            {/* Sub-navigation */}
            <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none border-b border-white/5">
                {subTabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveSubTab(t.key)}
                        className={cn(
                            "shrink-0 px-4 py-1.5 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                            activeSubTab === t.key
                                ? "bg-primary text-primary-foreground teal-glow shadow-lg shadow-primary/20 scale-[1.02]"
                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Sub-tab Content */}
            <div className="pt-2">
                {activeSubTab === "routes" && <TransportBusRoutes location={location} />}
                {activeSubTab === "crossborder" && <TransportCrossBorder />}
            </div>
        </div>
    )
}

