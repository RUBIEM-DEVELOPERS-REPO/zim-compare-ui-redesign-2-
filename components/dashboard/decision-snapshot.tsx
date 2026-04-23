"use client"

import Link from "next/link"
import React, { useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { Disclaimer } from "@/components/disclaimer"
import { cn } from "@/lib/utils"
import { CheckCircle2, ArrowRight } from "lucide-react"

/** Renders a progress bar whose width is set imperatively to avoid inline style lint warnings. */
function ProgressBar({ confidence }: { confidence: number }) {
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${confidence}%`
    }
  }, [confidence])
  return (
    <div className="h-2.5 w-full rounded-full bg-white/5 border border-white/5 overflow-hidden">
      <div ref={barRef} className="h-full bg-primary rounded-full transition-all duration-1000 ease-out teal-glow" />
    </div>
  )
}


const recommendations: Record<string, Record<string, { name: string; confidence: number; reasons: string[] }>> = {
  student: {
    banking: { name: "Steward Bank", confidence: 92, reasons: ["zeroFees", "ecocashIntegration", "atmNetwork"] },
    telecom: { name: "NetOne", confidence: 88, reasons: ["cheapData", "socialPacks", "valuePerGB"] },
    schools: { name: "Gateway High School", confidence: 85, reasons: ["passRate", "stemPrograms", "centralLocation"] },
    insurance: { name: "CIMAS Standard", confidence: 80, reasons: ["healthCover", "outpatientNetwork", "noExcess"] },
    mobility: { name: "Hwindi Student", confidence: 85, reasons: ["fastPickup", "safeDrivers", "competitivePricing"] },
    utilities: { name: "ZESA Prepaid", confidence: 94, reasons: ["reliableSupply", "easyPayment", "lowTariffs"] },
    stayscape: { name: "Bronte Hotel", confidence: 82, reasons: ["premiumService", "centralLocation", "excellentReviews"] },
  },
  family: {
    banking: { name: "CBZ Bank", confidence: 90, reasons: ["familyBanking", "digitalFeatures", "salaryAdvance"] },
    telecom: { name: "Econet Wireless", confidence: 91, reasons: ["nationwideCoverage", "networkQuality", "bundleOptions"] },
    schools: { name: "St George's College", confidence: 87, reasons: ["academicResults", "sportsExtra", "boardingDay"] },
    insurance: { name: "CIMAS Premier", confidence: 93, reasons: ["medicalCover", "dentalOptical", "fastClaims"] },
    mobility: { name: "Vaya Family", confidence: 88, reasons: ["safeDrivers", "fastPickup", "competitivePricing"] },
    utilities: { name: "ZESA Postpaid", confidence: 91, reasons: ["reliableSupply", "easyPayment", "lowTariffs"] },
    stayscape: { name: "Meikles Hotel", confidence: 95, reasons: ["premiumService", "centralLocation", "excellentReviews"] },
  },
  sme: {
    banking: { name: "Stanbic Bank", confidence: 94, reasons: ["smeLoan", "businessAdvisory", "advancedDigital"] },
    telecom: { name: "Liquid Telecom", confidence: 86, reasons: ["fibreSpeeds", "businessSLAs", "uptimeGuarantees"] },
    schools: { name: "Eaglesvale Senior School", confidence: 82, reasons: ["entrepreneurFocus", "networkingCommunity", "modernFacilities"] },
    insurance: { name: "Zimnat Business Shield", confidence: 89, reasons: ["businessShield", "businessInterruption", "competitivePremiums"] },
    mobility: { name: "InDrive Corporate", confidence: 92, reasons: ["competitivePricing", "safeDrivers", "fastPickup"] },
    utilities: { name: "Dandemutande Energy", confidence: 87, reasons: ["reliableSupply", "easyPayment", "lowTariffs"] },
    stayscape: { name: "Amanzi Lodge", confidence: 89, reasons: ["premiumService", "centralLocation", "excellentReviews"] },
  },
}

const categories = [
  { key: "banking" as const, labelKey: "nav.banking", href: "/banking", icon: "B" },
  { key: "telecom" as const, labelKey: "nav.telecom", href: "/telecom", icon: "T" },
  { key: "schools" as const, labelKey: "nav.schools", href: "/schools", icon: "S" },
  { key: "insurance" as const, labelKey: "nav.insurance", href: "/insurance", icon: "I" },
  { key: "mobility" as const, labelKey: "nav.mobility", href: "/mobility", icon: "M" },
  { key: "utilities" as const, labelKey: "nav.utilities", href: "/utilities", icon: "U" },
  { key: "stayscape" as const, labelKey: "nav.stayscape", href: "/stayscape", icon: "Ho" },
]



const ProgressFill = ({ progress }: { progress: number }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  
  React.useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--progress-width", `${progress}%`)
    }
  }, [progress])

  return (
    <div 
      ref={ref}
      className="progress-fill-dynamic h-full bg-gradient-to-r from-[#00c9ff] to-[#92fe9d] rounded-full shadow-[0_0_10px_rgba(0,201,255,0.3)]" 
    />
  )
}

export function DecisionSnapshot() {
  const { preferences } = useAppStore()
  const { t } = useI18n()
  const recs = recommendations[preferences.scenario]

  return (
    <section className="glass-panel p-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 container-breathable">
        <div>
          <h2 className="text-3xl font-display font-medium text-foreground mb-2">{t("dashboard.personalizedSnapshot")}</h2>
          <p className="text-sm text-muted-foreground font-sans">
            {t("dashboard.bestChoicesFor")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {categories.slice(0, 6).map((cat) => {
          const rec = recs[cat.key]
          const catClass = `cat-${cat.key === 'stayscape' ? 'hospitality' : cat.key}`
          
          return (
            <div
              key={cat.key}
              className="glass-floating p-10 flex flex-col justify-between group h-full relative floating-hover"
            >
              <div>
                {/* Header: Icon and Title */}
                <div className="flex items-center justify-between mb-8">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-medium border border-border/50 bg-background", catClass)}>
                    {cat.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground/60 mb-2">{t("dashboard.bestInCategory", { category: t(cat.labelKey) })}</p>
                    <p className="text-xl font-display font-medium text-foreground leading-tight">{rec.name}</p>
                  </div>
                </div>

                {/* Badge/Highlight */}
                <div className="mb-8">
                  <span className="px-3 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-widest bg-primary/5 text-primary border border-primary/10">
                    {cat.key === 'banking' ? t('dashboard.bestOverall') : 
                     cat.key === 'telecom' ? t('dashboard.bestValue') :
                     cat.key === 'schools' ? t('dashboard.topAcademic') :
                     cat.key === 'insurance' ? t('dashboard.bestForFamilies') :
                     cat.key === 'stayscape' ? t('dashboard.premiumChoice') : t('dashboard.reliableService')}
                  </span>
                </div>

                {/* Match Info */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{t("dashboard.profileMatch")}</span>
                    <span className="text-sm font-medium text-primary tracking-tight teal-glow bg-primary/10 px-2 py-0.5 rounded-full">{rec.confidence}%</span>
                  </div>
                  <ProgressBar confidence={rec.confidence} />
                </div>

                {/* Reasons List */}
                <ul className="space-y-4 mb-10">
                  {rec.reasons.map((r: string) => (
                    <li key={r} className="text-xs font-medium text-muted-foreground flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {t(`dashboard.reasons.${r}`)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border/30">
                <button className="flex-1 py-3 rounded-2xl text-[10px] font-medium uppercase tracking-widest border border-border/50 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                  {t("dashboard.whyThis")}
                </button>
                <Link
                  href={cat.href}
                  className="flex-1 py-3 rounded-2xl text-[10px] font-medium uppercase tracking-widest bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all text-center"
                >
                  {t("dashboard.analyze")}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-8 flex justify-end">
        <Link href="/insights" className="flex items-center gap-2 text-xs font-medium text-[#00f2fe] uppercase tracking-widest group">
          {t("dashboard.viewAllInsights")}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="mt-6 opacity-40">
        <Disclaimer />
      </div>
    </section>
  )
}

// ScenarioButton removed as per requirements


