"use client"

import React from "react"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { banks } from "@/lib/mock/banks"
import { telecomProviders } from "@/lib/mock/telecoms"
import { insuranceProviders } from "@/lib/mock/insurance"
import { schools } from "@/lib/mock/schools"
import { universities } from "@/lib/mock/universities"
import { apiPost } from "@/lib/api"
import * as XLSX from "xlsx"

export default function AdminPage() {
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

  if (role !== "admin") {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <h1 className="text-lg font-semibold text-foreground">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground">Switch to admin role using the role switcher in the top navigation to access this page.</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Dashboard
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
      alert(e.message || "Upload failed")
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
      <div>
        <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage pricing data, alerts, and platform content</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Banks</p>
          <p className="text-2xl font-semibold text-foreground">{banks.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Telecoms</p>
          <p className="text-2xl font-semibold text-foreground">{telecomProviders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Schools</p>
          <p className="text-2xl font-semibold text-foreground">{schools.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Universities</p>
          <p className="text-2xl font-semibold text-foreground">{universities.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Insurance</p>
          <p className="text-2xl font-semibold text-foreground">{insuranceProviders.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Pricing Data */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Upload Pricing Snapshot</h3>
          <p className="text-xs text-muted-foreground mb-4">Simulate uploading a new pricing data batch for a category.</p>
          <div className="flex gap-2 mb-3">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
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
                  <span className="text-muted-foreground">{new Date(log.uploadedAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Alert */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Create Alert</h3>
          <p className="text-xs text-muted-foreground mb-4">Send a notification to all users about pricing changes.</p>
          <form onSubmit={handleCreateAlert} className="space-y-3">
            <div className="flex gap-2">
              <select
                value={alertCategory}
                onChange={(e) => setAlertCategory(e.target.value)}
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
        <h3 className="text-sm font-semibold text-foreground mb-3">Active Alerts ({alerts.length})</h3>
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
              <span className="text-muted-foreground shrink-0 ml-2">{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bulk Custom File Import Section */}
      <section className="rounded-xl border border-border bg-card p-5 mt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Bulk Data Upload (Excel / CSV)</h3>
        <p className="text-xs text-muted-foreground mb-4">Upload a custom spreadsheet and map it into the database directly.</p>
        
        {importSuccessMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium rounded-lg">
            {importSuccessMessage}
          </div>
        )}

        <div className="flex gap-4 items-center mb-4">
          <select
            value={importCategory}
            onChange={(e) => setImportCategory(e.target.value)}
            className="rounded-lg border border-border bg-secondary text-xs text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="universities">Universities</option>
            <option value="telecom">Telecom Bundles</option>
            <option value="banking">Banking</option>
            <option value="schools" disabled>Schools (Coming Soon)</option>
          </select>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileUpload}
            className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>

        {parsedData && parsedData.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-foreground">Data Preview ({parsedData.length} rows found)</h4>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-secondary/50">
                  <tr>
                    {Object.keys(parsedData[0]).slice(0, 7).map((key, i) => (
                      <th key={i} className="px-3 py-2 font-medium text-foreground">{key}</th>
                    ))}
                    {Object.keys(parsedData[0]).length > 7 && (
                      <th className="px-3 py-2 font-medium text-muted-foreground">...more</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parsedData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-accent/50">
                      {Object.values(row).slice(0, 7).map((val: any, j) => (
                        <td key={j} className="px-3 py-2 text-muted-foreground truncate max-w-[150px]">{String(val)}</td>
                      ))}
                      {Object.keys(row).length > 7 && (
                        <td className="px-3 py-2 text-muted-foreground">...</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.length > 5 && (
              <p className="text-[10px] text-muted-foreground text-center">Showing first 5 rows only.</p>
            )}
            
            <button
              onClick={confirmBulkImport}
              disabled={isImporting}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Uploading Data...
                </>
              ) : (
                `Confirm & Upload ${parsedData.length} records to Database`
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
