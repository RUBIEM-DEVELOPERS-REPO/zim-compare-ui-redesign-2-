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
        <div className="glass-floating px-4 py-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-2 backdrop-blur-xl sticky top-20 z-40 shadow-2xl my-2 border-white/10 bg-primary/5 rounded-xl teal-glow">
            <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                    {compareTray.ids.map(id => {
                        const item = allItems.find(x => x.id === id)
                        let label = id
                        if (item) {
                            if ('make' in item) label = `${item.make} ${item.model}`
                            else if ('name' in item) label = item.name
                            else if ('origin' in item) label = `${item.origin}-${item.destination}`
                        }
                        const initials = label.substring(0, 1).toUpperCase()
                        
                        return (
                            <div key={id} className="h-7 w-7 rounded-full border border-background overflow-hidden bg-primary/10 flex items-center justify-center font-display font-medium text-primary text-[8px] uppercase shadow-md backdrop-blur-sm">
                                {initials}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <p className="text-[10px] text-white font-display font-medium uppercase tracking-[0.1em]">
                        {compareTray.ids.length} Selected
                    </p>
                    <button 
                        onClick={clearCompareTray}
                        className="text-[8px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors uppercase font-medium tracking-widest mt-0.5"
                    >
                        <Trash2 className="w-2.5 h-2.5" />
                        Reset
                    </button>
                </div>
            </div>
            
            <button
                onClick={handleCompare}
                disabled={compareTray.ids.length < 2}
                className={cn("rounded-lg px-4 py-1.5 text-[9px] font-display font-medium uppercase tracking-widest transition-all shadow-lg flex items-center gap-1.5",
                    compareTray.ids.length >= 2
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-95 teal-glow"
                        : "bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5"
                )}>
                Analyze comparisons
                <ArrowRight className="w-3 h-3" />
            </button>
        </div>
    )
}

