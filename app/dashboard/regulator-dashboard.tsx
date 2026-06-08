"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { 
    Activity, FileCheck, Scale, BarChart3, 
    MessageSquareWarning, RotateCcw, ReceiptText,
    ArrowUpRight, AlertCircle, ShieldCheck, Users,
    Globe, TrendingUp
} from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function RegulatorDashboard() {
    const { t } = useI18n()
    const router = useRouter()

    const stats = [
        { label: "Active Providers", value: "142", icon: Globe, trend: "+3 this month", color: "text-blue-400" },
        { label: "Compliance Rate", value: "94.2%", icon: ShieldCheck, trend: "+1.2%", color: "text-teal-400" },
        { label: "Pending Reviews", value: "18", icon: Scale, trend: "-5 from yesterday", color: "text-amber-400" },
        { label: "Active Complaints", value: "45", icon: MessageSquareWarning, trend: "Stable", color: "text-red-400" },
    ]

    const modules = [
        {
            id: "monitoring",
            title: "Service Provider Monitoring",
            desc: "Real-time uptime, service availability, and performance metrics across all sectors.",
            icon: Activity,
            status: "Normal",
            color: "teal"
        },
        {
            id: "compliance",
            title: "Compliance Data",
            desc: "Institutional compliance tracking against statutory requirements and KYC standards.",
            icon: FileCheck,
            status: "Action Required",
            color: "amber"
        },
        {
            id: "pricing_review",
            title: "Pricing and Fees Review",
            desc: "Analyze and approve fee structures, interest rates, and bundle pricing changes.",
            icon: Scale,
            status: "8 Pending",
            color: "blue"
        },
        {
            id: "analytics",
            title: "Category Analytics",
            desc: "Market concentration analysis, sector growth trends, and consumer behavior data.",
            icon: BarChart3,
            status: "Updated",
            color: "purple"
        },
        {
            id: "complaints",
            title: "Complaints and Reports",
            desc: "Manage escalated consumer complaints, whistle-blower reports, and dispute resolutions.",
            icon: MessageSquareWarning,
            status: "12 New",
            color: "red"
        },
        {
            id: "tracking",
            title: "Service Updates Tracking",
            desc: "Historical log of all product changes, license renewals, and service terminations.",
            icon: RotateCcw,
            status: "Live",
            color: "indigo"
        },
        {
            id: "taxes_monitoring",
            title: "Tax and Levy Monitoring",
            desc: "Supervision of IMT Tax collection, universal service fund contributions, and levies.",
            icon: ReceiptText,
            status: "Processing",
            color: "emerald"
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-medium dark:text-white text-slate-900 tracking-tight uppercase">
                        Regulator <span className="text-primary">Intelligence</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                        National regulatory oversight and multi-sector institutional supervision dashboard.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">System Online</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-4 floating-hover">
                        <div className="flex justify-between items-start mb-2">
                            <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{stat.trend}</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold dark:text-white text-slate-900 mb-0.5">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Modules Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((mod) => (
                    <div 
                        key={mod.id} 
                        onClick={() => router.push(`/regulator/${mod.id.replace('_', '-')}`)}
                        className="glass-teal-card p-6 group cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <mod.icon size={80} />
                        </div>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="icon-highlight-strip flex items-center justify-center">
                                <mod.icon size={24} className="text-primary" />
                            </div>
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                                mod.color === "teal" ? "bg-teal-500/10 border-teal-500/20 text-teal-400" :
                                mod.color === "amber" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                mod.color === "red" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                "bg-primary/10 border-primary/20 text-primary"
                            )}>
                                {mod.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-display font-medium dark:text-white text-slate-900 mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                            {mod.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                            {mod.desc}
                        </p>

                        <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            Launch Module <ArrowUpRight size={14} />
                        </div>
                    </div>
                ))}

                {/* System Alert Card */}
                <div className="glass-panel p-6 bg-red-500/5 border-red-500/20 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AlertCircle size={64} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-display font-medium text-red-400 mb-2 uppercase tracking-tight">
                        Critical Alert
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        3 Providers have exceeded the maximum permitted interest rate deviation threshold. Immediate review required.
                    </p>
                    <button 
                        title="Investigate Critical Alerts"
                        className="bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        Investigate Now
                    </button>
                </div>
            </div>
        </div>
    )
}
