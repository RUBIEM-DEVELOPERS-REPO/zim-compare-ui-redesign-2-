"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Trash2, ArrowRight } from "lucide-react"
import { vehicles, drivingSchools, busRoutes } from "@/lib/mock/transport"

export function TransportCompareBar() {
    const { t } = useI18n()
    const router = useRouter()
    const { compareTray, clearCompareTray } = useAppStore()

    if (compareTray.ids.length === 0 || compareTray.category !== "mobility") return null

    const handleCompare = () => {
        if (compareTray.ids.length < 2) return
        
        const sub = compareTray.subcategory || "cars"
        const base = `/mobility/compare/${sub}`
        router.push(`${base}?ids=${compareTray.ids.join(",")}`)
    }

    // Get item info for avatars
    const allItems = [...vehicles, ...drivingSchools, ...busRoutes]
    
    return (
        <div className="glass-card px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 backdrop-blur-xl sticky top-20 z-40 shadow-xl shadow-primary/10 my-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                    {compareTray.ids.map(id => {
                        const item = allItems.find(x => x.id === id)
                        let label = id
                        if (item) {
                            if ('make' in item) label = `${item.make} ${item.model}`
                            else if ('name' in item) label = item.name
                            else if ('origin' in item) label = `${item.origin}-${item.destination}`
                        }
                        const initials = label.substring(0, 2).toUpperCase()
                        
                        return (
                            <div key={id} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-primary/10 flex items-center justify-center font-black text-primary text-[10px] uppercase shadow-md backdrop-blur-sm">
                                {initials}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <p className="text-sm text-foreground font-black uppercase tracking-tight">
                        {compareTray.ids.length} items selected
                    </p>
                    <button 
                        onClick={clearCompareTray}
                        className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors uppercase font-bold tracking-wider"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear All
                    </button>
                </div>
            </div>
            
            <button
                onClick={handleCompare}
                disabled={compareTray.ids.length < 2}
                className={cn("rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2",
                    compareTray.ids.length >= 2
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30 hover:scale-105 active:scale-95"
                        : "bg-slate-200 dark:bg-slate-800 text-muted-foreground cursor-not-allowed"
                )}>
                Analyze Comparison
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}
