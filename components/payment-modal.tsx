"use client"

import React, { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  CheckCircle2, 
  Receipt, 
  ArrowRight,
  ShieldCheck,
  History
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Transaction } from "@/lib/types"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: string
    name: string
    price: number
    category: string
    provider?: string
  }
}

export function PaymentModal({ isOpen, onClose, item }: PaymentModalProps) {
  const [step, setStep] = useState<"details" | "confirm" | "success">("details")
  const [paymentMethod, setPaymentMethod] = useState("ecocash")
  const [amount, setAmount] = useState(item.price.toString())
  const [isProcessing, setIsProcessing] = useState(false)
  const [txId, setTxId] = useState("")
  
  const { addTransaction, transactions } = useAppStore()

  useEffect(() => {
    if (isOpen) {
      setStep("details")
      setAmount(item.price.toString())
    }
  }, [isOpen, item.price])

  const handlePayment = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      const newTx: Transaction = {
        id: "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        userId: "u1",
        bankId: item.provider || "System",
        methodId: paymentMethod,
        amount: parseFloat(amount),
        fee: parseFloat(amount) * 0.02,
        tax: parseFloat(amount) * 0.01,
        total: parseFloat(amount) * 1.03,
        status: "completed",
        createdAt: new Date().toISOString(),
      }
      addTransaction(newTx)
      setTxId(newTx.id)
      setIsProcessing(false)
      setStep("success")
    }, 2000)
  }

  const paymentMethods = [
    { id: "ecocash", name: "EcoCash", icon: Smartphone, color: "text-blue-500" },
    { id: "onemoney", name: "OneMoney", icon: Smartphone, color: "text-orange-500" },
    { id: "innbucks", name: "InnBucks", icon: Wallet, color: "text-amber-500" },
    { id: "visa", name: "Visa / Mastercard", icon: CreditCard, color: "text-emerald-500" },
    { id: "zipit", name: "ZIPIT", icon: History, color: "text-primary" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border-white/10 p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <Receipt size={20} className="text-primary" />
              {step === "success" ? "Payment Successful" : "Secure Payment"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              {item.provider ? `${item.provider} &middot; ` : ""}{item.category}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {step === "details" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Amount to Pay (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7 bg-white/5 border-white/10 h-12 text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Payment Method</Label>
                <div className="grid grid-cols-1 gap-2">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all",
                        paymentMethod === m.id 
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-white/5", m.color)}>
                          <m.icon size={18} />
                        </div>
                        <span className="text-sm font-medium">{m.name}</span>
                      </div>
                      {paymentMethod === m.id && <CheckCircle2 size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setStep("confirm")}
                className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-xs font-black uppercase tracking-widest gap-2 group"
              >
                Proceed to Confirm
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Item</span>
                  <span className="font-bold">{item.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-sans font-bold">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (2%)</span>
                  <span className="font-sans font-bold">${(parseFloat(amount) * 0.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Statutory Levies (1%)</span>
                  <span className="font-sans font-bold">${(parseFloat(amount) * 0.01).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Total Payable</span>
                  <span className="text-2xl font-display font-black text-white">${(parseFloat(amount) * 1.03).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                <p className="text-[10px] text-emerald-500/80 font-medium leading-relaxed">
                  Your transaction is encrypted. Verified by ZIMRA & RBZ compliance protocols.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("details")}
                  className="rounded-xl border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-widest h-12"
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold uppercase tracking-widest h-12"
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-4 animate-in zoom-in duration-500">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/20 border border-emerald-500/30">
                <CheckCircle2 size={40} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Transaction Verified</h3>
                <p className="text-xs text-muted-foreground font-medium">Your payment of ${(parseFloat(amount) * 1.03).toFixed(2)} has been successfully routed.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-left">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Reference ID</span>
                  <span className="text-white">{txId}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Timestamp</span>
                  <span className="text-white">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Method</span>
                  <span className="text-white capitalize">{paymentMethod}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => {
                    // Logic to show history would go here
                    onClose()
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest h-12 gap-2"
                >
                  <History size={16} />
                  View Transaction History
                </Button>
                <Button 
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90 rounded-xl text-xs font-bold uppercase tracking-widest h-12"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
