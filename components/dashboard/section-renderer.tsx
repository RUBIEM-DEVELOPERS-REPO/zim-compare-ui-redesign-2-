"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import sections for better performance
const DashboardHome = dynamic(() => import("@/app/dashboard/page"), { 
  loading: () => <SectionSkeleton /> 
})
const BankingSection = dynamic(() => import("@/app/banking/page"), { 
  loading: () => <SectionSkeleton /> 
})
const TelecomSection = dynamic(() => import("@/app/telecom/page"), { 
  loading: () => <SectionSkeleton /> 
})
const SchoolsSection = dynamic(() => import("@/app/schools/page"), { 
  loading: () => <SectionSkeleton /> 
})
const UniversitiesSection = dynamic(() => import("@/app/universities/page"), { 
  loading: () => <SectionSkeleton /> 
})
const InsuranceSection = dynamic(() => import("@/app/insurance/page"), { 
  loading: () => <SectionSkeleton /> 
})
const StayscapeSection = dynamic(() => import("@/app/stayscape/page"), { 
  loading: () => <SectionSkeleton /> 
})
const ChatSection = dynamic(() => import("@/app/chat/page"), { 
  loading: () => <SectionSkeleton /> 
})
const MobilitySection = dynamic(() => import("@/app/mobility/page"), { 
  loading: () => <SectionSkeleton /> 
})
const UtilitiesSection = dynamic(() => import("@/app/utilities/page"), { 
  loading: () => <SectionSkeleton /> 
})
const SavedSection = dynamic(() => import("@/app/saved/page"), { 
  loading: () => <SectionSkeleton /> 
})
const RegulatedPricesSection = dynamic(() => import("@/app/regulated-prices/page"), { 
  loading: () => <SectionSkeleton /> 
})
const TaxesLeviesSection = dynamic(() => import("@/app/taxes-levies/page"), { 
  loading: () => <SectionSkeleton /> 
})
const SmartAlertsSection = dynamic(() => import("@/app/smart-alerts/page"), { 
  loading: () => <SectionSkeleton /> 
})
const ApplicationsSection = dynamic(() => import("@/app/applications/page"), { 
  loading: () => <SectionSkeleton /> 
})

function SectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[200px] rounded-2xl" />
      </div>
    </div>
  )
}

interface SectionRendererProps {
  activeSection: string
}

export function SectionRenderer({ activeSection }: SectionRendererProps) {
  switch (activeSection) {
    case "dashboard": return <DashboardHome />
    case "banking": return <BankingSection />
    case "telecom": return <TelecomSection />
    case "schools": return <SchoolsSection />
    case "universities": return <UniversitiesSection />
    case "insurance": return <InsuranceSection />
    case "stayscape": return <StayscapeSection />
    case "chat": return <ChatSection />
    case "mobility": return <MobilitySection />
    case "utilities": return <UtilitiesSection />
    case "regulated": return <RegulatedPricesSection />
    case "taxes": return <TaxesLeviesSection />
    case "alerts": return <SmartAlertsSection />
    case "applications": return <ApplicationsSection />
    case "saved": return <SavedSection />
    default: return <DashboardHome />
  }
}
