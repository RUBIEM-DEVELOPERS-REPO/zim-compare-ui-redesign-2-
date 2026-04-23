"use client"

import { TrendingUp, ArrowRight, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

interface SwitchSaveSimulatorProps {
  category: string
  current: any
  recommended: any
  className?: string
}

export function SwitchSaveSimulator({ 
  category, 
  current, 
  recommended, 
  className 
}: SwitchSaveSimulatorProps) {
  const { t } = useI18n()

  if (!current || !recommended || current.id === recommended.id) return null

  const calculateSavings = () => {
    switch (category) {
      case "banking":
        // Monthly Savings = (Current Fee - Rec Fee) + (Interest Rate Diff * assumed $1000 balance)
        const feeSavings = (current.monthlyFee || 0) - (recommended.monthlyFee || 0)
        const interestDiff = ((recommended.interestRate || 0) - (current.interestRate || 0)) / 100
        const interestGain = (1000 * interestDiff) / 12 // monthly interest gain
        return {
          monthly: feeSavings + interestGain,
          yearly: (feeSavings + interestGain) * 12,
          unit: "month"
        }
      case "telecom":
        // Monthly Savings based on 10GB usage or flat price diff
        if (current.costPerGB && recommended.costPerGB) {
          const savings = (current.costPerGB - recommended.costPerGB) * 10
          return { monthly: savings, yearly: savings * 12, unit: "month" }
        }
        const telecomSavings = (current.price || 0) - (recommended.price || 0)
        return { monthly: telecomSavings, yearly: telecomSavings * 12, unit: "month" }
      case "insurance":
        const insuranceSavings = (current.monthlyPremium || 0) - (recommended.monthlyPremium || 0)
        return { monthly: insuranceSavings, yearly: insuranceSavings * 12, unit: "month" }
      case "schools":
      case "universities":
        const tuitionSavings = (current.tuitionPerTerm || current.annualFees || 0) - (recommended.tuitionPerTerm || recommended.annualFees || 0)
        const period = current.annualFees ? "year" : "term"
        return { 
          monthly: tuitionSavings, 
          yearly: current.annualFees ? tuitionSavings : tuitionSavings * 3, 
          unit: period 
        }
      case "utilities":
        const utilitySavings = (current.price || 0) - (recommended.price || 0)
        return { monthly: utilitySavings, yearly: utilitySavings * 12, unit: "month" }
      case "mobility":
      case "transport":
        const mobilitySavings = (current.price || 0) - (recommended.price || 0)
        return { monthly: mobilitySavings, yearly: mobilitySavings * 12, unit: "month" }
      case "hotels":
      case "stayscape":
        const hotelSavings = (current.price || 0) - (recommended.price || 0)
        return { monthly: hotelSavings, yearly: hotelSavings * 12, unit: "night" }
      default:
        return { monthly: 0, yearly: 0, unit: "month" }
    }
  }

  const savings = calculateSavings()
  if (savings.monthly <= 0) return null

  return (
    <div className={cn(
      "glass-floating p-4 relative overflow-hidden group border-primary/20 bg-primary/5 teal-glow h-full flex flex-col",
      className
    )}>
      {/* Background Decorative */}
      <div className="absolute -top-6 -right-6 text-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
        <TrendingUp size={70} />
      </div>

      <div className="flex items-center gap-2 mb-3 relative z-10">
        <div className="p-1.5 bg-primary/20 rounded-lg text-primary teal-glow">
          <Zap size={14} />
        </div>
        <div>
          <h3 className="text-base font-display font-black text-foreground uppercase tracking-tight">
            Switch & Save Simulator
          </h3>
          <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-[0.2em] mt-0.5 opacity-60">
            Estimate your savings by switching providers
          </p>
        </div>
      </div>

      <div className="space-y-3 relative z-10 flex-1">
        <div className="flex items-center gap-3 py-2 border-y border-white/5">
          <div className="flex flex-col flex-1">
            <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Current</span>
            <span className="text-xs font-display font-medium text-white truncate">
              {current.bankName || current.providerName || current.name}
            </span>
          </div>
          <div className="flex items-center justify-center p-1.5 rounded-full bg-white/5 border border-white/10">
            <ArrowRight size={10} className="text-primary animate-pulse" />
          </div>
          <div className="flex flex-col flex-1 text-right">
            <span className="text-[8px] font-medium text-primary uppercase tracking-widest mb-1">Recommended</span>
            <span className="text-xs font-display font-medium text-primary truncate">
              {recommended.bankName || recommended.providerName || recommended.name}
            </span>
          </div>
        </div>

        <div className="py-3 flex flex-col items-center justify-center text-center">
            <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest mb-1">Potential Savings</p>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-black text-primary tabular-nums teal-glow">
                    ${savings.monthly.toFixed(2)}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">/{savings.unit}</span>
            </div>
            <p className="text-[8px] text-primary font-medium uppercase tracking-[0.2em] mt-2 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              Save ${savings.yearly.toFixed(2)} annually
            </p>
        </div>

        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <p className="text-[10px] text-foreground/80 font-medium leading-relaxed">
            Switch from <span className="text-white">{current.bankName || current.providerName || current.name}</span> → <span className="text-primary">{recommended.bankName || recommended.providerName || recommended.name}</span> and save <span className="text-primary font-bold">${savings.monthly.toFixed(2)}</span>/{savings.unit}
          </p>
        </div>
      </div>

      <button className="w-full mt-4 bg-primary py-2.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 relative z-10 group/btn">
        <span>Apply Now / Switch Protocol</span>
        <CheckCircle2 size={12} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
