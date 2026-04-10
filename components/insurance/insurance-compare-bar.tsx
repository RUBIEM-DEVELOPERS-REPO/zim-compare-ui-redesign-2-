"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Trash2, ArrowRight } from "lucide-react"
import { policies } from "@/lib/mock/insurance"

export function InsuranceCompareBar() {
    const router = useRouter()
    const { compareTray, clearCompareTray } = useAppStore()

    // Requirement: Show the bar immediately after 2 or more products are added
    if (compareTray.ids.length < 2 || compareTray.category !== "insurance") return null

    const handleCompare = () => {
        if (compareTray.ids.length < 2) return
        
        const sub = compareTray.subcategory || "policies"
        const base = `/insurance/compare/${sub}`
        router.push(`${base}?ids=${compareTray.ids.join(",")}`)
    }

    return (
        <div className="glass-card-primary px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 backdrop-blur-xl sticky top-20 z-40 shadow-xl shadow-teal-500/10 my-4">
            <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                    {compareTray.ids.map(id => {
                        const policy = policies.find(x => x.id === id)
                        const name = policy?.providerName || id
                        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase()
                        
                        return (
                            <div key={id} title={name} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-teal-600/10 flex items-center justify-center font-black text-teal-600 text-[10px] uppercase shadow-md backdrop-blur-sm">
                                {initials}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <p className="text-sm text-foreground font-black uppercase tracking-tight">
                        {compareTray.ids.length} PRODUCTS SELECTED
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
                        ? "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/30 hover:scale-105 active:scale-95"
                        : "bg-slate-200 dark:bg-slate-800 text-muted-foreground cursor-not-allowed opacity-50"
                )}>
                Analyze Comparison
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}
