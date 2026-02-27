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
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Cross-Border Travel Guide</p>
                </div>
                <p className="text-xs text-muted-foreground">Everything you need to know about crossing Zimbabwe's borders by bus or car.</p>
            </div>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Cross-Border Bus Routes</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {crossBorderRoutes.map(route => (
                        <div key={route.id} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{route.origin} → {route.destination}</p>
                                    <p className="text-xs text-muted-foreground">{route.providerName} · via {route.borderCrossing}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">${route.price}</p>
                                    <p className="text-[10px] text-muted-foreground">{route.durationHours}h journey</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {route.departureTimes.map(t => (
                                    <span key={t} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full text-foreground">{t}</span>
                                ))}
                                {route.amenities.map(a => (
                                    <span key={a} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{a}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Border Posts</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {borderPosts.map(post => (
                        <div key={post.name} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{post.name}</p>
                                    <p className="text-xs text-muted-foreground">To {post.country}</p>
                                </div>
                                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">{post.hours}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-lg bg-secondary/50 p-2">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                                        <p className="text-[10px] text-muted-foreground">Avg Wait</p>
                                    </div>
                                    <p className="text-xs font-bold text-foreground">{post.avgWait}</p>
                                </div>
                                <div className="rounded-lg bg-amber-500/10 p-2">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                                        <p className="text-[10px] text-muted-foreground">Busy Period</p>
                                    </div>
                                    <p className="text-xs font-bold text-foreground">{post.busyPeriod}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Travel Requirements by Destination</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(requirements).map(([country, reqs]) => (
                        <div key={country} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-primary" />
                                <p className="text-sm font-semibold text-foreground">{country}</p>
                            </div>
                            <ul className="space-y-1.5">
                                {reqs.map(req => (
                                    <li key={req} className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <p className="text-xs text-muted-foreground">{req}</p>
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
