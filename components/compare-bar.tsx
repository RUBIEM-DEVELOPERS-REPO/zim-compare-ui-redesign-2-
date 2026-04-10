"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { X, ArrowRight, Trash2, GripHorizontal, RotateCcw } from "lucide-react"
import { bankLoans, bankingProducts } from "@/lib/mock/banks"
import { dataBundles } from "@/lib/mock/telecoms"
import { policies } from "@/lib/mock/insurance"
import { schools } from "@/lib/mock/schools"
import { universities } from "@/lib/mock/universities"
import { vehicles } from "@/lib/mock/transport"
import { solarPackages, boreholePackages } from "@/lib/mock/solar"
import { hotels } from "@/lib/mock/hotels"
import { cn } from "@/lib/utils"
import { SmartRecommendation } from "./smart-recommendation"

export function CompareBar() {
    const { compareTray, removeFromCompareTray, clearCompareTray } = useAppStore()
    const router = useRouter()
    const pathname = usePathname()

    // Draggable state
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const isMountedRef = useRef(true)
    const barRef = useRef<HTMLDivElement>(null)

    // Hydration guard
    useEffect(() => {
        setIsMounted(true)
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    const isBankingPage = pathname?.includes("/banking")
    const isTelecomPage = pathname?.includes("/telecom")
    const isSchoolsPage = pathname?.includes("/schools")
    const isUniversitiesPage = pathname?.includes("/universities")
    const isInsurancePage = pathname?.includes("/insurance")

    // Get current category from pathname (e.g., /insurance -> insurance)
    const currentCategory = pathname?.split('/')[1] || ""

    // Load saved position
    useEffect(() => {
        const saved = localStorage.getItem("compare-bar-pos")
        if (saved) {
            try {
                setPosition(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse saved position", e)
            }
        }
    }, [])

    // Draggable handlers
    const onMouseDown = (e: React.MouseEvent) => {
        if (!barRef.current) return
        setIsDragging(true)
        const rect = barRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
        // Disable text selection
        document.body.style.userSelect = "none"
    }

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return

            let newX = e.clientX - dragOffset.x
            let newY = e.clientY - dragOffset.y

            // Viewport constraints (20px margin)
            const margin = 20
            const barWidth = barRef.current?.offsetWidth || 0
            const barHeight = barRef.current?.offsetHeight || 0

            newX = Math.max(margin, Math.min(newX, window.innerWidth - barWidth - margin))
            newY = Math.max(margin, Math.min(newY, window.innerHeight - barHeight - margin))

            const newPos = { x: newX, y: newY }
            setPosition(newPos)
        }

        const onMouseUp = () => {
            if (isDragging) {
                setIsDragging(false)
                document.body.style.userSelect = ""
                if (position) {
                    localStorage.setItem("compare-bar-pos", JSON.stringify(position))
                }
            }
        }

        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove)
            window.addEventListener("mouseup", onMouseUp)
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [isDragging, dragOffset, position])

    const resetPosition = () => {
        setPosition(null)
        localStorage.removeItem("compare-bar-pos")
    }

    // Sync dynamic position via ref to avoid inline style warnings
    useEffect(() => {
        if (barRef.current && position) {
            barRef.current.style.setProperty("--x", `${position.x}px`);
            barRef.current.style.setProperty("--y", `${position.y}px`);
        } else if (barRef.current) {
            barRef.current.style.removeProperty("--x");
            barRef.current.style.removeProperty("--y");
        }
    }, [position]);

    if (
        !isMounted || 
        compareTray.ids.length === 0 || 
        isBankingPage || 
        isTelecomPage || 
        isSchoolsPage || 
        isUniversitiesPage ||
        isInsurancePage ||
        (compareTray.category !== "" && compareTray.category !== currentCategory)
    ) return null

    const allItems = [
        ...bankLoans,
        ...bankingProducts,
        ...dataBundles,
        ...policies,
        ...schools,
        ...universities,
        ...vehicles,
        ...solarPackages,
        ...boreholePackages,
        ...hotels
    ]

    const items = compareTray.ids.map(id => {
        const item = allItems.find(i => i.id === id) as any

        let providerName = ""
        if (item) {
            providerName = item.bankName || item.providerName || item.dealershipName || item.city || item.location || ""
        }

        let name = item?.name || id
        if (item && "make" in item && "model" in item) {
            name = `${item.make} ${item.model}`
        }

        return { id, name, provider: providerName }
    })

    const handleCompareClick = () => {
        const categoryRoutes: Record<string, string> = {
            telecom: "data",
            banking: "accounts",
            insurance: "policies",
            schools: "overview",
            universities: "fees",
            mobility: "cars",
            solar: "overview",
            boreholes: "overview",
            stayscape: "hotels"
        }

        const sub = compareTray.subcategory || categoryRoutes[compareTray.category] || "overview"

        if (compareTray.category === "universities" && sub !== "programs") {
            router.push(`/universities/compare?ids=${compareTray.ids.join(",")}`)
        } else if (compareTray.category === "mobility") {
            router.push(`/mobility/${sub}/compare?ids=${compareTray.ids.join(",")}`)
        } else {
            const base = `/${compareTray.category}/compare/${sub}`
            router.push(`${base}?ids=${compareTray.ids.join(",")}`)
        }

        // Clear the tray after successful navigation trigger
        setTimeout(() => {
            if (isMountedRef.current) {
                clearCompareTray()
            }
        }, 500)
    }

    return (
        <div
            ref={barRef}
            className={cn(
                "fixed z-[9999] w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-300",
                position 
                    ? "left-[var(--x)] top-[var(--y)] transform-none" 
                    : "bottom-8 left-1/2 -translate-x-1/2",
                isDragging && "cursor-grabbing"
            )}
    >
        <div className="relative">
            <SmartRecommendation />
            <div className="glass-card !rounded-2xl border-2 border-primary/20 shadow-2xl overflow-hidden shadow-primary/10">
                <div
                    onMouseDown={onMouseDown}
                    className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-white/5 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <GripHorizontal size={16} className="text-muted-foreground" />
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                                {compareTray.category}
                            </div>
                            <span className="text-xs font-bold text-foreground">
                                {compareTray.ids.length} items selected
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {position && (
                            <button
                                onClick={resetPosition}
                                className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                                title="Reset Position"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                        <button
                            onClick={clearCompareTray}
                            className="text-[9px] uppercase tracking-wider font-black text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                        >
                            <Trash2 size={12} />
                            Clear
                        </button>
                    </div>
                </div>

                <div className="p-3 flex items-center gap-4">
                    <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="shrink-0 flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm rounded-xl pl-3 pr-2 py-1.5 group hover:border-primary/50 transition-colors"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-primary leading-tight uppercase tracking-tighter truncate max-w-[70px]">
                                        {item.provider}
                                    </span>
                                    <span className="text-[11px] font-bold text-foreground leading-tight truncate max-w-[100px]">
                                        {item.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeFromCompareTray(item.id)}
                                    className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                    title="Remove item"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-32 border border-dashed border-white/20 rounded-xl flex items-center justify-center bg-white/5"
                            >
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-50">Slot {items.length + i + 1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex shrink-0">
                        <button
                            onClick={handleCompareClick}
                            disabled={compareTray.ids.length < 2}
                            className={cn(
                                "rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg",
                                compareTray.ids.length >= 2
                                    ? "bg-primary text-primary-foreground hover:scale-105 shadow-primary/20"
                                    : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                            )}
                        >
                            Compare
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}
