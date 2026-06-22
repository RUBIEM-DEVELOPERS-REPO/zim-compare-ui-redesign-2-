"use client"

import React from "react"
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { useRouter } from "next/navigation"
import { cn, formatDate, formatDateTime } from "@/lib/utils"
import { banks } from "@/lib/mock/banks"
import { telecomProviders } from "@/lib/mock/telecoms"
import { insuranceProviders } from "@/lib/mock/insurance"
import { schools } from "@/lib/mock/schools"
import { universities } from "@/lib/mock/universities"
import { apiPost } from "@/lib/api"
import * as XLSX from "xlsx"
import { Sun, Moon, LogOut } from "lucide-react"
import { useTheme } from "next-themes"

export default function AdminPage() {
  const hasHydrated = useHasHydrated()
  const { role, alerts, uploadLogs, addUploadLog, addAlert } = useAppStore()
  const router = useRouter()
  const [uploadCategory, setUploadCategory] = useState("banking")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertCategory, setAlertCategory] = useState("banking")
  const [alertType, setAlertType] = useState("price_drop")

  // For Bulk Data Upload (XLSX, CSV)
  const [parsedData, setParsedData] = useState<any[] | null>(null)
  const [importCategory, setImportCategory] = useState("universities")
  const [isImporting, setIsImporting] = useState(false)
  const [importSuccessMessage, setImportSuccessMessage] = useState("")
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Read the role from localStorage synchronously (set by interface-selection
  // before navigation) — this bypasses the Zustand rehydration delay entirely.
  const selectedRole = typeof window !== "undefined"
    ? (localStorage.getItem("selectedRole") ?? role)
    : role

  // Wait for hydration to complete to avoid hydration mismatches
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (selectedRole !== "admin" && role !== "admin") {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <h1 className="text-lg font-medium text-foreground">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground">Select System Admin from the interface selection screen to access this page.</p>
        <button
          onClick={() => router.push("/interface-selection")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Interface Selection
        </button>
      </div>
    )
  }

  async function handleUpload() {
    try {
      const res = await apiPost('/admin/upload', { category: uploadCategory })
      if (res.success) {
        addUploadLog({
          id: Date.now().toString(),
          category: uploadCategory,
          uploadedBy: "admin@zimcompare.co.zw",
          uploadedAt: new Date().toISOString(),
          recordCount: res.recordCount || 0,
        })
        alert(`Successfully uploaded ${res.recordCount} records to database.`)
      }
    } catch (e: any) {
      console.error("Upload error:", e)
      // Fallback for development if API is not available
      addUploadLog({
        id: Date.now().toString(),
        category: uploadCategory,
        uploadedBy: "admin@fintech.co.zw",
        uploadedAt: new Date().toISOString(),
        recordCount: Math.floor(Math.random() * 50) + 10,
      })
    }
  }

  function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault()
    if (!alertMessage.trim()) return
    addAlert({
      id: Date.now().toString(),
      type: alertType as "price_drop" | "new_promo" | "fee_increase" | "claims_change",
      category: alertCategory as "banking" | "telecom" | "schools" | "insurance",
      itemId: "",
      message: alertMessage,
      createdAt: new Date().toISOString(),
      read: false,
    })
    setAlertMessage("")
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImportSuccessMessage("")

    const arrayBuffer = await file.arrayBuffer()
    const wb = XLSX.read(arrayBuffer, { type: "array" })
    const wsname = wb.SheetNames[0]
    const ws = wb.Sheets[wsname]
    
    // Auto-detect if headers are pushed down by a title row
    const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]
    let headerRowIndex = 0
    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
        const validCells = (rawData[i] || []).map(c => String(c).trim()).filter(Boolean)
        if (validCells.length < 4) continue // A real header row must have many columns

        const rowVals = validCells.join(" ").toLowerCase()
        const isUni = rowVals.includes("university") && (rowVals.includes("location") || rowVals.includes("fee"))
        const isTelecom = rowVals.includes("provider") && (rowVals.includes("data") || rowVals.includes("price") || rowVals.includes("bundle"))
        const isBanking = rowVals.includes("bank") && rowVals.includes("name")
        
        if (isUni || isTelecom || isBanking) {
            headerRowIndex = i
            break
        }
    }

    const data = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex })
    
    setParsedData(data as any[])
  }

  async function confirmBulkImport() {
    if (!parsedData || parsedData.length === 0) return
    setIsImporting(true)
    setImportSuccessMessage("")
    try {
      const res = await apiPost('/admin/bulk-import', { category: importCategory, data: parsedData })
      if (res.success) {
        addUploadLog({
          id: Date.now().toString(),
          category: importCategory,
          uploadedBy: "admin@zimcompare.co.zw",
          uploadedAt: new Date().toISOString(),
          recordCount: res.recordCount,
        })
        const failMsg = res.failed > 0 ? ` (${res.failed} rows failed)` : ""
        setImportSuccessMessage(`Successfully imported ${res.recordCount} rows to the ${importCategory} database.${failMsg}`)
        if (res.errors && res.errors.length > 0) {
          alert("UPLOAD ERRORS DETECTED!\n\n" + res.errors.join("\n\n"))
        }
        setParsedData(null)
      } else {
        alert(res.error || "Bulk import failed")
      }
    } catch (e: any) {
      alert(e.message || "Bulk import failed")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage pricing data, alerts, and platform content</p>
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground hover:bg-white/10 hover:border-primary/50 transition-all shadow-sm"
              title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <button
            onClick={() => router.push("/interface-selection")}
            className="flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-foreground uppercase tracking-widest hover:bg-white/10 hover:border-red-500/50 transition-all shadow-sm group"
          >
            <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
            <span>Exit Page</span>
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Banks", value: banks.length, color: "text-blue-400" },
          { label: "Telecoms", value: telecomProviders.length, color: "text-emerald-400" },
          { label: "Schools", value: schools.length, color: "text-amber-400" },
          { label: "Universities", value: universities.length, color: "text-primary" },
          { label: "Insurance", value: insuranceProviders.length, color: "text-purple-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-white/[0.02] border border-[#dfe3e8] dark:border-white/5 rounded-[14px] py-[22px] px-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none group hover:border-[#cfd6dd] dark:hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-none transition-all duration-300"
          >
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={cn("text-2xl font-display font-medium", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Pricing Data */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Upload Pricing Snapshot</h3>
          <p className="text-xs text-muted-foreground mb-4">Simulate uploading a new pricing data batch for a category.</p>
          <div className="flex gap-2 mb-3">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              aria-label="Select category to upload pricing snapshot"
              className="flex-1 rounded-lg border border-border bg-secondary text-xs text-foreground px-2 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="banking">Banking</option>
              <option value="telecom">Telecom</option>
              <option value="schools">Schools</option>
              <option value="universities">Universities</option>
              <option value="insurance">Insurance</option>
            </select>
            <button
              onClick={handleUpload}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Upload Snapshot
            </button>
          </div>
          {uploadLogs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Recent Uploads</p>
              {uploadLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-xs rounded-lg border border-border bg-secondary/30 px-3 py-2">
                  <span className="text-foreground capitalize">{log.category}</span>
                  <span className="text-muted-foreground">{log.recordCount} records</span>
                  <span className="text-muted-foreground">{formatDateTime(log.uploadedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Alert */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Create Alert</h3>
          <p className="text-xs text-muted-foreground mb-4">Send a notification to all users about pricing changes.</p>
          <form onSubmit={handleCreateAlert} className="space-y-3">
            <div className="flex gap-2">
              <select
                value={alertCategory}
                onChange={(e) => setAlertCategory(e.target.value)}
                aria-label="Select category for alert"
                className="rounded-lg border border-border bg-secondary text-xs text-foreground px-2 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="banking">Banking</option>
                <option value="telecom">Telecom</option>
                <option value="schools">Schools</option>
                <option value="universities">Universities</option>
                <option value="insurance">Insurance</option>
              </select>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                aria-label="Select alert type"
                className="rounded-lg border border-border bg-secondary text-xs text-foreground px-2 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="price_drop">Price Drop</option>
                <option value="new_promo">New Promo</option>
                <option value="fee_increase">Fee Increase</option>
                <option value="claims_change">Claims Change</option>
              </select>
            </div>
            <input
              type="text"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Alert message..."
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Send Alert
            </button>
          </form>
        </div>
      </div>

      {/* Active Alerts */}
      <section>
        <h3 className="text-sm font-medium text-foreground mb-3">Active Alerts ({alerts.length})</h3>
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className={cn(
              "flex items-center justify-between rounded-xl border px-4 py-3 text-xs",
              a.read ? "border-border bg-card" : "border-primary/20 bg-primary/5"
            )}>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-medium capitalize",
                  a.type === "price_drop" ? "bg-emerald-500/15 text-emerald-400" :
                    a.type === "new_promo" ? "bg-blue-500/15 text-blue-400" :
                      a.type === "fee_increase" ? "bg-red-500/15 text-red-400" :
                        "bg-amber-500/15 text-amber-400"
                )}>
                  {a.type.replace("_", " ")}
                </span>
                <span className="text-foreground">{a.message}</span>
              </div>
              <span className="text-muted-foreground shrink-0 ml-2">{formatDate(a.createdAt)}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
