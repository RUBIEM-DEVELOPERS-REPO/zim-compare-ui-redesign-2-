"use client"

import { useState } from "react"
import { schools } from "@/lib/mock/schools"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { X, Check, AlertCircle, Info } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface SchoolsProfilesProps {
  location?: string
}

export function SchoolsProfiles({ location = "All Locations" }: SchoolsProfilesProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isComparing, setIsComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id))
      setError(null)
      if (selectedIds.length <= 2) setIsComparing(false)
    } else {
      if (selectedIds.length >= 3) {
        setError(t("schools.compareLimit"))
        setTimeout(() => setError(null), 3000)
        return
      }
      setSelectedIds(prev => [...prev, id])
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
    <div className="space-y-8 relative pb-24">
      {filteredSchools.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{t("schools.noSchoolsFound", { location: displayLocation })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("schools.noSchoolsDetail")}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{t("schools.selectSchools")}</p>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-destructive font-bold animate-in fade-in slide-in-from-right-2">
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
                    "rounded-2xl border p-6 transition-all duration-300 relative group overflow-hidden cursor-pointer",
                    isSelected
                      ? "bg-teal-50 border-teal-200 shadow-xl shadow-teal-500/10 ring-1 ring-teal-200"
                      : "bg-card border-border hover:border-teal-200/50 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1"
                  )}
                >
                  <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("schools.compare")}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300",
                      isSelected ? "bg-teal-600 border-teal-600 rotate-0" : "bg-white border-gray-200 group-hover:border-teal-300"
                    )}>
                      {isSelected && <Check size={12} className="text-white animate-in zoom-in-50 duration-300" />}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-20">
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">{s.name}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.city}, {s.province} &middot; <span className="text-teal-600">{t(`schools.subTabs.${s.type}`)}</span></p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <ScoreBadge score={s.academicScore} label={t("schools.academic")} />
                      <ScoreBadge score={s.safetyScore} label={t("schools.safety")} />
                      <ScoreBadge score={s.transparencyScore} label={t("telecom.transparency")} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 pt-2">
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/10">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">{t("schools.annualCost")}</p>
                      <p className="text-sm font-black text-teal-600">${s.totalAnnualCost.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/10">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">{t("schools.passRate")}</p>
                      <p className="text-sm font-black text-foreground">{s.passRate}%</p>
                    </div>
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/10">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">{t("schools.ratio")}</p>
                      <p className="text-sm font-black text-foreground">1:{s.studentTeacherRatio}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/10">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">{t("schools.curriculum")}</p>
                      <p className="text-[10px] font-bold text-foreground leading-tight">{s.curriculum.join(", ")}</p>
                    </div>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("schools.premiumFacilities")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.facilities.map((f) => (
                          <span key={f} className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 shadow-none leading-none h-[18px] flex items-center">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("schools.sportsCulture")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.sports.map((sp) => (
                          <span key={sp} className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 shadow-none leading-none h-[18px] flex items-center">{sp}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelection(s.id); }}
                      className={cn(
                        "btn-compare-standard rounded-full",
                        isSelected && "opacity-60"
                      )}
                    >
                      {isSelected ? t("common.removeFromCompare") : t("common.addToCompare")}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Comparison Panel */}
          {isComparing && selectedIds.length >= 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-card border border-teal-200/50 rounded-[2.5rem] shadow-2xl overflow-hidden mt-12 mb-12 relative z-10">
              <div className="px-8 py-6 bg-teal-50/50 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">{t("schools.profilesTitle")}</h2>
                  <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">{t("schools.profilesSubtitle")}</p>
                </div>
                <button
                  onClick={() => { setIsComparing(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="p-2 hover:bg-white rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-muted/5 divide-x divide-border/30">
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground w-64">{t("schools.competitiveMetrics")}</th>
                      {orderedSelected.map(s => (
                        <th key={s.id} className="p-6 text-center">
                          <p className="text-sm font-black text-foreground uppercase tracking-tight leading-tight">{s.name}</p>
                          <p className="text-[10px] font-bold text-teal-600 mt-1 uppercase tracking-widest">{s.city}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">{t("schools.annualTotal")}</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6 text-center font-black text-teal-600 text-lg">
                          ${s.totalAnnualCost.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">O/A-Level {t("schools.passRate")}</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6 text-center font-black text-foreground text-lg">
                          {s.passRate}%
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">Student–Teacher {t("schools.ratio")}</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6 text-center font-bold text-foreground">
                          1:{s.studentTeacherRatio}
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">Academic {t("schools.curriculum")}</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6 text-center">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {s.curriculum.map(c => (
                              <span key={c} className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded-full">{c}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">{t("common.location")} & {t("common.category")}</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6 text-center text-xs font-bold text-foreground capitalize">
                          {s.province} &middot; {t(`schools.subTabs.${s.type}`)}
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">Performance Scores</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6">
                          <div className="flex flex-col gap-2 scale-90 origin-center translate-y-2">
                            <ScoreBadge score={s.academicScore} label={t("schools.academic")} />
                            <ScoreBadge score={s.safetyScore} label={t("schools.safety")} />
                            <ScoreBadge score={s.transparencyScore} label="Transp." />
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">{t("schools.premiumFacilities")}</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {s.facilities.slice(0, 5).map(f => (
                              <span key={f} className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 h-[18px] flex items-center">{f}</span>
                            ))}
                            {s.facilities.length > 5 && <span className="text-[10px] font-bold text-muted-foreground ml-1">+{s.facilities.length - 5}</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-border/30">
                      <td className="p-6 text-xs font-bold text-muted-foreground uppercase bg-muted/5">{t("schools.sportsCulture")}</td>
                      {orderedSelected.map(s => (
                        <td key={s.id} className="p-6">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {s.sports.slice(0, 5).map(sp => (
                              <span key={sp} className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 h-[18px] flex items-center">{sp}</span>
                            ))}
                            {s.sports.length > 5 && <span className="text-[10px] font-bold text-muted-foreground ml-1">+{s.sports.length - 5}</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-8 bg-teal-50/30 border-t border-border/50">
                <div className="flex items-start gap-4 text-[11px] text-muted-foreground italic max-w-2xl">
                  <Info size={18} className="shrink-0 text-teal-600" />
                  {t("schools.comparisonInfo")}
                </div>
              </div>
            </div>
          )}

          {/* Sticky Compare Bar */}
          {selectedIds.length > 0 && !isComparing && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="bg-teal-900 text-white rounded-3xl shadow-2xl shadow-teal-900/40 p-3 pl-6 pr-6 flex items-center justify-between gap-4 border border-white/10 backdrop-blur-md bg-teal-900/95">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="hidden sm:flex flex-col shrink-0">
                    <span className="text-[10px] uppercase font-black tracking-tighter text-teal-300">{t("common.saved")}</span>
                    <span className="text-sm font-black leading-none">{selectedIds.length} / 3</span>
                  </div>
                  <div className="h-8 w-px bg-white/20 hidden sm:block" />
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-1">
                    {orderedSelected.map(s => (
                      <div key={s.id} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-2xl transition-colors group shrink-0 animate-in zoom-in-95">
                        <span className="text-xs font-bold uppercase tracking-tight max-w-[100px] truncate">{s.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSelection(s.id); }}
                          className="text-teal-300 hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-[10px] font-black uppercase tracking-widest text-teal-300 hover:text-white px-3 py-2 transition-colors"
                  >
                    {t("schools.clear")}
                  </button>
                  <button
                    disabled={selectedIds.length < 2}
                    onClick={() => { setIsComparing(true); setTimeout(() => { document.querySelector('.animate-in.fade-in.slide-in-from-bottom-6')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100); }}
                    className={cn(
                      "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                      selectedIds.length < 2
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-white text-teal-900 hover:bg-teal-50 shadow-lg active:scale-95"
                    )}
                  >
                    {t("schools.compareNow")}
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}

      <Disclaimer />
    </div>
  )
}
