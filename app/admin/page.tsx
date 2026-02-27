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

export default function AdminPage() {
  const { role, alerts, uploadLogs, addUploadLog, addAlert } = useAppStore()
  const router = useRouter()
  const [uploadCategory, setUploadCategory] = useState("banking")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertCategory, setAlertCategory] = useState("banking")
  const [alertType, setAlertType] = useState("price_drop")

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

  function handleUpload() {
    addUploadLog({
      id: Date.now().toString(),
      category: uploadCategory,
      uploadedBy: "admin@zimcompare.co.zw",
      uploadedAt: new Date().toISOString(),
      recordCount: Math.floor(Math.random() * 50) + 10,
    })
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
    </div>
  )
}
