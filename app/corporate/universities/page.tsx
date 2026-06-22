"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  Loader2,
  Plus,
  Trash2,
  ListOrdered,
} from "lucide-react"

// ── Program entry ──────────────────────────────────────────────────────────────

interface ProgramEntry {
  programName: string
  fieldOfStudy: string
  qualification: string
  durationYears: number | ""
  annualFee: number | ""
  currency: string
}

const QUALIFICATION_OPTIONS = [
  "Certificate",
  "Diploma",
  "HND",
  "Bachelor's Degree",
  "Honours Degree",
  "Postgraduate Diploma",
  "Master's Degree",
  "PhD / Doctorate",
]

const blankProgram = (): ProgramEntry => ({
  programName: "",
  fieldOfStudy: "",
  qualification: "Bachelor's Degree",
  durationYears: "",
  annualFee: "",
  currency: "USD",
})

// ── University record ──────────────────────────────────────────────────────────

interface UniversityRecord {
  id?: number
  universityName: string
  location: string
  tuitionFee: number
  currency: string
  accommodationFee: number | null
  applicationFee: number | null
  labFee: number | null
  libraryFee: number | null
  studentUnionFee: number | null
  annualFee: number
  programmeDuration: number
  programmeMatch: number
  normalised: number | null
  programs?: ProgramEntry[]
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

const PROGRAMME_MATCH_OPTIONS = [
  { label: "Exact Match", value: 1 },
  { label: "Related Match", value: 0.5 },
  { label: "No Match", value: 0 },
]

const initialForm = (): UniversityRecord => ({
  universityName: "",
  location: "",
  tuitionFee: 0,
  currency: "USD",
  accommodationFee: null,
  applicationFee: null,
  labFee: null,
  libraryFee: null,
  studentUnionFee: null,
  annualFee: 0,
  programmeDuration: 0,
  programmeMatch: 1,
  normalised: null,
  programs: [],
})

// ── Zimbabwe Universities list ──────────────────────────────────────────────────

const ZIM_UNIVERSITIES = [
  "University of Zimbabwe",
  "National University of Science and Technology (NUST)",
  "Midlands State University (MSU)",
  "Great Zimbabwe University (GZU)",
  "Bindura University of Science Education (BUSE)",
  "Zimbabwe Open University (ZOU)",
  "Chinhoyi University of Technology (CUT)",
  "Harare Institute of Technology (HIT)",
  "Lupane State University (LSU)",
  "Women's University in Africa (WUA)",
  "Reformed Church University (RCU)",
  "Africa University (AU)",
  "Catholic University in Zimbabwe (CUZ)",
  "Zimbabwe Ezekiel Guti University (ZEGU)",
  "Marondera University of Agricultural Sciences and Technology (MUAST)",
  "Manicaland State University of Applied Sciences (MSUAS)",
  "University of Mount Kenya (Zimbabwe Campus)",
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function UniversitiesCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [records, setRecords] = useState<UniversityRecord[]>([])
  const [uniQuery, setUniQuery] = useState("")
  const [uniFocused, setUniFocused] = useState(false)
  const [form, setForm] = useState<UniversityRecord>(initialForm())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Programs sub-form state
  const [programs, setPrograms] = useState<ProgramEntry[]>([])
  const [newProgram, setNewProgram] = useState<ProgramEntry>(blankProgram())
  const [programTab, setProgramTab] = useState<"list" | "add">("list")

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
      const res = await fetch("/api/universities/manual")
      const data = await res.json()
      const loaded = (data.records ?? []).map((r: any) => ({
        ...r,
        programs: (() => {
          try { return JSON.parse(r.programs ?? "[]") } catch { return [] }
        })(),
      }))
      setRecords(loaded)
    } catch {
      addToast("Failed to load existing records.", "error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  // ── Program helpers ──────────────────────────────────────────────────────────

  const setProgramField = (key: keyof ProgramEntry, value: any) =>
    setNewProgram((prev) => ({ ...prev, [key]: value }))

  const addProgram = () => {
    if (!newProgram.programName.trim()) {
      addToast("Program name is required.", "error")
      return
    }
    setPrograms((prev) => [...prev, { ...newProgram }])
    setNewProgram(blankProgram())
    setProgramTab("list")
    addToast("Program added.", "info")
  }

  const removeProgram = (idx: number) => {
    setPrograms((prev) => prev.filter((_, i) => i !== idx))
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.universityName.trim()) { addToast("University Name is required.", "error"); return }
    if (!form.location.trim()) { addToast("Location is required.", "error"); return }
    const annualFee = form.annualFee
    const duration = form.programmeDuration
    if (annualFee <= 0) { addToast("Annual Fee must be greater than 0.", "error"); return }
    if (duration <= 0) { addToast("Programme Duration must be greater than 0.", "error"); return }

    const norm = form.programmeMatch / (annualFee * duration)
    setForm((prev) => ({ ...prev, normalised: norm }))

    setIsSaving(true)
    try {
      const payload = {
        ...form,
        normalised: norm,
        id: editingId ?? undefined,
        programs: JSON.stringify(programs),
      }
      const res = await fetch("/api/universities/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Unknown error")

      addToast(editingId ? "University record updated." : "University record added.", "success")
      setEditingId(null)
      setForm(initialForm())
      setPrograms([])
      await loadRecords()
    } catch (err: any) {
      addToast(err.message ?? "Failed to save record.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (rec: UniversityRecord) => {
    setEditingId(rec.id ?? null)
    setForm({ ...rec })
    setPrograms(rec.programs ?? [])
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(initialForm())
    setPrograms([])
    addToast("Edit cancelled.", "info")
  }

  const setField = (key: keyof UniversityRecord, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }))

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

  // Combine known universities with existing record names for autocomplete
  const knownUniNames = [
    ...new Set([
      ...ZIM_UNIVERSITIES,
      ...records.map((r) => r.universityName),
    ]),
  ]

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
            Universities Input
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Manually enter university fee data and program details. Normalised Score = Programme Match Score / (Annual Fee × Programme Duration) — higher means better cost efficiency.
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
                <BookOpen className="w-3.5 h-3.5" /> University Data
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">

                {/* University Name combobox */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    University Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={uniFocused ? uniQuery : form.universityName}
                    onChange={(e) => {
                      setUniQuery(e.target.value)
                      setField("universityName", e.target.value)
                    }}
                    onFocus={() => {
                      setUniFocused(true)
                      setUniQuery(form.universityName)
                    }}
                    onBlur={() => setTimeout(() => setUniFocused(false), 150)}
                    placeholder="Select or type university name…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  {uniFocused && (
                    <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#0d1117] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-44 overflow-y-auto">
                      {knownUniNames
                        .filter((name) =>
                          name.toLowerCase().includes(uniQuery.toLowerCase())
                        )
                        .map((name) => (
                          <button
                            key={name}
                            type="button"
                            onMouseDown={() => {
                              setField("universityName", name)
                              setUniQuery(name)
                              setUniFocused(false)
                            }}
                            className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/10 transition-colors"
                          >
                            {name}
                          </button>
                        ))}
                      {uniQuery &&
                        !knownUniNames.some(
                          (n) => n.toLowerCase() === uniQuery.toLowerCase()
                        ) && (
                          <div className="px-3.5 py-2 text-[10px] text-muted-foreground border-t border-white/5">
                            New university:{" "}
                            <span className="text-primary">{uniQuery}</span>
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

                {/* Accommodation Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Accommodation Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.accommodationFee ?? ""}
                    onChange={(e) => setField("accommodationFee", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Application Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Application Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.applicationFee ?? ""}
                    onChange={(e) => setField("applicationFee", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Lab Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Lab Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.labFee ?? ""}
                    onChange={(e) => setField("labFee", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Library Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Library Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.libraryFee ?? ""}
                    onChange={(e) => setField("libraryFee", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Student Union Fee */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Student Union Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.studentUnionFee ?? ""}
                    onChange={(e) => setField("studentUnionFee", e.target.value ? parseFloat(e.target.value) : null)}
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

                {/* Programme Duration */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Programme Duration (Years) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.programmeDuration || ""}
                    onChange={(e) => setField("programmeDuration", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 4"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Programme Match */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Programme Match <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={form.programmeMatch}
                    onChange={(e) => setField("programmeMatch", parseFloat(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {PROGRAMME_MATCH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#111]">
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Normalised (read-only) */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Cost Efficiency Score (Normalised)
                    <span className="ml-1 text-primary/60 normal-case font-normal">= Match / (AnnualFee × Duration)</span>
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

              {/* ── Programs Section ──────────────────────────────────────────────── */}
              <div className="border border-white/10 rounded-2xl overflow-hidden">
                {/* Programs header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                      Programs / Courses
                    </span>
                    {programs.length > 0 && (
                      <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                        {programs.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setProgramTab("list")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                        programTab === "list"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-white"
                      )}
                    >
                      List
                    </button>
                    <button
                      type="button"
                      onClick={() => setProgramTab("add")}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                        programTab === "add"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-white"
                      )}
                    >
                      <Plus className="w-3 h-3" /> Add Program
                    </button>
                  </div>
                </div>

                {/* Programs List */}
                {programTab === "list" && (
                  <div className="p-4">
                    {programs.length === 0 ? (
                      <div className="py-6 text-center text-[10px] text-muted-foreground italic">
                        No programs added yet. Click "Add Program" to add course details.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-muted-foreground">
                              <th className="py-2 px-2">Program</th>
                              <th className="py-2 px-2">Field</th>
                              <th className="py-2 px-2">Qualification</th>
                              <th className="py-2 px-2 text-right">Duration</th>
                              <th className="py-2 px-2 text-right">Annual Fee</th>
                              <th className="py-2 px-2"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {programs.map((prog, idx) => (
                              <tr key={idx} className="text-xs text-white/80 hover:bg-white/5 transition-colors">
                                <td className="py-2 px-2 font-medium max-w-[120px] truncate">{prog.programName}</td>
                                <td className="py-2 px-2 text-muted-foreground max-w-[90px] truncate">{prog.fieldOfStudy || "—"}</td>
                                <td className="py-2 px-2 text-muted-foreground">{prog.qualification}</td>
                                <td className="py-2 px-2 text-right tabular-nums">{prog.durationYears ? `${prog.durationYears}yr` : "—"}</td>
                                <td className="py-2 px-2 text-right tabular-nums text-primary font-mono text-[10px]">
                                  {prog.annualFee ? `${prog.currency} ${Number(prog.annualFee).toLocaleString()}` : "—"}
                                </td>
                                <td className="py-2 px-2">
                                  <button
                                    type="button"
                                    onClick={() => removeProgram(idx)}
                                    className="text-muted-foreground hover:text-red-400 transition-colors"
                                    title="Remove program"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Add Program Form */}
                {programTab === "add" && (
                  <div className="p-4 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">

                      {/* Program Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Program Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newProgram.programName}
                          onChange={(e) => setProgramField("programName", e.target.value)}
                          placeholder="e.g. BSc Computer Science"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {/* Field of Study */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={newProgram.fieldOfStudy}
                          onChange={(e) => setProgramField("fieldOfStudy", e.target.value)}
                          placeholder="e.g. Engineering, Business, Arts"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {/* Qualification */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Qualification
                        </label>
                        <select
                          value={newProgram.qualification}
                          onChange={(e) => setProgramField("qualification", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                        >
                          {QUALIFICATION_OPTIONS.map((q) => (
                            <option key={q} value={q} className="bg-[#111]">{q}</option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Duration (Years)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={newProgram.durationYears}
                          onChange={(e) => setProgramField("durationYears", e.target.value ? parseInt(e.target.value) : "")}
                          placeholder="e.g. 4"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {/* Annual Fee */}
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Annual Fee
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newProgram.annualFee}
                          onChange={(e) => setProgramField("annualFee", e.target.value ? parseFloat(e.target.value) : "")}
                          placeholder="e.g. 1200.00"
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
                          value={newProgram.currency}
                          onChange={(e) => setProgramField("currency", e.target.value)}
                          placeholder="USD"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => { setProgramTab("list"); setNewProgram(blankProgram()) }}
                        className="px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addProgram}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/30 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        Add to List
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* ── End Programs Section ── */}

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
                      <th className="py-2 px-3">University</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3 text-center">Programs</th>
                      <th className="py-2 px-3">Match</th>
                      <th className="py-2 px-3">Score</th>
                      <th className="py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-white/5 transition-colors text-xs text-white/80">
                        <td className="py-2 px-3 max-w-[110px] truncate">{rec.universityName}</td>
                        <td className="py-2 px-3">{rec.location}</td>
                        <td className="py-2 px-3 text-center">
                          {rec.programs && rec.programs.length > 0 ? (
                            <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                              {rec.programs.length}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic text-[10px]">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {rec.programmeMatch === 1 ? "Exact" : rec.programmeMatch === 0.5 ? "Related" : "None"}
                        </td>
                        <td className="py-2 px-3">
                          {rec.normalised != null ? (
                            <span className="text-primary font-bold">{rec.normalised.toFixed(6)}</span>
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
                        <td colSpan={6} className="py-6 text-center text-xs text-muted-foreground italic">
                          No university records yet. Add one using the form.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Programs detail panel — shown when a record has programs */}
          {records.some((r) => r.programs && r.programs.length > 0) && (
            <div className="glass-floating p-6 space-y-3 border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Programs Summary
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {records
                  .filter((r) => r.programs && r.programs.length > 0)
                  .map((rec) => (
                    <div key={rec.id} className="border border-white/5 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-bold text-primary">{rec.universityName}</p>
                      <div className="space-y-1">
                        {rec.programs!.map((prog, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] text-white/70">
                            <span className="truncate max-w-[160px]">{prog.programName}</span>
                            <span className="text-muted-foreground ml-2 shrink-0">{prog.qualification} · {prog.durationYears ? `${prog.durationYears}yr` : "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
