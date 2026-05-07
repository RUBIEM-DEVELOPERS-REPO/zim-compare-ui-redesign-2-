"use client"

import React from "react"
import { 
    Activity, FileCheck, Scale, BarChart3, 
    MessageSquareWarning, RotateCcw, ReceiptText,
    CheckCircle2, AlertCircle, Clock, User,
    TrendingUp, TrendingDown, ShieldAlert,
    Building2, Search, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface SectionProps {
    section: string
}

export function RegulatorContent({ section }: SectionProps) {
    // 1. Service Provider Monitoring
    const renderMonitoring = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">Provider Monitoring</h2>
                    <p className="text-xs text-muted-foreground">Live network status and licensing compliance across all sectors.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        title="Filter Data"
                        className="glass-panel px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        <Filter size={12} /> Filter
                    </button>
                    <button 
                        title="Export Report"
                        className="bg-primary/20 border border-primary/30 text-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                    >
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {[
                    { name: "Econet Wireless", category: "Telecom", status: "Operational", uptime: "99.98%", license: "Active", renewal: "2027-12" },
                    { name: "CBZ Bank", category: "Banking", status: "Operational", uptime: "99.95%", license: "Active", renewal: "2026-06" },
                    { name: "NetOne", category: "Telecom", status: "Degraded", uptime: "94.20%", license: "Pending Audit", renewal: "2025-09" },
                    { name: "Old Mutual", category: "Insurance", status: "Operational", uptime: "100%", license: "Active", renewal: "2028-01" },
                    { name: "ZESA Holdings", category: "Utilities", status: "Operational", uptime: "88.50%", license: "Critical Review", renewal: "2024-05" },
                ].map((item, i) => (
                    <div key={i} className="glass-panel p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary border border-white/5 group-hover:border-primary/20">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium dark:text-white text-slate-900">{item.name}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.category}</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] text-muted-foreground uppercase mb-1">Uptime</p>
                            <p className="text-xs font-medium dark:text-white text-slate-900">{item.uptime}</p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] text-muted-foreground uppercase mb-1">License</p>
                            <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                                item.license === "Active" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            )}>
                                {item.license}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <div className={cn("w-1.5 h-1.5 rounded-full", item.status === "Operational" ? "bg-emerald-500" : "bg-amber-500")} />
                                <span className="text-[10px] font-bold dark:text-white text-slate-900 uppercase">{item.status}</span>
                            </div>
                            <p className="text-[9px] text-muted-foreground italic">Renews: {item.renewal}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // 2. Compliance Data
    const renderCompliance = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
             <div>
                <h2 className="text-2xl font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">Compliance & Risks</h2>
                <p className="text-xs text-muted-foreground">Institutional adherence to statutory capital requirements and operational mandates.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: "Overall Compliance", value: "92.4%", score: 92, color: "teal", icon: ShieldAlert },
                    { label: "Critical Risks", value: "14", score: 35, color: "red", icon: AlertCircle },
                    { label: "Audit Progress", value: "68%", score: 68, color: "indigo", icon: FileCheck },
                ].map((card, i) => (
                    <div key={i} className="glass-panel p-6 relative overflow-hidden">
                        <card.icon size={48} className="absolute -top-2 -right-2 opacity-5 text-primary" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{card.label}</p>
                        <h3 className="text-3xl font-display font-bold dark:text-white text-slate-900 mb-4">{card.value}</h3>
                        <Progress value={card.score} className="h-1" />
                    </div>
                ))}
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/30 border-b border-white/5">
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Entity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Risk Level</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Audit Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Review</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[
                            { name: "Nedbank Zimbabwe", risk: "Low", status: "Verified", date: "2 days ago" },
                            { name: "TelOne", risk: "Medium", status: "In-Progress", date: "1 week ago" },
                            { name: "CIMAS", risk: "Low", status: "Verified", date: "3 days ago" },
                            { name: "African Century", risk: "High", status: "Escalated", date: "Today" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium dark:text-white text-slate-900">{row.name}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                                        row.risk === "Low" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                        row.risk === "High" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                        "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    )}>
                                        {row.risk}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{row.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-muted-foreground">
                                    {row.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    // 3. Pricing and Fees Review
    const renderPricing = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">Pricing & Fees Review</h2>
                <p className="text-xs text-muted-foreground">Supervision of fee structure adjustments and anti-competitive pricing flags.</p>
            </div>

            <div className="grid gap-4">
                {[
                    { item: "ZIPIT Transaction Fee", provider: "All Banks", type: "Fee Cap", current: "$1.50", proposed: "$1.85", status: "Under Review", flag: true },
                    { item: "Monthly 10GB Data", provider: "Liquid Home", type: "Consumer Plan", current: "$35", proposed: "$38", status: "Approved", flag: false },
                    { item: "EcoCash C2B Fee", provider: "EcoCash", type: "Service Fee", current: "1.5%", proposed: "2.1%", status: "Rejected", flag: true },
                    { item: "Private Medical Cover", provider: "PSMAS", type: "Premium", current: "$80", proposed: "$95", status: "Pending Data", flag: true },
                ].map((price, i) => (
                    <div key={i} className={cn(
                        "glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4",
                        price.status === "Rejected" ? "border-l-red-500" : 
                        price.status === "Approved" ? "border-l-emerald-500" : "border-l-amber-500"
                    )}>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold dark:text-white text-slate-900">{price.item}</h4>
                                {price.flag && <ShieldAlert size={14} className="text-red-500" />}
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{price.provider} • {price.type}</p>
                        </div>
                        <div className="flex items-center gap-8 px-8 border-x border-white/5">
                            <div className="text-center">
                                <p className="text-[9px] text-muted-foreground uppercase mb-1">Current</p>
                                <p className="text-sm font-medium text-muted-foreground line-through">{price.current}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] text-primary uppercase mb-1 font-black">Proposed</p>
                                <p className="text-lg font-display font-bold dark:text-white text-slate-900">{price.proposed}</p>
                            </div>
                        </div>
                        <div className="text-right min-w-[120px]">
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border inline-block mb-2",
                                price.status === "Approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                price.status === "Rejected" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            )}>
                                {price.status}
                            </span>
                            <div className="flex justify-end gap-2">
                                <button 
                                    title="Approve Change"
                                    aria-label="Approve Change"
                                    className="p-1.5 hover:bg-emerald-500/20 rounded-md transition-colors text-emerald-400"
                                >
                                    <CheckCircle2 size={16} />
                                </button>
                                <button 
                                    title="Flag for Review"
                                    aria-label="Flag for Review"
                                    className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors text-red-400"
                                >
                                    <AlertCircle size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // 4. Category Analytics
    const renderAnalytics = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">Category Intelligence</h2>
                <p className="text-xs text-muted-foreground">Macro-level market concentration and sector performance metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                    { category: "Telecom", marketSize: "$1.2B", growth: "+8.2%", concentration: "High (HHI: 4200)", dominant: "Econet" },
                    { category: "Banking", marketSize: "$4.5B", growth: "+3.1%", concentration: "Moderate", dominant: "CBZ / CABS" },
                    { category: "Healthcare", marketSize: "$850M", growth: "+12.4%", concentration: "Low", dominant: "PSMAS" },
                    { category: "Schools", marketSize: "$2.1B", growth: "+5.0%", concentration: "Fragmented", dominant: "Government" },
                    { category: "Energy", marketSize: "$1.8B", growth: "-2.1%", concentration: "Monopoly", dominant: "ZESA" },
                    { category: "Insurance", marketSize: "$920M", growth: "+6.7%", concentration: "Moderate", dominant: "Old Mutual" },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-5 group hover:bg-primary/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-base font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">{stat.category}</h4>
                            <div className={cn("flex items-center gap-1 text-[10px] font-bold", stat.growth.startsWith('+') ? "text-emerald-400" : "text-red-400")}>
                                {stat.growth.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stat.growth}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] uppercase">
                                <span className="text-muted-foreground">Market Volume</span>
                                <span className="dark:text-white text-slate-900 font-medium">{stat.marketSize}</span>
                            </div>
                            <div className="flex justify-between text-[10px] uppercase">
                                <span className="text-muted-foreground">Dominant Entity</span>
                                <span className="text-primary font-medium">{stat.dominant}</span>
                            </div>
                            <div className="pt-2">
                                <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1.5">Concentration Index</p>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/40 w-[65%]" />
                                </div>
                                <p className="text-[8px] text-muted-foreground mt-1.5 italic">{stat.concentration}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // 5. Complaints and Reports
    const renderComplaints = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">Consumer Complaints</h2>
                    <p className="text-xs text-muted-foreground">Supervision of escalated disputes and whistle-blower institutional reports.</p>
                </div>
                <span className="text-[10px] font-black text-red-500 uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    12 Urgent Cases
                </span>
            </div>

            <div className="space-y-3">
                {[
                    { id: "C-9421", entity: "ZESA Holdings", subject: "Overbilling / Tariff Mismatch", severity: "High", status: "Investigation", officer: "D. Sibanda", time: "2h ago" },
                    { id: "C-9418", entity: "Steward Bank", subject: "Unauthorised Transaction Recovery", severity: "Medium", status: "Awaiting Response", officer: "T. Moyo", time: "5h ago" },
                    { id: "C-9405", entity: "NetOne", subject: "Data Vanishing / Non-delivery", severity: "High", status: "Escalated", officer: "S. Ncube", time: "Yesterday" },
                    { id: "C-9399", entity: "ZIMRA", subject: "IMT Tax Double Charge", severity: "Critical", status: "Action Required", officer: "P. Zhou", time: "Yesterday" },
                    { id: "C-9382", entity: "CIMAS", subject: "Shortfall Dispute - Specialist", severity: "Low", status: "Resolved", officer: "M. Gumbo", time: "2 days ago" },
                ].map((item) => (
                    <div key={item.id} className="glass-panel p-4 grid md:grid-cols-6 items-center gap-4 group">
                        <div className="md:col-span-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.id}</p>
                            <p className="text-[9px] text-muted-foreground">{item.time}</p>
                        </div>
                        <div className="md:col-span-1 font-medium text-sm dark:text-white text-slate-900">
                            {item.entity}
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
                        </div>
                        <div className="md:col-span-1">
                            <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded uppercase",
                                item.severity === "Critical" ? "bg-red-500/20 text-red-400" :
                                item.severity === "High" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                            )}>
                                {item.severity}
                            </span>
                        </div>
                        <div className="md:col-span-1 text-right">
                            <p className="text-[10px] font-medium dark:text-white text-slate-900 mb-1 flex items-center justify-end gap-1">
                                <User size={10} className="text-primary" /> {item.officer}
                            </p>
                            <p className="text-[9px] text-muted-foreground uppercase">{item.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // 6. Service Updates Tracking
    const renderTracking = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">Service Log Tracking</h2>
                <p className="text-xs text-muted-foreground">Audit trail of all institutional product launches and service modifications.</p>
            </div>

            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                {[
                    { date: "28 APR 2026", entity: "CBZ Bank", action: "Launched SMART-SAVER account", status: "Verified", details: "Zero-fee account for students under 25." },
                    { date: "27 APR 2026", entity: "Liquid Home", action: "Updated Unlimited T&Cs", status: "Under Review", details: "FUP threshold adjusted from 1TB to 800GB." },
                    { date: "26 APR 2026", entity: "Old Mutual", action: "New Unit Trust Product", status: "Approved", details: "US Dollar balanced fund for retail investors." },
                    { date: "25 APR 2026", entity: "Econet Wireless", action: "Terminated 2h Data Pack", status: "Verified", details: "Removed $0.50 2-hour bundle from menu." },
                ].map((log, i) => (
                    <div key={i} className="relative">
                        <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <div className="glass-panel p-4 ml-2">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{log.date}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase bg-white/5 px-2 py-0.5 rounded">{log.status}</span>
                            </div>
                            <h4 className="text-sm font-bold dark:text-white text-slate-900 mb-1">{log.entity}: {log.action}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{log.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // 7. Tax and Levy Monitoring
    const renderTaxes = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-display font-medium dark:text-white text-slate-900 uppercase tracking-tight">Tax & Levy Supervision</h2>
                <p className="text-xs text-muted-foreground">Compliance tracking of national levies, IMT Tax, and ZERA energy contributions.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-panel p-6">
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6">Energy Levies (ZERA)</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Petrol Duty", value: "$0.45 / L", compliance: "98%", status: "Stable" },
                            { name: "Diesel Levy", value: "$0.38 / L", compliance: "99%", status: "Stable" },
                            { name: "Carbon Tax", value: "$0.05 / L", compliance: "94%", status: "Reviewing" },
                        ].map((tax, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <div>
                                    <p className="text-xs font-medium dark:text-white text-slate-900">{tax.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{tax.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">{tax.value}</p>
                                    <p className="text-[9px] text-emerald-400 font-bold">{tax.compliance} Compliance</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6">Financial Levies (ZIMRA/RBZ)</h3>
                    <div className="space-y-4">
                        {[
                            { name: "IMT Tax (2%)", collection: "$42M", growth: "+4.5%", target: "92% of Forecast" },
                            { name: "Universal Service Fund", collection: "$8.4M", growth: "+1.2%", target: "100% Collected" },
                            { name: "Export Levy", collection: "$112M", growth: "-3.4%", target: "88% of Forecast" },
                        ].map((levy, i) => (
                            <div key={i} className="p-3 border border-white/5 rounded-xl">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-medium dark:text-white text-slate-900">{levy.name}</span>
                                    <span className="text-xs font-bold dark:text-white text-slate-900">{levy.collection}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-teal-500 w-[85%]" />
                                </div>
                                <div className="flex justify-between text-[9px] uppercase tracking-tighter">
                                    <span className={cn(levy.growth.startsWith('+') ? "text-emerald-400" : "text-red-400")}>{levy.growth} vs Last Q</span>
                                    <span className="text-muted-foreground">{levy.target}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    switch (section) {
        case "monitoring": return renderMonitoring()
        case "compliance": return renderCompliance()
        case "pricing-review": return renderPricing()
        case "analytics": return renderAnalytics()
        case "complaints": return renderComplaints()
        case "tracking": return renderTracking()
        case "taxes-monitoring": return renderTaxes()
        default: return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
                <Search size={48} className="opacity-20" />
                <p className="text-sm font-playfair italic">Select a regulatory module from the sidebar to begin oversight.</p>
            </div>
        )
    }
}
