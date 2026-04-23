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
import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { PageHeader } from "@/components/page-header"


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
  const { compareTray, clearCompareTray } = useAppStore()

  // Clear stale comparison state if not banking
  useEffect(() => {
    if (compareTray.ids.length > 0 && compareTray.category !== "banking") {
      clearCompareTray()
    }
  }, [compareTray.category, compareTray.ids.length, clearCompareTray])

  return (
    <div className="space-y-6">
      <div>
      <PageHeader
        title="Banking Intelligence"
        subtitle="Compare fees, interest rates, and loan products across all Zimbabwean commercial banks."
      />

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

