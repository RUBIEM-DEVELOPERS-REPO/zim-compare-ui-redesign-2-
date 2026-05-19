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

  const [banks, setBanks] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [banksRes, prodsRes, feesRes, loansRes] = await Promise.all([
          fetch('/api/banking/banks'),
          fetch('/api/banking/products'),
          fetch('/api/banking/fees'),
          fetch('/api/banking/loans')
        ])
        const [banksData, prodsData, feesData, loansData] = await Promise.all([
          banksRes.json(),
          prodsRes.json(),
          feesRes.json(),
          loansRes.json()
        ])
        setBanks(banksData.banks || [])
        setProducts(prodsData.products || [])
        setFees(feesData.fees || [])
        setLoans(loansData.loans || [])
      } catch (err) {
        console.error("Failed to fetch banking data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {tab === "overview" && <BankingOverview location={location} banks={banks} products={products} />}
            {tab === "accounts" && <BankingAccounts location={location} banks={banks} products={products} />}
            {tab === "loans" && <BankingLoans location={location} banks={banks} loans={loans} />}
            {tab === "fees" && <BankingFees location={location} banks={banks} fees={fees} />}
            {tab === "non-interest" && <BankingNonInterest location={location} banks={banks} products={products} />}
            {tab === "digital" && <BankingDigital location={location} banks={banks} />}
            {tab === "profiles" && <BankingProfiles location={location} banks={banks} />}
          </>
        )}
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

