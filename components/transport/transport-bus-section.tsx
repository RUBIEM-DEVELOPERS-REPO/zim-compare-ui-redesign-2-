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
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-border/40">
                {subTabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveSubTab(t.key)}
                        className={cn(
                            "shrink-0 glass-tab-base px-4 py-2 text-xs font-medium transition-all",
                            activeSubTab === t.key
                                ? "glass-tab-active"
                                : "text-muted-foreground hover:text-foreground"
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
