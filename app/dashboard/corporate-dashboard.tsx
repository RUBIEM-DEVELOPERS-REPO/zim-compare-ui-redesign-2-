"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { 
    BarChart3, TrendingUp, Users, FileText, Bell, Plus, Save, 
    Upload, CheckCircle, XCircle, MessageSquare, ArrowUpRight, ArrowDownRight,
    Search, Filter, MoreVertical, Edit3
} from "lucide-react"
import { NavArrows } from "@/components/nav-arrows"
import { validatePrice, validateRequired } from "@/lib/validation"
import { AddNewsModal } from "@/components/dashboard/add-news-modal"

export function CorporateDashboard() {
  const { applications, updateApplication, addAuditLog, userName } = useAppStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isAdsModalOpen, setIsAdsModalOpen] = useState(false)

  const stats = [
    { label: "Total Applications", value: applications.length, icon: FileText, color: "text-blue-500", trend: "+12%" },
    { label: "Total Reach", value: "12.4k", icon: Users, color: "text-purple-500", trend: "+5%" },
    { label: "Price Alerts Sent", value: "482", icon: Bell, color: "text-orange-500", trend: "0%" },
    { label: "Market Share", value: "12.5%", icon: TrendingUp, color: "text-emerald-500", trend: "+2.1%" },
  ]

  const handleUpdatePrice = (e: React.FormEvent, item: any) => {
    e.preventDefault()
    const errors = []
    const priceErr = validatePrice(newPrice, "Price")
    const reqErr = validateRequired(newPrice, "Price")
    if (priceErr) errors.push(priceErr.message)
    if (reqErr) errors.push(reqErr.message)

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    // Mock submit for approval
    addAuditLog("SUBMIT_PRICE_UPDATE", userName, `Submitted price update for ${item.name}: ${item.current} -> $${newPrice}`)
    setEditingPriceId(null)
    setNewPrice("")
    alert("Price update submitted for admin approval.")
  }

  const handleApproveApp = (id: string, name: string) => {
    updateApplication(id, { status: "approved" })
    addAuditLog("APPROVE_APPLICATION", userName, `Approved application ${id} for user ${name}`)
  }

  const handleRejectApp = (id: string, name: string) => {
    updateApplication(id, { status: "rejected" })
    addAuditLog("REJECT_APPLICATION", userName, `Rejected application ${id} for user ${name}`)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <NavArrows />
          <h1 className="text-5xl font-display font-medium text-foreground tracking-tight mb-2">Corporate Intelligence</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 max-w-2xl">Manage your institutional presence and pricing strategy in a frictionless workspace.</p>
        </div>
        <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 rounded-[1.25rem] bg-white/5 border border-white/10 text-white text-[11px] font-medium uppercase tracking-widest hover:bg-white/10 transition-all floating-hover">
                Export Insights
            </button>
            <button 
                onClick={() => setIsAdsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-[1.25rem] bg-white/5 border border-white/10 text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-white/10 transition-all floating-hover"
            >
                <Plus className="w-4 h-4" />
                Add New Ads
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-[1.25rem] bg-primary text-primary-foreground text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-primary/90 transition-all shadow-2xl teal-glow floating-hover">
                <Plus className="w-4 h-4" />
                Add New Product
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-floating p-6 flex items-center justify-between floating-hover group">
            <div className="flex items-center gap-5">
                <div className={cn("p-3.5 rounded-2xl border transition-all duration-500", 
                    stat.color.replace('text-', 'bg-').concat('/10 border-').concat(stat.color.replace('text-', '')).concat('/20'),
                    "group-hover:scale-110",
                    stat.color)}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1 opacity-70">{stat.label}</p>
                    <p className="text-2xl font-display font-medium text-foreground">{stat.value}</p>
                </div>
            </div>
            <div className={cn("flex items-center text-[10px] font-medium px-2 py-1 rounded-full teal-glow", 
                stat.trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-muted-foreground")}>
                {stat.trend.startsWith("+") ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="space-y-6">
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit backdrop-blur-xl">
          {["overview", "pricing", "applications", "upload"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                activeTab === tab ? "bg-primary text-primary-foreground teal-glow" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Pricing Management Table */}
              <section className="glass-floating overflow-hidden teal-glow">
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div>
                    <h3 className="font-display font-medium text-foreground text-xl">Institutional Pricing</h3>
                    <p className="text-xs text-muted-foreground mt-1 opacity-70">Live market rates and internal service fees.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      title="Search Pricing"
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-primary/50 transition-all"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button 
                      title="Filter Pricing"
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-primary/50 transition-all"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                <th className="px-6 py-4">Service Item</th>
                                <th className="px-6 py-4">Current Rate</th>
                                <th className="px-6 py-4">Market Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { id: "p1", name: "ZIPIT Transfer Fee", current: "$1.50", status: "Competitive", type: "currency" },
                                { id: "p2", name: "Monthly Account Maintenance", current: "$5.00", status: "High", type: "currency" },
                                { id: "p3", name: "ATM Withdrawal (Own)", current: "1%", status: "Good", type: "percent" },
                            ].map((item) => (
                                <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingPriceId === item.id ? (
                                            <form onSubmit={(e) => handleUpdatePrice(e, item)} className="flex items-center gap-2">
                                                <input 
                                                    autoFocus
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-20 bg-white/10 border border-primary/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                                                />
                                                <button 
                                                    type="submit" 
                                                    title="Approve Price Update"
                                                    className="p-1 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    title="Cancel Update"
                                                    onClick={() => setEditingPriceId(null)} 
                                                    className="p-1 rounded-lg bg-red-500 text-black hover:bg-red-400"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                </button>
                                            </form>
                                        ) : (
                                            <span className="text-sm font-medium text-foreground">{item.current}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-widest",
                                            item.status === "Competitive" ? "bg-emerald-500/10 text-emerald-500" : 
                                            item.status === "High" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            title="Edit Price"
                                            onClick={() => { setEditingPriceId(item.id); setNewPrice(item.current.replace(/[^\d.]/g, "")); }}
                                            className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </section>

              {/* Multi-Component Area: Applications & Upload */}
              <div className="grid gap-6 md:grid-cols-2">
                 <section className="glass-floating p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 teal-glow shadow-amber-500/20">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-display font-medium text-foreground text-lg">Pending Reviews</h3>
                    </div>
                    <div className="space-y-4">
                        {applications.filter(a => a.status === "under_review").slice(0, 3).map((app) => (
                            <div key={app.id} className="p-5 rounded-[1.5rem] border border-white/10 bg-white/5 floating-hover">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-md font-medium text-foreground mb-1">{app.serviceType} Application</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">Ref: {app.id.substr(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        title="Approve Application"
                                        onClick={() => handleApproveApp(app.id, "Applicant")}
                                        className="flex-1 py-2.5 text-[10px] font-medium uppercase tracking-widest rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 teal-glow"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        title="Reject Application"
                                        onClick={() => handleRejectApp(app.id, "Applicant")}
                                        className="flex-1 py-2.5 text-[10px] font-medium uppercase tracking-widest rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                        {applications.filter(a => a.status === "under_review").length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-8 italic">No pending applications</p>
                        )}
                    </div>
                 </section>

                 <section className="glass-floating p-8 border-dashed border-primary/20 flex flex-col items-center justify-center text-center group/upload cursor-pointer hover:border-primary/50 transition-all">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover/upload:bg-primary/10 transition-all duration-500 teal-glow">
                        <Upload className="w-10 h-10 text-muted-foreground group-hover/upload:text-primary transition-all duration-500" />
                    </div>
                    <h3 className="font-display font-medium text-foreground text-lg mb-3">Upload Product Data</h3>
                    <p className="text-xs text-muted-foreground max-w-[240px] mb-8 opacity-70">Drag and drop your CSV or Excel files here to bulk update products with zero friction.</p>
                    <button 
                        title="Select Files to Upload"
                        className="px-6 py-3 rounded-[1.25rem] bg-white/5 border border-white/10 text-[10px] font-medium uppercase tracking-widest text-white hover:bg-white/10 transition-all floating-hover"
                    >
                        Select Files
                    </button>
                 </section>
              </div>
            </div>

            <div className="space-y-6">
               {/* Competitor Insights */}
               <section className="glass-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-foreground text-sm uppercase tracking-tight">Competitor Insights</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  2 competitors updated their <strong>ZIPIT</strong> fees in the last 24 hours. Your current fee is 15% lower than average.
                </p>
                <button className="w-full mt-6 py-3 text-[10px] font-medium uppercase tracking-widest rounded-xl border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all">
                  Generate Full Report
                </button>
              </section>

              {/* Alert Subscriptions */}
              <section className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-500">
                        <Bell className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-foreground">Alert Controls</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { name: "Price Movement Monitoring", desc: "Notify me of competitor price changes", active: true },
                        { name: "Incoming Applications", desc: "SMS alerts for new submissions", active: false },
                        { name: "System Outages", desc: "Critical alerts for service down time", active: true },
                    ].map((alert, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-medium text-foreground">{alert.name}</p>
                                <p className="text-[9px] text-muted-foreground">{alert.desc}</p>
                            </div>
                            <div className={cn(
                                "w-10 h-5 rounded-full relative transition-all cursor-pointer",
                                alert.active ? "bg-emerald-500" : "bg-white/10"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                    alert.active ? "right-1" : "left-1"
                                )} />
                            </div>
                        </div>
                    ))}
                </div>
              </section>

              {/* Comments Management */}
              <section className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-foreground">Public Feedback</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { user: "Sarah M.", comment: "Fees are a bit high but the app is great.", rating: 4 },
                        { user: "Joshua T.", comment: "Loving the new PureSave features!", rating: 5 },
                    ].map((c, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
                            <div className="flex justify-between mb-1">
                                <span className="font-medium text-foreground">{c.user}</span>
                                <span className="text-amber-500">{"★".repeat(c.rating)}</span>
                            </div>
                            <p className="text-muted-foreground">{c.comment}</p>
                            <button className="mt-2 text-[9px] font-medium uppercase tracking-widest text-[#55edda] hover:underline">Reply</button>
                        </div>
                    ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      <AddNewsModal 
        isOpen={isAdsModalOpen} 
        onClose={() => setIsAdsModalOpen(false)} 
      />
    </div>
  )
}
