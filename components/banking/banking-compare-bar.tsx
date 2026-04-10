"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Trash2, ArrowRight } from "lucide-react"
import { banks, bankingProducts, bankLoans } from "@/lib/mock/banks"

export function BankingCompareBar() {
    const { t } = useI18n()
    const router = useRouter()
    const { compareTray, clearCompareTray } = useAppStore()

    if (compareTray.ids.length === 0) return null

    const handleCompare = () => {
        if (compareTray.ids.length < 2) return
        
        const sub = compareTray.subcategory || "accounts"
        const base = `/banking/compare/${sub}`
        router.push(`${base}?ids=${compareTray.ids.join(",")}`)
    }

    // Get item info for avatars
    const allItems = [...bankingProducts, ...bankLoans]
    
    return (
        <div className="glass-card-primary px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 backdrop-blur-xl sticky top-20 z-40 shadow-xl shadow-primary/10 my-4">
            <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                    {compareTray.ids.map(id => {
                        const item = allItems.find(x => x.id === id)
                        const bankName = item?.bankName || id
                        const initials = bankName.substring(0, 2).toUpperCase()
                        
                        return (
                            <div key={id} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-primary/10 flex items-center justify-center font-black text-primary text-[10px] uppercase shadow-md backdrop-blur-sm">
                                {initials}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <p className="text-sm text-foreground font-black uppercase tracking-tight">
                        {compareTray.ids.length} products selected
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
