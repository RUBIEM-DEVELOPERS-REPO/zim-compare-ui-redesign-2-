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
    { key: "quote", labelKey: "insurance.highlight.propertyQuote.label", subtitleKey: "insurance.highlight.propertyQuote.subtitle" },
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
    <div className="space-y-4">
      <div className="glass-floating p-4 bg-primary/5 border-primary/20 shadow-xl relative overflow-hidden group teal-glow rounded-2xl">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-1000" />
        <p className="text-[9px] font-medium text-primary uppercase tracking-[0.3em] mb-1.5">{t("insurance.bestForYou")}</p>
        <h2 className="text-2xl font-display font-normal text-white tracking-tight leading-tight uppercase">Old Mutual Comprehensive</h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-xl font-sans opacity-80 leading-relaxed font-medium">
          {t("insurance.bestRecommendation")} Optimized for risk mitigation and institutional reliability.
        </p>
        <div className="mt-4 pt-3 border-t border-white/10">
          <Disclaimer />
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {localizedSummaryCards.map((c) => (
            <div key={c.label} className="glass-floating p-3 h-full floating-hover group rounded-xl">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70 group-hover:text-primary transition-colors">{c.label}</p>
            <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">{c.value}</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {highlightCards.map((card) => (
          <button
            key={card.labelKey}
            onClick={() => onTabChange(card.key)}
            className="glass-floating p-3.5 text-left group h-full floating-hover rounded-xl"
          >
            <p className="text-[13px] font-display font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-none mb-1.5">{t(card.labelKey)}</p>
            <p className="text-[9px] font-medium text-muted-foreground leading-relaxed">{t(card.subtitleKey)}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit backdrop-blur-3xl">
        {categoryFilters.map((t) => (
          <button
            key={t.key}
            onClick={() => setCategoryFilter(t.key)}
            className={cn(
              "shrink-0 h-7 px-4 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
              categoryFilter === t.key
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 teal-glow"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section>
        <h3 className="text-sm font-medium text-foreground mb-3">{t("insurance.providersInLocation", { location: displayLocation, count: filteredProviders.length })}</h3>
        {filteredProviders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{t("insurance.noProvidersFound", { location: displayLocation })}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("insurance.noProvidersDetail")}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((p) => {
              const policyCount = policies.filter((pol) => pol.providerId === p.id).length
              return (
                <div
                  key={p.id}
                  className={cn(
                    "glass-floating p-3.5 transition-all duration-500 relative group h-full flex flex-col floating-hover rounded-xl",
                    "hover:border-primary/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <p className="text-base font-display font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-snug">{p.name}</p>
                    <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.2em] bg-white/5 text-muted-foreground px-2 py-1 rounded-lg border border-white/10 shadow-inner">
                      {p.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    <ScoreBadge score={p.claimsScore} label={t("insurance.claimsScore")} />
                    <ScoreBadge score={p.transparencyScore} label={t("telecom.transparency")} />
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-0.5">{t("insurance.avgClaim")}</span>
                      <span className="text-xs font-display font-medium text-foreground tabular-nums">{p.avgClaimDays} d</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-0.5">{t("insurance.policiesCount")}</span>
                      <span className="text-xs font-display font-medium text-primary tabular-nums">{t("insurance.totalCount", { count: policyCount })}</span>
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

