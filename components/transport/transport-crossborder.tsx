"use client"

import { busRoutes } from "@/lib/mock/transport"
import { Globe, FileText, AlertTriangle, Clock, DollarSign, Bus, MapPin } from "lucide-react"

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
        <div className="space-y-4">
            <div className="glass-floating p-4 bg-primary/5 border-primary/20 shadow-2xl overflow-hidden relative group rounded-2xl">
                <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                    <Globe size={100} className="text-primary" />
                </div>
                <div className="relative z-10 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl shadow-inner border border-primary/20 teal-glow">
                        <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[9px] font-medium text-white uppercase tracking-[0.2em] opacity-70">Travel Intelligence</p>
                </div>
                <h2 className="text-xl font-display font-medium text-white mb-2 relative z-10 uppercase tracking-tight">Cross-Border Guide</h2>
                <p className="text-[10px] text-muted-foreground leading-relaxed max-w-xl font-sans relative z-10 opacity-80 uppercase tracking-widest">Border fees, wait times, and documents.</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-4 mt-2">
                    <Bus size={14} className="text-primary" />
                    <h3 className="text-[9px] font-medium text-white uppercase tracking-[0.3em] opacity-70">Neural Bus Routes</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {crossBorderRoutes.map(route => (
                        <div key={route.id} className="glass-floating p-4 transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 bg-white/5 rounded-xl">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-base font-display font-medium text-white group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">{route.origin} → {route.destination}</p>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase mt-1.5 tracking-[0.15em] opacity-60 font-sans">{route.providerName} &middot; {route.borderCrossing}</p>
                                </div>
                                <div className="text-right glass-floating bg-primary/10 px-3 py-2 rounded-xl border border-primary/20 teal-glow">
                                    <p className="text-lg font-display font-medium text-white tabular-nums">${route.price}</p>
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">{route.durationHours}h trip</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {route.departureTimes.map(t => (
                                    <span key={t} className="text-[8px] font-medium uppercase tracking-widest bg-white/5 text-white px-2 py-0.5 rounded-md border border-white/10 shadow-inner">{t}</span>
                                ))}
                                {route.amenities.map(a => (
                                    <span key={a} className="text-[8px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">{a}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-4 mt-4">
                    <MapPin size={14} className="text-primary" />
                    <h3 className="text-[9px] font-medium text-white uppercase tracking-[0.3em] opacity-70">Strategic Border Posts</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {borderPosts.map(post => (
                        <div key={post.name} className="glass-floating p-4 transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 bg-white/5 rounded-xl">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-base font-display font-medium text-white tracking-tight uppercase leading-tight">{post.name}</p>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 font-sans mt-1">To {post.country}</p>
                                </div>
                                <span className="text-[8px] font-medium uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-inner">{post.hours}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                    <div className="flex items-center gap-1 mb-1 opacity-60">
                                        <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                                        <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">Avg Wait</p>
                                    </div>
                                    <p className="text-xs font-display font-medium text-white tabular-nums">{post.avgWait}</p>
                                </div>
                                <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 border-amber-500/20 bg-amber-500/5">
                                    <div className="flex items-center gap-1 mb-1 opacity-60">
                                        <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                                        <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">Peak</p>
                                    </div>
                                    <p className="text-xs font-display font-medium text-white">{post.busyPeriod}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-4 mt-4">
                    <FileText size={14} className="text-primary" />
                    <h3 className="text-[9px] font-medium text-white uppercase tracking-[0.3em] opacity-70">Regulatory Protocols</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(requirements).map(([country, reqs]) => (
                        <div key={country} className="glass-floating p-4 transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg shadow-inner border border-primary/20 teal-glow">
                                    <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <p className="text-base font-display font-medium text-white uppercase tracking-widest">{country}</p>
                            </div>
                            <ul className="space-y-2">
                                {reqs.map(req => (
                                    <li key={req} className="flex items-start gap-2.5 group/req">
                                        <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0 group-hover/req:bg-primary group-hover/req:scale-150 transition-all" />
                                        <p className="text-[9px] text-muted-foreground leading-relaxed font-sans uppercase tracking-widest opacity-80">{req}</p>
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

