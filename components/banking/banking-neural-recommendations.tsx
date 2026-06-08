"use client"

import * as React from "react"
import { Sparkles, TrendingUp, Info, CheckCircle2, Zap, Landmark, Wallet, CreditCard, ShieldCheck, ArrowRightLeft, ShoppingBag } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { AnalysisResult, analyzeInput } from "@/lib/neural-engine"

interface BankingNeuralRecommendationsProps {
    className?: string
}

const paymentMethods = [
    "EcoCash",
    "ZIPIT",
    "Swipe",
    "Bank Transfer",
    "Cash Withdrawal",
    "OneMoney",
    "InnBucks",
    "Mukuru"
]

const productTypes = [
    "Groceries",
    "Fuel",
    "School Fees",
    "Rent",
    "Electricity / ZESA Tokens",
    "Airtime & Data Bundles",
    "Medical Bills",
    "Transport / Kombi Fare",
    "Restaurant / Takeaway",
    "Hardware / Building Materials"
]

export function BankingNeuralRecommendations({ className }: BankingNeuralRecommendationsProps) {
    const [amount, setAmount] = React.useState("500")
    const [method1, setMethod1] = React.useState("EcoCash")
    const [method2, setMethod2] = React.useState("ZIPIT")
    const [product, setProduct] = React.useState("Groceries")
    const [result, setResult] = React.useState<AnalysisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)

    const handleGetRecommendation = () => {
        setIsAnalyzing(true)
        // Simulate neural processing for payment comparison
        setTimeout(() => {
            // Mock a specific recommendation result based on the pair and product
            const best = (product === "Fuel" || product === "Transport / Kombi Fare") ? "Cash Withdrawal" : 
                         (product === "Groceries" && method1 === "EcoCash") ? "EcoCash" : method1;

            const analysis: AnalysisResult = {
                bestOption: best,
                analysis: `For ${product} payments of $${amount}, ${best} is the neural leader. It offers superior merchant acceptance for ${product.toLowerCase()} in local hubs compared to ${best === method1 ? method2 : method1}.`,
                comparison: [
                    "Optimal for " + product,
                    "High Merchant Acceptance",
                    "Lowest Fee Tier",
                    "Neural Trust High"
                ],
                score: 96,
                recommendation: `${best} via neural selection`,
                reason: `Optimized merchant penetration for ${product.toLowerCase()} in high-traffic regions.`
            }
            setResult(analysis)
            setIsAnalyzing(false)
        }, 800)
    }

    // Initial analysis on mount
    React.useEffect(() => {
        handleGetRecommendation()
    }, [])

    const dropdownPillStyle = "h-[48px] w-full px-6 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"

    return (
        <div className={cn("max-w-[1280px] mx-auto pt-0 pb-8 space-y-8 relative", className)}>
            {/* Background Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
            
            {/* 1. Top Floating Input Bar (88px height) */}
            <div className="h-[88px] px-4 py-4 flex items-center gap-3 group glass-anti-gravity">
                {/* Pill Input: Amount */}
                <div className="flex flex-col flex-1 max-w-[130px]">
                    <span className="text-[10px] font-bold text-teal-400/60 uppercase tracking-[0.2em] mb-1 ml-3">Amount ($)</span>
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-[48px] w-full px-5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all"
                    />
                </div>

                {/* Dropdown: Payment Method 1 */}
                <div className="flex flex-col flex-1 max-w-[200px]">
                    <span className="text-[10px] font-bold text-teal-400/60 uppercase tracking-[0.2em] mb-1 ml-3">Method 1</span>
                    <div className="relative">
                        <select 
                            value={method1}
                            onChange={(e) => setMethod1(e.target.value)}
                            className={dropdownPillStyle}
                            aria-label="Payment Method 1"
                        >
                            {paymentMethods.map(m => <option key={m} value={m} className="bg-[#0a1419] text-white">{m}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400/50">
                            <ArrowRightLeft size={12} className="rotate-90" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 text-white/20">
                    <ArrowRightLeft size={14} />
                </div>

                {/* Dropdown: Payment Method 2 */}
                <div className="flex flex-col flex-1 max-w-[200px]">
                    <span className="text-[10px] font-bold text-teal-400/60 uppercase tracking-[0.2em] mb-1 ml-3">Method 2</span>
                    <div className="relative">
                        <select 
                            value={method2}
                            onChange={(e) => setMethod2(e.target.value)}
                            className={dropdownPillStyle}
                            aria-label="Payment Method 2"
                        >
                            {paymentMethods.map(m => <option key={m} value={m} className="bg-[#0a1419] text-white">{m}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400/50">
                            <ArrowRightLeft size={12} className="rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Dropdown: Product / Service */}
                <div className="flex flex-col flex-1 max-w-[240px]">
                    <span className="text-[10px] font-bold text-teal-400/60 uppercase tracking-[0.2em] mb-1 ml-3">Product / Service</span>
                    <div className="relative">
                        <select 
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            className={dropdownPillStyle}
                            aria-label="Product or Service"
                        >
                            {productTypes.map(p => <option key={p} value={p} className="bg-[#0a1419] text-white">{p}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400/50">
                            <ShoppingBag size={14} />
                        </div>
                    </div>
                </div>

                {/* Glowing "Get Recommendation" Button */}
                <button 
                    onClick={handleGetRecommendation}
                    disabled={isAnalyzing}
                    className="h-[48px] px-6 ml-auto rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:scale-[1.05] hover:shadow-[0_0_35px_rgba(20,184,166,0.7)] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isAnalyzing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Zap size={14} fill="currentColor" />
                    )}
                    Optimize
                </button>
            </div>

            {/* 2. Main Recommendation Card (3-column, min 260px height) */}
            {result && (
                <div className="min-h-[260px] p-8 grid grid-cols-[260px_1fr_280px] gap-10 group glass-anti-gravity">
                    {/* Left Section: Recommended Method + Logo + Match Badge */}
                    <div className="flex flex-col justify-center border-r border-white/5 pr-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-[64px] h-[64px] bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                                <Wallet className="w-8 h-8 text-teal-400" />
                            </div>
                            <div className="flex flex-col">
                                <div className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 w-fit mb-2">
                                    <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{result.score}% Match</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white leading-tight uppercase tracking-tight">{result.bestOption}</h3>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-white/60">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <Zap size={14} className="text-teal-400/80" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Fast • Low Cost • Widely Accepted</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <ShieldCheck size={14} className="text-teal-400/80" />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-widest">Neural Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: AI Explanation Text */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles size={18} className="text-teal-400 animate-pulse" />
                            <span className="text-[11px] font-black text-teal-400 uppercase tracking-[0.3em]">Neural Efficiency Analysis</span>
                        </div>
                        <p className="text-[15px] text-white/90 leading-relaxed font-medium mb-8">
                            {result.analysis}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {result.comparison.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                                    <span className="text-[12px] text-white/70 font-bold tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section: Comparison Bars (36px rows, 6px progress bars) */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                        <div className="mb-4">
                            <span className="text-[10px] font-black text-teal-400/60 uppercase tracking-[0.3em] block text-center">Efficiency Scorecard</span>
                        </div>
                        
                        <div className="space-y-5">
                            {[
                                { label: "Settlement Speed", value: 98, color: "from-teal-400 to-emerald-500" },
                                { label: "Fee Efficiency", value: 92, color: "from-teal-400 to-emerald-500" },
                                { label: "Merchant Reach", value: 85, color: "from-blue-400 to-indigo-500" },
                                { label: "Neural Trust", value: 96, color: "from-teal-400 to-teal-600" }
                            ].map((stat, i) => (
                                <div key={i} className="h-[36px] flex flex-col justify-center space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-tighter">{stat.label}</span>
                                        <span className="text-[11px] font-black text-teal-400">{stat.value}%</span>
                                    </div>
                                    <Progress 
                                        value={stat.value} 
                                        className="h-[6px] w-full bg-white/10"
                                        indicatorClassName={cn("bg-gradient-to-r", stat.color)}
                                        aria-label={stat.label}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <button className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all">
                            Download Fee Chart
                        </button>
                    </div>
                </div>
            )}

            {/* 3. Floating Stats Cards (180x100px) beneath */}
            <div className="flex flex-wrap gap-6 justify-center">
                {[
                    { label: "Est. Transaction Fee", value: "$0.12", icon: Wallet },
                    { label: "Daily Volume Limit", value: "$5,000", icon: TrendingUp },
                    { label: "Risk Mitigation", value: "Neural-Safe", icon: Info },
                    { label: "Network Uptime", value: "99.99%", icon: CheckCircle2 }
                ].map((stat, i) => (
                    <div 
                        key={i}
                        className="w-[180px] h-[100px] p-5 flex flex-col justify-between group/stat glass-anti-gravity cursor-default"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-teal-400/60 uppercase tracking-[0.2em] leading-tight">
                                {stat.label}
                            </span>
                            <stat.icon size={14} className="text-teal-400/40 group-hover/stat:text-teal-400 transition-colors" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
