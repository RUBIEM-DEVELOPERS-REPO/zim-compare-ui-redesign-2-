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
                    "flex items-center gap-2 px-5 py-2 h-11 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500 w-full md:w-auto justify-between md:justify-start shadow-2xl glass-floating floating-hover",
                    selectedLocation !== "All Locations"
                        ? "border-primary/50 text-primary teal-glow"
                        : "border-white/10 text-muted-foreground hover:border-primary/40 hover:bg-white/5"
                )}
            >
                <div className="flex items-center gap-2">
                    <MapPin className={cn("w-4 h-4", selectedLocation !== "All Locations" ? "text-primary" : "text-muted-foreground")} />
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
                        className="hover:bg-primary/20 rounded-full p-1 ml-2 transition-all"
                    >
                        <X className="w-3.5 h-3.5" />
                    </div>
                ) : (
                    <ChevronDown className="w-4 h-4 opacity-50" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-60 rounded-[1.5rem] border border-white/20 bg-background/40 backdrop-blur-3xl p-2 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-500 glass-floating teal-glow">
                    <div className="max-h-72 overflow-y-auto no-scrollbar py-1">
                        {ZIMBABWE_CITIES.map((loc) => (
                            <button
                                key={loc}
                                onClick={() => {
                                    onLocationChange(loc)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "w-full rounded-xl px-4 py-3 text-[10px] font-medium text-left transition-all duration-300 flex items-center justify-between mb-1 last:mb-0",
                                    selectedLocation === loc
                                        ? "bg-primary text-primary-foreground shadow-xl teal-glow"
                                        : "text-foreground hover:bg-white/10 hover:translate-x-1"
                                )}
                            >
                                <span className="uppercase tracking-[0.15em]">{loc}</span>
                                {selectedLocation === loc && <MapPin className="w-3.5 h-3.5" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

