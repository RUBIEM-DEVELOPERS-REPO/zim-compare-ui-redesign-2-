"use client"

import { insuranceProviders } from "@/lib/mock/insurance"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { DynamicBar } from "@/components/ui/dynamic-bar"

const claimsDetails = [
  { id: "old-mutual", process: "Online portal + branch", digitalClaim: true, trackable: true, requiredDocs: ["Claim form", "ID copy", "Police report (motor)", "Medical report (health)"] },
  { id: "first-mutual", process: "Branch + email", digitalClaim: false, trackable: true, requiredDocs: ["Claim form", "ID copy", "Supporting documents"] },
  { id: "zimnat", process: "Online portal + WhatsApp", digitalClaim: true, trackable: true, requiredDocs: ["Claim form", "ID copy", "Photos/evidence"] },
  { id: "nicoz-diamond", process: "Branch only", digitalClaim: false, trackable: false, requiredDocs: ["Claim form", "ID copy", "Police report", "Assessment report"] },
  { id: "sanctuary", process: "Branch + email", digitalClaim: false, trackable: false, requiredDocs: ["Claim form", "ID copy", "Supporting documents"] },
  { id: "cellinsure", process: "USSD + branch", digitalClaim: false, trackable: false, requiredDocs: ["Claim form", "ID copy"] },
  { id: "cimas", process: "Online portal + app + branch", digitalClaim: true, trackable: true, requiredDocs: ["Membership card", "Referral letter", "Prescription"] },
  { id: "psmas", process: "Branch + regional offices", digitalClaim: false, trackable: true, requiredDocs: ["Membership card", "Claim form"] },
  { id: "femas", process: "Branch + email", digitalClaim: false, trackable: true, requiredDocs: ["Membership card", "Claim form", "Medical report"] },
  { id: "alliance", process: "Online + branch", digitalClaim: true, trackable: true, requiredDocs: ["Membership card", "Claim form"] },
]

export function InsuranceClaims({ location = "All Locations" }: { location?: string }) {
  const { t } = useI18n()

  const filteredProviders = insuranceProviders.filter(p => {
    return location === "All Locations" || p.serviceAreas.includes(location)
  })

  const filteredClaimsDetails = claimsDetails.filter(c => {
    const provider = insuranceProviders.find(p => p.id === c.id)
    return location === "All Locations" || (provider && provider.serviceAreas.includes(location))
  })

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  return (
    <div className="space-y-4">
      {filteredProviders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
          <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <X className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">{t("insurance.noClaimsFound", { location: displayLocation })}</h3>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">{t("insurance.noClaimsDetail")}</p>
        </div>
      ) : (
        <>
          <div className="glass-panel p-4 bg-teal-50/5 border-teal-200/20 shadow-xl rounded-xl">
            <h3 className="text-[11px] font-medium text-foreground mb-3 uppercase tracking-widest text-center">{t("insurance.claimsRanking")}</h3>
            <div className="space-y-2">
              {[...filteredProviders]
                .sort((a, b) => b.claimsScore - a.claimsScore)
                .map((p, i) => {
                  return (
                    <div key={p.id} className="flex items-center gap-3 group">
                      <span className="text-[9px] font-medium text-teal-600/50 w-3 text-right tabular-nums">{i + 1}</span>
                      <span className="text-[11px] font-medium text-foreground w-28 truncate">{p.name}</span>
                      <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden relative">
                        <DynamicBar
                          value={p.claimsScore}
                          variableName="--bar-width"
                          className="h-full bg-teal-600 rounded-full transition-all duration-1000 group-hover:bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.3)] dynamic-bar-width"
                        />
                      </div>
                      <div className="flex items-center gap-2 min-w-[80px] justify-end">
                        <span className="text-[11px] font-medium text-foreground tabular-nums">{p.claimsScore}%</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          <section>
            <h3 className="text-[11px] font-medium text-foreground mb-2 uppercase tracking-wider">{t("insurance.claimsProcessDetails")}</h3>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-2 py-1.5 text-muted-foreground font-medium uppercase tracking-tighter">{t("insurance.provider")}</th>
                    <th className="text-left px-2 py-1.5 text-muted-foreground font-medium uppercase tracking-tighter">{t("insurance.process")}</th>
                    <th className="text-center px-2 py-1.5 text-muted-foreground font-medium uppercase tracking-tighter">{t("insurance.digital")}</th>
                    <th className="text-center px-2 py-1.5 text-muted-foreground font-medium uppercase tracking-tighter">{t("insurance.trackable")}</th>
                    <th className="text-center px-2 py-1.5 text-muted-foreground font-medium uppercase tracking-tighter">{t("insurance.avgClaim")}</th>
                    <th className="text-left px-2 py-1.5 text-muted-foreground font-medium uppercase tracking-tighter">{t("insurance.requiredDocs")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaimsDetails.map((c) => {
                    const provider = insuranceProviders.find((p) => p.id === c.id)
                    return (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                        <td className="px-2 py-1.5 text-foreground font-medium">{provider?.name}</td>
                        <td className="px-2 py-1.5 text-muted-foreground">{c.process}</td>
                        <td className="px-2 py-1.5 text-center">
                          <span className={c.digitalClaim ? "text-emerald-400" : "text-red-400"}>
                            {c.digitalClaim ? t("insurance.yes") : t("insurance.no")}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <span className={c.trackable ? "text-emerald-400" : "text-red-400"}>
                            {c.trackable ? t("insurance.yes") : t("insurance.no")}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-center text-foreground">{provider?.avgClaimDays}</td>
                        <td className="px-2 py-1.5 text-muted-foreground max-w-[150px]">
                          {c.requiredDocs.join(", ")}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
      <Disclaimer />
    </div>
  )
}

