"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  Hotel,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Building,
  Loader2,
} from "lucide-react"

interface HotelRecord {
  id?: number
  hotelName: string
  location: string
  city: string
  stars: number
  pricePerNight: number
  currency: string
  type: string
  amenities: string
  rating: number
  reviewCount: number
  description: string
  recommended: boolean
  bestValue: boolean
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

const initialForm = (): HotelRecord => ({
  hotelName: "",
  location: "",
  city: "",
  stars: 3,
  pricePerNight: 0,
  currency: "USD",
  type: "hotel",
  amenities: "",
  rating: 0,
  reviewCount: 0,
  description: "",
  recommended: false,
  bestValue: false,
})

export default function HotelsCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [records, setRecords] = useState<HotelRecord[]>([])
  const [form, setForm] = useState<HotelRecord>(initialForm())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const selectedRole =
    typeof window !== "undefined"
      ? (localStorage.getItem("selectedRole") ?? role)
      : role

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadRecords = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/hotels/manual")
      const data = await res.json()
      setRecords(data.records ?? [])
    } catch {
      addToast("Failed to load existing records.", "error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.hotelName.trim()) { addToast("Hotel Name is required.", "error"); return }
    if (!form.location.trim()) { addToast("Location is required.", "error"); return }
    if (form.pricePerNight <= 0) { addToast("Price per night must be greater than 0.", "error"); return }

    setIsSaving(true)
    try {
      const payload = { ...form, id: editingId ?? undefined }
      const res = await fetch("/api/hotels/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Unknown error")

      addToast(editingId ? "Hotel record updated." : "Hotel record added.", "success")
      setEditingId(null)
      setForm(initialForm())
      await loadRecords()
    } catch (err: any) {
      addToast(err.message ?? "Failed to save record.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (rec: HotelRecord) => {
    setEditingId(rec.id ?? null)
    setForm({ ...rec })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(initialForm())
    addToast("Edit cancelled.", "info")
  }

  const setField = (key: keyof HotelRecord, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

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

  return (
    <div className="relative min-h-screen bg-background space-y-8 animate-in fade-in duration-700 pt-12 px-6 sm:px-10 pb-24 overflow-x-hidden">
      {/* Toast Notifications */}
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
            <Hotel className="w-8 h-8 text-primary" />
            Hotels Input
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Manually enter hotel pricing and amenities data to compare properties across Zimbabwe.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Form (LHS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-floating p-6 sm:p-8 space-y-6 relative border-white/10">
            {/* Tab Header */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-widest">
                <Building className="w-3.5 h-3.5" /> Hotel Data
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Hotel Name */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Hotel Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.hotelName}
                    onChange={(e) => setField("hotelName", e.target.value)}
                    placeholder="e.g. Meikles Hotel"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder="e.g. Jason Moyo Ave, Harare"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                
                {/* City */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder="e.g. Harare"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Property Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setField("type", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="hotel" className="bg-[#111]">Hotel</option>
                    <option value="lodge" className="bg-[#111]">Lodge</option>
                    <option value="resort" className="bg-[#111]">Resort</option>
                    <option value="bed_and_breakfast" className="bg-[#111]">Bed & Breakfast</option>
                  </select>
                </div>

                {/* Stars */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Stars
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.stars || ""}
                    onChange={(e) => setField("stars", parseInt(e.target.value) || 0)}
                    placeholder="1-5"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Price Per Night */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Price Per Night <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.pricePerNight || ""}
                    onChange={(e) => setField("pricePerNight", parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={form.currency}
                    onChange={(e) => setField("currency", e.target.value)}
                    placeholder="e.g. USD"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    User Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating || ""}
                    onChange={(e) => setField("rating", parseFloat(e.target.value) || 0)}
                    placeholder="0.0 - 5.0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Review Count */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Review Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.reviewCount || ""}
                    onChange={(e) => setField("reviewCount", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 150"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Amenities */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Amenities (JSON array)
                  </label>
                  <input
                    type="text"
                    value={form.amenities}
                    onChange={(e) => setField("amenities", e.target.value)}
                    placeholder='e.g. ["Pool", "Free WiFi", "Spa"]'
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                
                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Short description of the property"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                {/* Flags */}
                <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.recommended}
                            onChange={(e) => setField("recommended", e.target.checked)}
                            className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                        />
                        Recommended
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.bestValue}
                            onChange={(e) => setField("bestValue", e.target.checked)}
                            className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                        />
                        Best Value
                    </label>
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
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl teal-glow disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? "Update Record" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Entered Records (RHS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-floating p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Entered Records
            </h3>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <th className="py-2 px-3">Hotel</th>
                      <th className="py-2 px-3">City</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3">Stars</th>
                      <th className="py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {records.map((rec) => (
                      <tr
                        key={rec.id}
                        className="hover:bg-white/5 transition-colors text-xs text-white/80"
                      >
                        <td className="py-2 px-3 max-w-[120px] truncate">{rec.hotelName}</td>
                        <td className="py-2 px-3">{rec.city || "—"}</td>
                        <td className="py-2 px-3">
                            <span className="text-primary font-bold">${rec.pricePerNight}</span>
                        </td>
                        <td className="py-2 px-3">
                          {rec.stars > 0 ? "★".repeat(rec.stars) : "—"}
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleEdit(rec)}
                            className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {records.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground italic">
                          No hotel records yet. Add one using the form.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
