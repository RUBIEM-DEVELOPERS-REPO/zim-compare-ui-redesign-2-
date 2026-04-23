"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Trash2, ArrowRight } from "lucide-react"
import { telecomProviders, dataBundles } from "@/lib/mock/telecoms"

export function TelecomCompareBar() {
    const { t } = useI18n()
    const router = useRouter()
    const { compareTray, clearCompareTray } = useAppStore()

    if (compareTray.ids.length === 0 || compareTray.category !== "telecom") return null

    const handleCompare = () => {
        if (compareTray.ids.length < 2) return
        
        const sub = compareTray.subcategory || "data"
        const base = `/telecom/compare/${sub}`
        router.push(`${base}?ids=${compareTray.ids.join(",")}`)
    }

    // Get item info for avatars
    const allProviders = telecomProviders
    const allBundles = dataBundles
    
    return (
        <div className="rounded-2xl border-2 border-teal-500/30 bg-teal-500/5 px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 backdrop-blur-md sticky top-20 z-40 shadow-xl shadow-teal-500/10 my-4">
            <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                    {compareTray.ids.map(id => {
                        const bundle = allBundles.find(x => x.id === id)
                        const provider = allProviders.find(x => x.id === id || x.id === bundle?.providerId)
                        
                        const name = bundle?.name || provider?.name || id
                        const initials = name.substring(0, 2).toUpperCase()
                        
                        return (
                            <div key={id} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-teal-500/10 flex items-center justify-center font-medium text-teal-600 text-[10px] uppercase shadow-md backdrop-blur-sm">
                                {initials}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <p className="text-sm text-foreground font-medium uppercase tracking-tight">
                        {compareTray.ids.length} {compareTray.subcategory === 'data' ? 'bundles' : 'providers'} selected
                    </p>
                    <button 
                        onClick={clearCompareTray}
                        className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors uppercase font-medium tracking-wider"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear All
                    </button>
                </div>
            </div>
            
            <button
                onClick={handleCompare}
                disabled={compareTray.ids.length < 2}
                className={cn("rounded-xl px-6 py-2.5 text-xs font-medium uppercase tracking-widest transition-all shadow-lg flex items-center gap-2",
                    compareTray.ids.length >= 2
                        ? "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/30 hover:scale-105 active:scale-95"
                        : "bg-slate-200 dark:bg-slate-800 text-muted-foreground cursor-not-allowed"
                )}>
                Analyze Comparison
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}

