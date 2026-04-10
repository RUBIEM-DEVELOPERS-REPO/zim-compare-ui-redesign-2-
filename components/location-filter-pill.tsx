"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export const ZIMBABWE_CITIES = [
    "All Locations",
    "Harare",
    "Bulawayo",
    "Gweru",
    "Mutare",
    "Masvingo",
    "Chinhoyi",
    "Marondera",
    "Kwekwe",
    "Kadoma",
    "Victoria Falls"
]

interface LocationFilterPillProps {
    selectedLocation: string
    onLocationChange: (location: string) => void
    className?: string
}

export function LocationFilterPill({ selectedLocation, onLocationChange, className }: LocationFilterPillProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className={cn("relative shrink-0", className)} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-4 py-1.5 h-10 text-xs font-bold transition-all w-full md:w-auto justify-between md:justify-start shadow-xl glass-tab-base",
                    selectedLocation !== "All Locations"
                        ? "glass-tab-active border-primary/40"
                        : "border-white/10 text-muted-foreground hover:border-primary/40 hover:bg-white/10"
                )}
            >
                <div className="flex items-center gap-1.5 uppercase tracking-widest">
                    <MapPin className={cn("w-3.5 h-3.5", selectedLocation !== "All Locations" ? "text-teal-600" : "text-muted-foreground")} />
                    <span>{selectedLocation}</span>
                </div>
                {selectedLocation !== "All Locations" ? (
                    <div
                        role="button"
                        title="Remove location filter"
                        aria-label="Remove location filter"
                        onClick={(e) => {
                            e.stopPropagation()
                            onLocationChange("All Locations")
                            setIsOpen(false)
                        }}
                        className="hover:bg-teal-100 rounded-full p-0.5 ml-1 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </div>
                ) : (
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/20 bg-background/60 backdrop-blur-2xl p-1.5 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-72 overflow-y-auto no-scrollbar py-1">
                        {ZIMBABWE_CITIES.map((loc) => (
                            <button
                                key={loc}
                                onClick={() => {
                                    onLocationChange(loc)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "w-full rounded-xl px-3 py-2.5 text-xs font-bold text-left transition-all flex items-center justify-between mb-0.5 last:mb-0",
                                    selectedLocation === loc
                                        ? "bg-primary text-white shadow-lg"
                                        : "text-foreground hover:bg-primary/20 hover:translate-x-1"
                                )}
                            >
                                <span className="uppercase tracking-wide">{loc}</span>
                                {selectedLocation === loc && <MapPin className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
