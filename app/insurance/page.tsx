"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { InsuranceOverview } from "@/components/insurance/insurance-overview"
import { InsurancePolicies } from "@/components/insurance/insurance-policies"
import { InsuranceClaims } from "@/components/insurance/insurance-claims"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { useAppStore } from "@/lib/store"
import { InsuranceCompareBar } from "@/components/insurance/insurance-compare-bar"
import { PropertyQuoteWizard } from "@/app/insurance/property-quote/wizard"
import { PageHeader } from "@/components/page-header"
import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"
import { policies, insuranceProviders } from "@/lib/mock/insurance"
import { X, Zap } from "lucide-react"
import { InsuranceComparisonTable } from "@/components/insurance/insurance-comparison-table"
import { InsuranceRecommendationCards } from "@/components/insurance/insurance-recommendation-cards"
import { scoreInsurancePolicies } from "@/lib/insurance-utils"
import { PaymentModal } from "@/components/payment-modal"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "policies", label: "Policies" },
  { key: "claims", label: "Claims & Process" },
  { key: "quote", label: "Property Quote" },
  { key: "analysis", label: "Insurance Compare" },
] as const

function InsurancePageContent() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const { compareTray, clearCompareTray, removeFromCompareTray } = useAppStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentItem, setPaymentItem] = useState<{ id: string, name: string, price: number, category: string, provider?: string }>({
    id: "", name: "", price: 0, category: "", provider: ""
  })

  // Sync tab with URL
  useEffect(() => {
    const t = searchParams.get("tab")
    if (t && tabs.some(tab => tab.key === t)) {
      setTab(t)
    }
  }, [searchParams])

  // Clear stale comparison state if not insurance
  useEffect(() => {
    if (compareTray.ids.length > 0 && compareTray.category !== "insurance") {
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
        title="Insurance Intelligence"
        subtitle="Compare motor, medical, life, funeral and property insurance in Zimbabwe"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategorySelector
          value={tab}
          onValueChange={setTab}
          categories={tabs}
          mainCategory="insurance"
          onAnalysis={handleAnalysis}
        />

        <LocationFilterPill
          selectedLocation={location}
          onLocationChange={setLocation}
        />
      </div>

      <InsuranceCompareBar />

      <div className="animate-in fade-in duration-500">
        {tab === "overview" && <InsuranceOverview onTabChange={setTab} location={location} />}
        {tab === "policies" && <InsurancePolicies location={location} />}
        {tab === "claims" && <InsuranceClaims location={location} />}
        {tab === "quote" && <PropertyQuoteWizard />}
        {tab === "analysis" && (
          <div className="space-y-12">
            {analysisResult && <NeuralAnalysisPanel result={analysisResult} />}
            
            {compareTray.ids.length >= 2 ? (
              <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 glass-floating bg-primary/10 text-primary teal-glow">
                      <Zap size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-medium text-foreground uppercase tracking-tight">Neural Comparison Engine</h2>
                      <p className="text-sm text-muted-foreground font-medium opacity-60">Strategic side-by-side performance metrics for selected contracts</p>
                    </div>
                  </div>
                  <button 
                    onClick={clearCompareTray}
                    className="glass-floating px-6 py-2 rounded-xl text-[10px] font-medium uppercase tracking-[0.2em] bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <X size={14} />
                    Clear Comparison
                  </button>
                </div>

                <InsuranceComparisonTable 
                  selectedPolicies={policies.filter(p => compareTray.ids.includes(p.id))}
                  insuranceProviders={insuranceProviders}
                  onRemove={(id) => removeFromCompareTray(id)}
                />

                <InsuranceRecommendationCards 
                  {...scoreInsurancePolicies(policies.filter(p => compareTray.ids.includes(p.id)))}
                  onApply={(p) => console.log("Apply", p)}
                  onPay={(p) => {
                    setPaymentItem({
                      id: p.id,
                      name: `Initial Premium: ${p.name}`,
                      price: p.monthlyPremium,
                      category: "Insurance",
                      provider: p.providerName
                    })
                    setIsPaymentOpen(true)
                  }}
                />
              </div>
            ) : !analysisResult && (
              <div className="glass-panel p-12 text-center">
                <p className="text-muted-foreground font-playfair italic">
                  Select 2 or more policies from the "Policies" tab or enter your requirements above for neural insurance analysis.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        item={paymentItem}
      />
    </div>
  )
}

export default function InsurancePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-teal-600 font-medium animate-pulse uppercase tracking-widest text-[10px]">Analyzing Insurance Vectors...</div>}>
      <InsurancePageContent />
    </Suspense>
  )
}
