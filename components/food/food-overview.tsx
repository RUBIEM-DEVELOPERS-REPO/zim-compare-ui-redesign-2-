"use client"

import { foodProviders } from "@/lib/mock/food"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"
import { Utensils, Star, Clock, MapPin, TrendingUp, DollarSign, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function FoodOverview({ location = "All Locations" }: { location?: string }) {
  const { preferences } = useAppStore()

  // Logic for "Best for you"
  const bestDining = preferences.scenario === "student" ? "Chicken Inn" : preferences.scenario === "family" ? "Amanzi Restaurant" : "Porkys"
  const recommendationReason = preferences.scenario === "student" 
    ? "Offers the most competitive calorie-to-cost ratio with central CBD access." 
    : preferences.scenario === "family" 
    ? "Premier Highlands location with extensive family-style platters and serene atmosphere."
    : "Ideal corporate lunch venue with consistent service and premium Borrowdale accessibility."

  const tagline = preferences.scenario === "student" ? "Best value for budget dining" : preferences.scenario === "family" ? "Premium Family Experience" : "Top Business Dining Choice"

  const summaryCards = [
    { label: "Cheapest Meal Option", value: "Chicken Inn", detail: "Avg $5.50 per meal", icon: <DollarSign className="w-3 h-3" /> },
    { label: "Best Rated Restaurant", value: "Amanzi Restaurant", detail: "4.8/5.0 Rating", icon: <Star className="w-3 h-3" /> },
    { label: "Best Value Dining", value: "Porkys", detail: "$15.00 Avg Meal Price", icon: <TrendingUp className="w-3 h-3" /> },
    { label: "Best for Groups / Family", value: "Amanzi (Highlands)", detail: "Spacious Garden Seating", icon: <Users className="w-3 h-3" /> },
  ]

  return (
    <div className="space-y-4 pb-10">
      {/* Best for you summary card */}
      <div className="glass-floating p-4 bg-primary/5 border-primary/20 shadow-xl relative overflow-hidden group teal-glow">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-1000" />
        <p className="text-[9px] font-medium text-primary uppercase tracking-[0.3em] mb-1.5 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Best Dining Option for You
        </p>
        <h2 className="text-2xl font-display font-normal text-foreground tracking-tight leading-tight">{bestDining}</h2>
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
            <p className="text-sm font-display font-medium text-foreground mt-0.5 leading-tight">{c.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
                <div className="w-4 h-4 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    {c.icon}
                </div>
                <p className="text-[10px] text-primary font-medium tracking-widest uppercase">{c.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Market Highlights */}
      <section className="pt-2">
        <h3 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-3 opacity-70 flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-primary" />
            Dining Highlights
        </h3>
        <div className="grid gap-2.5 sm:grid-cols-4">
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Avg Meal Price</p>
            <p className="text-sm font-display font-medium text-foreground mt-0.5 leading-tight">$15.17</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">National Average</p>
          </div>
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Most Popular Cuisine</p>
            <p className="text-sm font-display font-medium text-foreground mt-0.5 leading-tight">Fast Food</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">Based on Vol.</p>
          </div>
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5 border-primary/20 bg-primary/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Highest Rated Location</p>
            <p className="text-sm font-display font-medium text-foreground mt-0.5 leading-tight">Highlands</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">4.8 Avg Rating</p>
          </div>
          <div className="glass-floating p-3 h-full floating-hover rounded-xl border-white/5">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">Trending Restaurant</p>
            <p className="text-sm font-display font-medium text-foreground mt-0.5 leading-tight">Chicken Inn</p>
            <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">+12% Monthly Growth</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function Sparkles({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
        </svg>
    )
}
