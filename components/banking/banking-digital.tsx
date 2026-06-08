"use client"

import { useState } from "react"
import { banks } from "@/lib/mock/banks"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X, Check, AlertCircle } from "lucide-react"
import { Disclaimer } from "@/components/disclaimer"
import { BankingCompareBar } from "./banking-compare-bar"

interface BankingDigitalProps {
  location?: string
}

export function BankingDigital({ location = "All Locations" }: BankingDigitalProps) {
  const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
  const [error, setError] = useState<string | null>(null)

  const filteredBanks = location === "All Locations"
    ? banks
    : banks.filter(b => b.locations.includes(location))

  const sorted = [...filteredBanks].sort((a, b) => (b.digitalScore ?? 0) - (a.digitalScore ?? 0))

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const isSelected = compareTray.ids.includes(id)
    if (isSelected) {
      removeFromCompareTray(id)
    } else {
      if (compareTray.ids.length >= 3) {
        setError("You can compare up to 3 banks.")
        setTimeout(() => setError(null), 3000)
        return
      }
      addToCompareTray("banking", id, "digital")
    }
  }

  return (
    <div className="space-y-4 pb-12">
      <BankingCompareBar />
      
      {/* Selection Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Select up to 3 banks to compare digital features</p>
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-medium animate-in fade-in slide-in-from-right-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        {filteredBanks.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No digital banking data for {location}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">None of the banks with digital scoring are currently active in this location.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((b, i) => {
              const isSelected = compareTray.ids.includes(b.id)
              return (
                <div
                  key={b.id}
                  onClick={(e) => toggleSelection(b.id, e)}
                  className={cn(
                    "rounded-2xl border p-5 cursor-pointer transition-all duration-300 relative group overflow-hidden",
                    isSelected
                      ? "bg-primary/5 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                      : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{isSelected ? "Added" : "Add to Compare"}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shadow-sm",
                      isSelected ? "bg-primary border-primary" : "bg-background border-border"
                    )}>
                      {isSelected && <Check size={12} className="text-primary-foreground" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground/60 font-mono">#{i + 1}</span>
                      <p className="text-sm font-medium text-foreground">{b.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] font-medium uppercase tracking-tight">
                    <div className="rounded-xl bg-secondary/40 p-2.5 text-center flex flex-col items-center justify-center">
                      <span className="text-muted-foreground mb-0.5">Score</span>
                      <span className="text-primary">{b.digitalScore}%</span>
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-2.5 text-center flex flex-col items-center justify-center">
                      <span className="text-muted-foreground mb-0.5">Rating</span>
                      <span className="text-foreground">{(3.5 + (b.digitalScore ?? 0) / 50).toFixed(1)}</span>
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-2.5 text-center flex flex-col items-center justify-center">
                      <span className="text-muted-foreground mb-0.5">Uptime</span>
                      <span className="text-foreground">{95 + Math.floor((b.digitalScore ?? 0) / 25)}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {b.digitalFeatures.slice(0, 4).map((f) => (
                      <span key={f} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/10">
                        {f}
                      </span>
                    ))}
                    {b.digitalFeatures.length > 4 && (
                      <span className="text-[9px] text-muted-foreground px-1 py-0.5">+{b.digitalFeatures.length - 4} more</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  )
}

