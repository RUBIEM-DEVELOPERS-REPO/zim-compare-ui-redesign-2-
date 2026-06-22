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
  MessageSquare,
  Share2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react"

// Exact database schema models represented locally
interface BrowsingData {
  product_id: number;
  provider: string;
  product: number;
  browsing_data_type: string;
  price: number;
  currency: string;
  validity: string;
  normalised_data: number | null;
}

interface Combo {
  product_id: number;
  provider: string;
  product: number;
  combo_type: string;
  price: number;
  currency: string;
  validity: string;
  normalised_data: number | null;
}

interface Sms {
  product_id: number;
  provider: string;
  product: number;
  sms_type: string;
  price: number;
  currency: string;
  validity: string;
  normalised_data: number | null;
}

interface SocialMedia {
  product_id: number;
  provider: string;
  product: number;
  social_media_type: string;
  price: number;
  currency: string;
  validity: string;
  normalised_data: number | null;
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

const initialBrowsingData = (op: string): Omit<BrowsingData, "product_id"> => ({
  provider: op,
  product: 0,
  browsing_data_type: "daily",
  price: 0,
  currency: "USD",
  validity: "1 Day",
  normalised_data: null,
})

const initialCombo = (op: string): Omit<Combo, "product_id"> => ({
  provider: op,
  product: 0,
  combo_type: "voice_data",
  price: 0,
  currency: "USD",
  validity: "1 Day",
  normalised_data: null,
})

const initialSms = (op: string): Omit<Sms, "product_id"> => ({
  provider: op,
  product: 0,
  sms_type: "local",
  price: 0,
  currency: "USD",
  validity: "1 Day",
  normalised_data: null,
})

const initialSocialMedia = (op: string): Omit<SocialMedia, "product_id"> => ({
  provider: op,
  product: 0,
  social_media_type: "whatsapp",
  price: 0,
  currency: "USD",
  validity: "1 Day",
  normalised_data: null,
})

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export default function TelecomCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [selectedOperator, setSelectedOperator] = useState("econet")
  const [providerQuery, setProviderQuery] = useState("")
  const [providerFocused, setProviderFocused] = useState(false)
  const [activeTab, setActiveTab] = useState<"browsing_data" | "combo" | "sms" | "social_media">("browsing_data")
  
  // Data lists
  const [browsingData, setBrowsingData] = useState<BrowsingData[]>([])
  const [combos, setCombos] = useState<Combo[]>([])
  const [smsData, setSmsData] = useState<Sms[]>([])
  const [socialMediaData, setSocialMediaData] = useState<SocialMedia[]>([])

