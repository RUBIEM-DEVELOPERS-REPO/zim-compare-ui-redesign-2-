"use client"

import { useState } from "react"
import { banks } from "@/lib/mock/banks"
import { ScoreBadge } from "@/components/score-badge"
import { cn } from "@/lib/utils"
import { X, Check, AlertCircle, Info } from "lucide-react"
import { Disclaimer } from "@/components/disclaimer"

const digitalChecklist = [
  "Mobile App",
  "Internet Banking",
  "USSD",
  "WhatsApp Banking",
  "QR Payments",
  "Cardless ATM",
  "EcoCash Integration",
  "Textacash",
  "POS Integration"
]

interface BankingDigitalProps {
  location?: string
}

export function BankingDigital({ location = "All Locations" }: BankingDigitalProps) {
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const filteredBanks = location === "All Locations"
    ? banks
    : banks.filter(b => b.locations.includes(location))

  const sorted = [...filteredBanks].sort((a, b) => (b.digitalScore ?? 0) - (a.digitalScore ?? 0))

  const toggleSelection = (id: string) => {
    if (selectedBankIds.includes(id)) {
      setSelectedBankIds(prev => prev.filter(item => item !== id))
      setError(null)
    } else {
      if (selectedBankIds.length >= 3) {
        setError("You can compare up to 3 banks.")
        setTimeout(() => setError(null), 3000)
        return
      }
      setSelectedBankIds(prev => [...prev, id])
      setError(null)
    }
  }

  const selectedBanks = banks.filter(b => selectedBankIds.includes(b.id))
  // Re-sort selected banks to match the selection order if desired, or keep original
  const orderedSelected = selectedBankIds.map(id => banks.find(b => b.id === id)!)

  return (
    <div className="space-y-8 pb-12">
      {/* Selection Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Select 2-3 banks to compare features</p>
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-bold animate-in fade-in slide-in-from-right-2">
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
            <h3 className="text-lg font-bold text-foreground mb-2">No digital banking data for {location}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">None of the banks with digital scoring are currently active in this location.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((b, i) => {
              const isSelected = selectedBankIds.includes(b.id)
              return (
                <div
                  key={b.id}
                  onClick={() => toggleSelection(b.id)}
                  className={cn(
                    "rounded-2xl border p-5 cursor-pointer transition-all duration-300 relative group overflow-hidden",
                    isSelected
                      ? "bg-teal-50 border-teal-200 shadow-lg shadow-teal-500/10 ring-1 ring-teal-200"
                      : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select</span>
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                      isSelected ? "bg-teal-600 border-teal-600" : "bg-background border-border"
                    )}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground/60 font-mono">#{i + 1}</span>
                      <p className="text-sm font-bold text-foreground">{b.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] font-bold uppercase tracking-tight">
                    <div className="rounded-xl bg-secondary/40 p-2.5 text-center flex flex-col items-center justify-center">
                      <span className="text-muted-foreground mb-0.5">Score</span>
                      <span className="text-teal-600 dark:text-teal-400">{b.digitalScore}%</span>
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
                      <span key={f} className="text-[9px] bg-primary/5 text-primary/80 px-2 py-0.5 rounded-full border border-primary/10">
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

      {/* Comparison Panel */}
      {selectedBankIds.length >= 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card border border-teal-200/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Panel Header */}
            <div className="px-6 py-4 bg-teal-50/50 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Comparing {selectedBankIds.length}/3
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {orderedSelected.map(b => (
                    <div key={b.id} className="flex items-center gap-1.5 bg-background border border-border px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm animate-in zoom-in">
                      {b.name}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSelection(b.id); }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedBankIds([])}
                className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 uppercase tracking-widest"
              >
                Clear All
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto selection:bg-teal-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/5">
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground w-[240px]">Capability</th>
                    {orderedSelected.map(b => (
                      <th key={b.id} className="p-6 text-center border-l border-border/50 min-w-[200px]">
                        <span className="text-sm font-bold text-foreground">{b.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">Digital Score</td>
                    {orderedSelected.map(b => (
                      <td key={b.id} className="p-6 text-center border-l border-border/50">
                        <ScoreBadge score={b.digitalScore ?? 0} label="" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">App Rating</td>
                    {orderedSelected.map(b => (
                      <td key={b.id} className="p-6 text-center border-l border-border/50 text-sm font-semibold">
                        {(3.5 + (b.digitalScore ?? 0) / 50).toFixed(1)} / 5.0
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">Service Uptime</td>
                    {orderedSelected.map(b => (
                      <td key={b.id} className="p-6 text-center border-l border-border/50 text-sm font-bold text-teal-600 dark:text-teal-400">
                        {95 + Math.floor((b.digitalScore ?? 0) / 25)}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">Features Count</td>
                    {orderedSelected.map(b => (
                      <td key={b.id} className="p-6 text-center border-l border-border/50 text-sm font-medium">
                        {b.digitalFeatures.length} available
                      </td>
                    ))}
                  </tr>
                  {digitalChecklist.map(feat => (
                    <tr key={feat}>
                      <td className="p-6 text-xs font-semibold text-foreground/80 bg-muted/5">{feat}</td>
                      {orderedSelected.map(b => {
                        const has = b.digitalFeatures.includes(feat)
                        return (
                          <td key={b.id} className="p-6 text-center border-l border-border/50">
                            {has ? (
                              <div className="flex justify-center">
                                <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 p-1 rounded-full ring-4 ring-teal-50 dark:ring-teal-950/20">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-700 font-bold text-lg leading-none">−</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-muted/5 border-t border-border/50">
              <div className="flex items-start gap-3 text-[10px] text-muted-foreground italic leading-relaxed">
                <Info size={14} className="shrink-0 mt-0.5" />
                Comparison is based on latest available data from individual bank portals and user feedback surveys.
                App ratings are calculated based on Play Store and App Store averages.
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedBankIds.length < 2 && (
        <div className="bg-secondary/20 border border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
            <PlusIcon id="plus" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Select {2 - selectedBankIds.length} more bank{selectedBankIds.length === 0 ? "s" : ""} to view comparison</p>
        </div>
      )}

      <Disclaimer />
    </div>
  )
}

function PlusIcon({ id }: { id: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      id={id}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
