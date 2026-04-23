"use client"

import { useState } from "react"
import { schools } from "@/lib/mock/schools"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { X, Check, AlertCircle, Info } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { SchoolsCompareBar } from "./schools-compare-bar"

interface SchoolsProfilesProps {
  location?: string
}

export function SchoolsProfiles({ location = "All Locations" }: SchoolsProfilesProps) {
  const { compareTray, addToCompareTray, removeFromCompareTray, clearCompareTray } = useAppStore()
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const selectedIds = compareTray.category === "schools" ? compareTray.ids : []

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      removeFromCompareTray(id)
      setError(null)
    } else {
      if (selectedIds.length >= 4) {
        setError(t("schools.compareLimit"))
        setTimeout(() => setError(null), 3000)
        return
      }
      addToCompareTray("schools", id, "profiles")
      setError(null)
    }
  }

  const filteredSchools = location === "All Locations"
    ? schools
    : schools.filter((s) => s.city === location)

  const selectedSchools = filteredSchools.filter(s => selectedIds.includes(s.id))
  const orderedSelected = selectedIds
    .map(id => filteredSchools.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s)

  return (
    <div className="space-y-4">
      <SchoolsCompareBar />
      {filteredSchools.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">{t("schools.noSchoolsFound", { location: displayLocation })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("schools.noSchoolsDetail")}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{t("schools.selectSchools")}</p>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-destructive font-medium animate-in fade-in slide-in-from-right-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {filteredSchools.map((s) => {
              const isSelected = selectedIds.includes(s.id)
              return (
                <div
                  key={s.id}
                  onClick={() => toggleSelection(s.id)}
                  className={cn(
                    "glass-card p-6 transition-all duration-500 relative group overflow-hidden cursor-pointer hover:-translate-y-2",
                    isSelected
                      ? "border-primary/60 bg-primary/10 shadow-2xl shadow-primary/20 ring-2 ring-primary/20"
                      : "hover:border-primary/40"
                  )}
                >
                  <div className="absolute top-6 right-6 flex items-center gap-3 z-10 bg-muted/30 px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">{t("schools.compare")}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-500",
                      isSelected ? "bg-primary border-primary rotate-0" : "bg-white/5 border-white/10 group-hover:border-primary/50"
                    )}>
                      {isSelected && <Check size={12} className="text-primary-foreground animate-in zoom-in-50 duration-300" />}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-20">
                    <div>
                      <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{s.name}</h3>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{s.city}, {s.province} &middot; <span className="text-primary">{t(`schools.subTabs.${s.type}`)}</span></p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <ScoreBadge score={s.academicScore} label={t("schools.academic")} />
                      <ScoreBadge score={s.safetyScore} label={t("schools.safety")} />
                      <ScoreBadge score={s.transparencyScore} label={t("telecom.transparency")} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 pt-2">
                    <div className="rounded-2xl bg-muted/30 p-5 border border-white/5 relative group/stat overflow-hidden">
                      <div className="absolute right-0 top-0 p-2 opacity-10 group-hover/stat:scale-110 transition-transform">
                        <Check className="text-primary w-10 h-10" />
                      </div>
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">{t("schools.annualCost")}</p>
                      <p className="text-base font-medium text-primary tabular-nums tracking-tighter">${s.totalAnnualCost.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/30 p-5 border border-white/5">
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">{t("schools.passRate")}</p>
                      <p className="text-base font-medium text-foreground tabular-nums tracking-tight">{s.passRate}%</p>
                    </div>
                    <div className="rounded-2xl bg-muted/30 p-5 border border-white/5">
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">{t("schools.ratio")}</p>
                      <p className="text-base font-medium text-foreground tabular-nums tracking-tight">1:{s.studentTeacherRatio}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/30 p-5 border border-white/5">
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">{t("schools.curriculum")}</p>
                      <p className="text-[10px] font-medium text-foreground leading-tight uppercase tracking-tight">{s.curriculum.join(", ")}</p>
                    </div>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{t("schools.premiumFacilities")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.facilities.map((f) => (
                          <span key={f} className="text-xs font-medium bg-primary/5 text-primary px-2 py-0.5 rounded-full border border-primary/10 shadow-none leading-none h-[18px] flex items-center">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{t("schools.sportsCulture")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.sports.map((sp) => (
                          <span key={sp} className="text-xs font-medium bg-primary/5 text-primary px-2 py-0.5 rounded-full border border-primary/10 shadow-none leading-none h-[18px] flex items-center">{sp}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/5 flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelection(s.id); }}
                      className={cn(
                        "rounded-2xl px-8 py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 shadow-xl active:scale-95",
                        isSelected
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-primary text-primary-foreground border-transparent shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1"
                      )}
                    >
                      {isSelected ? (
                        <span className="flex items-center gap-2"><Check size={14} /> {t("common.added")}</span>
                      ) : (
                        t("common.addToCompare")
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <Disclaimer />
    </div>
  )
}

