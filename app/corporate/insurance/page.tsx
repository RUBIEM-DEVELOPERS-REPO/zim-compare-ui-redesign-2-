"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  HeartPulse,
  Heart,
  Home,
  Building2,
  Tractor,
  Plane,
  Car,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Loader2,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Provider {
  id: string
  name: string
}

interface SavedPolicy {
  id: string
  name: string
  type: string
  monthlyPremium: number
  annualPremium: number
  normalisedScore: number | null
  currency: string
  createdAt: string
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

// ── Category Config ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "motor",              label: "Car Insurance",        icon: Car },
  { key: "medical",            label: "Medical Insurance",    icon: HeartPulse },
  { key: "life_funeral",       label: "Funeral Cover",        icon: Heart },
  { key: "property_business",  label: "Home Insurance",       icon: Home },
  { key: "business",           label: "Business Insurance",   icon: Building2 },
  { key: "agriculture",        label: "Agriculture Insurance",icon: Tractor },
  { key: "travel",             label: "Travel Insurance",     icon: Plane },
] as const

type CategoryKey = typeof CATEGORIES[number]["key"]

const PLAN_TYPES: Record<CategoryKey, string[]> = {
  motor:             ["Third Party", "Third Party Fire & Theft", "Comprehensive"],
  medical:           ["Individual", "Family", "In-Patient", "Out-Patient", "Corporate"],
  life_funeral:      ["Individual Plan", "Family Plan", "Extended Plan", "Cash Plan", "Service Plan"],
  property_business: ["Building Cover", "Contents Cover", "Combined Home Cover", "All Risks Cover", "Landlord Cover"],
  business:          ["Business All Risks", "Public Liability", "Professional Indemnity", "Asset All Risks"],
  agriculture:       ["Crop Cover", "Livestock Cover", "Equipment Cover", "Tobacco Hail Cover"],
  travel:            ["International", "Regional", "Student Travel", "Business Travel"],
}

// ── Field definitions per category ───────────────────────────────────────────

interface FieldDef {
  name: string
  label: string
  type: "text" | "number" | "boolean" | "textarea"
  placeholder?: string
  hint?: string
}

const SHARED_FIELDS: FieldDef[] = [
  { name: "name",              label: "Policy / Plan Name",   type: "text",    placeholder: "e.g. Comprehensive Motor Silver" },
  { name: "monthlyPremium",    label: "Monthly Premium",      type: "number",  placeholder: "e.g. 45.00" },
  { name: "annualPremium",     label: "Annual Premium",       type: "number",  placeholder: "Auto-calculated if blank", hint: "Leave blank to auto-derive from monthly × 12" },
  { name: "excess",            label: "Excess / Deductible",  type: "number",  placeholder: "e.g. 200" },
  { name: "coverLimit",        label: "Cover Limit",          type: "number",  placeholder: "e.g. 50000" },
  { name: "waitingPeriodDays", label: "Waiting Period (days)",type: "number",  placeholder: "e.g. 30" },
  { name: "currency",          label: "Currency",             type: "text",    placeholder: "USD" },
  { name: "benefits",          label: "Benefits",             type: "textarea",placeholder: "e.g. Windscreen, Fire, Theft (comma-separated)", hint: "Comma-separated list" },
  { name: "exclusions",        label: "Exclusions",           type: "textarea",placeholder: "e.g. DUI, Racing (comma-separated)", hint: "Comma-separated list" },
]

const EXTRA_FIELDS: Record<CategoryKey, FieldDef[]> = {
  motor: [],
  medical: [
    { name: "copayPercent",  label: "Co-pay %",       type: "number", placeholder: "e.g. 20" },
    { name: "annualLimit",   label: "Annual Limit",   type: "number", placeholder: "e.g. 10000" },
  ],
  life_funeral: [
    { name: "funeralPayoutLimit", label: "Funeral Payout Limit", type: "number",  placeholder: "e.g. 5000" },
    { name: "cashbackOption",     label: "Cashback Option",      type: "boolean" },
  ],
  property_business: [
    { name: "propertyValue", label: "Property Value", type: "number", placeholder: "e.g. 150000" },
  ],
  business: [],
  agriculture: [
    { name: "seasonalCover", label: "Seasonal Cover", type: "boolean" },
  ],
  travel: [
    { name: "tripDurationDays",  label: "Trip Duration (days)", type: "number", placeholder: "e.g. 30" },
    { name: "destinationRegion", label: "Destination Region",   type: "text",   placeholder: "e.g. Southern Africa" },
  ],
}

