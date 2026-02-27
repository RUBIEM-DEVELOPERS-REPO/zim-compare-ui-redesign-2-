"use client"

import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { Disclaimer } from "@/components/disclaimer"
import { cn } from "@/lib/utils"

const recommendations = {
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
  { key: "stayscape" as const, labelKey: "nav.stayscape", href: "/stayscape", icon: "St" },
]

export function DecisionSnapshot() {
  const { preferences } = useAppStore()
  const { t } = useI18n()
  const recs = recommendations[preferences.scenario]

  return (
    <section className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/20 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("dashboard.personalizedSnapshot")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.bestChoicesFor", { profile: t(`dashboard.${preferences.scenario}`) })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => {
          const rec = recs[cat.key]
          return (
            <div
              key={cat.key}
              className="rounded-xl border border-border bg-card/50 p-4 flex flex-col justify-between hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm bg-card/60 group"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t(cat.labelKey)}</p>
                    <p className="text-sm font-semibold text-foreground">{rec.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${rec.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-primary">{rec.confidence}%</span>
                </div>
                <ul className="space-y-1">
                  {rec.reasons.map((r) => (
                    <li key={r} className="text-xs text-muted-foreground flex gap-1.5">
                      <span className="text-primary mt-0.5 shrink-0">-</span>
                      {t(`dashboard.reasons.${r}`)}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={cat.href}
                className="mt-3 inline-flex items-center text-xs text-primary hover:underline font-medium"
              >
                {t("common.compare")} {t(cat.labelKey)} &rarr;
              </Link>
            </div>
          )
        })}
      </div>
      <Disclaimer />
    </section>
  )
}

// ScenarioButton removed as per requirements

