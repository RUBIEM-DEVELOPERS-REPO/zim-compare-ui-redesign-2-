"use client"

import { insuranceProviders } from "@/lib/mock/insurance"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"

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
    <div className="space-y-6">
      {filteredProviders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{t("insurance.noClaimsFound", { location: displayLocation })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("insurance.noClaimsDetail")}</p>
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-teal-200/50 bg-teal-50/30 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest text-center">{t("insurance.claimsRanking")}</h3>
            <div className="space-y-4">
              {[...filteredProviders]
                .sort((a, b) => b.claimsScore - a.claimsScore)
                .map((p, i) => {
                  const barWidth = (p.claimsScore / 100) * 100
                  return (
                    <div key={p.id} className="flex items-center gap-4 group">
                      <span className="text-[10px] font-black text-teal-600/50 w-4 text-right tabular-nums">{i + 1}</span>
                      <span className="text-xs font-bold text-foreground w-32 truncate">{p.name}</span>
                      <div className="flex-1 h-2.5 bg-secondary/50 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-teal-600 rounded-full transition-all duration-1000 group-hover:bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-3 min-w-[100px] justify-end">
                        <span className="text-xs font-black text-foreground tabular-nums">{p.claimsScore}%</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{t("telecom.validUntil", { date: String(p.avgClaimDays) }).replace(t("telecom.validUntil", { date: "" }), "").trim()}d avg</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">{t("insurance.claimsProcessDetails")}</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("insurance.provider")}</th>
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("insurance.process")}</th>
                    <th className="text-center px-3 py-2 text-muted-foreground font-medium">{t("insurance.digital")}</th>
                    <th className="text-center px-3 py-2 text-muted-foreground font-medium">{t("insurance.trackable")}</th>
                    <th className="text-center px-3 py-2 text-muted-foreground font-medium">{t("insurance.avgClaim")}</th>
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("insurance.requiredDocs")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaimsDetails.map((c) => {
                    const provider = insuranceProviders.find((p) => p.id === c.id)
                    return (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                        <td className="px-3 py-2 text-foreground font-medium">{provider?.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{c.process}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={c.digitalClaim ? "text-emerald-400" : "text-red-400"}>
                            {c.digitalClaim ? t("insurance.yes") : t("insurance.no")}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={c.trackable ? "text-emerald-400" : "text-red-400"}>
                            {c.trackable ? t("insurance.yes") : t("insurance.no")}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center text-foreground">{provider?.avgClaimDays}</td>
                        <td className="px-3 py-2 text-muted-foreground max-w-[200px]">
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
