"use client"

import { useSearchParams } from "next/navigation"
import { banks, bankingProducts, bankFees } from "@/lib/mock/banks"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useEffect } from "react"

function CompareContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get("ids")?.split(",") ?? []
  const { addSavedComparison, clearCompareTray } = useAppStore()
  const { t } = useI18n()

  useEffect(() => {
    clearCompareTray()
  }, [clearCompareTray])

  const compareBanks = banks.filter((b) => ids.includes(b.id))
  const compareProducts = bankingProducts.filter((p) => ids.includes(p.id))

  // Determine what we're comparing: banks or products
  const isProducts = compareProducts.length > 0
  const items = isProducts ? compareProducts : compareBanks

  if (items.length < 2) {
    return (
      <div className="text-center py-12">
        <h1 className="text-lg font-semibold text-foreground mb-2">Banking Comparison</h1>
        <p className="text-sm text-muted-foreground">Select at least 2 items to compare. Go to the Banking page and add items to your compare tray.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Banking Comparison</h1>
        <button
          onClick={() => {
            addSavedComparison({
              id: Date.now().toString(),
              category: "banking",
              itemIds: ids,
              createdAt: new Date().toISOString(),
              name: `Banking: ${items.map((i) => "name" in i ? i.name : "").join(" vs ")}`,
            })
          }}
          className="rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          Save Comparison
        </button>
      </div>

      {/* Side-by-side */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border border-border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-secondary/30 border-b border-border">
              <th className="text-left px-3 py-2 text-muted-foreground font-medium">Attribute</th>
              {items.map((item) => (
                <th key={item.id} className="text-center px-3 py-2 text-foreground font-medium">
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isProducts ? (
              <>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Bank</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="px-3 py-2 text-center text-foreground">{p.bankName}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Interest Rate</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="px-3 py-2 text-center text-foreground font-medium">{p.interestRate}%</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Monthly Fee</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="px-3 py-2 text-center text-foreground font-medium">${p.monthlyFee}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Min Balance</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="px-3 py-2 text-center text-foreground">${p.minBalance}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Perks</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="px-3 py-2 text-center text-foreground">{p.perks.join(", ")}</td>
                  ))}
                </tr>
              </>
            ) : (
              <>
                {compareBanks.map((_, __, arr) => null)}
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Type</td>
                  {compareBanks.map((b) => (
                    <td key={b.id} className="px-3 py-2 text-center text-foreground capitalize">{b.type.replace("_", " ")}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Branches</td>
                  {compareBanks.map((b) => (
                    <td key={b.id} className="px-3 py-2 text-center text-foreground">{b.branches}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Transparency</td>
                  {compareBanks.map((b) => (
                    <td key={b.id} className="px-3 py-2 text-center"><ScoreBadge score={b.transparencyScore} label="" /></td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">Digital Score</td>
                  {compareBanks.map((b) => (
                    <td key={b.id} className="px-3 py-2 text-center"><ScoreBadge score={b.digitalScore ?? 0} label="" /></td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2 text-muted-foreground">ZIPIT Fee</td>
                  {compareBanks.map((b) => {
                    const fee = bankFees.find((f) => f.bankId === b.id && f.name.includes("ZIPIT"))
                    return (
                      <td key={b.id} className="px-3 py-2 text-center text-foreground">
                        {fee ? `$${fee.amount.toFixed(2)}` : "-"}
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Digital Features</td>
                  {compareBanks.map((b) => (
                    <td key={b.id} className="px-3 py-2 text-center text-foreground text-[10px]">
                      {b.digitalFeatures.join(", ")}
                    </td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {isProducts && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-sm font-bold">★</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t("banking.winner")}: <span className="text-primary italic">
                  {(() => {
                    const products = compareProducts;
                    let winner = products[0];
                    products.forEach(p => {
                      let score = 0;
                      if (p.interestRate > winner.interestRate) score += 2;
                      if (p.monthlyFee < winner.monthlyFee) score += 1;
                      if (p.minBalance < winner.minBalance) score += 1;
                      if (p.perks.length > winner.perks.length) score += 1;

                      if (score >= 2) winner = p;
                    });
                    return winner.bankName + " " + winner.name;
                  })()}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t("banking.recommended")}</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {(() => {
              const products = compareProducts;
              let winner = products[0];
              products.forEach(p => {
                if (p.interestRate > winner.interestRate) winner = p;
              });
              // Simple summary of winner's best traits
              return [
                `${t("banking.reasoning.higherRate")} (${winner.interestRate}% APY)`,
                `${t("banking.reasoning.lowerFee")} ($${winner.monthlyFee}/mo)`,
                `${t("banking.reasoning.betterPerks")}: ${winner.perks.slice(0, 2).join(", ")}`
              ].map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                  <span className="text-primary mt-1">✓</span>
                  {reason}
                </li>
              ));
            })()}
          </ul>

          <p className="text-[10px] text-muted-foreground italic">
            {t("banking.disclaimer")}
          </p>
        </div>
      )}

      <button
        className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => alert("PDF export is a placeholder in this demo.")}
      >
        Export to PDF
      </button>


      <Disclaimer />
    </div>
  )
}

export default function BankingComparePage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  )
}
