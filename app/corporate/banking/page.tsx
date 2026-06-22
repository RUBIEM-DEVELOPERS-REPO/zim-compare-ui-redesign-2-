"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { cn } from "@/lib/utils"
import {
  Landmark,
  CreditCard,
  Banknote,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react"

// Exact database schema models represented locally
interface BankingProduct {
  id: number;
  bankId: string;
  category: string;
  name: string;
  interestRate: number;
  minBalance: number;
  monthlyFee: number;
  perks: string;
  normalised: number | null;
}

interface BankFee {
  id: number;
  bankId: string;
  category: string;
  name: string;
  amount: number;
  unit: string;
  description: string;
  normalised: number | null;
}

interface BankLoan {
  id: number;
  bankId: string;
  category: string;
  name: string;
  apr: number;
  initiationFee: number;
  earlySettlementPenalty: number;
  maxTermMonths: number;
  requirements: string;
  normalised: number | null;
}

// Simulated Banks
const banks = [
  { id: "cbz", name: "CBZ Bank" },
  { id: "stanbic", name: "Stanbic Bank" },
  { id: "fbc", name: "FBC Bank" },
  { id: "bancabc", name: "BancABC" },
  { id: "stanchart", name: "Standard Chartered" },
  { id: "zb", name: "ZB Bank" },
  { id: "nedbank", name: "Nedbank Zimbabwe" },
  { id: "nmb", name: "NMB Bank" },
  { id: "firstcapital", name: "First Capital Bank" },
]

const initialProduct = (bank: string): Omit<BankingProduct, "id"> => ({
  bankId: bank,
  category: "savings",
  name: "",
  interestRate: 0,
  minBalance: 0,
  monthlyFee: 0,
  perks: "",
  normalised: null,
})

const initialFee = (bank: string): Omit<BankFee, "id"> => ({
  bankId: bank,
  category: "transaction",
  name: "",
  amount: 0,
  unit: "flat",
  description: "",
  normalised: null,
})

const initialLoan = (bank: string): Omit<BankLoan, "id"> => ({
  bankId: bank,
  category: "personal",
  name: "",
  apr: 0,
  initiationFee: 0,
  earlySettlementPenalty: 0,
  maxTermMonths: 12,
  requirements: "",
  normalised: null,
})

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export default function BankingCorporate() {
  const hasHydrated = useHasHydrated()
  const { role } = useAppStore()
  const router = useRouter()

  const [selectedBank, setSelectedBank] = useState("cbz")
  const [bankQuery, setBankQuery] = useState("")
  const [bankFocused, setBankFocused] = useState(false)
  const [activeTab, setActiveTab] = useState<"products" | "fees" | "loans">("products")
  
  // Data lists
  const [products, setProducts] = useState<BankingProduct[]>([])
  const [fees, setFees] = useState<BankFee[]>([])
  const [loans, setLoans] = useState<BankLoan[]>([])

  // Form states
  const [productForm, setProductForm] = useState<Omit<BankingProduct, "id">>(initialProduct("cbz"))
  const [feeForm, setFeeForm] = useState<Omit<BankFee, "id">>(initialFee("cbz"))
  const [loanForm, setLoanForm] = useState<Omit<BankLoan, "id">>(initialLoan("cbz"))
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const selectedRole = typeof window !== "undefined"
    ? (localStorage.getItem("selectedRole") ?? role)
    : role

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("corp_banking_products")
      const savedFees = localStorage.getItem("corp_banking_fees")
      const savedLoans = localStorage.getItem("corp_banking_loans")
      if (savedProducts) setProducts(JSON.parse(savedProducts))
      if (savedFees) setFees(JSON.parse(savedFees))
      if (savedLoans) setLoans(JSON.parse(savedLoans))
    }
  }, [])

  useEffect(() => {
    setProductForm(prev => ({ ...prev, bankId: selectedBank }))
    setFeeForm(prev => ({ ...prev, bankId: selectedBank }))
    setLoanForm(prev => ({ ...prev, bankId: selectedBank }))
  }, [selectedBank])

  const saveProductsToStorage = (newData: BankingProduct[]) => {
    setProducts(newData)
    localStorage.setItem("corp_banking_products", JSON.stringify(newData))
  }
  const saveFeesToStorage = (newData: BankFee[]) => {
    setFees(newData)
    localStorage.setItem("corp_banking_fees", JSON.stringify(newData))
  }
  const saveLoansToStorage = (newData: BankLoan[]) => {
    setLoans(newData)
    localStorage.setItem("corp_banking_loans", JSON.stringify(newData))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeTab === "products") {
        if (!productForm.name.trim()) { addToast("Product Name is required.", "error"); return; }
        const norm = productForm.interestRate - (productForm.monthlyFee * 0.1) - (productForm.minBalance * 0.001);
        setProductForm(prev => ({ ...prev, normalised: norm }));
        const completeRecord = { ...productForm, normalised: norm };
        if (editingId) {
            saveProductsToStorage(products.map(d => d.id === editingId ? { ...completeRecord, id: editingId } : d))
            addToast("Product Data updated.", "success")
        } else {
            saveProductsToStorage([...products, { ...completeRecord, id: Date.now() }])
            addToast("Product Data added.", "success")
        }
    } else if (activeTab === "fees") {
        if (!feeForm.name.trim()) { addToast("Fee Name is required.", "error"); return; }
        const norm = feeForm.amount;
        setFeeForm(prev => ({ ...prev, normalised: norm }));
        const completeRecord = { ...feeForm, normalised: norm };
        if (editingId) {
            saveFeesToStorage(fees.map(d => d.id === editingId ? { ...completeRecord, id: editingId } : d))
            addToast("Fee Data updated.", "success")
        } else {
            saveFeesToStorage([...fees, { ...completeRecord, id: Date.now() }])
            addToast("Fee Data added.", "success")
        }
    } else if (activeTab === "loans") {
        if (!loanForm.name.trim()) { addToast("Loan Name is required.", "error"); return; }
        const term = loanForm.maxTermMonths > 0 ? loanForm.maxTermMonths : 1;
        const norm = loanForm.apr + ((loanForm.initiationFee / term) * 12);
        setLoanForm(prev => ({ ...prev, normalised: norm }));
        const completeRecord = { ...loanForm, normalised: norm };
        if (editingId) {
            saveLoansToStorage(loans.map(d => d.id === editingId ? { ...completeRecord, id: editingId } : d))
            addToast("Loan Data updated.", "success")
        } else {
            saveLoansToStorage([...loans, { ...completeRecord, id: Date.now() }])
            addToast("Loan Data added.", "success")
        }
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setProductForm(initialProduct(selectedBank))
    setFeeForm(initialFee(selectedBank))
    setLoanForm(initialLoan(selectedBank))
    addToast("Edit cancelled.", "info")
  }

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (selectedRole !== "corporate" && selectedRole !== "admin" && role !== "corporate" && role !== "admin") {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-lg font-medium text-foreground">Corporate Access Required</h1>
        <p className="text-sm text-muted-foreground">
          Select Corporate or Admin from the interface selection screen to access this page.
        </p>
        <button
          onClick={() => router.push("/interface-selection")}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Go to Interface Selection
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background space-y-8 animate-in fade-in duration-700 pt-12 px-6 sm:px-10 pb-24 overflow-x-hidden">
      
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg pointer-events-auto transition-all animate-in slide-in-from-top-2",
              t.type === "success" ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400" :
              t.type === "error" ? "bg-red-950/80 border-red-500/30 text-red-400" :
              "bg-blue-950/80 border-blue-500/30 text-blue-400"
            )}
          >
            {t.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="text-xs font-medium">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => router.push("/corporate")}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-display font-medium text-foreground tracking-tight flex items-center gap-3">
            <Landmark className="w-8 h-8 text-primary" />
            Banking Input
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Input, manage, and audit banking tables (Products, Fees, Loans) matching the Neon DB.
          </p>
        </div>
      </div>



      {/* Main Forms and Views Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* Form Container (LHS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-floating p-6 sm:p-8 space-y-6 relative border-white/10">
            
            {/* Header Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
                <button
                  onClick={() => { setActiveTab("products"); if (editingId) cancelEdit(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "products" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <PiggyBank className="w-3.5 h-3.5" /> Products
                </button>
                <button
                  onClick={() => { setActiveTab("fees"); if (editingId) cancelEdit(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "fees" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Fees
                </button>
                <button
                  onClick={() => { setActiveTab("loans"); if (editingId) cancelEdit(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === "loans" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Banknote className="w-3.5 h-3.5" /> Loans
                </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                  {/* Bank/Provider combobox */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Provider <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankFocused ? bankQuery : (banks.find(b => b.id === selectedBank)?.name || selectedBank)}
                      onChange={(e) => {
                        setBankQuery(e.target.value)
                        // If it matches one of the hardcoded bank names, we set the ID, otherwise we set the raw string
                        const matchedBank = banks.find(b => b.name.toLowerCase() === e.target.value.toLowerCase())
                        setSelectedBank(matchedBank ? matchedBank.id : e.target.value)
                        if (editingId) cancelEdit()
                      }}
                      onFocus={() => {
                        setBankFocused(true)
                        const currentName = banks.find(b => b.id === selectedBank)?.name || selectedBank
                        setBankQuery(currentName)
                      }}
                      onBlur={() => setTimeout(() => setBankFocused(false), 150)}
                      placeholder="Select or type bank name…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {bankFocused && (
                      <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#0d1117] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-44 overflow-y-auto">
                        {[
                          ...new Set([
                            ...banks.map((b) => b.name),
                            ...products.map((d) => banks.find(b => b.id === d.bankId)?.name || d.bankId),
                            ...fees.map((d) => banks.find(b => b.id === d.bankId)?.name || d.bankId),
                            ...loans.map((d) => banks.find(b => b.id === d.bankId)?.name || d.bankId),
                          ])
                        ]
                          .filter((name) =>
                            name.toLowerCase().includes(bankQuery.toLowerCase())
                          )
                          .map((name) => (
                            <button
                              key={name}
                              type="button"
                              onMouseDown={() => {
                                const matchedBank = banks.find(b => b.name.toLowerCase() === name.toLowerCase())
                                setSelectedBank(matchedBank ? matchedBank.id : name)
                                setBankQuery(name)
                                setBankFocused(false)
                              }}
                              className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/10 transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                        {bankQuery &&
                          ![
                            ...banks.map((b) => b.name),
                            ...products.map((d) => banks.find(b => b.id === d.bankId)?.name || d.bankId),
                            ...fees.map((d) => banks.find(b => b.id === d.bankId)?.name || d.bankId),
                            ...loans.map((d) => banks.find(b => b.id === d.bankId)?.name || d.bankId),
                          ].some(
                            (name) => name.toLowerCase() === bankQuery.toLowerCase()
                          ) && (
                            <div className="px-3.5 py-2 text-[10px] text-muted-foreground border-t border-white/5">
                              New provider:{" "}
                              <span className="text-primary">{bankQuery}</span>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {activeTab === "products" ? "Product Name" : activeTab === "fees" ? "Fee Name" : "Loan Name"} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={
                        activeTab === "products" ? productForm.name :
                        activeTab === "fees" ? feeForm.name :
                        loanForm.name
                      }
                      onChange={(e) => {
                        if (activeTab === "products") setProductForm({ ...productForm, name: e.target.value })
                        else if (activeTab === "fees") setFeeForm({ ...feeForm, name: e.target.value })
                        else setLoanForm({ ...loanForm, name: e.target.value })
                      }}
                      placeholder={activeTab === "products" ? "e.g., Plus Savings" : activeTab === "fees" ? "e.g., RTGS Transfer" : "e.g., Salary Loan"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={
                        activeTab === "products" ? productForm.category :
                        activeTab === "fees" ? feeForm.category :
                        loanForm.category
                      }
                      onChange={(e) => {
                        if (activeTab === "products") setProductForm({ ...productForm, category: e.target.value })
                        else if (activeTab === "fees") setFeeForm({ ...feeForm, category: e.target.value })
                        else setLoanForm({ ...loanForm, category: e.target.value })
                      }}
                      placeholder={activeTab === "products" ? "e.g., savings, current" : activeTab === "fees" ? "e.g., transaction, atm" : "e.g., personal, sme"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {activeTab === "products" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.interestRate}
                          onChange={(e) => setProductForm({ ...productForm, interestRate: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Min Balance
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.minBalance}
                          onChange={(e) => setProductForm({ ...productForm, minBalance: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Monthly Fee
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.monthlyFee}
                          onChange={(e) => setProductForm({ ...productForm, monthlyFee: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Perks (JSON Array)
                        </label>
                        <input
                          type="text"
                          value={productForm.perks}
                          onChange={(e) => setProductForm({ ...productForm, perks: e.target.value })}
                          placeholder='e.g. ["Free Withdrawals", "Rewards"]'
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "fees" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Amount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={feeForm.amount}
                          onChange={(e) => setFeeForm({ ...feeForm, amount: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={feeForm.unit}
                          onChange={(e) => setFeeForm({ ...feeForm, unit: e.target.value })}
                          placeholder="e.g. flat, %, per_transaction"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={feeForm.description}
                          onChange={(e) => setFeeForm({ ...feeForm, description: e.target.value })}
                          placeholder="Details"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "loans" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          APR (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={loanForm.apr}
                          onChange={(e) => setLoanForm({ ...loanForm, apr: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Initiation Fee
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={loanForm.initiationFee}
                          onChange={(e) => setLoanForm({ ...loanForm, initiationFee: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Early Settlement Penalty
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={loanForm.earlySettlementPenalty}
                          onChange={(e) => setLoanForm({ ...loanForm, earlySettlementPenalty: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Max Term (Months)
                        </label>
                        <input
                          type="number"
                          value={loanForm.maxTermMonths}
                          onChange={(e) => setLoanForm({ ...loanForm, maxTermMonths: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Requirements (JSON)
                        </label>
                        <input
                          type="text"
                          value={loanForm.requirements}
                          onChange={(e) => setLoanForm({ ...loanForm, requirements: e.target.value })}
                          placeholder='e.g. ["Payslip", "ID"]'
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Normalised Score
                    </label>
                    <input
                      type="number"
                      disabled
                      value={
                        (activeTab === "products" ? productForm.normalised :
                        activeTab === "fees" ? feeForm.normalised :
                        loanForm.normalised) ?? ""
                      }
                      placeholder="Calculates on Add Record"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground/60 cursor-not-allowed"
                    />
                  </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl teal-glow"
                  >
                    {editingId ? "Update Record" : "Add Record"}
                  </button>
              </div>
            </form>
          </div>
        </div>

        {/* Data Table Container (RHS / Bottom) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-floating p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Entered Records
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Normalised</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(activeTab === "products" ? products :
                    activeTab === "fees" ? fees :
                    loans)
                    .filter((item: any) => item.bankId === selectedBank)
                    .map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors text-xs text-white/80">
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3">{item.category}</td>
                      <td className="py-2 px-3">{item.normalised ? item.normalised.toFixed(2) : "-"}</td>
                    </tr>
                  ))}
                  {(activeTab === "products" ? products :
                    activeTab === "fees" ? fees :
                    loans).filter((item: any) => item.bankId === selectedBank).length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-xs text-muted-foreground italic">
                        No records found for this bank and category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
