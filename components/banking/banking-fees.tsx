"use client"

import { useState } from "react"
import { bankFees, banks } from "@/lib/mock/banks"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X, Plus, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { BankingCompareBar } from "./banking-compare-bar"

interface BankingFeesProps {
  location?: string
}

export function BankingFees({ location = "All Locations" }: BankingFeesProps) {
  const [transfers, setTransfers] = useState(10)
  const [atmWithdrawals, setAtmWithdrawals] = useState(5)
  const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
  const { t } = useI18n()

  const filteredBanks = location === "All Locations"
    ? banks
    : banks.filter(b => b.locations.includes(location))

  const filteredBankFees = location === "All Locations"
    ? bankFees
    : bankFees.filter(f => {
      const bank = banks.find(b => b.id === f.bankId)
      return bank?.locations.includes(location)
    })

  const zipitFees = filteredBanks.map((b) => {
    const zipit = bankFees.find((f) => f.bankId === b.id && f.name.includes("ZIPIT"))
    const atm = bankFees.find((f) => f.bankId === b.id && f.name.includes("ATM"))
    const monthlyCost = (zipit ? zipit.amount * transfers : 0) + (atm ? atm.amount * atmWithdrawals : 0)
    return { bank: b.name, zipitFee: zipit?.amount ?? null, atmFee: atm?.amount ?? null, monthlyCost }
  }).sort((a, b) => a.monthlyCost - b.monthlyCost)

  return (
    <div className="space-y-6">
      <BankingCompareBar />

      {/* Monthly Cost Calculator */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Typical Monthly Cost Calculator</h3>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Monthly Transfers</label>
              <input
                type="range"
                min={0}
                max={30}
                value={transfers}
                onChange={(e) => setTransfers(Number(e.target.value))}
                className="w-full accent-primary"
                title="Monthly Transfers"
              />
              <span className="text-xs text-foreground">{transfers} transfers/month</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">ATM Withdrawals</label>
              <input
                type="range"
                min={0}
                max={20}
                value={atmWithdrawals}
                onChange={(e) => setAtmWithdrawals(Number(e.target.value))}
                className="w-full accent-primary"
                title="ATM Withdrawals"
              />
            <span className="text-xs text-foreground">{atmWithdrawals} withdrawals/month</span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2">
          {zipitFees.map((f, i) => (
            <div
              key={f.bank}
              className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                {i === 0 && (
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium">
                    Cheapest
                  </span>
                )}
                <span className="text-sm text-foreground">{f.bank}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">${f.monthlyCost.toFixed(2)}/mo</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Comparison Table */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Fee Comparison Table</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Bank</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">ZIPIT</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">ATM</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Est. Monthly</th>
              </tr>
            </thead>
            <tbody>
              {zipitFees.map((f) => (
                <tr key={f.bank} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2 text-foreground">{f.bank}</td>
                  <td className="px-3 py-2 text-right text-foreground">
                    {f.zipitFee !== null ? `$${f.zipitFee.toFixed(2)}` : "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-foreground">
                    {f.atmFee !== null ? `$${f.atmFee.toFixed(2)}` : "-"}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-foreground">
                    ${f.monthlyCost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* All Fees */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Detailed Fee Breakdown</h3>
        {filteredBankFees.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No fees found for {location}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">None of the banks with published fees are currently active in this location.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBankFees.map((f) => {
              const inTray = compareTray.ids.includes(f.id)
              return (
                <div key={f.id} className={cn(
                  "rounded-lg border bg-card p-3 transition-all",
                  inTray ? "border-primary ring-1 ring-primary/20" : "border-border"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{f.name}</span>
                    <span className="text-xs font-semibold text-primary">${f.amount.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{f.bankName} &middot; {f.unit}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{f.description}</p>
                  
                  <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                    {f.category === "hidden" ? (
                      <span className="text-[9px] bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">
                        Hidden Fee
                      </span>
                    ) : (
                      <div />
                    )}
                    <button
                      onClick={() => inTray ? removeFromCompareTray(f.id) : addToCompareTray("banking", f.id, "fees")}
                      className={cn(
                        "btn-compare-standard px-3 py-1.5",
                        inTray && "opacity-60"
                      )}
                    >
                      {inTray ? t("common.addedToCompare") : t("common.addToCompare")}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      <Disclaimer />
    </div>
  )
}
