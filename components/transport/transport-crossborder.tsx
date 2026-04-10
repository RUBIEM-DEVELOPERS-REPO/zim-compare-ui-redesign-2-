"use client"

import { busRoutes } from "@/lib/mock/transport"
import { Globe, FileText, AlertTriangle, Clock, DollarSign } from "lucide-react"

const crossBorderRoutes = busRoutes.filter(r => r.crossBorder)

const requirements: Record<string, string[]> = {
    "South Africa": ["Valid Passport (6+ months validity)", "Zimbabwe ID", "Return ticket", "Proof of accommodation", "Yellow fever certificate (if applicable)"],
    "Zambia": ["Valid Passport", "Zambia visa ($50 single entry)", "Vehicle permit (if driving)", "Insurance certificate"],
    "Botswana": ["Valid Passport", "Botswana visa (free for Zimbabweans)", "Return ticket"],
    "Mozambique": ["Valid Passport", "Mozambique visa ($50)", "Yellow fever certificate"],
}

const borderPosts = [
    { name: "Beitbridge", country: "South Africa", hours: "24/7", busyPeriod: "Dec–Jan, Easter", avgWait: "2–6 hours" },
    { name: "Chirundu", country: "Zambia", hours: "06:00–22:00", busyPeriod: "Weekends", avgWait: "1–3 hours" },
    { name: "Forbes/Machipanda", country: "Mozambique", hours: "06:00–18:00", busyPeriod: "Weekends", avgWait: "1–2 hours" },
    { name: "Plumtree", country: "Botswana", hours: "06:00–22:00", busyPeriod: "Public holidays", avgWait: "30min–2 hours" },
]

export function TransportCrossBorder() {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-4 bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
                <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                    <Globe size={100} className="text-primary" />
                </div>
                <div className="relative z-10 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
                        <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-black text-foreground uppercase tracking-widest">Cross-Border Travel Guide</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-lg">Everything you need to know about crossing Zimbabwe's borders by bus or car, including fees, wait times, and documents.</p>
            </div>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Cross-Border Bus Routes</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    {crossBorderRoutes.map(route => (
                        <div key={route.id} className="glass-card p-5 hover:border-primary/40 group">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{route.origin} → {route.destination}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{route.providerName} &middot; via {route.borderCrossing}</p>
                                </div>
                                <div className="text-right bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/10">
                                    <p className="text-sm font-black text-primary tabular-nums">${route.price}</p>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{route.durationHours}h trip</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {route.departureTimes.map(t => (
                                    <span key={t} className="text-[9px] bg-muted px-2 py-0.5 rounded-full text-foreground font-black tracking-tighter border border-border/40">{t}</span>
                                ))}
                                {route.amenities.map(a => (
                                    <span key={a} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-primary/20">{a}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Border Posts</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    {borderPosts.map(post => (
                        <div key={post.name} className="glass-card p-5 hover:border-primary/40">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-sm font-bold text-foreground tracking-tight">{post.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To {post.country}</p>
                                </div>
                                <span className="text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">{post.hours}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-muted/30 p-2.5 border border-white/5">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Avg Wait</p>
                                    </div>
                                    <p className="text-xs font-black text-foreground tabular-nums">{post.avgWait}</p>
                                </div>
                                <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/10">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Busy Period</p>
                                    </div>
                                    <p className="text-xs font-black text-foreground">{post.busyPeriod}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Travel Requirements by Destination</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(requirements).map(([country, reqs]) => (
                        <div key={country} className="glass-card p-5 hover:border-primary/40">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
                                    <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <p className="text-sm font-black text-foreground uppercase tracking-widest">{country}</p>
                            </div>
                            <ul className="space-y-2.5">
                                {reqs.map(req => (
                                    <li key={req} className="flex items-start gap-3 group/req">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0 group-hover/req:bg-primary transition-colors" />
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">{req}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
