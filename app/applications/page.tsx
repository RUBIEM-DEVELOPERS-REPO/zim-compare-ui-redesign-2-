"use client"

import React, { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  LayoutGrid, 
  Calculator, 
  FileCheck2, 
  Truck, 
  ShieldCheck, 
  BarChart4, 
  Wrench,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Command
} from "lucide-react"
import { cn } from "@/lib/utils"

const appTools = [
  { 
    id: 1, 
    name: "Tax Estimator", 
    desc: "Calculate VAT, CIT, and IMTT for your business transactions.", 
    icon: Calculator, 
    category: "Finance",
    status: "Stable",
    color: "text-primary",
    bgColor: "bg-primary/10",
    hotkey: "T"
  },
  { 
    id: 2, 
    name: "Permit Validator", 
    desc: "Verify the authenticity of trade and business permits instantly.", 
    icon: FileCheck2, 
    category: "Compliance",
    status: "Updated",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    hotkey: "V"
  },
  { 
    id: 3, 
    name: "Customs Duty Calc", 
    desc: "Estimate import duties and excise for cross-border logistics.", 
    icon: Truck, 
    category: "Logistics",
    status: "Beta",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    hotkey: "D"
  },
  { 
    id: 4, 
    name: "Statutory Auditor", 
    desc: "Check compliance status against NSSA and ZIMRA requirements.", 
    icon: ShieldCheck, 
    category: "Compliance",
    status: "Stable",
    color: "text-accent",
    bgColor: "bg-accent/10",
    hotkey: "S"
  },
  { 
    id: 5, 
    name: "Market Analyst", 
    desc: "Visualise pricing trends and inflation across categories.", 
    icon: BarChart4, 
    category: "Data",
    status: "Analytical",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    hotkey: "A"
  },
  { 
    id: 6, 
    name: "Rate Converters", 
    desc: "Real-time blended rate and multi-currency conversion tool.", 
    icon: Wrench, 
    category: "Utility",
    status: "Stable",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    hotkey: "C"
  }
]

export default function ApplicationsPage() {
  const [search, setSearch] = useState("")

  const filteredApps = appTools.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight mb-2">
            Applications
          </h1>
          <p className="text-sm text-muted-foreground font-sans max-w-2xl">
            A unified launcher for internal fintech tools and compliance utility applications.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Sparkles size={12} className="text-primary" />
          <span>New tools added monthly</span>
        </div>
      </div>

      {/* Global Search and Shortcuts */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder="Search internal tools (Press / to focus)..." 
            className="pl-12 h-14 bg-white/5 border-white/10 text-lg rounded-2xl focus-visible:ring-primary/20 transition-all font-sans"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-card/10 border border-white/5 p-2 rounded-2xl">
          {[
            { label: "All", count: appTools.length },
            { label: "Finance", count: 1 },
            { label: "Compliance", count: 2 }
          ].map((cat) => (
            <button key={cat.label} className="px-4 py-2 rounded-xl hover:bg-white/5 text-sm transition-colors flex items-center gap-2">
              <span className="font-medium">{cat.label}</span>
              <span className="text-[10px] w-5 h-5 flex items-center justify-center rounded-md bg-white/10 text-muted-foreground">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => {
          const Icon = app.icon
          return (
            <Card key={app.id} className="glass-card group hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
              {/* Highlight Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110", app.bgColor, app.color)}>
                    <Icon size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter border-white/10 bg-white/5">
                      {app.status}
                    </Badge>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-bold text-muted-foreground">
                      <Command size={8} />
                      {app.hotkey}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">{app.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2 h-10">{app.desc}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{app.category}</span>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    Launch Tool
                    <ExternalLink size={14} />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Prototyping Placeholder Card */}
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-8 text-center aspect-[1.3/1] group hover:border-primary/30 transition-colors">
          <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles size={24} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Request New Application</h3>
          <p className="text-[10px] text-muted-foreground/60 max-w-[180px]">Have a specific calculation or tool in mind? Let us build it.</p>
        </div>
      </div>
    </div>
  )
}
