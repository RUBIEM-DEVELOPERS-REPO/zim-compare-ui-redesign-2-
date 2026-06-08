"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  RadioTower,
  Database,
  Mic2,
  DollarSign,
  Package,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HomeIcon,
  Search,
  X,
  Wifi,
} from "lucide-react"
import { telecomProviders } from "@/lib/mock/telecoms"

// ── Types ────────────────────────────────────────────────────────────────────

interface Bundle {
  id: string
  operator: string
  currency: string
  bundle_group: string
  bundle_name: string
  price: number
  validity_value: number
  validity_unit: string
  total_data_mb: number
  peak_data_mb?: number | null
  offpeak_data_mb?: number | null
  extras?: string | null
  ussd_code?: string | null
  // editing state
  _editing?: boolean
  _dirty?: boolean
}

interface VoiceRate {
  id: string
  operator: string
  bundle_group: string
  bundle_name: string
  price: number
  validity_value: number
  validity_unit: string
  onnet_min_count?: number | null
  offnet_min_count?: number | null
  sms_count?: number | null
  extras?: string | null
  ussd_code?: string | null
  _editing?: boolean
  _dirty?: boolean
}

interface Provider {
  id: string
  name: string
  type: string
  networkType: string
  bundles: Bundle[]
  voiceRates: VoiceRate[]
}

type ViewType = "data" | "voice" | "fees" | "packages"
type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

// ── Telecom Provider colours ─────────────────────────────────────────────────

const providerColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  econet:       { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/30",    dot: "bg-red-400"    },
  netone:       { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/30",  dot: "bg-green-400"  },
  telecel:      { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/30",   dot: "bg-blue-400"   },
  telone:       { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", dot: "bg-yellow-400" },
  liquid:       { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", dot: "bg-purple-400" },
  utande:       { bg: "bg-teal-500/10",   text: "text-teal-400",   border: "border-teal-500/30",   dot: "bg-teal-400"   },
  dandemutande: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" },
}

const getProviderColor = (id: string) =>
  providerColors[id] ?? { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", dot: "bg-primary" }

// ── Formatters ────────────────────────────────────────────────────────────────

const formatData = (mb: number) => {
  if (!mb) return "—"
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

// ── Empty form templates ──────────────────────────────────────────────────────

const emptyBundle = (operator: string): Omit<Bundle, "id"> => ({
  operator,
  currency: "USD",
  bundle_group: "monthly",
  bundle_name: "",
  price: 0,
  validity_value: 30,
  validity_unit: "days",
  total_data_mb: 0,
  peak_data_mb: null,
  offpeak_data_mb: null,
  extras: null,
  ussd_code: null,
  _editing: true,
  _dirty: true,
})

const emptyVoice = (operator: string): Omit<VoiceRate, "id"> => ({
  operator,
  bundle_group: "voice",
  bundle_name: "",
  price: 0,
  validity_value: 30,
  validity_unit: "days",
  onnet_min_count: null,
  offnet_min_count: null,
  sms_count: null,
  extras: null,
  ussd_code: null,
  _editing: true,
  _dirty: true,
})

// ── Static fee data (editable in UI) ─────────────────────────────────────────

interface FeeEntry {
  id: string
  provider: string
  providerId: string
  category: "activation" | "topup" | "roaming" | "hidden"
  name: string
  amount: number
  unit: string
  note: string
  _dirty?: boolean
}

const defaultFees: FeeEntry[] = [
  { id: "f1",  providerId: "econet",  provider: "Econet Wireless",  category: "activation", name: "SIM Card Purchase",    amount: 1.00,  unit: "once",      note: "" },
  { id: "f2",  providerId: "econet",  provider: "Econet Wireless",  category: "activation", name: "SIM Replacement",      amount: 2.00,  unit: "once",      note: "" },
  { id: "f3",  providerId: "netone",  provider: "NetOne",           category: "activation", name: "SIM Card Purchase",    amount: 0.50,  unit: "once",      note: "" },
  { id: "f4",  providerId: "telecel", provider: "Telecel",          category: "activation", name: "SIM Card Purchase",    amount: 0.50,  unit: "once",      note: "" },
  { id: "f5",  providerId: "telone",  provider: "TelOne",           category: "activation", name: "Fibre Installation",   amount: 50.00, unit: "once",      note: "Standard installation" },
  { id: "f6",  providerId: "liquid",  provider: "Liquid Telecom",   category: "activation", name: "Fibre Installation",   amount: 75.00, unit: "once",      note: "Includes router" },
  { id: "f7",  providerId: "econet",  provider: "Econet Wireless",  category: "topup",      name: "Agent Top-up Fee",     amount: 0.10,  unit: "per txn",   note: "Some agents charge extra" },
  { id: "f8",  providerId: "econet",  provider: "Econet Wireless",  category: "topup",      name: "Bank Top-up Fee",      amount: 0.05,  unit: "per txn",   note: "" },
  { id: "f9",  providerId: "netone",  provider: "NetOne",           category: "topup",      name: "Agent Top-up Fee",     amount: 0.05,  unit: "per txn",   note: "" },
  { id: "f10", providerId: "telecel", provider: "Telecel",          category: "topup",      name: "Top-up Fee",           amount: 0.00,  unit: "free",      note: "No additional fees" },
  { id: "f11", providerId: "econet",  provider: "Econet Wireless",  category: "roaming",    name: "SA Roaming Data/MB",   amount: 0.50,  unit: "per MB",    note: "South Africa" },
  { id: "f12", providerId: "econet",  provider: "Econet Wireless",  category: "roaming",    name: "SA Roaming Calls/min", amount: 1.50,  unit: "per min",   note: "South Africa" },
  { id: "f13", providerId: "netone",  provider: "NetOne",           category: "roaming",    name: "SA Roaming Data/MB",   amount: 0.60,  unit: "per MB",    note: "South Africa" },
  { id: "f14", providerId: "econet",  provider: "Econet Wireless",  category: "hidden",     name: "Out-of-bundle rate",   amount: 0.20,  unit: "per MB",    note: "Charged when bundle expires" },
  { id: "f15", providerId: "netone",  provider: "NetOne",           category: "hidden",     name: "Out-of-bundle rate",   amount: 0.15,  unit: "per MB",    note: "Charged when bundle expires" },
  { id: "f16", providerId: "telecel", provider: "Telecel",          category: "hidden",     name: "Out-of-bundle rate",   amount: 0.18,  unit: "per MB",    note: "Charged when bundle expires" },
  { id: "f17", providerId: "telone",  provider: "TelOne",           category: "hidden",     name: "Late payment penalty", amount: 5.00,  unit: "per month", note: "After 7 days overdue" },
  { id: "f18", providerId: "liquid",  provider: "Liquid Telecom",   category: "hidden",     name: "Early termination",    amount: 100.00, unit: "once",     note: "Contract break fee" },
]

// ── Main Component ────────────────────────────────────────────────────────────

export default function TelecomPricingAdmin() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState<string>("econet")
  const [activeView, setActiveView] = useState<ViewType>("data")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [fees, setFees] = useState<FeeEntry[]>(defaultFees)
  const [feeCategory, setFeeCategory] = useState<FeeEntry["category"]>("activation")
  const [hasUnsaved, setHasUnsaved] = useState(false)

  // ── Auth guard ─────────────────────────────────────────────────────────────

  const selectedRole =
    typeof window !== "undefined" ? (localStorage.getItem("selectedRole") ?? role) : role

  // ── Toasts ─────────────────────────────────────────────────────────────────

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  // ── Fetch data ─────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/telecom-pricing")
      if (!res.ok) throw new Error("Failed to fetch")
      const { providers: dbProviders } = await res.json()
      setProviders(
        dbProviders.map((p: any) => ({
          ...p,
          bundles: (p.bundles || []).map((b: any) => ({ ...b, _editing: false, _dirty: false })),
          voiceRates: (p.voiceRates || []).map((v: any) => ({ ...v, _editing: false, _dirty: false })),
        }))
      )
    } catch {
      // Fall back to mock data so the page is always usable
      const mockProviders = telecomProviders.map((p) => ({
        ...p,
        bundles: [],
        voiceRates: [],
      }))
      setProviders(mockProviders as any)
      addToast("Using mock data — database unavailable", "info")
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Derived state ──────────────────────────────────────────────────────────

  const selectedProvider = providers.find((p) => p.id === selectedProviderId)
  const pColor = getProviderColor(selectedProviderId)

  const filteredBundles = (selectedProvider?.bundles ?? []).filter((b) =>
    !searchQuery || b.bundle_name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredVoice = (selectedProvider?.voiceRates ?? []).filter((v) =>
    !searchQuery || v.bundle_name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredFees = fees.filter(
    (f) => f.providerId === selectedProviderId && f.category === feeCategory
  )

  // ── Mutation helpers ───────────────────────────────────────────────────────

  const updateBundle = (bundleId: string, field: keyof Bundle, value: any) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id !== selectedProviderId
          ? p
          : {
              ...p,
              bundles: p.bundles.map((b) =>
                b.id !== bundleId ? b : { ...b, [field]: value, _dirty: true }
              ),
            }
      )
    )
    setHasUnsaved(true)
  }

  const updateVoice = (voiceId: string, field: keyof VoiceRate, value: any) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id !== selectedProviderId
          ? p
          : {
              ...p,
              voiceRates: p.voiceRates.map((v) =>
                v.id !== voiceId ? v : { ...v, [field]: value, _dirty: true }
              ),
            }
      )
    )
    setHasUnsaved(true)
  }

  const updateFee = (feeId: string, field: keyof FeeEntry, value: any) => {
    setFees((prev) =>
      prev.map((f) => (f.id !== feeId ? f : { ...f, [field]: value, _dirty: true }))
    )
    setHasUnsaved(true)
  }

  // ── Save handlers ──────────────────────────────────────────────────────────

  const saveBundle = async (bundle: Bundle) => {
    setSaving(bundle.id)
    try {
      const isNew = bundle.id.startsWith("NEW_")
      const method = isNew ? "POST" : "PUT"
      const body = isNew
        ? { type: "bundle", data: bundle }
        : { type: "bundle", id: bundle.id, updates: bundle }
      const res = await fetch("/api/admin/telecom-pricing", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      addToast(`Bundle "${bundle.bundle_name}" saved successfully`, "success")
      await fetchData()
    } catch (e: any) {
      addToast(`Failed to save bundle: ${e.message}`, "error")
    } finally {
      setSaving(null)
    }
  }

  const saveVoice = async (rate: VoiceRate) => {
    setSaving(rate.id)
    try {
      const isNew = rate.id.startsWith("NEW_")
      const method = isNew ? "POST" : "PUT"
      const body = isNew
        ? { type: "voice", data: rate }
        : { type: "voice", id: rate.id, updates: rate }
      const res = await fetch("/api/admin/telecom-pricing", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      addToast(`Voice rate "${rate.bundle_name}" saved successfully`, "success")
      await fetchData()
    } catch (e: any) {
      addToast(`Failed to save voice rate: ${e.message}`, "error")
    } finally {
      setSaving(null)
    }
  }

  const deleteBundle = async (bundleId: string, name: string) => {
    if (!confirm(`Delete bundle "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/telecom-pricing?type=bundle&id=${bundleId}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      addToast(`Bundle "${name}" deleted`, "success")
      await fetchData()
    } catch (e: any) {
      addToast(`Delete failed: ${e.message}`, "error")
    }
  }

  const deleteVoice = async (voiceId: string, name: string) => {
    if (!confirm(`Delete voice rate "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/telecom-pricing?type=voice&id=${voiceId}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      addToast(`Voice rate "${name}" deleted`, "success")
      await fetchData()
    } catch (e: any) {
      addToast(`Delete failed: ${e.message}`, "error")
    }
  }

  const addNewBundle = () => {
    const newBundle: Bundle = {
      ...emptyBundle(selectedProviderId),
      id: `NEW_${Date.now()}`,
    } as Bundle
    setProviders((prev) =>
      prev.map((p) =>
        p.id !== selectedProviderId ? p : { ...p, bundles: [...p.bundles, newBundle] }
      )
    )
  }

  const addNewVoice = () => {
    const newRate: VoiceRate = {
      ...emptyVoice(selectedProviderId),
      id: `NEW_${Date.now()}`,
    } as VoiceRate
    setProviders((prev) =>
      prev.map((p) =>
        p.id !== selectedProviderId ? p : { ...p, voiceRates: [...p.voiceRates, newRate] }
      )
    )
  }

  const addNewFee = () => {
    const newFee: FeeEntry = {
      id: `NEW_${Date.now()}`,
      providerId: selectedProviderId,
      provider: selectedProvider?.name ?? "",
      category: feeCategory,
      name: "",
      amount: 0,
      unit: "once",
      note: "",
      _dirty: true,
    }
    setFees((prev) => [...prev, newFee])
    setHasUnsaved(true)
  }

  const saveFees = () => {
    setFees((prev) => prev.map((f) => ({ ...f, _dirty: false })))
    setHasUnsaved(false)
    addToast("Fees & charges saved locally", "success")
  }

  // ── Render guards ──────────────────────────────────────────────────────────

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (selectedRole !== "admin" && role !== "admin") {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-lg font-medium text-foreground">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground">
          Select System Admin from the interface selection screen to access this page.
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

  // ── Nav tabs ───────────────────────────────────────────────────────────────

  const navTabs: { key: ViewType; label: string; icon: React.ReactNode }[] = [
    { key: "data",     label: "Data Bundles",    icon: <Database className="h-4 w-4" /> },
    { key: "voice",    label: "Voice & SMS",      icon: <Mic2 className="h-4 w-4" /> },
    { key: "fees",     label: "Fees & Charges",   icon: <DollarSign className="h-4 w-4" /> },
    { key: "packages", label: "Packages & Promos",icon: <Package className="h-4 w-4" /> },
  ]

  const feeCategories = [
    { key: "activation" as const, label: "Activation & SIM" },
    { key: "topup"      as const, label: "Top-up Fees" },
    { key: "roaming"    as const, label: "Roaming" },
    { key: "hidden"     as const, label: "Hidden Costs" },
  ]

  // ── Content renderer ───────────────────────────────────────────────────────

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-24 gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading pricing data…</span>
        </div>
      )
    }

    // ── DATA BUNDLES ──────────────────────────────────────────────────────────
    if (activeView === "data") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {filteredBundles.length} bundle{filteredBundles.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={addNewBundle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Bundle
            </button>
          </div>

          {filteredBundles.length === 0 ? (
            <EmptyState message="No data bundles found for this provider" onAdd={addNewBundle} />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    {["Bundle Name","Group","Price (USD)","Data","Validity","Peak","Off-Peak","USSD","Extras","Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBundles.map((b) => (
                    <tr
                      key={b.id}
                      className={cn(
                        "border-b border-white/5 transition-colors group/row",
                        b._dirty ? "bg-amber-500/5 border-l-2 border-l-amber-500/50" : "hover:bg-white/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <EditableCell
                          value={b.bundle_name}
                          onChange={(v) => updateBundle(b.id, "bundle_name", v)}
                          placeholder="Bundle name"
                          className="font-semibold text-foreground"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <SelectCell
                          value={b.bundle_group}
                          onChange={(v) => updateBundle(b.id, "bundle_group", v)}
                          options={["daily","weekly","monthly","night","social","unlimited","internet"]}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={b.price}
                          onChange={(v) => updateBundle(b.id, "price", parseFloat(v) || 0)}
                          type="number"
                          prefix="$"
                          className="text-primary font-bold tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <EditableCell
                            value={b.total_data_mb}
                            onChange={(v) => updateBundle(b.id, "total_data_mb", parseFloat(v) || 0)}
                            type="number"
                            className="w-16 tabular-nums"
                          />
                          <span className="text-muted-foreground text-[9px] uppercase">MB</span>
                          <span className="text-muted-foreground/40 text-[9px]">({formatData(b.total_data_mb)})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <EditableCell
                            value={b.validity_value}
                            onChange={(v) => updateBundle(b.id, "validity_value", parseInt(v) || 0)}
                            type="number"
                            className="w-12 tabular-nums"
                          />
                          <SelectCell
                            value={b.validity_unit}
                            onChange={(v) => updateBundle(b.id, "validity_unit", v)}
                            options={["hours","days","weeks","months"]}
                            className="w-20"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={b.peak_data_mb ?? ""}
                          onChange={(v) => updateBundle(b.id, "peak_data_mb", v ? parseFloat(v) : null)}
                          type="number"
                          placeholder="—"
                          className="w-16 tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={b.offpeak_data_mb ?? ""}
                          onChange={(v) => updateBundle(b.id, "offpeak_data_mb", v ? parseFloat(v) : null)}
                          type="number"
                          placeholder="—"
                          className="w-16 tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={b.ussd_code ?? ""}
                          onChange={(v) => updateBundle(b.id, "ussd_code", v || null)}
                          placeholder="*123#"
                          className="font-mono"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={b.extras ?? ""}
                          onChange={(v) => updateBundle(b.id, "extras", v || null)}
                          placeholder="Optional extras…"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <ActionButton
                            onClick={() => saveBundle(b)}
                            disabled={!b._dirty || saving === b.id}
                            loading={saving === b.id}
                            icon={<Save className="h-3.5 w-3.5" />}
                            variant="save"
                            title="Save changes"
                          />
                          <ActionButton
                            onClick={() => deleteBundle(b.id, b.bundle_name)}
                            icon={<Trash2 className="h-3.5 w-3.5" />}
                            variant="delete"
                            title="Delete bundle"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
    }

    // ── VOICE & SMS ───────────────────────────────────────────────────────────
    if (activeView === "voice") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {filteredVoice.length} rate{filteredVoice.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={addNewVoice}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Rate
            </button>
          </div>

          {filteredVoice.length === 0 ? (
            <EmptyState message="No voice rates found for this provider" onAdd={addNewVoice} />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    {["Rate Name","Group","Price (USD)","Validity","On-net Mins","Off-net Mins","SMS","USSD","Extras","Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVoice.map((v) => (
                    <tr
                      key={v.id}
                      className={cn(
                        "border-b border-white/5 transition-colors",
                        v._dirty ? "bg-amber-500/5 border-l-2 border-l-amber-500/50" : "hover:bg-white/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <EditableCell
                          value={v.bundle_name}
                          onChange={(val) => updateVoice(v.id, "bundle_name", val)}
                          placeholder="Rate name"
                          className="font-semibold text-foreground"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <SelectCell
                          value={v.bundle_group}
                          onChange={(val) => updateVoice(v.id, "bundle_group", val)}
                          options={["voice","sms","combo","onnet","offnet","international"]}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={v.price}
                          onChange={(val) => updateVoice(v.id, "price", parseFloat(val) || 0)}
                          type="number"
                          prefix="$"
                          className="text-primary font-bold tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <EditableCell
                            value={v.validity_value}
                            onChange={(val) => updateVoice(v.id, "validity_value", parseInt(val) || 0)}
                            type="number"
                            className="w-12 tabular-nums"
                          />
                          <SelectCell
                            value={v.validity_unit}
                            onChange={(val) => updateVoice(v.id, "validity_unit", val)}
                            options={["hours","days","weeks","months"]}
                            className="w-20"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={v.onnet_min_count ?? ""}
                          onChange={(val) => updateVoice(v.id, "onnet_min_count", val ? parseFloat(val) : null)}
                          type="number"
                          placeholder="—"
                          className="w-16 tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={v.offnet_min_count ?? ""}
                          onChange={(val) => updateVoice(v.id, "offnet_min_count", val ? parseFloat(val) : null)}
                          type="number"
                          placeholder="—"
                          className="w-16 tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={v.sms_count ?? ""}
                          onChange={(val) => updateVoice(v.id, "sms_count", val ? parseFloat(val) : null)}
                          type="number"
                          placeholder="—"
                          className="w-16 tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={v.ussd_code ?? ""}
                          onChange={(val) => updateVoice(v.id, "ussd_code", val || null)}
                          placeholder="*123#"
                          className="font-mono"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={v.extras ?? ""}
                          onChange={(val) => updateVoice(v.id, "extras", val || null)}
                          placeholder="Optional…"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <ActionButton
                            onClick={() => saveVoice(v)}
                            disabled={!v._dirty || saving === v.id}
                            loading={saving === v.id}
                            icon={<Save className="h-3.5 w-3.5" />}
                            variant="save"
                            title="Save changes"
                          />
                          <ActionButton
                            onClick={() => deleteVoice(v.id, v.bundle_name)}
                            icon={<Trash2 className="h-3.5 w-3.5" />}
                            variant="delete"
                            title="Delete rate"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
    }

    // ── FEES & CHARGES ────────────────────────────────────────────────────────
    if (activeView === "fees") {
      return (
        <div className="space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-2 flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner w-full sm:w-auto">
            {feeCategories.map((c) => (
              <button
                key={c.key}
                onClick={() => setFeeCategory(c.key)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                  feeCategory === c.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {filteredFees.length} fee{filteredFees.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-2">
              <button
                onClick={addNewFee}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Fee
              </button>
              {hasUnsaved && (
                <button
                  onClick={saveFees}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save All Fees
                </button>
              )}
            </div>
          </div>

          {filteredFees.length === 0 ? (
            <EmptyState message="No fees in this category for this provider" onAdd={addNewFee} />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    {["Fee Name","Amount (USD)","Unit","Note",""].map((h, i) => (
                      <th key={i} className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFees.map((f) => (
                    <tr
                      key={f.id}
                      className={cn(
                        "border-b border-white/5 transition-colors",
                        f._dirty ? "bg-amber-500/5 border-l-2 border-l-amber-500/50" : "hover:bg-white/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <EditableCell
                          value={f.name}
                          onChange={(v) => updateFee(f.id, "name", v)}
                          placeholder="Fee name"
                          className="font-semibold text-foreground"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={f.amount}
                          onChange={(v) => updateFee(f.id, "amount", parseFloat(v) || 0)}
                          type="number"
                          prefix="$"
                          className="text-primary font-bold tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <SelectCell
                          value={f.unit}
                          onChange={(v) => updateFee(f.id, "unit", v)}
                          options={["once","per txn","per MB","per min","per month","free","varies","N/A"]}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          value={f.note}
                          onChange={(v) => updateFee(f.id, "note", v)}
                          placeholder="Optional note…"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setFees((prev) => prev.filter((x) => x.id !== f.id))}
                          className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Remove fee"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
    }

    // ── PACKAGES & PROMOS ─────────────────────────────────────────────────────
    if (activeView === "packages") {
      return <PackagesView providerId={selectedProviderId} providerName={selectedProvider?.name ?? ""} addToast={addToast} />
    }
  }

  // ── Main layout ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 relative">

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-medium backdrop-blur-xl animate-in slide-in-from-right-8 duration-300",
              t.type === "success" && "bg-emerald-900/80 border-emerald-500/30 text-emerald-300",
              t.type === "error"   && "bg-red-900/80 border-red-500/30 text-red-300",
              t.type === "info"    && "bg-slate-900/80 border-white/10 text-muted-foreground"
            )}
          >
            {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {t.type === "error"   && <AlertCircle  className="h-4 w-4 text-red-400 shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <RadioTower className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-foreground">Telecom Pricing Manager</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Admin · Update prices for all telecom service providers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsaved && (
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full animate-pulse">
              Unsaved Changes
            </span>
          )}
          <button
            onClick={fetchData}
            className="flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-primary/30 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-primary/30 transition-all"
          >
            <HomeIcon className="h-3.5 w-3.5" />
            Admin Home
          </button>
        </div>
      </div>

      {/* Provider Selector */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Select Telecom Provider
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {(providers.length > 0 ? providers : telecomProviders).map((p) => {
            const col = getProviderColor(p.id)
            const isSelected = p.id === selectedProviderId
            const bundleCount = providers.find((x) => x.id === p.id)?.bundles.length ?? 0
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedProviderId(p.id); setSearchQuery("") }}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-center group",
                  isSelected
                    ? cn(col.bg, col.border, "shadow-lg scale-[1.02]")
                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  isSelected ? cn(col.bg, col.border, "border") : "bg-white/5 border border-white/10"
                )}>
                  <Wifi className={cn("h-5 w-5", isSelected ? col.text : "text-muted-foreground")} />
                </div>
                <div>
                  <p className={cn("text-[10px] font-bold uppercase tracking-tight leading-tight", isSelected ? col.text : "text-muted-foreground")}>
                    {p.name}
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5">{(p as any).type ?? "MNO"}</p>
                </div>
                {bundleCount > 0 && (
                  <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded-full", col.bg, col.text, "border", col.border)}>
                    {bundleCount} bundles
                  </span>
                )}
                {isSelected && (
                  <div className={cn("absolute top-2 right-2 w-2 h-2 rounded-full", col.dot, "shadow-lg")} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Provider Summary Bar */}
      {selectedProvider && (
        <div className={cn(
          "rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4",
          pColor.bg, pColor.border
        )}>
          <div className="flex items-center gap-3 flex-1">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", pColor.bg, "border", pColor.border)}>
              <RadioTower className={cn("h-4 w-4", pColor.text)} />
            </div>
            <div>
              <p className={cn("text-sm font-bold", pColor.text)}>{selectedProvider.name}</p>
              <p className="text-[10px] text-muted-foreground">{(selectedProvider as any).networkType ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className={cn("text-lg font-display font-bold tabular-nums", pColor.text)}>{selectedProvider.bundles.length}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Data Bundles</p>
            </div>
            <div>
              <p className={cn("text-lg font-display font-bold tabular-nums", pColor.text)}>{selectedProvider.voiceRates.length}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Voice Rates</p>
            </div>
            <div>
              <p className={cn("text-lg font-display font-bold tabular-nums", pColor.text)}>
                {fees.filter((f) => f.providerId === selectedProviderId).length}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Fees</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-gradient-to-r from-white/5 via-white/[0.03] to-white/5 p-3 rounded-2xl border border-white/10 shadow-inner">
        {navTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300",
              activeView === tab.key
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      {(activeView === "data" || activeView === "voice") && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeView === "data" ? "bundles" : "voice rates"}…`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Help hint for amber rows */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
        <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30" />
        <span>Highlighted rows have unsaved changes — click <strong>Save</strong> to persist to database</span>
      </div>

      {/* Main content */}
      {renderContent()}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EditableCell({
  value,
  onChange,
  type = "text",
  placeholder = "",
  prefix,
  className = "",
}: {
  value: string | number
  onChange: (v: string) => void
  type?: "text" | "number"
  placeholder?: string
  prefix?: string
  className?: string
}) {
  return (
    <div className="flex items-center gap-1">
      {prefix && <span className="text-muted-foreground text-[10px]">{prefix}</span>}
      <input
        type={type}
        value={value === null || value === undefined ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
        className={cn(
          "bg-transparent border-b border-transparent hover:border-white/20 focus:border-primary/50 focus:outline-none text-xs py-0.5 min-w-0 transition-colors",
          type === "number" ? "w-20" : "w-full min-w-[80px]",
          className
        )}
      />
    </div>
  )
}

function SelectCell({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all hover:bg-white/10 appearance-none cursor-pointer",
        className
      )}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-slate-900 text-foreground">{o}</option>
      ))}
    </select>
  )
}

function ActionButton({
  onClick,
  icon,
  variant,
  title,
  disabled = false,
  loading = false,
}: {
  onClick: () => void
  icon: React.ReactNode
  variant: "save" | "delete"
  title: string
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-all",
        variant === "save" && !disabled && "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300",
        variant === "save" && disabled  && "text-muted-foreground/30 cursor-not-allowed",
        variant === "delete" && "text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
      )}
    >
      {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : icon}
    </button>
  )
}

function EmptyState({ message, onAdd }: { message: string; onAdd: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-white/10 p-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
        <Database className="h-7 w-7 text-muted-foreground/40" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-2">{message}</h3>
      <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto">
        Upload data via the scraper or add entries manually below.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
      >
        <Plus className="h-3.5 w-3.5" />
        Add First Entry
      </button>
    </div>
  )
}

// ── Packages & Promos sub-view ────────────────────────────────────────────────

const defaultPromos = [
  { id: "pr1", providerId: "econet",  provider: "Econet Wireless",  name: "Weekend Data Blast",     detail: "Double data on all bundles purchased Friday–Sunday", validUntil: "2026-03-31", active: true },
  { id: "pr2", providerId: "netone",  provider: "NetOne",           name: "OneFusion Family",        detail: "Share data across 5 lines with OneFusion packages",   validUntil: "2026-04-15", active: true },
  { id: "pr3", providerId: "telecel", provider: "Telecel",          name: "Night Data x3",           detail: "Triple night data on all night bundles",               validUntil: "2026-02-28", active: false },
  { id: "pr4", providerId: "telone",  provider: "TelOne",           name: "Fibre Upgrade Free",      detail: "Free speed upgrade for 3 months on new fibre installs", validUntil: "2026-03-15", active: true },
  { id: "pr5", providerId: "liquid",  provider: "Liquid Telecom",   name: "Business Fibre Discount", detail: "20% off first 6 months for SME fibre plans",           validUntil: "2026-04-30", active: true },
]

function PackagesView({
  providerId,
  providerName,
  addToast,
}: {
  providerId: string
  providerName: string
  addToast: (msg: string, type: ToastType) => void
}) {
  const [promos, setPromos] = useState(defaultPromos)
  const col = getProviderColor(providerId)

  const filtered = promos.filter((p) => p.providerId === providerId)

  const update = (id: string, field: string, value: any) => {
    setPromos((prev) => prev.map((p) => (p.id !== id ? p : { ...p, [field]: value })))
  }

  const addPromo = () => {
    const newPromo = {
      id: `NEW_${Date.now()}`,
      providerId,
      provider: providerName,
      name: "",
      detail: "",
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      active: true,
    }
    setPromos((prev) => [...prev, newPromo])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{filtered.length} package / promo{filtered.length !== 1 ? "s" : ""}</p>
        <div className="flex gap-2">
          <button
            onClick={addPromo}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Promo
          </button>
          <button
            onClick={() => addToast("Packages & promos saved", "success")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
          >
            <Save className="h-3.5 w-3.5" />
            Save All
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No packages or promos for this provider" onAdd={addPromo} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pr) => (
            <div
              key={pr.id}
              className={cn(
                "rounded-2xl border p-5 space-y-4 transition-all group relative",
                pr.active ? cn(col.bg, col.border) : "border-white/5 bg-white/[0.02] opacity-60"
              )}
            >
              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", pr.active ? cn(col.bg, col.text, "border", col.border) : "bg-white/5 text-muted-foreground border border-white/10")}>
                  {pr.active ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => update(pr.id, "active", !pr.active)}
                  className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {pr.active ? "Deactivate" : "Activate"}
                </button>
              </div>

              {/* Promo name */}
              <input
                type="text"
                value={pr.name}
                onChange={(e) => update(pr.id, "name", e.target.value)}
                placeholder="Promo name…"
                className="w-full bg-transparent border-b border-white/10 focus:border-primary/50 focus:outline-none text-sm font-bold text-foreground py-1 transition-colors"
              />

              {/* Detail */}
              <textarea
                value={pr.detail}
                onChange={(e) => update(pr.id, "detail", e.target.value)}
                placeholder="Promo description…"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none transition-all"
              />

              {/* Valid until */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Valid until:</span>
                <input
                  type="date"
                  value={pr.validUntil}
                  onChange={(e) => update(pr.id, "validUntil", e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              {/* Delete */}
              <button
                onClick={() => setPromos((prev) => prev.filter((x) => x.id !== pr.id))}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
