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

import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"
import { BankingNeuralRecommendations } from "@/components/banking/banking-neural-recommendations"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "accounts", label: "Accounts" },
  { key: "loans", label: "Loans" },
  { key: "fees", label: "Fees & Charges" },
  { key: "non-interest", label: "Non-Interest Income" },
  { key: "digital", label: "Digital Banking" },
  { key: "profiles", label: "Bank Profiles" },
  { key: "analysis", label: "Recommendations / Analysis" },
] as const

export default function BankingPage() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const { compareTray, clearCompareTray } = useAppStore()

  // Clear stale comparison state if not banking
  useEffect(() => {
    if (compareTray.ids.length > 0 && compareTray.category !== "banking") {
      clearCompareTray()
    }
  }, [compareTray.category, compareTray.ids.length, clearCompareTray])

  const handleAnalysis = (result: AnalysisResult | null) => {
    setAnalysisResult(result)
    if (result && tab !== "analysis") {
      setTab("analysis")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banking Intelligence"
        subtitle="Compare fees, interest rates, and loan products across all Zimbabwean commercial banks."
      />


      {/* Secondary tab bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategorySelector
          value={tab}
          onValueChange={setTab}
          categories={tabs}
          mainCategory="banking"
          onAnalysis={handleAnalysis}
        />

        <LocationFilterPill
          selectedLocation={location}
          onLocationChange={setLocation}
        />
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {tab === "overview" && <BankingOverview location={location} />}
        {tab === "accounts" && <BankingAccounts location={location} />}
        {tab === "loans" && <BankingLoans location={location} />}
        {tab === "fees" && <BankingFees location={location} />}
        {tab === "non-interest" && <BankingNonInterest location={location} />}
        {tab === "digital" && <BankingDigital location={location} />}
        {tab === "profiles" && <BankingProfiles location={location} />}
        {tab === "analysis" && (
          <div className="relative min-h-[600px] rounded-[2rem] overflow-hidden pt-0 pb-8 px-8">
            {/* Background Depth Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] to-[#031b1f] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            
            <BankingNeuralRecommendations />
          </div>
        )}
      </div>
    </div>
  )
}

