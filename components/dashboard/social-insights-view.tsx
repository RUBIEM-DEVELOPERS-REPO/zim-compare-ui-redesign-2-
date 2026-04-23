"use client"

import React from "react"
import { useAppStore } from "@/lib/store"
import { 
  Sparkles, Shield, TrendingUp, Heart, Zap, 
  Instagram, Twitter, Facebook, Music, Linkedin,
  ExternalLink, ArrowRight
} from "lucide-react"

export function SocialInsightsView() {
  const { socialProfiles, enableSocialInsights, savedComparisons } = useAppStore()

  if (!enableSocialInsights) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Shield size={32} />
        </div>
        <h3 className="text-xl font-medium text-foreground">Social Insights Disabled</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Enable Social Intelligence in your profile settings to unlock lifestyle-based financial optimizations and AI-driven market maneuvers.
        </p>
      </div>
    )
  }

  const socialCount = Object.values(socialProfiles).filter(Boolean).length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-display font-normal text-white tracking-tight leading-tight mb-2">
            Social Intelligence
          </h1>
          <p className="text-sm text-muted-foreground font-sans max-w-2xl">
            Lifestyle-derived financial optimizations based on your connected digital presence and behavior patterns.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
          <div className="flex -space-x-2">
            {socialProfiles.instagram && <div className="w-8 h-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center"><Instagram size={14} className="text-primary" /></div>}
            {socialProfiles.twitter && <div className="w-8 h-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center"><Twitter size={14} className="text-primary" /></div>}
            {socialProfiles.tiktok && <div className="w-8 h-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center"><Music size={14} className="text-primary" /></div>}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-primary">
            {socialCount} Nodes Connected
          </span>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Lifestyle Profile Card */}
        <div className="glass-floating p-8 relative overflow-hidden group shadow-lg md:col-span-2">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-md">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-xl font-display font-medium text-white">Neural Lifestyle Profile</h3>
                <p className="text-[10px] text-primary uppercase font-medium tracking-[0.2em] mt-1">Status: High Fidelity</p>
              </div>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed font-sans mb-8">
              Analysis of your connected platforms indicates an <span className="text-white font-medium">Active Digital Nomad</span> lifestyle. 
              Your interest in travel (via Twitter) and decentralized finance (via LinkedIn) suggests a preference for high-liquidity, 
              borderless banking solutions with zero international transaction overhead.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Risk Appetite</p>
                <p className="text-lg font-display text-white">Moderate-Aggressive</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Consumption Habit</p>
                <p className="text-lg font-display text-white">Value-Oriented Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Guard Card */}
        <div className="glass-floating p-8 bg-primary/5 border-primary/20 flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
              <Shield size={24} />
            </div>
            <h4 className="text-xl font-display font-medium text-white mb-4">Zero-Scrape Integrity</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These insights are generated via AI inference of your provided handles and interests. No data is harvested from the social platforms themselves.
            </p>
          </div>
          <p className="text-[10px] text-primary/60 font-medium uppercase tracking-widest mt-6">Protocol: Local-Only Analysis</p>
        </div>

        {/* Tactical Recommendation Card 1 */}
        <div className="glass-floating p-8 floating-hover border-white/5 bg-white/5 flex flex-col h-full group">
          <div className="flex items-center justify-between mb-8">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full">Finance</span>
          </div>
          <h4 className="text-lg font-display font-medium text-white mb-3">High-Yield FX Strategy</h4>
          <p className="text-sm text-muted-foreground flex-grow leading-relaxed">
            Based on your frequent mentions of international tech on Twitter, switching to the Stanbic Global Wallet could save you $45/month in currency conversion.
          </p>
          <button className="flex items-center gap-2 text-xs font-medium text-primary mt-6 group-hover:gap-3 transition-all">
            Execute Maneuver <ArrowRight size={14} />
          </button>
        </div>

        {/* Tactical Recommendation Card 2 */}
        <div className="glass-floating p-8 floating-hover border-white/5 bg-white/5 flex flex-col h-full group">
          <div className="flex items-center justify-between mb-8">
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <Heart size={24} />
            </div>
            <span className="text-[10px] font-medium text-pink-400 uppercase tracking-widest bg-pink-400/10 px-3 py-1 rounded-full">Lifestyle</span>
          </div>
          <h4 className="text-lg font-display font-medium text-white mb-3">Priority Concierge Access</h4>
          <p className="text-sm text-muted-foreground flex-grow leading-relaxed">
            Your LinkedIn professional status qualifies you for FBC Bank's Platinum Concierge, currently offering zero-fee airport lounge access.
          </p>
          <button className="flex items-center gap-2 text-xs font-medium text-primary mt-6 group-hover:gap-3 transition-all">
            View Details <ExternalLink size={14} />
          </button>
        </div>

        {/* Tactical Recommendation Card 3 */}
        <div className="glass-floating p-8 floating-hover border-white/5 bg-white/5 flex flex-col h-full group">
          <div className="flex items-center justify-between mb-8">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <span className="text-[10px] font-medium text-teal-400 uppercase tracking-widest bg-teal-400/10 px-3 py-1 rounded-full">Telecom</span>
          </div>
          <h4 className="text-lg font-display font-medium text-white mb-3">Content Creator Bundle</h4>
          <p className="text-sm text-muted-foreground flex-grow leading-relaxed">
            Given your TikTok presence, Econet's 'Streamer Plus' package is 12% more efficient for your upload patterns than your current plan.
          </p>
          <button className="flex items-center gap-2 text-xs font-medium text-primary mt-6 group-hover:gap-3 transition-all">
            Upgrade Node <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  )
}
