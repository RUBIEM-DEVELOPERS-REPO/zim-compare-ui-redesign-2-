"use client"

import { useState } from "react"
import { Calculator, DollarSign } from "lucide-react"

export function TransportEmiCalculator() {
    const [loanAmount, setLoanAmount] = useState(20000)
    const [interestRate, setInterestRate] = useState(18)
    const [months, setMonths] = useState(60)
    const [downPayment, setDownPayment] = useState(5000)
    const [result, setResult] = useState<{ monthly: number; total: number; interest: number } | null>(null)

    const calculate = () => {
        const principal = loanAmount - downPayment
        const monthlyRate = interestRate / 100 / 12
        const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
        const total = monthly * months + downPayment
        const interest = total - loanAmount
        setResult({ monthly: Math.round(monthly * 100) / 100, total: Math.round(total), interest: Math.round(interest) })
    }

    const repaymentData = result
        ? Array.from({ length: months }, (_, i) => {
            const principal = loanAmount - downPayment
            const monthlyRate = interestRate / 100 / 12
            return Math.max(0, principal * Math.pow(1 + monthlyRate, -(months - i)))
        })
        : []

    return (
        <div className="space-y-4">
            <div className="glass-floating p-3 bg-primary/5 border-primary/20 shadow-xl rounded-xl group teal-glow">
                <div className="flex items-center gap-2 mb-1 relative z-10">
                    <Calculator className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[10px] font-medium text-white uppercase tracking-[0.2em] opacity-70">Neural EMI Engine</p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60 relative z-10">Calculate monthly vehicle installments.</p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
                <div className="glass-floating p-4 space-y-3.5 border-white/5 bg-white/5 rounded-xl">
                    <h3 className="text-[10px] font-medium text-white uppercase tracking-[0.2em] opacity-70 mb-1">Loan Parameters</h3>
                    <div>
                        <label htmlFor="price-input" className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block opacity-60">Price (USD)</label>
                        <input 
                            id="price-input"
                            type="number" 
                            placeholder="Vehicle Price"
                            value={loanAmount} onChange={e => setLoanAmount(parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary shadow-inner" />
                    </div>
                    <div>
                        <label htmlFor="deposit-input" className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block opacity-60">Deposit (USD)</label>
                        <input 
                            id="deposit-input"
                            type="number" 
                            placeholder="Down Payment"
                            value={downPayment} onChange={e => setDownPayment(parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary shadow-inner" />
                        <p className="text-[8px] text-primary/70 mt-1 uppercase tracking-widest font-medium">Principal: ${(loanAmount - downPayment).toLocaleString()}</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="apr-input" className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">APR</label>
                            <span className="text-[10px] font-display font-medium text-primary tabular-nums">{interestRate}%</span>
                        </div>
                        <input 
                            id="apr-input"
                            type="range" 
                            min={5} max={35} step={0.5} value={interestRate} onChange={e => setInterestRate(parseFloat(e.target.value))} 
                            className="w-full accent-primary h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" />
                        <span className="sr-only">Interest Rate: {interestRate}%</span>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="term-input" className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">Term</label>
                            <span className="text-[10px] font-display font-medium text-primary tabular-nums">{months} Mos</span>
                        </div>
                        <input 
                            id="term-input"
                            type="range" 
                            min={12} max={84} step={6} value={months} onChange={e => setMonths(parseInt(e.target.value))} 
                            className="w-full accent-primary h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" />
                        <span className="sr-only">Loan Term: {months} Months</span>
                    </div>
                    <button onClick={calculate} className="w-full rounded-lg bg-primary py-2 text-[10px] font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-[0.2em] teal-glow font-display">
                        Compute EMI
                    </button>
                </div>

                <div className="glass-floating p-4 border-white/5 bg-white/5 rounded-xl">
                    <h3 className="text-[10px] font-medium text-white uppercase tracking-[0.2em] opacity-70 mb-3">Analysis Result</h3>
                    {result === null ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center opacity-40">
                            <Calculator className="w-8 h-8 text-muted-foreground mb-3" />
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Awaiting Parameters</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="glass-floating bg-primary/10 border border-primary/20 p-3.5 rounded-xl teal-glow">
                                <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                    <DollarSign className="w-3 h-3 text-primary" />
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">Monthly Quota</p>
                                </div>
                                <p className="text-2xl font-display font-medium text-white tabular-nums leading-tight">${result.monthly.toLocaleString()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="glass-floating bg-white/5 border-white/10 p-2.5 rounded-lg shadow-inner">
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mb-0.5">Repayment</p>
                                    <p className="text-sm font-display font-medium text-white tabular-nums">${result.total.toLocaleString()}</p>
                                </div>
                                <div className="glass-floating bg-red-500/5 border border-red-500/20 p-2.5 rounded-lg shadow-inner">
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mb-0.5">Interest</p>
                                    <p className="text-sm font-display font-medium text-red-400 tabular-nums">${result.interest.toLocaleString()}</p>
                                </div>
                            </div>
                            {repaymentData.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Liquidation Curve</p>
                                        <div className="h-14 w-full">
                                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                {(() => {
                                                    const bars = repaymentData.filter((_, i) => i % Math.ceil(repaymentData.length / 32) === 0)
                                                    const barWidth = 100 / bars.length - 0.5
                                                    return bars.map((v, i) => {
                                                        const h = (v / (loanAmount - downPayment)) * 100
                                                        return (
                                                            <rect 
                                                                key={i} 
                                                                x={i * (100 / bars.length)} 
                                                                y={100 - h} 
                                                                width={barWidth} 
                                                                height={h} 
                                                                className="fill-primary/40 hover:fill-primary transition-colors cursor-pointer"
                                                                rx="1"
                                                            >
                                                                <title>Principal: ${v.toLocaleString()}</title>
                                                            </rect>
                                                        )
                                                    })
                                                })()}
                                            </svg>
                                        </div>
                                    <div className="flex justify-between text-[7px] font-medium text-muted-foreground uppercase tracking-widest mt-1 opacity-40">
                                        <span>Start</span><span>Month {months}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

