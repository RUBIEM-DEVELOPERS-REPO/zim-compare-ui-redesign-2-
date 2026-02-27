"use client"

import { banks } from "@/lib/mock/banks"
import { telecomProviders } from "@/lib/mock/telecoms"
import { schools } from "@/lib/mock/schools"
import { insuranceProviders } from "@/lib/mock/insurance"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"

const categorySummaries = [
  {
    category: "Banking",
    highlights: [
      "10 licensed banks compared across accounts, loans, fees, and digital features",
      "Stanbic Bank leads in transparency (82%), while Steward Bank leads in digital banking (90%)",
      "POSB offers the lowest ZIPIT fees at $0.80, while FBC charges the highest at $1.80",
      "CBZ Bank has the most branches (62), offering widest physical access",
    ],
    topPick: "Stanbic Bank",
    topPickReason: "Best balance of transparency, digital features, and competitive fees",
  },
  {
    category: "Telecom",
    highlights: [
      "5 providers compared: 3 MNOs (Econet, NetOne, Telecel) and 2 ISPs (TelOne, Liquid)",
      "Econet leads coverage at 92% but is most expensive. Telecel cheapest at $1.33/GB",
      "Liquid Telecom offers best fibre value at $0.30/GB for 50Mbps",
      "Night bundles offer best cost/GB across all providers (as low as $0.50/GB)",
    ],
    topPick: "Econet (mobile) / Liquid (fibre)",
    topPickReason: "Econet for best coverage; Liquid for best speed-to-cost ratio",
  },
  {
    category: "Schools",
    highlights: [
      "10 schools compared across boarding and day options, ZIMSEC and Cambridge curricula",
      "Peterhouse Boys leads academically (98% pass rate, 1:8 ratio) but costs $16,500/yr",
      "Prince Edward offers best value at $3,300/yr with good sports facilities",
      "Eaglesvale is the standout day school with STEM focus and 93% pass rate",
    ],
    topPick: "Eaglesvale (day) / Peterhouse (boarding)",
    topPickReason: "Best academic outcomes for their respective categories",
  },
  {
    category: "Insurance",
    highlights: [
      "10 providers and 30+ policies compared across motor, medical, life, funeral, and property",
      "CIMAS leads medical with 7-day avg claims and digital portal; most comprehensive coverage",
      "Old Mutual offers widest product range across all categories",
      "Zimnat stands out for business insurance with $200K cover and 12-day claims",
    ],
    topPick: "CIMAS (medical) / Old Mutual (general)",
    topPickReason: "CIMAS for fastest claims process; Old Mutual for broadest coverage",
  },
]

export default function SummariesPage() {
  const { preferences } = useAppStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Market Summaries</h1>
        <p className="text-sm text-muted-foreground">
          Overview of all sectors based on your <span className="text-primary capitalize">{preferences.scenario}</span> profile
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Banks Tracked</p>
          <p className="text-2xl font-semibold text-foreground">{banks.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Telecom Providers</p>
          <p className="text-2xl font-semibold text-foreground">{telecomProviders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Schools Listed</p>
          <p className="text-2xl font-semibold text-foreground">{schools.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Insurance Providers</p>
          <p className="text-2xl font-semibold text-foreground">{insuranceProviders.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {categorySummaries.map((s) => (
          <div key={s.category} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground">{s.category}</h3>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Top Pick</p>
                <p className="text-xs text-primary font-medium">{s.topPick}</p>
              </div>
            </div>
            <ul className="space-y-2 mb-3">
              {s.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5 shrink-0">&#x2022;</span>
                  {h}
                </li>
              ))}
            </ul>
            <p className="text-xs text-primary/80 bg-primary/5 rounded-lg px-3 py-2">
              <span className="font-medium">Why:</span> {s.topPickReason}
            </p>
          </div>
        ))}
      </div>
      <Disclaimer />
    </div>
  )
}
