"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  RadioTower,
  Database,
  Mic2,
  Plus,
  Trash2,
  Edit3,
  Save,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Info,
  ExternalLink,
  RefreshCw,
  FolderOpen
} from "lucide-react"

// Exact database schema models represented locally
interface DataBundle {
  id: string
  operator: string
  currency: string
  bundle_group: string
  bundle_name: string
  price: number
  validity_type: string
  validity_value: number
  validity_unit: string
  total_data_mb: number
  peak_data_mb: number | null
  offpeak_data_mb: number | null
  onnet_minutes: number | null
  other_minutes: number | null
  cug_minutes: number | null
  international_minutes: number | null
  sms_count: number | null
  facebook_mb: number | null
  instagram_mb: number | null
  x_mb: number | null
  extras: string | null
  ussd_code: string | null
  source_url: string | null
  source_name: string | null
}

interface VoiceRate {
  id: string
  operator: string
  offer_type: string
  bundle_group: string
  bundle_name: string
  price: number
  validity_type: string
  validity_value: number
  validity_unit: string
  offpeak_type: string | null
  price_unit: string | null
  onnet_min_count: number | null
  offnet_min_count: number | null
  landline_min_count: number | null
  intl_min_count: number | null
  sms_count: number | null
  offpeak_sms_count: number | null
  extras: string | null
  ussd_code: string | null
  source_url: string | null
  source_name: string | null
}

