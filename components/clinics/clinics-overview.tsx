"use client"

import { healthcareProviders } from "@/lib/mock/clinics"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"
import { Stethoscope, Star, Clock, MapPin, TrendingUp, DollarSign, Shield, Activity, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function ClinicsOverview({ location = "All Locations" }: { location?: string }) {
  const { preferences } = useAppStore()

  // Logic for "Best for you"
  const bestClinic = preferences.scenario === "student" ? "Health Point" : preferences.scenario === "family" ? "The Avenues Clinic" : "The Avenues Clinic"
  const recommendationReason = preferences.scenario === "student" 
    ? "Offers the fastest turnaround time with premium student-friendly consultation rates." 
    : preferences.scenario === "family" 
    ? "Comprehensive maternity and pediatric facilities with 24/7 emergency support."
    : "Elite medical services with broad corporate insurance acceptance and specialist access."

  const tagline = preferences.scenario === "student" ? "Best balance of cost and speed" : preferences.scenario === "personal" ? "Superior Care for You" : "Premium Institutional Healthcare"

  const summaryCards = [
    { label: "Lowest Consultation Fee", value: "Parirenyatwa Hospital", detail: "$10.00 Entry Fee", icon: <DollarSign className="w-3 h-3" /> },
    { label: "Shortest Wait Time", value: "Health Point", detail: "15 Min Avg Wait", icon: <Clock className="w-3 h-3" /> },
    { label: "Best Rated Facility", value: "The Avenues Clinic", detail: "4.8/5.0 Care Score", icon: <Star className="w-3 h-3" /> },
    { label: "Best Insurance Coverage", value: "The Avenues Clinic", detail: "All Major Insurers", icon: <Shield className="w-3 h-3" /> },
  ]

  return (
    <div className="space-y-4 pb-10">
      {/* Best for you summary card */}
      <div className="glass-floating p-4 bg-primary/5 border-primary/20 shadow-xl relative overflow-hidden group teal-glow">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-1000" />
        <p className="text-[9px] font-medium text-primary uppercase tracking-[0.3em] mb-1.5 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Best Healthcare Provider for You
        </p>
        <h2 className="text-2xl font-display font-normal text-white tracking-tight leading-tight">{bestClinic}</h2>
        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{tagline}</p>
        <p className="text-xs text-muted-foreground mt-3 max-w-xl font-sans opacity-80 leading-relaxed font-medium">
          Based on your {preferences.scenario} profile. {recommendationReason}
        </p>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Disclaimer />
        </div>
      </div>

      {/* Secondary Insight Cards */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="glass-floating p-3 h-full floating-hover group rounded-xl border-white/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70 group-hover:text-primary transition-colors">{c.label}</p>
            <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">{c.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
                <div className="w-4 h-4 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    {c.icon}
                </div>
                <p className="text-[10px] text-primary font-medium tracking-widest uppercase">{c.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Medical Highlights */}
      <section className="pt-2">
        <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-3 opacity-70 flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" />
            Medical Highlights
        </h3>
        <div className="grid gap-2.5 sm:grid-cols-4">
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Avg Consultation Fee</p>
            <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">$24.00</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">National Benchmark</p>
          </div>
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Average Wait Time</p>
            <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">43 Minutes</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">Across All Tiers</p>
          </div>
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5 border-primary/20 bg-primary/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Most Common Type</p>
            <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">Private Clinic</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">High Accessibility</p>
          </div>
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Top Healthcare Location</p>
            <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">Harare CBD</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">Highest Node Density</p>
          </div>
        </div>
      </section>
    </div>
  )
}