// ── Blank form factory ────────────────────────────────────────────────────────

function blankForm(): Record<string, any> {
  return {
    name: "",
    monthlyPremium: "",
    annualPremium: "",
    excess: "",
    coverLimit: "",
    waitingPeriodDays: "",
    currency: "USD",
    benefits: "",
    exclusions: "",
    copayPercent: "",
    annualLimit: "",
    funeralPayoutLimit: "",
    cashbackOption: false,
    propertyValue: "",
    seasonalCover: false,
    tripDurationDays: "",
    destinationRegion: "",
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InsuranceCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  // Provider combobox state
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [providerQuery, setProviderQuery] = useState("")
  const [providerFocused, setProviderFocused] = useState(false)

  // Category & plan type
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("motor")
  const [planType, setPlanType] = useState<string>(PLAN_TYPES["motor"][0])

  // Form
  const [form, setForm] = useState<Record<string, any>>(blankForm())

  // Saved records panel (fetched from DB)
  const [savedPolicies, setSavedPolicies] = useState<SavedPolicy[]>([])
  const [loadingPolicies, setLoadingPolicies] = useState(false)

  // Submission
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const selectedRole =
    typeof window !== "undefined"
      ? (localStorage.getItem("selectedRole") ?? role)
      : role

  // ── Helpers ───────────────────────────────────────────────────────────────

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000)
  }

  const resetForm = () => {
    setForm(blankForm())
  }

  // ── Data fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/insurance/providers")
      .then((res) => res.json())
      .then((data) => {
        const dbProviders = Array.isArray(data) ? data : []
        const defaultList = [
          { id: "old-mutual", name: "Old Mutual Zimbabwe" },
          { id: "zimnat", name: "Zimnat Insurance" },
          { id: "nicoz-diamond", name: "Nicoz Diamond" },
          { id: "cimas", name: "CIMAS Medical Aid" },
          { id: "psmas", name: "PSMAS" },
          { id: "first-mutual", name: "First Mutual Health" },
          { id: "alliance", name: "Alliance Health" },
          { id: "eagle", name: "Eagle Insurance" },
          { id: "cellmed", name: "CellMed Health" },
          { id: "doves", name: "Doves Funeral Services" },
          { id: "nyaradzo", name: "Nyaradzo Group" }
        ]
        const merged = [...dbProviders]
        defaultList.forEach(def => {
          if (!merged.some(p => p.name.toLowerCase() === def.name.toLowerCase())) {
            merged.push(def)
          }
        })
        setProviders(merged)
      })
      .catch((err) => {
        console.error(err)
        setProviders([
          { id: "old-mutual", name: "Old Mutual Zimbabwe" },
          { id: "zimnat", name: "Zimnat Insurance" },
          { id: "nicoz-diamond", name: "Nicoz Diamond" },
          { id: "cimas", name: "CIMAS Medical Aid" },
          { id: "psmas", name: "PSMAS" },
          { id: "first-mutual", name: "First Mutual Health" },
          { id: "alliance", name: "Alliance Health" },
          { id: "eagle", name: "Eagle Insurance" },
          { id: "cellmed", name: "CellMed Health" },
          { id: "doves", name: "Doves Funeral Services" },
          { id: "nyaradzo", name: "Nyaradzo Group" }
        ])
      })
  }, [])

  const fetchSavedPolicies = useCallback(async () => {
    if (!selectedProvider) { setSavedPolicies([]); return }
    setLoadingPolicies(true)
    try {
      const res = await fetch(
        `/api/insurance/policies?category=${activeCategory}`
      )
      const data = await res.json()
      const allPolicies: any[] = data.policies || []
      const filtered = allPolicies.filter(
        (p) => p.providerName.toLowerCase() === selectedProvider.toLowerCase()
      )
      setSavedPolicies(filtered)
    } catch {
      setSavedPolicies([])
    } finally {
      setLoadingPolicies(false)
    }
  }, [selectedProvider, activeCategory])

  useEffect(() => { fetchSavedPolicies() }, [fetchSavedPolicies])

  // ── Category change ───────────────────────────────────────────────────────

  const handleCategoryChange = (key: CategoryKey) => {
    setActiveCategory(key)
    setPlanType(PLAN_TYPES[key][0])
    resetForm()
  }

  // ── Form field update ─────────────────────────────────────────────────────

  const setField = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProvider.trim()) {
      addToast("Please enter or select a provider.", "error")
      return
    }
    if (!form.monthlyPremium || Number(form.monthlyPremium) <= 0) {
      addToast("Monthly premium must be greater than 0.", "error")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        providerName: selectedProvider.trim(),
        category: activeCategory,
        type: planType,
        ...form,
      }

      const res = await fetch("/api/insurance/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        addToast(data.error || "Failed to save policy.", "error")
        return
      }

      addToast(
        `✓ Saved — normalised score: ${data.normalisedScore ?? "–"}`,
        "success"
      )
      resetForm()
      fetchSavedPolicies()

      // Re-fetch providers in case a new one was created
      const pRes = await fetch("/api/insurance/providers")
      const pData = await pRes.json()
      if (Array.isArray(pData)) setProviders(pData)
    } catch (err: any) {
      addToast(err?.message || "Network error.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Live normalised score preview ─────────────────────────────────────────

  const coverLimit = parseFloat(form.coverLimit) || 0
  const monthly = parseFloat(form.monthlyPremium) || 0
  const annual = parseFloat(form.annualPremium) || monthly * 12
  const previewScore = annual > 0 ? (coverLimit / annual).toFixed(4) : "–"

  // ── Guard ─────────────────────────────────────────────────────────────────

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (
    selectedRole !== "corporate" &&
    selectedRole !== "admin" &&
    role !== "corporate" &&
    role !== "admin"
  ) {
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

  const currentCat = CATEGORIES.find((c) => c.key === activeCategory)!
  const allFields = [...SHARED_FIELDS, ...EXTRA_FIELDS[activeCategory]]

  return (
    <div className="relative min-h-screen bg-background space-y-8 animate-in fade-in duration-700 pt-12 px-6 sm:px-10 pb-24 overflow-x-hidden">

      {/* Toast notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg pointer-events-auto transition-all animate-in slide-in-from-top-2",
              t.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400"
                : t.type === "error"
                ? "bg-red-950/80 border-red-500/30 text-red-400"
                : "bg-blue-950/80 border-blue-500/30 text-blue-400"
            )}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
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
            Input and manage insurance policies. Records are normalised and stored directly to the database for immediate use on the consumer interface.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">

        {/* ── Form (LHS) ────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-floating p-6 sm:p-8 space-y-6 relative border-white/10">

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
              {CATEGORIES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeCategory === key
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Row 1 — Provider + Plan Type */}
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Provider combobox */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Provider <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={providerFocused ? providerQuery : selectedProvider}
                    onChange={(e) => {
                      setProviderQuery(e.target.value)
                      setSelectedProvider(e.target.value)
                    }}
                    onFocus={() => {
                      setProviderFocused(true)
                      setProviderQuery(selectedProvider)
                    }}
                    onBlur={() => setTimeout(() => setProviderFocused(false), 150)}
                    placeholder="Select or type new provider…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  {providerFocused && (
                    <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#0d1117] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-44 overflow-y-auto">
                      {providers
                        .filter((p) =>
                          p.name.toLowerCase().includes(providerQuery.toLowerCase())
                        )
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onMouseDown={() => {
                              setSelectedProvider(p.name)
                              setProviderQuery(p.name)
                              setProviderFocused(false)
                            }}
                            className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/10 transition-colors"
                          >
                            {p.name}
                          </button>
                        ))}
                      {providerQuery &&
                        !providers.some(
                          (p) => p.name.toLowerCase() === providerQuery.toLowerCase()
                        ) && (
                          <div className="px-3.5 py-2 text-[10px] text-muted-foreground border-t border-white/5">
                            New provider:{" "}
                            <span className="text-primary">{providerQuery}</span>
                          </div>
                        )}
                      {providers.length === 0 && (
                        <div className="px-3.5 py-2 text-[10px] text-muted-foreground italic">
                          No providers yet — type to create one
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Plan type dropdown */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Plan Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {PLAN_TYPES[activeCategory].map((t) => (
                      <option key={t} value={t} className="bg-background">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic fields grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allFields.map((field) => (
                  <div
                    key={field.name}
                    className={cn(
                      "space-y-1",
                      field.type === "textarea" && "sm:col-span-2 lg:col-span-3"
                    )}
                  >
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {field.label}
                      {field.hint && (
                        <span className="ml-1 text-muted-foreground/50 normal-case font-normal tracking-normal">
                          ({field.hint})
                        </span>
                      )}
                    </label>

                    {field.type === "boolean" ? (
                      <select
                        value={form[field.name] ? "true" : "false"}
                        onChange={(e) => setField(field.name, e.target.value === "true")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="false" className="bg-background">No</option>
                        <option value="true" className="bg-background">Yes</option>
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        rows={2}
                        value={form[field.name] || ""}
                        onChange={(e) => setField(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        step={field.type === "number" ? "0.01" : undefined}
                        min={field.type === "number" ? "0" : undefined}
                        value={form[field.name] || ""}
                        onChange={(e) => setField(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    )}
                  </div>
                ))}

                {/* Normalised score preview (read-only) */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Normalised Score{" "}
                    <span className="text-muted-foreground/50 normal-case font-normal tracking-normal">
                      (preview)
                    </span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={previewScore}
                    className="w-full bg-white/3 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-primary font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Submit row */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
                <p className="text-[10px] text-muted-foreground opacity-60">
                  Records are normalised and saved directly to the database.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl teal-glow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    {submitting ? "Saving…" : "Save to Database"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ── Saved records panel (RHS) ──────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-floating p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Saved Records
              </h3>
              <button
                onClick={fetchSavedPolicies}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Category + provider context */}
            <div className="text-[10px] text-muted-foreground opacity-60">
              <span className="text-primary font-medium">{currentCat.label}</span>
              {selectedProvider ? (
                <> · {selectedProvider}</>
              ) : (
                " · select a provider to filter"
              )}
            </div>

            <div className="overflow-x-auto">
              {loadingPolicies ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-muted-foreground">
                      <th className="py-2 px-2">Plan</th>
                      <th className="py-2 px-2 text-right">$/mo</th>
                      <th className="py-2 px-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {savedPolicies.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 text-center text-[10px] text-muted-foreground italic"
                        >
                          {selectedProvider
                            ? "No policies for this provider & category."
                            : "Enter a provider name to see records."}
                        </td>
                      </tr>
                    ) : (
                      savedPolicies.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-white/5 transition-colors text-xs text-white/80"
                        >
                          <td className="py-2 px-2">
                            <p className="font-medium text-white truncate max-w-[110px]">
                              {p.name}
                            </p>
                            <p className="text-[9px] text-muted-foreground">{p.type}</p>
                          </td>
                          <td className="py-2 px-2 text-right tabular-nums">
                            {p.currency ?? "USD"} {p.monthlyPremium}
                          </td>
                          <td className="py-2 px-2 text-right tabular-nums text-primary font-mono text-[10px]">
                            {p.normalisedScore != null
                              ? p.normalisedScore.toFixed(2)
                              : "–"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {savedPolicies.length > 0 && (
              <p className="text-[9px] text-muted-foreground opacity-50 text-right">
                {savedPolicies.length} record{savedPolicies.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* Normalisation legend */}
          <div className="glass-floating p-4 space-y-2 border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Normalisation Guide
            </p>
            <div className="space-y-1.5 text-[9px] text-muted-foreground leading-relaxed">
              <p>
                <span className="text-primary font-mono">Score = Cover Limit ÷ Annual Premium</span>
              </p>
              <p>Higher score = more coverage per dollar paid.</p>
              <p>Annual premium auto-fills from monthly × 12 if blank.</p>
              <p>Benefits &amp; exclusions are stored as JSON arrays.</p>
              <p>Provider names are title-cased and deduplicated.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
