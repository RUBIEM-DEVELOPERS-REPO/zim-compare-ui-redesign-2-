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
import { cn } from "@/lib/utils"

export function CompareBar() {
    const { compareTray, removeFromCompareTray, clearCompareTray } = useAppStore()
    const router = useRouter()
    const pathname = usePathname()

    // Draggable state
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const barRef = useRef<HTMLDivElement>(null)

    // Auto-hide logic
    const isHiddenPage = pathname.includes("/compare") ||
        pathname.includes("/comparison") ||
        pathname.includes("/results")

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

    if (compareTray.ids.length === 0 || isHiddenPage) return null

    const items = compareTray.ids.map(id => {
        const loan = bankLoans.find(l => l.id === id)
        const product = bankingProducts.find(p => p.id === id)
        const bundle = dataBundles.find(b => b.id === id)
        const policy = policies.find(pol => pol.id === id)
        const school = schools.find(s => s.id === id)
        const university = universities.find(u => u.id === id)
        const vehicle = vehicles.find(v => v.id === id)

        const item = loan || product || bundle || policy || school || university || vehicle

        let providerName = ""
        if (item) {
            if ("bankName" in item) providerName = (item as any).bankName
            else if ("providerName" in item) providerName = (item as any).providerName
            else if ("city" in item) providerName = (item as any).city // Fallback for schools/unis
            else if ("dealershipName" in item) providerName = (item as any).dealershipName
        }

        let name = (item as any)?.name || id
        if (vehicle) {
            name = `${vehicle.make} ${vehicle.model}`
        }

        return { id, name, provider: providerName }
    })

    // Style for position
    const dragStyle: React.CSSProperties = position ? {
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "none",
        bottom: "auto"
    } : {
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)"
    }

    return (
        <div
            ref={barRef}
            style={dragStyle}
            className={cn(
                "z-[100] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-8 duration-500",
                isDragging && "cursor-grabbing"
            )}
        >
            <div className="bg-card/90 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
                <div
                    onMouseDown={onMouseDown}
                    className="px-4 py-2 flex items-center justify-between border-b border-border/50 bg-primary/5 cursor-grab active:cursor-grabbing hover:bg-primary/10 transition-colors"
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
                                className="shrink-0 flex items-center gap-2 bg-secondary/80 border border-border rounded-xl pl-3 pr-2 py-1.5 group hover:border-primary/50 transition-colors"
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
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-32 border border-dashed border-border rounded-xl flex items-center justify-center bg-secondary/20"
                            >
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-50">Slot {items.length + i + 1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex shrink-0">
                        <button
                            onClick={() => {
                                const sub = compareTray.subcategory || (
                                    compareTray.category === "telecom" ? "data" :
                                        compareTray.category === "banking" ? "accounts" :
                                            compareTray.category === "insurance" ? "policies" :
                                                compareTray.category === "schools" ? "overview" :
                                                    compareTray.category === "universities" ? "fees" :
                                                        compareTray.category === "mobility" ? "cars" : "overview"
                                )

                                if (compareTray.category === "universities" && sub !== "programs") {
                                    router.push(`/universities/compare?ids=${compareTray.ids.join(",")}`)
                                } else {
                                    const base = `/${compareTray.category}/compare/${sub}`
                                    router.push(`${base}?ids=${compareTray.ids.join(",")}`)
                                }

                                // Clear the tray after successful navigation trigger
                                setTimeout(() => {
                                    clearCompareTray()
                                }, 500)
                            }}
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
    )
}
