const fs = require('fs');
const path = require('path');

const pageContent = `
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  Landmark,
  HeartPulse,
  FileText,
  Car,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react"

// Providers
interface Provider {
  id: string;
  name: string;
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

// Field definition
type FieldDef = { name: string; type: "string" | "number" | "boolean" | "currency"; label: string; isPrice?: boolean };

const tables = {
  insurance: [
    { name: "provider_name", type: "string", label: "Provider Name" },
    { name: "provider_type", type: "string", label: "Provider Type" },
    { name: "provider_website", type: "string", label: "Provider Website" },
    { name: "product_category", type: "string", label: "Product Category" },
    { name: "product_name", type: "string", label: "Product Name" },
    { name: "product_type", type: "string", label: "Product Type" },
    { name: "coverage_description", type: "string", label: "Coverage Description" },
    { name: "coverage_limit", type: "number", label: "Coverage Limit", isPrice: true },
    { name: "premium_amount", type: "number", label: "Premium Amount", isPrice: true },
    { name: "premium_frequency", type: "string", label: "Premium Frequency" },
    { name: "price_string", type: "string", label: "Price String" },
    { name: "excess_deductible", type: "number", label: "Excess Deductible", isPrice: true },
    { name: "waiting_period_days", type: "number", label: "Waiting Period Days" },
    { name: "age_minimum", type: "number", label: "Age Minimum" },
    { name: "age_maximum", type: "number", label: "Age Maximum" },
    { name: "third_party_covered", type: "boolean", label: "Third Party Covered" },
    { name: "own_damage_covered", type: "boolean", label: "Own Damage Covered" },
    { name: "comprehensive_coverage", type: "boolean", label: "Comprehensive Coverage" },
    { name: "accidental_damage", type: "boolean", label: "Accidental Damage" },
    { name: "theft_coverage", type: "boolean", label: "Theft Coverage" },
    { name: "personal_belongings", type: "boolean", label: "Personal Belongings" },
    { name: "legal_liability", type: "boolean", label: "Legal Liability" },
    { name: "roadside_assistance", type: "boolean", label: "Roadside Assistance" },
    { name: "confidence_score", type: "number", label: "Confidence Score" },
    { name: "source_url", type: "string", label: "Source URL" },
    { name: "data_status", type: "string", label: "Data Status" }
  ],
  loan_products: [
    { name: "loan_name", type: "string", label: "Loan Name" },
    { name: "loan_type", type: "string", label: "Loan Type" },
    { name: "minimum_loan_amount", type: "number", label: "Minimum Loan Amount", isPrice: true },
    { name: "maximum_loan_amount", type: "number", label: "Maximum Loan Amount", isPrice: true },
    { name: "interest_rate", type: "number", label: "Interest Rate" },
    { name: "interest_rate_type", type: "string", label: "Interest Rate Type" },
    { name: "apr", type: "number", label: "APR" },
    { name: "minimum_repayment_period_months", type: "number", label: "Min Repayment Months" },
    { name: "maximum_repayment_period_months", type: "number", label: "Max Repayment Months" },
    { name: "application_fee", type: "number", label: "Application Fee", isPrice: true },
    { name: "processing_fee", type: "number", label: "Processing Fee", isPrice: true },
    { name: "administration_fee", type: "number", label: "Administration Fee", isPrice: true },
    { name: "facility_fee", type: "number", label: "Facility Fee", isPrice: true },
    { name: "insurance_required", type: "boolean", label: "Insurance Required" },
    { name: "insurance_fee", type: "number", label: "Insurance Fee", isPrice: true },
    { name: "minimum_age", type: "number", label: "Minimum Age" },
    { name: "maximum_age", type: "number", label: "Maximum Age" },
    { name: "minimum_salary", type: "number", label: "Minimum Salary", isPrice: true },
    { name: "collateral_required", type: "boolean", label: "Collateral Required" },
    { name: "collateral_type", type: "string", label: "Collateral Type" },
    { name: "guarantor_required", type: "boolean", label: "Guarantor Required" },
    { name: "approval_time", type: "string", label: "Approval Time" },
    { name: "disbursement_time", type: "string", label: "Disbursement Time" },
    { name: "repayment_frequency", type: "string", label: "Repayment Frequency" },
    { name: "grace_period_days", type: "number", label: "Grace Period Days" },
    { name: "top_up_available", type: "boolean", label: "Top Up Available" },
    { name: "early_settlement_allowed", type: "boolean", label: "Early Settlement Allowed" },
    { name: "early_settlement_fee", type: "number", label: "Early Settlement Fee", isPrice: true },
    { name: "late_payment_penalty", type: "number", label: "Late Payment Penalty", isPrice: true },
    { name: "online_application", type: "boolean", label: "Online Application" },
    { name: "mobile_application", type: "boolean", label: "Mobile Application" },
    { name: "credit_score_required", type: "boolean", label: "Credit Score Required" },
    { name: "business_registration_required", type: "boolean", label: "Business Registration Required" },
    { name: "tax_clearance_required", type: "boolean", label: "Tax Clearance Required" },
    { name: "financial_statements_required", type: "boolean", label: "Financial Statements Required" },
    { name: "relationship_manager_available", type: "boolean", label: "Relationship Manager Available" },
    { name: "status", type: "string", label: "Status" },
  ],
  medical_aid_schemes: [
    { name: "provider_name", type: "string", label: "Provider Name" },
    { name: "provider_type", type: "string", label: "Provider Type" },
    { name: "provider_website", type: "string", label: "Provider Website" },
    { name: "scheme_category", type: "string", label: "Scheme Category" },
    { name: "plan_name", type: "string", label: "Plan Name" },
    { name: "plan_tier", type: "string", label: "Plan Tier" },
    { name: "monthly_premium", type: "number", label: "Monthly Premium", isPrice: true },
    { name: "annual_premium", type: "number", label: "Annual Premium", isPrice: true },
    { name: "price_string", type: "string", label: "Price String" },
    { name: "billing_period", type: "string", label: "Billing Period" },
    { name: "coverage_type", type: "string", label: "Coverage Type" },
    { name: "dependents_allowed", type: "boolean", label: "Dependents Allowed" },
    { name: "max_dependents", type: "number", label: "Max Dependents" },
    { name: "outpatient_coverage", type: "boolean", label: "Outpatient Coverage" },
    { name: "inpatient_coverage", type: "boolean", label: "Inpatient Coverage" },
    { name: "maternity_coverage", type: "boolean", label: "Maternity Coverage" },
    { name: "dental_coverage", type: "boolean", label: "Dental Coverage" },
    { name: "optical_coverage", type: "boolean", label: "Optical Coverage" },
    { name: "mental_health_coverage", type: "boolean", label: "Mental Health Coverage" },
    { name: "emergency_coverage", type: "boolean", label: "Emergency Coverage" },
    { name: "benefits_description", type: "string", label: "Benefits Description" },
    { name: "waiting_period_days", type: "number", label: "Waiting Period Days" },
    { name: "co_pay_percentage", type: "number", label: "Co-Pay Percentage" },
    { name: "excess_amount", type: "number", label: "Excess Amount", isPrice: true },
    { name: "annual_limit", type: "number", label: "Annual Limit", isPrice: true },
    { name: "lifetime_limit", type: "number", label: "Lifetime Limit", isPrice: true },
    { name: "confidence_score", type: "number", label: "Confidence Score" },
    { name: "source_url", type: "string", label: "Source URL" },
    { name: "data_status", type: "string", label: "Data Status" }
  ],
  Policy: [
    { name: "providerName", type: "string", label: "Provider Name" },
    { name: "category", type: "string", label: "Category" },
    { name: "name", type: "string", label: "Name" },
    { name: "monthlyPremium", type: "number", label: "Monthly Premium", isPrice: true },
    { name: "annualPremium", type: "number", label: "Annual Premium", isPrice: true },
    { name: "excess", type: "number", label: "Excess", isPrice: true },
    { name: "waitingPeriodDays", type: "number", label: "Waiting Period Days" },
    { name: "coverLimit", type: "number", label: "Cover Limit", isPrice: true },
    { name: "benefits", type: "string", label: "Benefits" },
    { name: "exclusions", type: "string", label: "Exclusions" },
  ],
  Vehicle: [
    { name: "dealershipName", type: "string", label: "Dealership Name" },
    { name: "make", type: "string", label: "Make" },
    { name: "model", type: "string", label: "Model" },
    { name: "year", type: "number", label: "Year" },
    { name: "price", type: "number", label: "Price", isPrice: true },
    { name: "engineCC", type: "number", label: "Engine CC" },
    { name: "fuelType", type: "string", label: "Fuel Type" },
    { name: "mileage", type: "number", label: "Mileage" },
    { name: "transmission", type: "string", label: "Transmission" },
    { name: "color", type: "string", label: "Color" },
    { name: "financingAvailable", type: "boolean", label: "Financing Available" },
    { name: "condition", type: "string", label: "Condition" },
    { name: "location", type: "string", label: "Location" },
  ]
};

export default function InsuranceCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [activeTab, setActiveTab] = useState<keyof typeof tables>("insurance")
  
  // Data lists
  const [records, setRecords] = useState<Record<string, any[]>>({
    insurance: [],
    loan_products: [],
    medical_aid_schemes: [],
    Policy: [],
    Vehicle: []
  })

  // Form states
  const [forms, setForms] = useState<Record<string, Record<string, any>>>({
    insurance: {},
    loan_products: {},
    medical_aid_schemes: {},
    Policy: {},
    Vehicle: {}
  })
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const selectedRole = typeof window !== "undefined"
    ? (localStorage.getItem("selectedRole") ?? role)
    : role

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  useEffect(() => {
    fetch("/api/insurance/providers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setProviders(data)
            if (data.length > 0) setSelectedProvider(data[0].name)
        }
      })
      .catch(err => console.error(err))

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("corp_insurance_records")
      if (saved) setRecords(JSON.parse(saved))
    }
  }, [])

  const saveToStorage = (newData: Record<string, any[]>) => {
    setRecords(newData)
    localStorage.setItem("corp_insurance_records", JSON.stringify(newData))
  }

  const handleFieldChange = (name: string, value: any) => {
    setForms(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [name]: value
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProvider) {
      addToast("Please select a provider first.", "error")
      return
    }

    const currentForm = forms[activeTab];
    let coverageAmt = 0;
    let annualPremium = 0;

    // Detect coverage and premium fields for calculation
    if (activeTab === "insurance") {
      coverageAmt = Number(currentForm.coverage_limit) || 0;
      annualPremium = Number(currentForm.premium_amount) || 0;
    } else if (activeTab === "loan_products") {
      coverageAmt = Number(currentForm.maximum_loan_amount) || 0;
      annualPremium = Number(currentForm.apr) || 1; // avoid / 0
    } else if (activeTab === "medical_aid_schemes") {
      coverageAmt = Number(currentForm.annual_limit) || 0;
      annualPremium = Number(currentForm.annual_premium) || 0;
    } else if (activeTab === "Policy") {
      coverageAmt = Number(currentForm.coverLimit) || 0;
      annualPremium = Number(currentForm.annualPremium) || 0;
    } else if (activeTab === "Vehicle") {
      coverageAmt = Number(currentForm.price) || 0;
      annualPremium = 1;
    }

    const norm = annualPremium > 0 ? coverageAmt / annualPremium : 0;

    const completeRecord = {
      ...currentForm,
      providerName: selectedProvider, // store for filtering
      normalised: norm,
      id: editingId || Date.now()
    }

    const tabRecords = records[activeTab] || [];
    
    if (editingId) {
      const newTabRecords = tabRecords.map(r => r.id === editingId ? completeRecord : r);
      saveToStorage({ ...records, [activeTab]: newTabRecords })
      addToast("Record updated.", "success")
    } else {
      saveToStorage({ ...records, [activeTab]: [...tabRecords, completeRecord] })
      addToast("Record added.", "success")
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForms(prev => ({ ...prev, [activeTab]: {} }))
    addToast("Edit cancelled.", "info")
  }

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (selectedRole !== "corporate" && selectedRole !== "admin" && role !== "corporate" && role !== "admin") {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-lg font-medium text-foreground">Corporate Access Required</h1>
        <p className="text-sm text-muted-foreground">
          Select Corporate or Admin from the interface selection screen to access this page.
        </p>
        <button
          onClick={() => router.push("/interface-selection")}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Go to Interface Selection
        </button>
      </div>
    )
  }

  const currentFields = tables[activeTab];
  
  // Calculate normalised dynamically for display
  const currentForm = forms[activeTab] || {};
  let tempNorm = 0;
  if (activeTab === "insurance") {
    tempNorm = (Number(currentForm.coverage_limit) || 0) / (Number(currentForm.premium_amount) || 1);
  } else if (activeTab === "loan_products") {
    tempNorm = (Number(currentForm.maximum_loan_amount) || 0) / (Number(currentForm.apr) || 1);
  } else if (activeTab === "medical_aid_schemes") {
    tempNorm = (Number(currentForm.annual_limit) || 0) / (Number(currentForm.annual_premium) || 1);
  } else if (activeTab === "Policy") {
    tempNorm = (Number(currentForm.coverLimit) || 0) / (Number(currentForm.annualPremium) || 1);
  } else if (activeTab === "Vehicle") {
    tempNorm = (Number(currentForm.price) || 0);
  }

  return (
    <div className="relative min-h-screen bg-background space-y-8 animate-in fade-in duration-700 pt-12 px-6 sm:px-10 pb-24 overflow-x-hidden">
      
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg pointer-events-auto transition-all animate-in slide-in-from-top-2",
              t.type === "success" ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400" :
              t.type === "error" ? "bg-red-950/80 border-red-500/30 text-red-400" :
              "bg-blue-950/80 border-blue-500/30 text-blue-400"
            )}
          >
            {t.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="text-xs font-medium">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => router.push("/corporate")}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-display font-medium text-foreground tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Insurance Input
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Input, manage, and audit insurance tables matching the Neon DB schema exactly.
          </p>
        </div>
      </div>

      {/* Main Forms and Views Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* Form Container (LHS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-floating p-6 sm:p-8 space-y-6 relative border-white/10">
            
            {/* Header Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
                {Object.keys(tables).map((tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => { setActiveTab(tabKey as any); if (editingId) cancelEdit(); }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      activeTab === tabKey ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    {tabKey === "insurance" && <ShieldCheck className="w-3.5 h-3.5" />}
                    {tabKey === "loan_products" && <Landmark className="w-3.5 h-3.5" />}
                    {tabKey === "medical_aid_schemes" && <HeartPulse className="w-3.5 h-3.5" />}
                    {tabKey === "Policy" && <FileText className="w-3.5 h-3.5" />}
                    {tabKey === "Vehicle" && <Car className="w-3.5 h-3.5" />}
                    {tabKey.replace(/_/g, ' ')}
                  </button>
                ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  
                  {/* Global Provider Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Provider <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="" disabled className="bg-background">Select Provider</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.name} className="bg-background">{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {currentFields.map((field) => (
                    <React.Fragment key={field.name}>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          {field.label}
                        </label>
                        {field.type === "boolean" ? (
                          <select
                            value={currentForm[field.name] ? "true" : "false"}
                            onChange={(e) => handleFieldChange(field.name, e.target.value === "true")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          >
                            <option value="false" className="bg-background">No</option>
                            <option value="true" className="bg-background">Yes</option>
                          </select>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            step={field.type === "number" ? "0.01" : undefined}
                            value={currentForm[field.name] || ""}
                            onChange={(e) => {
                              const val = field.type === "number" ? parseFloat(e.target.value) : e.target.value;
                              handleFieldChange(field.name, val);
                            }}
                            placeholder={\`Enter \${field.label}\`}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        )}
                      </div>
                      
                      {/* Currency field after price */}
                      {field.isPrice && (
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            {field.label} Currency
                          </label>
                          <input
                            type="text"
                            value={currentForm[\`\${field.name}_currency\`] || ""}
                            onChange={(e) => handleFieldChange(\`\${field.name}_currency\`, e.target.value)}
                            placeholder="e.g. USD"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Normalised Read Only */}
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Normalised
                    </label>
                    <input
                      type="number"
                      disabled
                      value={tempNorm === Infinity || isNaN(tempNorm) ? 0 : tempNorm}
                      placeholder="Calculates on Add Record"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground/60 cursor-not-allowed"
                    />
                  </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl teal-glow"
                  >
                    {editingId ? "Update Record" : "Add Record"}
                  </button>
              </div>
            </form>
          </div>
        </div>

        {/* Data Table Container (RHS) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-floating p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Entered Records
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Normalised</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(records[activeTab] || [])
                    .filter((item: any) => item.providerName === selectedProvider)
                    .map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors text-xs text-white/80">
                      <td className="py-2 px-3 truncate max-w-[150px]">
                        {item.product_name || item.loan_name || item.plan_name || item.name || item.model || "Unnamed"}
                      </td>
                      <td className="py-2 px-3">{item.normalised ? item.normalised.toFixed(4) : "-"}</td>
                    </tr>
                  ))}
                  {(records[activeTab] || []).filter((item: any) => item.providerName === selectedProvider).length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-xs text-muted-foreground italic">
                        No records found for this provider and category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
`;

const dir = path.join(__dirname, '..', 'app', 'corporate', 'insurance');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent, 'utf8');
console.log('Page created.');
