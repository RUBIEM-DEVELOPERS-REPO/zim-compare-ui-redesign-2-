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
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Vehicle EMI Calculator</p>
                </div>
                <p className="text-xs text-muted-foreground">Calculate your monthly vehicle loan installment.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">Loan Details</h3>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Vehicle Price (USD)</label>
                        <input type="number" value={loanAmount} onChange={e => setLoanAmount(parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Down Payment (USD)</label>
                        <input type="number" value={downPayment} onChange={e => setDownPayment(parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                        <p className="text-xs text-muted-foreground mt-1">Loan amount: ${(loanAmount - downPayment).toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Annual Interest Rate: {interestRate}%</label>
                        <input type="range" min={5} max={35} step={0.5} value={interestRate} onChange={e => setInterestRate(parseFloat(e.target.value))} className="w-full accent-primary" />
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Repayment Period: {months} months</label>
                        <input type="range" min={12} max={84} step={6} value={months} onChange={e => setMonths(parseInt(e.target.value))} className="w-full accent-primary" />
                    </div>
                    <button onClick={calculate} className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                        Calculate EMI
                    </button>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Results</h3>
                    {result === null ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <Calculator className="w-12 h-12 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">Enter loan details and click Calculate EMI.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    <p className="text-xs text-muted-foreground">Monthly Installment</p>
                                </div>
                                <p className="text-3xl font-bold text-foreground">${result.monthly.toLocaleString()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-secondary/50 p-3">
                                    <p className="text-xs text-muted-foreground">Total Repayment</p>
                                    <p className="text-lg font-bold text-foreground">${result.total.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                                    <p className="text-xs text-muted-foreground">Total Interest</p>
                                    <p className="text-lg font-bold text-red-600 dark:text-red-400">${result.interest.toLocaleString()}</p>
                                </div>
                            </div>
                            {repaymentData.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Loan Balance Over Time</p>
                                    <div className="flex items-end gap-0.5 h-20">
                                        {repaymentData.filter((_, i) => i % Math.ceil(repaymentData.length / 30) === 0).map((v, i) => (
                                            <div key={i} className="flex-1 rounded-t-sm bg-primary/40"
                                                style={{ height: `${(v / (loanAmount - downPayment)) * 100}%` }} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                        <span>Month 1</span><span>Month {months}</span>
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
