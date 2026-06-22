"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  School,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Loader2,
} from "lucide-react"

interface SchoolRecord {
  id?: number
  schoolName: string
  location: string
  schoolType: string
  province: string
  tuitionFee: number
  currency: string
  admissionFee: number | null
  boardingFee: number | null
  uniformCost: number | null
  booksCost: number | null
  examFee: number | null
  passRate: number
  numberOfTerms: number
  annualFee: number
  normalised: number | null
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

const initialForm = (): SchoolRecord => ({
  schoolName: "",
  location: "",
  schoolType: "day",
  province: "",
  tuitionFee: 0,
  currency: "USD",
  admissionFee: null,
  boardingFee: null,
  uniformCost: null,
  booksCost: null,
  examFee: null,
  passRate: 0,
  numberOfTerms: 3,
  annualFee: 0,
  normalised: null,
})

export default function SchoolsCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [records, setRecords] = useState<SchoolRecord[]>([])
  const [schoolQuery, setSchoolQuery] = useState("")
  const [schoolFocused, setSchoolFocused] = useState(false)
  const [form, setForm] = useState<SchoolRecord>(initialForm())
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
      const res = await fetch("/api/schools/manual")
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
    if (!form.schoolName.trim()) { addToast("School Name is required.", "error"); return }
    if (!form.location.trim()) { addToast("Location is required.", "error"); return }
    if (form.annualFee <= 0) { addToast("Annual Fee must be greater than 0.", "error"); return }

    // Step 1: Calculate normalisation
    const norm = (form.passRate * form.numberOfTerms) / form.annualFee
    // Update the on-screen field immediately
    setForm((prev) => ({ ...prev, normalised: norm }))

    // Step 2: Save to DB with calculated normalised value
    setIsSaving(true)
    try {
      const payload = { ...form, normalised: norm, id: editingId ?? undefined }
      const res = await fetch("/api/schools/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Unknown error")

      addToast(editingId ? "School record updated." : "School record added.", "success")
      setEditingId(null)
      setForm(initialForm())
      await loadRecords()
    } catch (err: any) {
      addToast(err.message ?? "Failed to save record.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (rec: SchoolRecord) => {
    setEditingId(rec.id ?? null)
    setForm({ ...rec })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(initialForm())
    addToast("Edit cancelled.", "info")
  }

  const setField = (key: keyof SchoolRecord, value: any) => {
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
            <GraduationCap className="w-8 h-8 text-primary" />
            Schools Input
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Manually enter school fee data. Normalised Score = (Pass Rate × Terms) / Annual Fee — higher score means better academic value per dollar.
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
                <BookOpen className="w-3.5 h-3.5" /> School Data
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">

                {/* School Name combobox */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    School Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolFocused ? schoolQuery : form.schoolName}
                    onChange={(e) => {
                      setSchoolQuery(e.target.value)
                      setField("schoolName", e.target.value)
                    }}
                    onFocus={() => {
                      setSchoolFocused(true)
                      setSchoolQuery(form.schoolName)
                    }}
                    onBlur={() => setTimeout(() => setSchoolFocused(false), 150)}
                    placeholder="Select or type school name…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  {schoolFocused && (
                    <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#0d1117] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-44 overflow-y-auto">
                      {[...new Set(records.map((r) => r.schoolName))]
                        .filter((name) =>
                          name.toLowerCase().includes(schoolQuery.toLowerCase())
                        )
                        .map((name) => (
                          <button
                            key={name}
                            type="button"
                            onMouseDown={() => {
                              setField("schoolName", name)
                              setSchoolQuery(name)
                              setSchoolFocused(false)
                            }}
                            className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/10 transition-colors"
                          >
                            {name}
                          </button>
                        ))}
                      {schoolQuery &&
                        !records.some(
                          (r) => r.schoolName.toLowerCase() === schoolQuery.toLowerCase()
                        ) && (
                          <div className="px-3.5 py-2 text-[10px] text-muted-foreground border-t border-white/5">
                            New school:{" "}
                            <span className="text-primary">{schoolQuery}</span>
                          </div>
                        )}
                    </div>
                  )}
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
                    placeholder="e.g. Harare"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* School Type */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    School Type
                  </label>
                  <select
                    value={form.schoolType}
                    onChange={(e) => setField("schoolType", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="day" className="bg-[#111]">Day</option>
                    <option value="boarding" className="bg-[#111]">Boarding</option>
                    <option value="both" className="bg-[#111]">Day & Boarding</option>
                  </select>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setField("province", e.target.value)}
                    placeholder="e.g. Mashonaland East"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Tuition Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Tuition Fee <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.tuitionFee || ""}
                    onChange={(e) => setField("tuitionFee", parseFloat(e.target.value) || 0)}
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
                    placeholder="e.g. USD, ZIG"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Admission Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Admission Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.admissionFee ?? ""}
                    onChange={(e) => setField("admissionFee", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Boarding Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Boarding Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.boardingFee ?? ""}
                    onChange={(e) => setField("boardingFee", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Uniform Cost */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Uniform Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.uniformCost ?? ""}
                    onChange={(e) => setField("uniformCost", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Books Cost */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Books Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.booksCost ?? ""}
                    onChange={(e) => setField("booksCost", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Exam Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Exam Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.examFee ?? ""}
                    onChange={(e) => setField("examFee", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Pass Rate */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Pass Rate (%) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={form.passRate || ""}
                    onChange={(e) => setField("passRate", parseFloat(e.target.value) || 0)}
                    placeholder="0 – 100"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Number of Terms */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Number of Terms <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.numberOfTerms || ""}
                    onChange={(e) => setField("numberOfTerms", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Annual Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Annual Fee (Total) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.annualFee || ""}
                    onChange={(e) => setField("annualFee", parseFloat(e.target.value) || 0)}
                    placeholder="Total yearly cost"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Normalised (read-only) */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Academic Value Score (Normalised)
                    <span className="ml-1 text-primary/60 normal-case font-normal">= PassRate × Terms / AnnualFee</span>
                  </label>
                  <input
                    type="number"
                    disabled
                    value={form.normalised ?? ""}
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
                      <th className="py-2 px-3">School</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3">Pass%</th>
                      <th className="py-2 px-3">Value Score</th>
                      <th className="py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {records.map((rec) => (
                      <tr
                        key={rec.id}
                        className="hover:bg-white/5 transition-colors text-xs text-white/80"
                      >
                        <td className="py-2 px-3 max-w-[120px] truncate">{rec.schoolName}</td>
                        <td className="py-2 px-3">{rec.location}</td>
                        <td className="py-2 px-3">{rec.passRate}%</td>
                        <td className="py-2 px-3">
                          {rec.normalised != null ? (
                            <span className="text-primary font-bold">{rec.normalised.toFixed(4)}</span>
                          ) : (
                            <span className="text-muted-foreground italic">—</span>
                          )}
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
                          No school records yet. Add one using the form.
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