  // Form states
  const [browsingForm, setBrowsingForm] = useState<Omit<BrowsingData, "product_id">>(initialBrowsingData("econet"))
  const [comboForm, setComboForm] = useState<Omit<Combo, "product_id">>(initialCombo("econet"))
  const [smsForm, setSmsForm] = useState<Omit<Sms, "product_id">>(initialSms("econet"))
  const [socialMediaForm, setSocialMediaForm] = useState<Omit<SocialMedia, "product_id">>(initialSocialMedia("econet"))
  
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
    if (typeof window !== "undefined") {
      const savedBrowsing = localStorage.getItem("corp_telecom_browsing")
      const savedCombo = localStorage.getItem("corp_telecom_combo")
      const savedSms = localStorage.getItem("corp_telecom_sms")
      const savedSocial = localStorage.getItem("corp_telecom_social")
      if (savedBrowsing) setBrowsingData(JSON.parse(savedBrowsing))
      if (savedCombo) setCombos(JSON.parse(savedCombo))
      if (savedSms) setSmsData(JSON.parse(savedSms))
      if (savedSocial) setSocialMediaData(JSON.parse(savedSocial))
    }
  }, [])

  useEffect(() => {
    setBrowsingForm(prev => ({ ...prev, provider: selectedOperator }))
    setComboForm(prev => ({ ...prev, provider: selectedOperator }))
    setSmsForm(prev => ({ ...prev, provider: selectedOperator }))
    setSocialMediaForm(prev => ({ ...prev, provider: selectedOperator }))
  }, [selectedOperator])

  const saveBrowsingToStorage = (newData: BrowsingData[]) => {
    setBrowsingData(newData)
    localStorage.setItem("corp_telecom_browsing", JSON.stringify(newData))
  }
  const saveComboToStorage = (newData: Combo[]) => {
    setCombos(newData)
    localStorage.setItem("corp_telecom_combo", JSON.stringify(newData))
  }
  const saveSmsToStorage = (newData: Sms[]) => {
    setSmsData(newData)
    localStorage.setItem("corp_telecom_sms", JSON.stringify(newData))
  }
  const saveSocialToStorage = (newData: SocialMedia[]) => {
    setSocialMediaData(newData)
    localStorage.setItem("corp_telecom_social", JSON.stringify(newData))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeTab === "browsing_data") {
        if (!browsingForm.product) { addToast("Product size is required.", "error"); return; }
        const norm = browsingForm.price / browsingForm.product;
        setBrowsingForm(prev => ({ ...prev, normalised_data: norm }));
        const completeRecord = { ...browsingForm, normalised_data: norm };
        if (editingId) {
            saveBrowsingToStorage(browsingData.map(d => d.product_id === editingId ? { ...completeRecord, product_id: editingId } : d))
            addToast("Browsing Data updated.", "success")
        } else {
            saveBrowsingToStorage([...browsingData, { ...completeRecord, product_id: Date.now() }])
            addToast("Browsing Data added.", "success")
        }
    } else if (activeTab === "combo") {
        if (!comboForm.product) { addToast("Product size is required.", "error"); return; }
        const norm = comboForm.price / comboForm.product;
        setComboForm(prev => ({ ...prev, normalised_data: norm }));
        const completeRecord = { ...comboForm, normalised_data: norm };
        if (editingId) {
            saveComboToStorage(combos.map(d => d.product_id === editingId ? { ...completeRecord, product_id: editingId } : d))
            addToast("Combo Data updated.", "success")
        } else {
            saveComboToStorage([...combos, { ...completeRecord, product_id: Date.now() }])
            addToast("Combo Data added.", "success")
        }
    } else if (activeTab === "sms") {
        if (!smsForm.product) { addToast("Product size is required.", "error"); return; }
        const norm = smsForm.price / smsForm.product;
        setSmsForm(prev => ({ ...prev, normalised_data: norm }));
        const completeRecord = { ...smsForm, normalised_data: norm };
        if (editingId) {
            saveSmsToStorage(smsData.map(d => d.product_id === editingId ? { ...completeRecord, product_id: editingId } : d))
            addToast("SMS Data updated.", "success")
        } else {
            saveSmsToStorage([...smsData, { ...completeRecord, product_id: Date.now() }])
            addToast("SMS Data added.", "success")
        }
    } else if (activeTab === "social_media") {
        if (!socialMediaForm.product) { addToast("Product size is required.", "error"); return; }
        const norm = socialMediaForm.price / socialMediaForm.product;
        setSocialMediaForm(prev => ({ ...prev, normalised_data: norm }));
        const completeRecord = { ...socialMediaForm, normalised_data: norm };
        if (editingId) {
            saveSocialToStorage(socialMediaData.map(d => d.product_id === editingId ? { ...completeRecord, product_id: editingId } : d))
            addToast("Social Media Data updated.", "success")
        } else {
            saveSocialToStorage([...socialMediaData, { ...completeRecord, product_id: Date.now() }])
            addToast("Social Media Data added.", "success")
        }
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setBrowsingForm(initialBrowsingData(selectedOperator))
    setComboForm(initialCombo(selectedOperator))
    setSmsForm(initialSms(selectedOperator))
    setSocialMediaForm(initialSocialMedia(selectedOperator))
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
            Telecom Input
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Input, manage, and audit telecom tables (Browsing Data, Combo, SMS, Social Media) matching the Neon DB.
          </p>
        </div>
      </div>



      {/* Main Forms and Views Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* Form Container (LHS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-floating p-6 sm:p-8 space-y-6 relative border-white/10">
            
            {/* Header Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
                <button
                  onClick={() => { setActiveTab("browsing_data"); if (editingId) cancelEdit(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "browsing_data" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Database className="w-3.5 h-3.5" /> Browsing Data
                </button>
                <button
                  onClick={() => { setActiveTab("combo"); if (editingId) cancelEdit(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "combo" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Mic2 className="w-3.5 h-3.5" /> Combo
                </button>
                <button
                  onClick={() => { setActiveTab("sms"); if (editingId) cancelEdit(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "sms" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> SMS
                </button>
                <button
                  onClick={() => { setActiveTab("social_media"); if (editingId) cancelEdit(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "social_media" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Share2 className="w-3.5 h-3.5" /> Social Media
                </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                  {/* Provider combobox */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Provider <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={providerFocused ? providerQuery : selectedOperator}
                      onChange={(e) => {
                        setProviderQuery(e.target.value)
                        setSelectedOperator(e.target.value)
                        if (editingId) cancelEdit()
                      }}
                      onFocus={() => {
                        setProviderFocused(true)
                        setProviderQuery(selectedOperator)
                      }}
                      onBlur={() => setTimeout(() => setProviderFocused(false), 150)}
                      placeholder="Select or type operator name…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {providerFocused && (
                      <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#0d1117] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-44 overflow-y-auto">
                        {[
                          ...new Set([
                            ...operators.map((o) => o.name),
                            ...browsingData.map((d) => d.provider),
                            ...combos.map((d) => d.provider),
                            ...smsData.map((d) => d.provider),
                            ...socialMediaData.map((d) => d.provider),
                          ])
                        ]
                          .filter((name) =>
                            name.toLowerCase().includes(providerQuery.toLowerCase())
                          )
                          .map((name) => (
                            <button
                              key={name}
                              type="button"
                              onMouseDown={() => {
                                setSelectedOperator(name)
                                setProviderQuery(name)
                                setProviderFocused(false)
                              }}
                              className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/10 transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                        {providerQuery &&
                          ![
                            ...operators.map((o) => o.name),
                            ...browsingData.map((d) => d.provider),
                            ...combos.map((d) => d.provider),
                            ...smsData.map((d) => d.provider),
                            ...socialMediaData.map((d) => d.provider),
                          ].some(
                            (name) => name.toLowerCase() === providerQuery.toLowerCase()
                          ) && (
                            <div className="px-3.5 py-2 text-[10px] text-muted-foreground border-t border-white/5">
                              New provider:{" "}
                              <span className="text-primary">{providerQuery}</span>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Product (MB) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={
                        activeTab === "browsing_data" ? browsingForm.product || "" :
                        activeTab === "combo" ? comboForm.product || "" :
                        activeTab === "sms" ? smsForm.product || "" :
                        socialMediaForm.product || ""
                      }
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0
                        if (activeTab === "browsing_data") setBrowsingForm({ ...browsingForm, product: val })
                        else if (activeTab === "combo") setComboForm({ ...comboForm, product: val })
                        else if (activeTab === "sms") setSmsForm({ ...smsForm, product: val })
                        else setSocialMediaForm({ ...socialMediaForm, product: val })
                      }}
                      placeholder="e.g. 500"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {activeTab === "browsing_data" && "Browsing Type"}
                      {activeTab === "combo" && "Combo Type"}
                      {activeTab === "sms" && "SMS Type"}
                      {activeTab === "social_media" && "Social Media Type"}
                    </label>
                    <input
                      type="text"
                      required
                      value={
                        activeTab === "browsing_data" ? browsingForm.browsing_data_type :
                        activeTab === "combo" ? comboForm.combo_type :
                        activeTab === "sms" ? smsForm.sms_type :
                        socialMediaForm.social_media_type
                      }
                      onChange={(e) => {
                        if (activeTab === "browsing_data") setBrowsingForm({ ...browsingForm, browsing_data_type: e.target.value })
                        else if (activeTab === "combo") setComboForm({ ...comboForm, combo_type: e.target.value })
                        else if (activeTab === "sms") setSmsForm({ ...smsForm, sms_type: e.target.value })
                        else setSocialMediaForm({ ...socialMediaForm, social_media_type: e.target.value })
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={
                        activeTab === "browsing_data" ? browsingForm.price :
                        activeTab === "combo" ? comboForm.price :
                        activeTab === "sms" ? smsForm.price :
                        socialMediaForm.price
                      }
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0
                        if (activeTab === "browsing_data") setBrowsingForm({ ...browsingForm, price: val })
                        else if (activeTab === "combo") setComboForm({ ...comboForm, price: val })
                        else if (activeTab === "sms") setSmsForm({ ...smsForm, price: val })
                        else setSocialMediaForm({ ...socialMediaForm, price: val })
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Currency <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={
                        activeTab === "browsing_data" ? browsingForm.currency :
                        activeTab === "combo" ? comboForm.currency :
                        activeTab === "sms" ? smsForm.currency :
                        socialMediaForm.currency
                      }
                      onChange={(e) => {
                        const val = e.target.value
                        if (activeTab === "browsing_data") setBrowsingForm({ ...browsingForm, currency: val })
                        else if (activeTab === "combo") setComboForm({ ...comboForm, currency: val })
                        else if (activeTab === "sms") setSmsForm({ ...smsForm, currency: val })
                        else setSocialMediaForm({ ...socialMediaForm, currency: val })
                      }}
                      placeholder="e.g. USD, ZIG"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Validity <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={
                        activeTab === "browsing_data" ? browsingForm.validity :
                        activeTab === "combo" ? comboForm.validity :
                        activeTab === "sms" ? smsForm.validity :
                        socialMediaForm.validity
                      }
                      onChange={(e) => {
                        if (activeTab === "browsing_data") setBrowsingForm({ ...browsingForm, validity: e.target.value })
                        else if (activeTab === "combo") setComboForm({ ...comboForm, validity: e.target.value })
                        else if (activeTab === "sms") setSmsForm({ ...smsForm, validity: e.target.value })
                        else setSocialMediaForm({ ...socialMediaForm, validity: e.target.value })
                      }}
                      placeholder="e.g., 1 Day"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Normalised Data (MB)
                    </label>
                    <input
                      type="number"
                      disabled
                      value={
                        (activeTab === "browsing_data" ? browsingForm.normalised_data :
                        activeTab === "combo" ? comboForm.normalised_data :
                        activeTab === "sms" ? smsForm.normalised_data :
                        socialMediaForm.normalised_data) ?? ""
                      }
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

        {/* Data Table Container (RHS / Bottom) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-floating p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Entered Records
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(activeTab === "browsing_data" ? browsingData :
                    activeTab === "combo" ? combos :
                    activeTab === "sms" ? smsData :
                    socialMediaData)
                    .filter((item: any) => item.provider === selectedOperator)
                    .map((item: any) => (
                    <tr key={item.product_id} className="hover:bg-white/5 transition-colors text-xs text-white/80">
                      <td className="py-2 px-3">{item.product}</td>
                      <td className="py-2 px-3">
                        {item.browsing_data_type || item.combo_type || item.sms_type || item.social_media_type}
                      </td>
                      <td className="py-2 px-3">${item.price}</td>
                    </tr>
                  ))}
                  {(activeTab === "browsing_data" ? browsingData :
                    activeTab === "combo" ? combos :
                    activeTab === "sms" ? smsData :
                    socialMediaData).filter((item: any) => item.provider === selectedOperator).length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-xs text-muted-foreground italic">
                        No records found for this operator and category.
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
