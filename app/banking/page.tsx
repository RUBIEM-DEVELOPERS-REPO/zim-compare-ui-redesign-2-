"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { BankingOverview } from "@/components/banking/banking-overview"
import { BankingAccounts } from "@/components/banking/banking-accounts"
import { BankingLoans } from "@/components/banking/banking-loans"
import { BankingFees } from "@/components/banking/banking-fees"
import { BankingNonInterest } from "@/components/banking/banking-non-interest"
import { BankingDigital } from "@/components/banking/banking-digital"
import { BankingProfiles } from "@/components/banking/banking-profiles"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "accounts", label: "Accounts" },
  { key: "loans", label: "Loans" },
  { key: "fees", label: "Fees & Charges" },
  { key: "non-interest", label: "Non-Interest Income" },
  { key: "digital", label: "Digital Banking" },
  { key: "profiles", label: "Bank Profiles" },
] as const

export default function BankingPage() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Banking</h1>
        <p className="text-sm text-muted-foreground">Compare Zimbabwe banks, accounts, loans, and fees</p>
      </div>

      {/* Secondary tab bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategorySelector
          value={tab}
          onValueChange={setTab}
          categories={tabs}
        />

        <LocationFilterPill
          selectedLocation={location}
          onLocationChange={setLocation}
        />
      </div>

      {/* Tab Content */}
      {tab === "overview" && <BankingOverview location={location} />}
      {tab === "accounts" && <BankingAccounts location={location} />}
      {tab === "loans" && <BankingLoans location={location} />}
      {tab === "fees" && <BankingFees location={location} />}
      {tab === "non-interest" && <BankingNonInterest location={location} />}
      {tab === "digital" && <BankingDigital location={location} />}
      {tab === "profiles" && <BankingProfiles location={location} />}
    </div>
  )
}
