"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Wallet, ArrowRight, ShieldCheck, Search } from "lucide-react"
import { PaymentModal } from "./payment-modal"

interface PaymentItem {
  id: string
  name: string
  detail: string
}

interface PaymentsInterfaceProps {
  category: string
  items: PaymentItem[]
}

export function PaymentsInterface({ category, items }: PaymentsInterfaceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>("50")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedItem = items.find(i => i.id === selectedId)

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.detail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePayClick = () => {
    if (selectedId && amount) {
      setIsModalOpen(true)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        {/* Left Section: Provider Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Select Recipient</h3>
            <div className="relative max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden",
                  selectedId === item.id 
                    ? "bg-primary/10 border-primary shadow-xl shadow-primary/10" 
                    : "glass-card border-white/5 hover:border-white/20 hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  selectedId === item.id ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground group-hover:text-foreground"
                )}>
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-tight mb-0.5">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{item.detail}</p>
                </div>
                {selectedId === item.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Payment Details Card */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="glass-card p-6 border-white/10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldCheck size={80} />
            </div>

            <div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">Payment Summary</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Payment Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-8 pr-4 py-4 text-xl font-display font-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/30 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground">Category</span>
                    <span className="text-foreground">{category}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground">Provider</span>
                    <span className={cn("text-foreground", !selectedItem && "text-muted-foreground italic")}>
                      {selectedItem?.name || "None Selected"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayClick}
                  disabled={!selectedId || !amount || parseFloat(amount) <= 0}
                  className={cn(
                    "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-xl",
                    selectedId && amount && parseFloat(amount) > 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 hover:scale-[1.02] active:scale-95"
                      : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  )}
                >
                  Initiate Secure Payment
                  <ArrowRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-500/5 border border-teal-500/10">
              <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <p className="text-[9px] text-teal-500/70 font-medium leading-relaxed uppercase tracking-tighter">
                Payments are processed through secured RBZ-compliant gateways with 256-bit encryption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <PaymentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={{
            id: selectedItem.id,
            name: selectedItem.name,
            price: parseFloat(amount) || 0,
            category: category,
            provider: selectedItem.name
          }}
        />
      )}
    </div>
  )
}
