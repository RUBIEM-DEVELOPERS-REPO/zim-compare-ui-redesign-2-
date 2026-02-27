"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { banks, bankingProducts, bankFees } from "@/lib/mock/banks"
import { telecomProviders, dataBundles } from "@/lib/mock/telecoms"
import { schools } from "@/lib/mock/schools"
import { insuranceProviders, policies } from "@/lib/mock/insurance"

interface SearchResult {
  group: string
  label: string
  sublabel: string
  href: string
}

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const results = useMemo<SearchResult[]>(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    const r: SearchResult[] = []

    // Institutions
    for (const b of banks) {
      if (b.name.toLowerCase().includes(q))
        r.push({ group: "Institutions", label: b.name, sublabel: "Bank", href: `/banking?tab=profiles&bank=${b.id}` })
    }
    for (const t of telecomProviders) {
      if (t.name.toLowerCase().includes(q))
        r.push({ group: "Institutions", label: t.name, sublabel: "Telecom", href: `/telecom?tab=profiles&provider=${t.id}` })
    }
    for (const s of schools) {
      if (s.name.toLowerCase().includes(q))
        r.push({ group: "Institutions", label: s.name, sublabel: "School", href: `/schools?tab=profiles&school=${s.id}` })
    }
    for (const i of insuranceProviders) {
      if (i.name.toLowerCase().includes(q))
        r.push({ group: "Institutions", label: i.name, sublabel: "Insurance", href: `/insurance?tab=profiles&provider=${i.id}` })
    }

    // Products
    for (const p of bankingProducts) {
      if (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
        r.push({ group: "Products", label: p.name, sublabel: p.bankName, href: `/banking?tab=accounts` })
    }
    for (const b of dataBundles) {
      if (b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
        r.push({ group: "Products", label: b.name, sublabel: b.providerName, href: `/telecom?tab=data` })
    }
    for (const p of policies) {
      if (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
        r.push({ group: "Products", label: p.name, sublabel: p.providerName, href: `/insurance?tab=${p.category === "motor" ? "motor" : p.category === "medical" ? "medical" : "life"}` })
    }

    // Fees/Terms
    const feeTerms = ["zipit", "atm", "sms", "roaming", "fup", "throttle", "excess", "waiting period", "exclusion", "hidden"]
    for (const f of bankFees) {
      if (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
        r.push({ group: "Fees & Terms", label: f.name, sublabel: `${f.bankName} - $${f.amount}/${f.unit}`, href: `/banking?tab=fees` })
    }
    if (feeTerms.some((t) => t.includes(q))) {
      r.push({ group: "Fees & Terms", label: `Search "${query}" in fees`, sublabel: "Browse fee comparisons", href: `/banking?tab=fees` })
    }

    return r.slice(0, 20)
  }, [query])

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search banks, bundles, schools, policies, fees..."
          className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full max-h-80 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
          {["Institutions", "Products", "Fees & Terms"].map((group) => {
            const groupResults = results.filter((r) => r.group === group)
            if (groupResults.length === 0) return null
            return (
              <div key={group}>
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-secondary/30">
                  {group}
                </div>
                {groupResults.map((r, i) => (
                  <button
                    key={`${r.label}-${i}`}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-secondary/50 transition-colors text-left"
                    onClick={() => {
                      router.push(r.href)
                      setQuery("")
                      setOpen(false)
                    }}
                  >
                    <span className="text-foreground">{r.label}</span>
                    <span className="text-xs text-muted-foreground">{r.sublabel}</span>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