const operators = [
  { id: "econet", name: "Econet Wireless", color: "text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10" },
  { id: "netone", name: "NetOne", color: "text-green-400 border-green-500/20 bg-green-500/5 hover:border-green-500/40 hover:bg-green-500/10" },
  { id: "telecel", name: "Telecel", color: "text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 hover:bg-blue-500/10" },
  { id: "telone", name: "TelOne", color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40 hover:bg-yellow-500/10" },
  { id: "liquid", name: "Liquid Telecom", color: "text-purple-400 border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:bg-purple-500/10" },
  { id: "utande", name: "Utande", color: "text-teal-400 border-teal-500/20 bg-teal-500/5 hover:border-teal-500/40 hover:bg-teal-500/10" },
  { id: "dandemutande", name: "Dandemutande", color: "text-orange-400 border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40 hover:bg-orange-500/10" },
]

const initialDataBundle = (op: string): Omit<DataBundle, "id"> => ({
  operator: op,
  currency: "USD",
  bundle_group: "monthly",
  bundle_name: "",
  price: 0,
  validity_type: "days",
  validity_value: 30,
  validity_unit: "days",
  total_data_mb: 0,
  peak_data_mb: null,
  offpeak_data_mb: null,
  onnet_minutes: null,
  other_minutes: null,
  cug_minutes: null,
  international_minutes: null,
  sms_count: null,
  facebook_mb: null,
  instagram_mb: null,
  x_mb: null,
  extras: null,
  ussd_code: null,
  source_url: null,
  source_name: null,
})

const initialVoiceRate = (op: string): Omit<VoiceRate, "id"> => ({
  operator: op,
  offer_type: "prepaid",
  bundle_group: "voice",
  bundle_name: "",
  price: 0,
  validity_type: "days",
  validity_value: 30,
  validity_unit: "days",
  offpeak_type: null,
  price_unit: "per minute",
  onnet_min_count: null,
  offnet_min_count: null,
  landline_min_count: null,
  intl_min_count: null,
  sms_count: null,
  offpeak_sms_count: null,
  extras: null,
  ussd_code: null,
  source_url: null,
  source_name: null,
})

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export default function TelecomPricingCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [selectedOperator, setSelectedOperator] = useState("econet")
  const [activeTab, setActiveTab] = useState<"data" | "voice">("data")
  
  // Data lists (starts clean/empty)
  const [dataBundles, setDataBundles] = useState<DataBundle[]>([])
  const [voiceRates, setVoiceRates] = useState<VoiceRate[]>([])

  // Form states
  const [dataForm, setDataForm] = useState<Omit<DataBundle, "id">>(initialDataBundle("econet"))
  const [voiceForm, setVoiceForm] = useState<Omit<VoiceRate, "id">>(initialVoiceRate("econet"))
  const [editingId, setEditingId] = useState<string | null>(null)

  // Expandable sections for forms
  const [expandAllowances, setExpandAllowances] = useState(false)
  const [expandMetadata, setExpandMetadata] = useState(false)

  // Feedback notifications
  const [toasts, setToasts] = useState<Toast[]>([])

  const selectedRole = typeof window !== "undefined"
    ? (localStorage.getItem("selectedRole") ?? role)
    : role

  // Toast helper
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBundles = localStorage.getItem("corp_telecom_bundles")
      const savedVoice = localStorage.getItem("corp_telecom_voice")
      if (savedBundles) setDataBundles(JSON.parse(savedBundles))
      if (savedVoice) setVoiceRates(JSON.parse(savedVoice))
    }
  }, [])

  // Sync operator to forms when it changes
  useEffect(() => {
    setDataForm(prev => ({ ...prev, operator: selectedOperator }))
    setVoiceForm(prev => ({ ...prev, operator: selectedOperator }))
  }, [selectedOperator])

  // Save updates to localStorage
  const saveBundlesToStorage = (newBundles: DataBundle[]) => {
    setDataBundles(newBundles)
    localStorage.setItem("corp_telecom_bundles", JSON.stringify(newBundles))
  }

  const saveVoiceToStorage = (newVoice: VoiceRate[]) => {
    setVoiceRates(newVoice)
    localStorage.setItem("corp_telecom_voice", JSON.stringify(newVoice))
  }

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "data") {
      if (!dataForm.bundle_name.trim()) {
        addToast("Bundle Name is required.", "error")
        return
      }
      if (dataForm.price < 0 || dataForm.total_data_mb < 0) {
        addToast("Price and Total Data must be positive numbers.", "error")
        return
      }

      if (editingId) {
        // Edit Mode
        const updated = dataBundles.map((b) =>
          b.id === editingId ? { ...dataForm, id: editingId } : b
        )
        saveBundlesToStorage(updated)
        addToast("Data bundle updated successfully.", "success")
        setEditingId(null)
      } else {
        // Create Mode
        const newBundle: DataBundle = {
          ...dataForm,
          id: `db_${Date.now()}`,
        }
        saveBundlesToStorage([...dataBundles, newBundle])
        addToast("Data bundle added successfully.", "success")
      }
      setDataForm(initialDataBundle(selectedOperator))
    } else {
      if (!voiceForm.bundle_name.trim()) {
        addToast("Rate/Pack Name is required.", "error")
        return
      }
      if (voiceForm.price < 0) {
        addToast("Price must be a positive number.", "error")
        return
      }

      if (editingId) {
        // Edit Mode
        const updated = voiceRates.map((v) =>
          v.id === editingId ? { ...voiceForm, id: editingId } : v
        )
        saveVoiceToStorage(updated)
        addToast("Voice rate updated successfully.", "success")
        setEditingId(null)
      } else {
        // Create Mode
        const newVoice: VoiceRate = {
          ...voiceForm,
          id: `vr_${Date.now()}`,
        }
        saveVoiceToStorage([...voiceRates, newVoice])
        addToast("Voice rate added successfully.", "success")
      }
      setVoiceForm(initialVoiceRate(selectedOperator))
    }

    setExpandAllowances(false)
    setExpandMetadata(false)
  }

  // Delete handler
  const handleDelete = (id: string, type: "data" | "voice") => {
    if (confirm("Are you sure you want to delete this pricing record?")) {
      if (type === "data") {
        const filtered = dataBundles.filter((b) => b.id !== id)
        saveBundlesToStorage(filtered)
        addToast("Data bundle deleted.", "info")
      } else {
        const filtered = voiceRates.filter((v) => v.id !== id)
        saveVoiceToStorage(filtered)
        addToast("Voice rate deleted.", "info")
      }
      if (editingId === id) {
        setEditingId(null)
        setDataForm(initialDataBundle(selectedOperator))
        setVoiceForm(initialVoiceRate(selectedOperator))
      }
    }
  }

  // Edit initializer
  const startEdit = (item: DataBundle | VoiceRate, type: "data" | "voice") => {
    setEditingId(item.id)
    setSelectedOperator(item.operator)
    setActiveTab(type)
    if (type === "data") {
      const bundle = item as DataBundle
      setDataForm({
        operator: bundle.operator,
        currency: bundle.currency,
        bundle_group: bundle.bundle_group,
        bundle_name: bundle.bundle_name,
        price: bundle.price,
        validity_type: bundle.validity_type,
        validity_value: bundle.validity_value,
        validity_unit: bundle.validity_unit,
        total_data_mb: bundle.total_data_mb,
        peak_data_mb: bundle.peak_data_mb,
        offpeak_data_mb: bundle.offpeak_data_mb,
        onnet_minutes: bundle.onnet_minutes,
        other_minutes: bundle.other_minutes,
        cug_minutes: bundle.cug_minutes,
        international_minutes: bundle.international_minutes,
        sms_count: bundle.sms_count,
        facebook_mb: bundle.facebook_mb,
        instagram_mb: bundle.instagram_mb,
        x_mb: bundle.x_mb,
        extras: bundle.extras,
        ussd_code: bundle.ussd_code,
        source_url: bundle.source_url,
        source_name: bundle.source_name,
      })
    } else {
      const voice = item as VoiceRate
      setVoiceForm({
        operator: voice.operator,
        offer_type: voice.offer_type,
        bundle_group: voice.bundle_group,
        bundle_name: voice.bundle_name,
        price: voice.price,
        validity_type: voice.validity_type,
        validity_value: voice.validity_value,
        validity_unit: voice.validity_unit,
        offpeak_type: voice.offpeak_type,
        price_unit: voice.price_unit,
        onnet_min_count: voice.onnet_min_count,
        offnet_min_count: voice.offnet_min_count,
        landline_min_count: voice.landline_min_count,
        intl_min_count: voice.intl_min_count,
        sms_count: voice.sms_count,
        offpeak_sms_count: voice.offpeak_sms_count,
        extras: voice.extras,
        ussd_code: voice.ussd_code,
        source_url: voice.source_url,
        source_name: voice.source_name,
      })
    }
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setDataForm(initialDataBundle(selectedOperator))
    setVoiceForm(initialVoiceRate(selectedOperator))
    addToast("Edit cancelled.", "info")
  }

  // Render check
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

  const filteredBundles = dataBundles.filter((b) => b.operator === selectedOperator)
  const filteredVoice = voiceRates.filter((v) => v.operator === selectedOperator)

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
            <RadioTower className="w-8 h-8 text-primary" />
            Telecom Pricing Input
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Input, manage, and audit pricing metrics manually matching the database structure.
          </p>
        </div>
      </div>

      {/* Operator Selector Grid */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Telecom Operator</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {operators.map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setSelectedOperator(op.id)
                if (editingId) cancelEdit()
              }}
              className={cn(
                "px-4 py-3 rounded-2xl border text-xs font-medium text-center transition-all duration-300",
                selectedOperator === op.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg teal-glow scale-[1.02]"
                  : op.color
              )}
            >
              {op.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Forms and Views Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* Form Container (LHS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-floating p-6 sm:p-8 space-y-6 relative border-white/10">
            
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab("data")
                    if (editingId) cancelEdit()
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "data"
                      ? "bg-white/10 text-white"
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Database className="w-3.5 h-3.5" />
                  Data Bundle
                </button>
                <button
                  onClick={() => {
                    setActiveTab("voice")
                    if (editingId) cancelEdit()
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "voice"
                      ? "bg-white/10 text-white"
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Mic2 className="w-3.5 h-3.5" />
                  Voice & SMS Rate
                </button>
              </div>

              {editingId && (
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold uppercase tracking-widest">
                  Editing mode
                </span>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* CORE DETAILS SECTION */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Core Details
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {activeTab === "data" ? "Bundle Name" : "Rate/Pack Name"} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={activeTab === "data" ? dataForm.bundle_name : voiceForm.bundle_name}
                      onChange={(e) =>
                        activeTab === "data"
                          ? setDataForm({ ...dataForm, bundle_name: e.target.value })
                          : setVoiceForm({ ...voiceForm, bundle_name: e.target.value })
                      }
                      placeholder={activeTab === "data" ? "e.g., Daily 500MB" : "e.g., Weekly Combo Voice"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Category (group)
                    </label>
                    {activeTab === "data" ? (
                      <select
                        value={dataForm.bundle_group}
                        onChange={(e) => setDataForm({ ...dataForm, bundle_group: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="daily" className="bg-[#111]">Daily</option>
                        <option value="weekly" className="bg-[#111]">Weekly</option>
                        <option value="monthly" className="bg-[#111]">Monthly</option>
                        <option value="night" className="bg-[#111]">Night</option>
                        <option value="social" className="bg-[#111]">Social</option>
                        <option value="unlimited" className="bg-[#111]">Unlimited</option>
                        <option value="internet" className="bg-[#111]">Internet/Fibre</option>
                      </select>
                    ) : (
                      <select
                        value={voiceForm.bundle_group}
                        onChange={(e) => setVoiceForm({ ...voiceForm, bundle_group: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="voice" className="bg-[#111]">Voice Only</option>
                        <option value="sms" className="bg-[#111]">SMS Only</option>
                        <option value="combo" className="bg-[#111]">Combo (Voice+SMS)</option>
                        <option value="onnet" className="bg-[#111]">On-net Special</option>
                        <option value="offnet" className="bg-[#111]">Off-net Special</option>
                        <option value="international" className="bg-[#111]">International</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={activeTab === "data" ? dataForm.price : voiceForm.price}
                        onChange={(e) =>
                          activeTab === "data"
                            ? setDataForm({ ...dataForm, price: parseFloat(e.target.value) || 0 })
                            : setVoiceForm({ ...voiceForm, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      disabled
                      value="USD"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground/60 cursor-not-allowed"
                    />
                  </div>

                  {activeTab === "data" ? (
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Total Data (MB) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        required
                        value={dataForm.total_data_mb}
                        onChange={(e) => setDataForm({ ...dataForm, total_data_mb: parseInt(e.target.value) || 0 })}
                        placeholder="e.g. 1024"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors tabular-nums"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Offer Type
                      </label>
                      <select
                        value={voiceForm.offer_type}
                        onChange={(e) => setVoiceForm({ ...voiceForm, offer_type: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="prepaid" className="bg-[#111]">Prepaid</option>
                        <option value="postpaid" className="bg-[#111]">Postpaid</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Validity Value <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      required
                      value={activeTab === "data" ? dataForm.validity_value : voiceForm.validity_value}
                      onChange={(e) =>
                        activeTab === "data"
                          ? setDataForm({ ...dataForm, validity_value: parseInt(e.target.value) || 1 })
                          : setVoiceForm({ ...voiceForm, validity_value: parseInt(e.target.value) || 1 })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Validity Unit
                    </label>
                    <select
                      value={activeTab === "data" ? dataForm.validity_unit : voiceForm.validity_unit}
                      onChange={(e) =>
                        activeTab === "data"
                          ? setDataForm({ ...dataForm, validity_unit: e.target.value, validity_type: e.target.value })
                          : setVoiceForm({ ...voiceForm, validity_unit: e.target.value, validity_type: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="hours" className="bg-[#111]">Hours</option>
                      <option value="days" className="bg-[#111]">Days</option>
                      <option value="weeks" className="bg-[#111]">Weeks</option>
                      <option value="months" className="bg-[#111]">Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Validity Type (computed)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={activeTab === "data" ? dataForm.validity_type : voiceForm.validity_type}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground/60 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* OPTIONAL ALLOWANCES & QUOTAS SECTION */}
              <div className="border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandAllowances(!expandAllowances)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Additional Quotas & Allowances
                  </h3>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {expandAllowances ? "Collapse" : "Expand"}
                  </span>
                </button>

                {expandAllowances && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 animate-in fade-in duration-300">
                    {activeTab === "data" ? (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Peak Data (MB)</label>
                          <input
                            type="number"
                            value={dataForm.peak_data_mb ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, peak_data_mb: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Off-Peak Data (MB)</label>
                          <input
                            type="number"
                            value={dataForm.offpeak_data_mb ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, offpeak_data_mb: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">On-net Minutes</label>
                          <input
                            type="number"
                            value={dataForm.onnet_minutes ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, onnet_minutes: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Other/Off-net Mins</label>
                          <input
                            type="number"
                            value={dataForm.other_minutes ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, other_minutes: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">CUG Minutes</label>
                          <input
                            type="number"
                            value={dataForm.cug_minutes ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, cug_minutes: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">International Mins</label>
                          <input
                            type="number"
                            value={dataForm.international_minutes ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, international_minutes: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">SMS Count</label>
                          <input
                            type="number"
                            value={dataForm.sms_count ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, sms_count: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Facebook Data (MB)</label>
                          <input
                            type="number"
                            value={dataForm.facebook_mb ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, facebook_mb: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Instagram Data (MB)</label>
                          <input
                            type="number"
                            value={dataForm.instagram_mb ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, instagram_mb: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">X/Twitter Data (MB)</label>
                          <input
                            type="number"
                            value={dataForm.x_mb ?? ""}
                            onChange={(e) => setDataForm({ ...dataForm, x_mb: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Price Unit</label>
                          <input
                            type="text"
                            value={voiceForm.price_unit ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, price_unit: e.target.value || null })}
                            placeholder="e.g. per minute"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Off-Peak Type</label>
                          <input
                            type="text"
                            value={voiceForm.offpeak_type ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, offpeak_type: e.target.value || null })}
                            placeholder="e.g. 11PM-5AM"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">On-net Minutes</label>
                          <input
                            type="number"
                            value={voiceForm.onnet_min_count ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, onnet_min_count: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Off-net Minutes</label>
                          <input
                            type="number"
                            value={voiceForm.offnet_min_count ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, offnet_min_count: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Landline Minutes</label>
                          <input
                            type="number"
                            value={voiceForm.landline_min_count ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, landline_min_count: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">International Mins</label>
                          <input
                            type="number"
                            value={voiceForm.intl_min_count ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, intl_min_count: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">SMS Count</label>
                          <input
                            type="number"
                            value={voiceForm.sms_count ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, sms_count: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Off-Peak SMS Count</label>
                          <input
                            type="number"
                            value={voiceForm.offpeak_sms_count ?? ""}
                            onChange={(e) => setVoiceForm({ ...voiceForm, offpeak_sms_count: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Null"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* METADATA, LINKS & CODES SECTION */}
              <div className="border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandMetadata(!expandMetadata)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    USSD, Extras & Verification Sources
                  </h3>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {expandMetadata ? "Collapse" : "Expand"}
                  </span>
                </button>

                {expandMetadata && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 grid gap-4 sm:grid-cols-2 animate-in fade-in duration-300">
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">USSD Activation Code</label>
                      <input
                        type="text"
                        value={(activeTab === "data" ? dataForm.ussd_code : voiceForm.ussd_code) ?? ""}
                        onChange={(e) =>
                          activeTab === "data"
                            ? setDataForm({ ...dataForm, ussd_code: e.target.value || null })
                            : setVoiceForm({ ...voiceForm, ussd_code: e.target.value || null })
                        }
                        placeholder="e.g. *143*1*1#"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Extras & FUP Notes</label>
                      <input
                        type="text"
                        value={(activeTab === "data" ? dataForm.extras : voiceForm.extras) ?? ""}
                        onChange={(e) =>
                          activeTab === "data"
                            ? setDataForm({ ...dataForm, extras: e.target.value || null })
                            : setVoiceForm({ ...voiceForm, extras: e.target.value || null })
                        }
                        placeholder="e.g. WhatsApp only, throttled at 20GB"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Verification URL (Source URL)</label>
                      <input
                        type="url"
                        value={(activeTab === "data" ? dataForm.source_url : voiceForm.source_url) ?? ""}
                        onChange={(e) =>
                          activeTab === "data"
                            ? setDataForm({ ...dataForm, source_url: e.target.value || null })
                            : setVoiceForm({ ...voiceForm, source_url: e.target.value || null })
                        }
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Verification Source Name</label>
                      <input
                        type="text"
                        value={(activeTab === "data" ? dataForm.source_name : voiceForm.source_name) ?? ""}
                        onChange={(e) =>
                          activeTab === "data"
                            ? setDataForm({ ...dataForm, source_name: e.target.value || null })
                            : setVoiceForm({ ...voiceForm, source_name: e.target.value || null })
                        }
                        placeholder="e.g., Econet Official Portal"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-[1.25rem] bg-primary text-primary-foreground text-xs font-bold uppercase tracking-[0.15em] hover:bg-primary/90 transition-all shadow-xl teal-glow"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Item" : "Save Pricing Item"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-4 rounded-[1.25rem] bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>

          </div>
        </div>

        {/* Saved List Container (RHS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display font-medium text-foreground text-lg">Saved Records</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-bold">
                  {operators.find(o => o.id === selectedOperator)?.name}
                </p>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground px-2 py-1 bg-white/5 rounded-lg">
                {activeTab === "data" ? filteredBundles.length : filteredVoice.length} Item(s)
              </span>
            </div>

            {activeTab === "data" ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredBundles.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3 relative group/card hover:border-primary/20 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-xs text-white">{b.bundle_name}</h4>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5 font-bold">{b.bundle_group} bundle</p>
                      </div>
                      <span className="text-xs font-bold text-primary tabular-nums">${b.price.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Database className="w-3 h-3 text-muted-foreground" />
                        <span>Data: <strong className="text-white">{b.total_data_mb} MB</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <RefreshCw className="w-3 h-3 text-muted-foreground" />
                        <span>Validity: <strong className="text-white">{b.validity_value} {b.validity_unit}</strong></span>
                      </div>
                    </div>

                    {(b.ussd_code || b.extras) && (
                      <div className="text-[9px] text-muted-foreground bg-white/5 px-2 py-1.5 rounded-lg space-y-0.5">
                        {b.ussd_code && <div>USSD: <code className="text-white font-mono">{b.ussd_code}</code></div>}
                        {b.extras && <div>Note: <span className="text-white">{b.extras}</span></div>}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1 border-t border-white/5">
                      <button
                        title="Edit Bundle"
                        onClick={() => startEdit(b, "data")}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Bundle"
                        onClick={() => handleDelete(b.id, "data")}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredBundles.length === 0 && (
                  <div className="text-center py-12 space-y-3">
                    <FolderOpen className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                    <p className="text-xs text-muted-foreground italic">No manual data bundles entered.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredVoice.map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3 relative group/card hover:border-primary/20 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-xs text-white">{v.bundle_name}</h4>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5 font-bold">{v.offer_type} · {v.bundle_group}</p>
                      </div>
                      <span className="text-xs font-bold text-primary tabular-nums">${v.price.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mic2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Mins: <strong className="text-white">{v.onnet_min_count ?? 0} On / {v.offnet_min_count ?? 0} Off</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <RefreshCw className="w-3 h-3 text-muted-foreground" />
                        <span>Validity: <strong className="text-white">{v.validity_value} {v.validity_unit}</strong></span>
                      </div>
                    </div>

                    {(v.ussd_code || v.extras) && (
                      <div className="text-[9px] text-muted-foreground bg-white/5 px-2 py-1.5 rounded-lg space-y-0.5">
                        {v.ussd_code && <div>USSD: <code className="text-white font-mono">{v.ussd_code}</code></div>}
                        {v.extras && <div>Note: <span className="text-white">{v.extras}</span></div>}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1 border-t border-white/5">
                      <button
                        title="Edit Rate"
                        onClick={() => startEdit(v, "voice")}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Rate"
                        onClick={() => handleDelete(v.id, "voice")}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredVoice.length === 0 && (
                  <div className="text-center py-12 space-y-3">
                    <FolderOpen className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                    <p className="text-xs text-muted-foreground italic">No manual voice rates entered.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  )
}
