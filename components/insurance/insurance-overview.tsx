"use client"

import { useState } from "react"
import { insuranceProviders, policies } from "@/lib/mock/insurance"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function InsuranceOverview({ onTabChange, location = "All Locations" }: { onTabChange: (tab: string) => void, location?: string }) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { t } = useI18n()

  const highlightCards = [
    { key: "policies", labelKey: "insurance.highlight.policyTypes.label", subtitleKey: "insurance.highlight.policyTypes.subtitle" },
    { key: "policies", labelKey: "insurance.highlight.premiums.label", subtitleKey: "insurance.highlight.premiums.subtitle" },
    { key: "claims", labelKey: "insurance.highlight.claims.label", subtitleKey: "insurance.highlight.claims.subtitle" },
    { key: "policies", labelKey: "insurance.highlight.profiles.label", subtitleKey: "insurance.highlight.profiles.subtitle" },
  ]

  const summaryCards = [
    { labelKey: "insurance.summary.cheapestPremium", value: "Cell Funeral Cover", detailKey: "insurance.perMonth", detailVars: { amount: "10" } },
    { labelKey: "insurance.summary.bestCoverage", value: "Old Mutual Business", detail: "$250k cover limit" }, // Hardcoded values usually come from mock data, but labels need localization
    { labelKey: "insurance.summary.bestClaimReliability", value: "CIMAS", detailVars: { rate: "85" }, detailKey: "insurance.claimsScoreDetail" },
    { labelKey: "insurance.summary.bestValuePolicy", value: "FEMAS Silver", detail: "$45/mo for medical" },
  ]

  // I'll update summaryCards to be more translation friendly if possible, but for now I'll localize labels
  const localizedSummaryCards = [
    { label: t("insurance.summary.cheapestPremium"), value: "Cell Funeral Cover", detail: `$10/${t("insurance.monthly").toLowerCase()}` },
    { label: t("insurance.summary.bestCoverage"), value: "Old Mutual Business", detail: "$250k cover limit" },
    { label: t("insurance.summary.bestClaimReliability"), value: "CIMAS", detail: `85% ${t("insurance.claimsScore").toLowerCase()}` },
    { label: t("insurance.summary.bestValuePolicy"), value: "FEMAS Silver", detail: `$45/${t("insurance.monthly").toLowerCase()} for medical` },
  ]

  const categoryFilters = [
    { key: "all", label: t("insurance.subTabs.all") },
    { key: "motor", label: t("insurance.subTabs.motor") },
    { key: "medical", label: t("insurance.subTabs.medical") },
    { key: "life_funeral", label: t("insurance.subTabs.life_funeral") },
    { key: "property_business", label: t("insurance.subTabs.property_business") },
    { key: "travel", label: t("insurance.subTabs.travel") },
    { key: "property_business_biz", label: t("insurance.subTabs.property_business_biz") },
  ]

  const filteredProviders = insuranceProviders.filter(p => {
    if (location !== "All Locations" && !p.serviceAreas.includes(location)) return false
    if (categoryFilter === "all") return true
    const providerPolicies = policies.filter(pol => pol.providerId === p.id)
    if (categoryFilter === "property_business") {
      return providerPolicies.some(pol => pol.category === "property_business" && (pol.name.toLowerCase().includes("home") || pol.name.toLowerCase().includes("protect") || pol.name.toLowerCase().includes("property")))
    }
    if (categoryFilter === "property_business_biz") {
      return providerPolicies.some(pol => pol.category === "property_business" && (pol.name.toLowerCase().includes("business") || pol.name.toLowerCase().includes("biz")))
    }
    return providerPolicies.some(pol => pol.category === categoryFilter)
  })

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 bg-primary/5 border-primary/20">
        <p className="text-xs text-muted-foreground mb-1">{t("insurance.bestForYou")}</p>
        <p className="text-lg font-semibold text-foreground">Old Mutual Comprehensive Cover</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t("insurance.bestRecommendation")}
        </p>
        <Disclaimer />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {localizedSummaryCards.map((c) => (
            <div key={c.label} className="glass-card p-4 h-full">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-sm font-semibold text-foreground mt-1">{c.value}</p>
            <p className="text-xs text-primary mt-1">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {highlightCards.map((card) => (
          <button
            key={card.labelKey}
            onClick={() => onTabChange(card.key)}
            className="glass-card p-4 text-left group h-full"
          >
            <p className="text-sm font-semibold text-foreground">{t(card.labelKey)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t(card.subtitleKey)}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {categoryFilters.map((t) => (
          <button
            key={t.key}
            onClick={() => setCategoryFilter(t.key)}
            className={cn(
              "shrink-0 h-8 glass-tab-base",
              categoryFilter === t.key
                ? "glass-tab-active"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("insurance.providersInLocation", { location: displayLocation, count: filteredProviders.length })}</h3>
        {filteredProviders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t("insurance.noProvidersFound", { location: displayLocation })}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("insurance.noProvidersDetail")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((p) => {
              const policyCount = policies.filter((pol) => pol.providerId === p.id).length
              return (
                <div
                  key={p.id}
                  className={cn(
                    "glass-card p-5 transition-all duration-300 relative group h-full",
                    "hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">{p.name}</p>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                      {p.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-4">
                    <ScoreBadge score={p.claimsScore} label={t("insurance.claimsScore")} />
                    <ScoreBadge score={p.transparencyScore} label={t("telecom.transparency")} />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{t("insurance.avgClaim")}</span>
                      <span className="text-xs font-bold text-foreground">{p.avgClaimDays} d</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{t("insurance.policiesCount")}</span>
                      <span className="text-xs font-bold text-teal-600">{t("insurance.totalCount", { count: policyCount })}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
