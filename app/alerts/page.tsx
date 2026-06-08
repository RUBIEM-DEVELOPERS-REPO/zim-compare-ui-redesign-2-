"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Bell, Smartphone, MessageSquare, Mail, History, ShieldCheck, CreditCard, ChevronRight } from "lucide-react"

export default function AlertsPage() {
  const { alertPreferences, setAlertPreference, alerts, role } = useAppStore()
  const [activeTab, setActiveTab] = useState("preferences")

  const categories = [
    { id: "banking", name: "Banking & Transaction Fees", icon: CreditCard },
    { id: "telecom", name: "Telecom & Data Bundles", icon: Smartphone },
    { id: "insurance", name: "Insurance Premiums", icon: ShieldCheck },
    { id: "regulated", name: "Regulated Prices", icon: Bell },
  ]

  const channels = [
    { id: "in_app", name: "In-App Notification", icon: Bell },
    { id: "sms", name: "SMS Alert", icon: MessageSquare, paid: true },
    { id: "whatsapp", name: "WhatsApp Alert", icon: Smartphone, paid: true },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-foreground">Smart Alerts</h1>
          <p className="text-muted-foreground">Never miss a price drop or fee change. Manage your multi-channel notifications.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20">
          <History className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-tighter">Delivery Status: Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border">
        {[
          { id: "preferences", label: "Preferences", icon: SettingsIcon },
          { id: "logs", label: "Delivery Logs", icon: History },
          { id: "subscriptions", label: "Paid Subscriptions", icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 pb-4 text-sm font-medium transition-all relative",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "preferences" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {categories.map((cat) => {
              const pref = alertPreferences.find(p => p.category === cat.id)
              const isActive = pref?.active ?? false
              const activeChannels = pref?.channels ?? ["in_app"]

              return (
                <div key={cat.id} className="glass-card overflow-hidden group">
                  <div className="p-6 flex items-center justify-between border-b border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-secondary group-hover:bg-primary/10 transition-colors">
                        <cat.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">Alert me when prices in this sector move by &gt; 5%</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAlertPreference(cat.id, activeChannels, !isActive)}
                      title={isActive ? "Disable alerts" : "Enable alerts"}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                        isActive ? "bg-primary" : "bg-secondary"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
                        isActive ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                  
                  <div className={cn(
                    "p-6 grid gap-4 transition-all duration-500",
                    isActive ? "opacity-100 max-h-96" : "opacity-40 pointer-events-none grayscale max-h-96"
                  )}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Delivery Channels</p>
                    <div className="flex flex-wrap gap-3">
                      {channels.map((chan) => {
                        const isChanSelected = activeChannels.includes(chan.id as any)
                        return (
                          <button
                            key={chan.id}
                            onClick={() => {
                              const newChannels = isChanSelected 
                                ? activeChannels.filter(c => c !== chan.id)
                                : [...activeChannels, chan.id as any]
                              setAlertPreference(cat.id, newChannels, isActive)
                            }}
                            className={cn(
                              "flex-1 min-w-[140px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group/chan",
                              isChanSelected 
                                ? "bg-primary/5 border-primary/30 text-primary" 
                                : "border-border bg-card hover:border-primary/20 text-muted-foreground"
                            )}
                            title={`Toggle ${chan.name}`}
                          >
                            <chan.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{chan.name}</span>
                            {chan.paid && (
                              <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">Paid</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <h3 className="font-medium text-foreground mb-4">Why use SMS/WhatsApp?</h3>
              <ul className="space-y-4">
                {[
                  "Offline visibility for instant price action",
                  "Direct links to transaction advisory",
                  "Secure one-time delivery verification",
                  "Lower data usage for price tracking"
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                    <CheckCircleIcon className="w-4 h-4 text-primary shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Upgrade to Premium
              </button>
            </div>

            <div className="glass-card p-6 border-dashed border-2">
              <h3 className="text-sm font-medium text-foreground mb-1">Global Alert Statistics</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Last 30 days of market movement</p>
              <div className="space-y-4">
                 <div className="space-y-1">
                   <div className="flex justify-between text-[10px] font-medium">
                     <span className="text-foreground">Banking Fees</span>
                     <span className="text-red-500">+12.4%</span>
                   </div>
                   <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-red-500 w-[65%]" />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-[10px] font-medium">
                     <span className="text-foreground">Telecom Bundles</span>
                     <span className="text-green-500">-4.2%</span>
                   </div>
                   <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-[40%]" />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="glass-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-foreground">Delivery History</h3>
            <button className="text-xs text-primary font-medium hover:underline">Download full log (.csv)</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/30">
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Alert Message</th>
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Channel</th>
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {alerts.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-foreground">{a.message}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{a.category}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {a.channel === "sms" && <MessageSquare className="w-3 h-3 text-blue-400" />}
                        {a.channel === "whatsapp" && <Smartphone className="w-3 h-3 text-emerald-400" />}
                        {!a.channel && <Bell className="w-3 h-3 text-primary" />}
                        <span className="text-xs text-foreground capitalize">{a.channel || "In-App"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-medium uppercase",
                        a.status === "failed" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {a.status || "Delivered"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}

function CheckCircleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  )
}

