"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { apiGet } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useEffect, useState } from "react"
import { ArrowLeft, HeartHandshake, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { PaymentModal } from "@/components/payment-modal"
import { InsuranceComparisonTable } from "@/components/insurance/insurance-comparison-table"
import { InsuranceRecommendationCards } from "@/components/insurance/insurance-recommendation-cards"
import { scoreInsurancePolicies } from "@/lib/insurance-utils"

import { policies as mockPolicies, insuranceProviders as mockProviders } from "@/lib/mock/insurance"

function InsuranceCompareContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? []
    const { addSavedComparison, removeFromCompareTray } = useAppStore()

    const [policies, setPolicies] = useState<any[]>(mockPolicies)
    const [insuranceProviders, setInsuranceProviders] = useState<any[]>(mockProviders)
    const [loading, setLoading] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [paymentItem, setPaymentItem] = useState<{ id: string, name: string, price: number, category: string, provider?: string }>({
        id: "", name: "", price: 0, category: "", provider: ""
    })

    // Still attempt to fetch fresh data but default to mock
    useEffect(() => {
        setLoading(true)
        Promise.all([
            apiGet('/insurance/policies').catch(() => ({ policies: [] })),
            apiGet('/insurance/providers').catch(() => ({ providers: [] }))
        ]).then(([pRes, prRes]) => {
            if (pRes.policies?.length > 0) setPolicies(pRes.policies)
            if (prRes.providers?.length > 0) setInsuranceProviders(prRes.providers)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const selectedPolicies = policies.filter((p) => ids.includes(p.id))

    if (loading && selectedPolicies.length === 0) {
        return <div className="flex items-center justify-center py-20 text-muted-foreground animate-pulse font-medium uppercase tracking-widest text-[10px]">Synchronizing Neural Policy Data...</div>
    }

    if (selectedPolicies.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <HeartHandshake size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium text-foreground mb-2">No insurance policies selected for comparison.</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 policies to see a side-by-side comparison and AI recommendations.
                </p>
                <Link
                    href="/insurance"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                >
                    <ArrowLeft size={16} />
                    Go back to Policies
                </Link>
            </div>
        )
    }

    const handleRemove = (id: string) => {
        removeFromCompareTray(id)
        const newIds = ids.filter(i => i !== id)
        if (newIds.length === 0) {
            router.push("/insurance")
        } else {
            router.push(`/insurance/compare/policies?ids=${newIds.join(",")}`)
        }
    }

    const { scoredPolicies, bestOverall, lowestCost, bestCoverage, lowestRisk } = scoreInsurancePolicies(selectedPolicies)

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "insurance",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `Insurance Comparison: ${selectedPolicies.map(p => p.providerName).join(" vs ")}`
        })
        router.push("/dashboard")
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <button
                        onClick={() => router.push("/insurance")}
                        className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground hover:text-primary uppercase tracking-[0.2em] transition-all mb-6 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Policy Index
                    </button>
                    <h1 className="text-5xl font-display font-medium text-foreground tracking-tighter uppercase leading-tight">
                        Risk Analysis
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-sans opacity-70">
                        Strategic side-by-side performance metrics for {selectedPolicies.length} insurance contracts.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="glass-floating px-8 py-3 rounded-2xl text-[10px] font-medium uppercase tracking-[0.2em] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all teal-glow active:scale-95"
                >
                    Archive This Logic
                </button>
            </div>

            <InsuranceComparisonTable 
                selectedPolicies={selectedPolicies}
                insuranceProviders={insuranceProviders}
                onRemove={handleRemove}
            />

            <InsuranceRecommendationCards 
                scoredPolicies={scoredPolicies}
                lowestCost={lowestCost}
                bestCoverage={bestCoverage}
                lowestRisk={lowestRisk}
                bestOverall={bestOverall}
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

            <PaymentModal 
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                item={paymentItem}
            />

            <Disclaimer />
        </div>
    )
}

export default function InsuranceComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-teal-600 font-medium animate-pulse text-[10px] uppercase tracking-[0.2em]">Analyzing Insurance Vectors...</div>}>
                <InsuranceCompareContent />
            </Suspense>
        </div>
    )
}
