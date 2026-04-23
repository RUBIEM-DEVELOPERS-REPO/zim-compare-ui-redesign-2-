"use client"

import React, { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { NavArrows } from "@/components/nav-arrows"
import { 
    Shield, CheckCircle, XCircle, AlertTriangle, FileText, Settings, Users, 
    Database, Activity, Landmark, Gavel, BarChart3, Clock, ArrowRight,
    Terminal, Lock, Eye, AlertCircle
} from "lucide-react"

export function AdminDashboard() {
  const { 
    pendingApprovals, approveUpdate, rejectUpdate, 
    regulatedPrices, updateRegulatedPrice, taxLevies, 
    auditLogs, userName 
  } = useAppStore()
  
  const [activeTab, setActiveTab] = useState("validation")

  const stats = [
    { label: "Pending Approvals", value: pendingApprovals.length, icon: Clock, color: "text-amber-500" },
    { label: "Compliance Alerts", value: "3", icon: AlertCircle, color: "text-red-500" },
    { label: "Active Institutions", value: "48", icon: Landmark, color: "text-blue-500" },
    { label: "System Uptime", value: "99.98%", icon: Activity, color: "text-emerald-500" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <NavArrows />
          <h1 className="text-5xl font-display font-medium text-foreground tracking-tight flex items-center gap-4 mb-4">
            System Admin
            <span className="px-4 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-medium tracking-[0.2em] uppercase border border-red-500/20 shadow-lg shadow-red-500/10 teal-glow">Root Level</span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 max-w-2xl">Global oversight, data validation, and platform governance in a secure neural workspace.</p>
        </div>
        <div className="flex items-center gap-4">
            <button 
              title="System Settings"
              className="h-12 w-12 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-white/30 transition-all floating-hover"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button className="px-6 py-3 rounded-[1.25rem] bg-red-600 text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-red-500 transition-all shadow-2xl shadow-red-600/30 floating-hover">
              Audit System
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-floating p-6 flex items-center gap-5 floating-hover group">
            <div className={cn("p-3.5 rounded-2xl border transition-all duration-500 group-hover:scale-110", 
                stat.color.replace('text-', 'bg-').concat('/10 border-').concat(stat.color.replace('text-', '')).concat('/20'),
                stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1 opacity-70">{stat.label}</p>
              <p className="text-2xl font-display font-medium text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit backdrop-blur-3xl">
          {[
            { id: "validation", label: "Queue", icon: Landmark },
            { id: "regulated", label: "Governance", icon: Gavel },
            { id: "users", label: "Access", icon: Lock },
            { id: "monitoring", label: "Intelligence", icon: Activity },
            { id: "audit", label: "History", icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 rounded-[1.25rem] text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-500",
                activeTab === tab.id ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "validation" && (
           <div className="grid gap-6 lg:grid-cols-3">
             <div className="lg:col-span-2 space-y-6">
                <section className="glass-card overflow-hidden">
                   <div className="p-6 border-b border-white/10">
                      <h3 className="font-medium text-foreground">Validation Queue</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Approve or reject price updates from corporate partners.</p>
                   </div>
                   <div className="divide-y divide-white/5">
                    {pendingApprovals.map((update) => (
                      <div key={update.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.01] transition-all">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground uppercase tracking-tight">{update.provider}</p>
                          <p className="text-xs text-muted-foreground">Request: <span className="text-[#55edda]">{update.item}</span></p>
                          <p className="text-[10px] text-muted-foreground opacity-60">Submitted {new Date(update.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-widest mb-1 opacity-50">Current</p>
                            <p className="text-sm font-medium text-muted-foreground line-through decoration-red-500/50">{update.old}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase text-[#55edda] font-medium tracking-widest mb-1">Proposed</p>
                            <p className="text-sm font-medium text-foreground">{update.new}</p>
                          </div>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => approveUpdate(update.id)}
                               className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all border border-emerald-500/20"
                               title="Approve Update"
                             >
                               <CheckCircle className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => rejectUpdate(update.id)}
                               className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                               title="Reject Update"
                             >
                               <XCircle className="w-5 h-5" />
                             </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pendingApprovals.length === 0 && (
                      <div className="p-20 text-center flex flex-col items-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500/30 mb-4" />
                        <p className="text-sm text-muted-foreground">Queue is clear. All updates processed.</p>
                      </div>
                    )}
                   </div>
                </section>

                <section className="glass-card p-6 border-red-500/20 bg-red-500/[0.03]">
                  <div className="flex items-center gap-3 mb-4 text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="font-medium uppercase tracking-tight">Anomalous Data Detected</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0b0f14]/80 border border-red-500/20 text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-white">BancABC</strong> manual update of <span className="text-white">ATM Fees</span> exceeded the <span className="text-red-400">Regulated Cap</span> by 15%. Automated system blocked the entry. Manual oversight required to investigate possible inflation breach.
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-[10px] font-medium uppercase tracking-widest">Investigate</button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] font-medium uppercase tracking-widest">Dismiss</button>
                  </div>
                </section>
             </div>

             <div className="space-y-6">
                <section className="glass-card p-6">
                  <h3 className="font-medium text-foreground mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Live System Monitor
                  </h3>
                  <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
                            <span>API Payload</span>
                            <span className="text-emerald-500">Normal</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[65%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
                            <span>Storage Capacity</span>
                            <span className="text-amber-500">78%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[78%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
                            <span>Encryption Ops</span>
                            <span className="text-emerald-500">Encrypted</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[92%]" />
                        </div>
                    </div>
                  </div>
                </section>

                <section className="glass-card p-6">
                  <h3 className="font-medium text-foreground mb-4">Exceptions Log</h3>
                  <div className="space-y-4">
                    {[
                      { msg: "API Timeout: RBZ Feed Exchange Rates", code: "504", time: "12m ago" },
                      { msg: "Sms Gateway: Low Balance Alert (Sender ZIMCOMP)", code: "WARN", time: "1h ago" },
                      { msg: "Auth Failure: IP [192.168.1.5] (Brussels)", code: "FAIL", time: "3h ago" },
                    ].map((ex, i) => (
                      <div key={i} className="flex flex-col gap-1 border-l-2 border-red-500/50 pl-3">
                        <p className="text-xs font-mono text-red-500">{ex.code} &middot; {ex.time}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight italic">{ex.msg}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-white transition-all">
                    View Full Terminal
                  </button>
                </section>
             </div>
           </div>
        )}

        {activeTab === "regulated" && (
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="glass-card">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="font-medium text-foreground">Regulated Price Caps</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Government mandated price limits for essential services.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {regulatedPrices.map(rp => (
                            <div key={rp.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{rp.item}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{rp.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-emerald-400">{rp.regulatedPrice.toFixed(2)} {rp.unit}</span>
                                    <button 
                                        title="Edit Regulatory Item"
                                        className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground"
                                    >
                                        <Edit3 size={14} className="Lucide-Edit3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:border-white/20 hover:text-white transition-all">
                            Add Regulatory Item
                        </button>
                    </div>
                </section>

                <section className="glass-card">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="font-medium text-foreground">Taxes & Levies</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">National tax policies and sector-specific levies.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {taxLevies.map(tax => (
                            <div key={tax.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-medium text-foreground">{tax.name}</p>
                                    <span className="text-sm font-medium text-red-400">{tax.rate * 100}%</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">{tax.appliesTo} &middot; {tax.sector} Sector</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )}

        {activeTab === "audit" && (
            <section className="glass-card">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-foreground">System Audit Trail</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Immutable record of all administrative actions and system updates.</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-medium uppercase tracking-widest text-white">Download PDF</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Entity Details</th>
                                <th className="px-6 py-4 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {auditLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground italic">No audit records found</td>
                                </tr>
                            ) : (
                                auditLogs.map(log => (
                                    <tr key={log.id} className="text-xs hover:bg-white/[0.01]">
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{log.user}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-mono">{log.action}</span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{log.details}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex h-2 w-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-widest">Signed</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        )}
      </div>
    </div>
  )
}

function Edit3(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}
