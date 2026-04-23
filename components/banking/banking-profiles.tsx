"use client"

import { useState } from "react"
import { banks, bankingProducts, bankFees } from "@/lib/mock/banks"
import { ScoreBadge } from "@/components/score-badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

import { X } from "lucide-react"
import { BankingCompareBar } from "./banking-compare-bar"

type FilterType = "all" | "commercial" | "building_society" | "microfinance"

interface BankingProfilesProps {
  location?: string
}

export function BankingProfiles({ location = "All Locations" }: BankingProfilesProps) {
  const [filter, setFilter] = useState<FilterType>("all")
  const [selected, setSelected] = useState<string | null>(null)
  const { addToCompareTray, removeFromCompareTray, compareTray, addRecentView } = useAppStore()

  const filteredByLocation = banks // All licensed banks have national scope

  const filtered = filter === "all"
    ? filteredByLocation
    : filteredByLocation.filter((b) => b.type === filter)

  const selectedBank = selected ? banks.find((b) => b.id === selected) : null

  if (selectedBank) {
    const products = bankingProducts.filter((p) => p.bankId === selectedBank.id)
    const fees = bankFees.filter((f) => f.bankId === selectedBank.id)

    return (
      <div className="space-y-6">
        <BankingCompareBar />
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-primary hover:underline"
        >
          &larr; Back to directory
        </button>

        <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center border border-white/20 shadow-lg shadow-teal-500/20">
                <span className="text-white font-medium text-2xl">{selectedBank.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-medium text-foreground tracking-tight">{selectedBank.name}</h2>
                <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium uppercase tracking-wider">
                  {selectedBank.type.replace("_", " ")}
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  {selectedBank.branches} Branches
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ScoreBadge score={selectedBank.transparencyScore} label="Transparency" />
              {selectedBank.digitalScore && <ScoreBadge score={selectedBank.digitalScore} label="Digital" />}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-1">Institutional Profile</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Head Office</p>
                    <p className="text-sm text-foreground">{selectedBank.headOfficeAddress || "Not available"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Contact Details</p>
                    <p className="text-sm text-foreground">{selectedBank.contactPhone || "No primary phone"}</p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{selectedBank.contactEmail || ""}</p>
                  </div>
                </div>
                {selectedBank.website && (
                  <a
                    href={selectedBank.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 hover:bg-teal-500/20 transition-all font-medium text-sm"
                  >
                    <span>Visit Official Website</span>
                    <span className="text-lg">&nearrow;</span>
                  </a>
                )}
              </div>
            </div>

            {/* Digital Features */}
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-1">Digital Ecosystem</h3>
              <div className="flex flex-wrap gap-2">
                {selectedBank.digitalFeatures.map((f) => (
                  <span key={f} className="text-xs font-medium bg-white/50 dark:bg-white/10 text-foreground px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10 shadow-sm">{f}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-black/5 dark:border-white/5">
            <button
              onClick={() => addToCompareTray("banking", selectedBank.id)}
              className="flex-1 rounded-xl bg-teal-600 text-white px-6 py-3 font-medium hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
            >
              Add to Competition Analysis
            </button>
            <button
              onClick={() => setSelected(null)}
              className="px-6 py-3 rounded-xl bg-black/5 dark:bg-white/5 text-foreground font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BankingCompareBar />
      {/* Filters */}
      {/* Filters - 4 Column Grid for consistency */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/25 dark:border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.08)] p-2">
        {(["all", "commercial", "building_society", "microfinance"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-xl px-2 py-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider transition-all duration-300 text-center",
              filter === f
                ? "bg-white/40 dark:bg-white/10 text-foreground shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                : "hover:bg-white/10 hover:backdrop-blur-2xl hover:brightness-125 hover:-translate-y-[1px] text-muted-foreground"
            )}
          >
            {f === "all" ? "All" : f === "building_society" ? "B.Society" : f === "microfinance" ? "Micro" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bank cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No banks found for {location}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">There are no banks of this type active in this location.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => {
            const inTray = compareTray.ids.includes(b.id)
            const trayFull = compareTray.ids.length >= 4 && !inTray

            return (
              <button
                key={b.id}
                onClick={() => {
                  setSelected(b.id)
                  addRecentView({ category: "banking", id: b.id, name: b.name })
                }}
                className="group relative flex flex-col rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:border-teal-500/50 hover:bg-white/60 dark:hover:bg-white/10 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 backdrop-blur-md overflow-hidden h-full"
              >
                {/* Decorative gradient */}
                <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-teal-500/5 blur-3xl group-hover:bg-teal-500/10 transition-colors" />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/20 flex items-center justify-center border border-teal-100/50 dark:border-teal-500/20">
                      <span className="text-teal-600 dark:text-teal-400 font-medium text-sm">{b.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground tracking-tight">{b.name}</p>
                      <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                        {b.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-xl bg-black/5 dark:bg-white/5 p-2 border border-black/5 dark:border-white/5">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Transparency</p>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span className="text-xs font-medium text-foreground">{b.transparencyScore}/100</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/5 dark:bg-white/5 p-2 border border-black/5 dark:border-white/5">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Digital Score</p>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-xs font-medium text-foreground">{b.digitalScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 mt-auto">
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{b.branches}</span> Branches nationwide
                  </p>
                  <div className="h-6 w-6 rounded-full bg-teal-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-teal-600 dark:text-teal-400 text-xs">&rarr;</span>
                  </div>
                </div>

                <div className="w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      inTray ? removeFromCompareTray(b.id) : addToCompareTray("banking", b.id, "profiles")
                    }}
                    className={cn(
                      "w-full rounded-xl py-2.5 text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2",
                      inTray
                        ? "bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30"
                        : "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-500/10"
                    )}
                  >
                    {inTray ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Compare
                      </>
                    ) : trayFull ? "Tray Full" : "Add to Compare"}
                  </button>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

