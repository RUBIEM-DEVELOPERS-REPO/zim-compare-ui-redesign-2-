"use client"

import React, { useState } from "react"
import { 
  Play, Music, Tv, Gamepad2, Smartphone,
  TrendingUp, Star, Zap, Info, ArrowRight,
  Check, X, Flame, Sparkles, Plus, Minus,
  ExternalLink, ShieldCheck, Heart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

const categories = [
  { id: "music", label: "Music", icon: Music },
  { id: "streaming", label: "Streaming", icon: Tv },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "entertainment", label: "Entertainment", icon: Sparkles },
]

const platforms = {
  music: [
    { 
      name: "Spotify", 
      price: 2.99, 
      offline: true,
      quality: "320kbps",
      library: "100M+ Songs",
      bestFor: "Discovery",
      features: ["Offline playback", "Highest audio quality", "Huge podcast library"], 
      popularity: 98, 
      isTrending: true, 
      isBestValue: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
    },
    { 
      name: "Apple Music", 
      price: 3.49, 
      offline: true,
      quality: "Lossless",
      library: "100M+ Songs",
      bestFor: "Audiophiles",
      features: ["Lossless audio", "Dolby Atmos", "Spatial audio"], 
      popularity: 85, 
      isTrending: false, 
      isBestValue: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    { 
      name: "YouTube Music", 
      price: 1.99, 
      offline: true,
      quality: "256kbps",
      library: "80M+ Songs",
      bestFor: "Videos",
      features: ["Included with Premium", "Music videos", "Algorithm-driven"], 
      popularity: 78, 
      isTrending: false, 
      isBestValue: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg"
    },
    { 
      name: "Deezer", 
      price: 2.49, 
      offline: true,
      quality: "HiFi",
      library: "90M+ Songs",
      bestFor: "Lyrics",
      features: ["HiFi audio", "Flow playlist", "Lyrics sync"], 
      popularity: 62, 
      isTrending: false, 
      isBestValue: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/db/Deezer_logo.svg"
    }
  ],
  streaming: [
    { 
      name: "Netflix", 
      price: 7.99, 
      offline: true,
      quality: "4K HDR",
      library: "6000+ Titles",
      bestFor: "Originals",
      features: ["Originals", "4K HDR", "Mobile games"], 
      popularity: 95, 
      isTrending: true, 
      isBestValue: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
    },
    { 
      name: "Showmax", 
      price: 4.49, 
      offline: true,
      quality: "1080p",
      library: "2000+ Titles",
      bestFor: "Local/Sports",
      features: ["Local content", "Mobile only plan", "Live football"], 
      popularity: 82, 
      isTrending: false, 
      isBestValue: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Showmax_logo.svg"
    },
    { 
      name: "Apple TV+", 
      price: 4.99, 
      offline: true,
      quality: "4K HDR",
      library: "200+ Titles",
      bestFor: "Quality",
      features: ["High-end originals", "Family sharing", "Ad-free"], 
      popularity: 65, 
      isTrending: true, 
      isBestValue: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg"
    }
  ],
  gaming: [
    { 
      name: "PC Game Pass", 
      price: 9.99, 
      offline: true,
      quality: "Native",
      library: "400+ Games",
      bestFor: "Variety",
      features: ["Day-one releases", "Huge library", "EA Play included"], 
      popularity: 92, 
      isTrending: true, 
      isBestValue: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/01/Xbox_Logo.svg"
    },
    { 
      name: "PS Plus", 
      price: 12.99, 
      offline: true,
      quality: "4K/Native",
      library: "700+ Games",
      bestFor: "Exclusives",
      features: ["Cloud streaming", "Game catalog", "Ubisoft+ Classics"], 
      popularity: 88, 
      isTrending: false, 
      isBestValue: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg"
    }
  ]
}

export function GenZHub() {
  const [activeTab, setActiveTab] = useState("music")
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])

  const currentPlatforms = platforms[activeTab as keyof typeof platforms] || []

  const toggleCompare = (name: string) => {
    setSelectedForCompare(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <div className="min-h-screen bg-[#020408] text-foreground pb-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-12 animate-in fade-in duration-700">
        
        {/* HERO HEADER */}
        <header className="relative space-y-2">
          <h1 className="text-6xl md:text-7xl font-display font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-[#00E5C0] to-[#00FFC6] bg-clip-text text-transparent">
              Gen Z Hub
            </span>
          </h1>
          <p className="text-muted-foreground/80 text-lg font-medium max-w-2xl leading-relaxed">
            Compare the best music, streaming, gaming & digital platforms with high-fidelity intelligence.
          </p>
          <div className="absolute -bottom-6 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 via-primary/5 to-transparent" />
          <div className="absolute -bottom-6 left-0 w-32 h-[2px] bg-primary shadow-[0_0_15px_#00E5C0]" />
        </header>

        {/* CATEGORY TABS */}
        <nav className="flex flex-wrap gap-4 pt-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "relative flex items-center gap-3 px-8 py-4 rounded-full backdrop-blur-xl border transition-all duration-500 group",
                  isActive 
                    ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_20px_rgba(0,229,192,0.15)]" 
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20 hover:text-foreground"
                )}
              >
                <Icon size={18} className={cn("transition-all duration-500", isActive && "scale-110")} />
                <span className="text-xs font-black uppercase tracking-[0.15em]">{cat.label}</span>
                {isActive && (
                  <div className="absolute -inset-[1px] rounded-full border border-primary/50 animate-pulse" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* PLATFORM CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {currentPlatforms.map((platform, idx) => (
                <Card 
                  key={idx}
                  className="group relative overflow-hidden bg-white/[0.03] border-white/[0.08] backdrop-blur-2xl rounded-[2.5rem] p-6 hover:-translate-y-2 hover:bg-white/[0.05] transition-all duration-500"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Status Tags */}
                  <div className="absolute top-5 right-5">
                    {platform.isTrending ? (
                      <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border border-orange-500/20">
                        <Flame size={10} fill="currentColor" />
                        Trending
                      </div>
                    ) : platform.isBestValue ? (
                      <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border border-primary/20">
                        <Zap size={10} fill="currentColor" />
                        Best Value
                      </div>
                    ) : null}
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#0a0c10] border border-white/10 p-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-1">{platform.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black">${platform.price}</span>
                        <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-widest">/mo</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {platform.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-center gap-2.5 text-[11px] text-muted-foreground/80 font-medium">
                          <div className="h-1 w-1 rounded-full bg-primary/40 shadow-[0_0_5px_#00E5C0]" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="flex items-center justify-between text-[9px] uppercase font-black tracking-widest text-muted-foreground/40">
                        <span>Usage Trend</span>
                        <span>{platform.popularity}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary/40 to-primary shadow-[0_0_10px_#00E5C0] transition-all duration-1000 ease-out"
                          style={{ width: `${platform.popularity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* COMPARISON TABLE */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Intelligence matrix</h2>
                <div className="flex items-center gap-4">
                  <button className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
                    Export Data
                  </button>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <button className="text-[11px] uppercase font-black tracking-[0.2em] text-primary">
                    Live Feed
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Platform</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Price</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Offline</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Audio Quality</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Library</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Best For</th>
                      <th className="px-8 py-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {currentPlatforms.map((p, idx) => (
                      <tr key={idx} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#0a0c10] border border-white/10 p-1.5">
                              <img src={p.logo} alt="" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-bold text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm font-medium text-foreground/90">${p.price}</td>
                        <td className="px-6 py-6">
                          {p.offline ? (
                            <Check className="text-primary" size={16} />
                          ) : (
                            <X className="text-muted-foreground/20" size={16} />
                          )}
                        </td>
                        <td className="px-6 py-6 text-xs text-muted-foreground font-medium">{p.quality || "Standard"}</td>
                        <td className="px-6 py-6 text-xs text-muted-foreground font-medium">{p.library || "—"}</td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 rounded-full bg-secondary/40 text-[10px] font-bold text-foreground/80">
                            {p.bestFor}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => toggleCompare(p.name)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                              selectedForCompare.includes(p.name)
                                ? "bg-primary text-black"
                                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                            )}
                          >
                            {selectedForCompare.includes(p.name) ? "Selected" : "Add"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                  <Info size={14} />
                  <span>Showing real-time synthesized pricing from Zimbabwean regions.</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    Clear Selection
                  </button>
                  <button className="px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] bg-primary text-black shadow-[0_0_20px_rgba(0,229,192,0.3)] hover:scale-105 transition-all">
                    Compare Platforms
                  </button>
                </div>
              </div>
            </div>
          </div>

            {/* RIGHT INSIGHTS PANEL (STICKY) */}
          <aside className="space-y-6">
            <div className="sticky top-10 space-y-6">
              
              {/* BEST FOR YOU CARD */}
              <Card className="relative overflow-hidden bg-primary/10 border-primary/20 p-8 rounded-[2.5rem] space-y-8">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Star size={120} fill="currentColor" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-primary text-black shadow-[0_0_15px_#00E5C0]">
                      <Sparkles size={18} />
                    </div>
                    <h3 className="font-bold text-lg">Best for You</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Intelligence analysis suggests <span className="text-foreground font-black">Spotify Student</span> is your optimal digital match.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                    <span>Precision Match</span>
                    <span>94%</span>
                  </div>
                  <div className="relative h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary shadow-[0_0_15px_#00E5C0] animate-pulse transition-all duration-1000" 
                      style={{ width: '94%' }} 
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-[9px] font-black uppercase tracking-widest text-primary border border-primary/20">
                    Best Value
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-widest text-foreground/60 border border-white/10">
                    Most Popular
                  </span>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
