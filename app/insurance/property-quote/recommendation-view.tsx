"use client"

import React from "react"
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  BadgeCheck,
  Zap,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { getRecommendations, insurers, Recommendation } from "@/lib/mock/insurance-risk"

/** Renders a progress bar whose width is set imperatively to avoid inline style lint warnings. */
function ProgressBar({ value, className }: { value: number, className?: string }) {
  const barRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${value}%`
    }
  }, [value])
  return (
    <div className={cn("h-1.5 w-full bg-white/5 rounded-full overflow-hidden", className)}>
      <div ref={barRef} className="h-full bg-primary transition-all duration-1000 ease-out" />
    </div>
  )
}

interface RecommendationViewProps {
  assetType: "house" | "car"
  formData: any
  images: File[]
}

export function RecommendationView({ assetType, formData, images }: RecommendationViewProps) {
  const recommendations = getRecommendations(assetType, formData)

  return (
    <div className="space-y-12 pb-12">
      {/* Top Section: Risk Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BadgeCheck size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-display font-medium">Risk Assessment Profile</h2>
                <p className="text-muted-foreground text-sm font-sans">Based on visual characteristics and verified asset details.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card bg-primary/[0.02]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Overall Risk Level</span>
                   <Badge className="bg-emerald-500/20 text-emerald-500 border-none px-3 font-bold">Low Risk</Badge>
                </div>
                <div className="text-3xl font-display font-bold">A+ Stable</div>
                <p className="text-xs text-muted-foreground mt-2 font-sans px-1 leading-relaxed">
                   The asset shows high structural integrity with minimal visible hazard indicators. Verified security measures significantly reduce theft risk.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Insurability Score</span>
                   <span className="text-primary font-bold text-lg font-sans">98/100</span>
                </div>
                <ProgressBar value={98} className="mt-4" />
                <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-tighter">Excellent eligibility for all premium tiers</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer Panel */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
              <AlertCircle size={14} />
              Important Notice
           </div>
           <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              These recommendations are <strong>indicative</strong> and generated via visual analysis simulation. Final underwriting is subject to insurer verification of all documents, claims history, and on-site inspection.
           </p>
           <div className="flex flex-col gap-2 pt-2">
              <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-widest h-8 justify-start">
                 <ShieldCheck size={12} className="mr-2" /> Privacy Statement
              </Button>
              <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-widest h-8 justify-start">
                 <Info size={12} className="mr-2" /> Terms of Service
              </Button>
           </div>
        </div>
      </div>

      {/* Main Recommendations */}
      <div className="space-y-6">
        <h3 className="text-xl font-display font-medium px-2">Top Insurer matches for your {assetType}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const insurer = insurers.find(i => i.id === rec.insurerId)
            return (
              <Card 
                key={rec.id} 
                className="glass-card group hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
              >
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-primary border border-white/10 group-hover:bg-primary/20 transition-colors">
                         {insurer?.logo}
                      </div>
                      <div>
                         <CardTitle className="text-lg">{insurer?.name}</CardTitle>
                         <CardDescription className="text-[10px] uppercase font-bold tracking-tighter flex items-center gap-1">
                            <Star size={10} className="fill-primary text-primary" /> {insurer?.rating} Rating
                         </CardDescription>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="text-xs font-bold text-primary">{rec.matchScore}% Match</div>
                      <div className="flex gap-1 mt-1">
                        {rec.tags.map(tag => (
                          <Badge key={tag} className="text-[8px] px-1.5 h-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-tighter">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <div className="text-sm font-sans text-muted-foreground uppercase tracking-widest font-bold">Policy Type</div>
                         <div className="text-lg font-display font-medium">{rec.productName}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-sans text-muted-foreground uppercase tracking-widest font-bold">Est. Premium</div>
                         <div className="text-xl font-display font-bold text-primary">{rec.estimatedPremiumRange}</div>
                         <div className="text-[10px] text-muted-foreground">per annum</div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Key Benefits</div>
                      <div className="grid grid-cols-2 gap-2">
                        {rec.benefits.map(benefit => (
                          <div key={benefit} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                             <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                             <span className="line-clamp-1">{benefit}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="pt-4 border-t border-white/5 space-y-4">
                      <div className="bg-white/5 p-3 rounded-xl">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-primary mb-2 flex items-center gap-1.5">
                           <Zap size={10} /> Why this fits
                        </div>
                        <ul className="space-y-1">
                           {rec.reasons.map((reason, idx) => (
                             <li key={idx} className="text-[10px] text-muted-foreground flex items-start gap-2">
                                <ChevronRight size={10} className="mt-0.5 shrink-0" />
                                {reason}
                             </li>
                           ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest h-12 shadow-lg shadow-primary/20">
                           Request Quote
                        </Button>
                        <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 h-12 px-4 shadow-xl">
                           <ExternalLink size={18} />
                        </Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xl font-display font-medium px-2">Side-by-side Insurer Comparison</h3>
        <div className="rounded-3xl border border-white/10 overflow-hidden bg-card/5 backdrop-blur-2xl">
          <Table>
             <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/10">
                   <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold">Insurer</TableHead>
                   <TableHead className="text-[10px] uppercase tracking-widest font-bold">Plan Type</TableHead>
                   <TableHead className="text-[10px] uppercase tracking-widest font-bold">Trust Score</TableHead>
                   <TableHead className="text-[10px] uppercase tracking-widest font-bold">Key Indicator</TableHead>
                   <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold">Action</TableHead>
                </TableRow>
             </TableHeader>
             <TableBody>
                {recommendations.map((rec) => {
                  const insurer = insurers.find(i => i.id === rec.insurerId)
                  return (
                    <TableRow key={rec.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                       <TableCell className="font-display font-medium py-6">
                          {insurer?.name}
                       </TableCell>
                       <TableCell>
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-tighter">
                             {rec.type}
                          </Badge>
                       </TableCell>
                       <TableCell>
                          <div className="flex items-center gap-2">
                             <ProgressBar value={insurer?.trustScore || 0} className="w-16" />
                             <span className="text-[11px] font-bold text-muted-foreground">{insurer?.trustScore}%</span>
                          </div>
                       </TableCell>
                       <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {rec.coverage}
                       </TableCell>
                       <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px] gap-2">
                             Compare Insurers <ArrowRight size={12} />
                          </Button>
                       </TableCell>
                    </TableRow>
                  )
                })}
             </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
