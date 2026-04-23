"use client"

import React, { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Bell, 
  BellRing, 
  Mail, 
  MessageSquare, 
  Settings2, 
  CheckCheck,
  Zap,
  Clock,
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"


const initialAlerts = [
  { id: 1, title: "Fuel Price Increase", type: "Price Change", content: "Diesel 50 price increased by 2.4% at ZUVA and NOIL stations.", time: "2 hours ago", read: false, priority: "high" },
  { id: 2, title: "New Banking Fee", type: "Regulation", content: "CABS has updated their monthly service fees for Gold accounts.", time: "5 hours ago", read: false, priority: "medium" },
  { id: 3, title: "Data Bundle Promo", type: "Telecom", content: "Econet launched a new 48-hour social media pack for $2.", time: "1 day ago", read: true, priority: "low" },
  { id: 4, title: "Tax Threshold Update", type: "Taxation", content: "Individual income tax-free threshold moved to $300,000.", time: "2 days ago", read: true, priority: "medium" },
  { id: 5, title: "New Hospital Added", type: "Medical", content: "West End Hospital now listed in the insurance comparison tool.", time: "3 days ago", read: true, priority: "low" },
]

export default function SmartAlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [channels, setChannels] = useState({
    push: true,
    email: true,
    sms: false
  })

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })))
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Alert Intelligence"
        subtitle="Stay ahead of the market with real-time updates on prices, taxes, and service changes tailored to your profile."
      >
        <button 
          onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
        >
          <CheckCheck size={16} />
          Mark All as Read
        </button>
      </PageHeader>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Preferences */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card border-primary/20 bg-primary/[0.02]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 size={18} className="text-primary" />
                Channels
              </CardTitle>
              <CardDescription>How you'll receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "push", label: "Push Notifications", icon: BellRing, desc: "Instant mobile/desktop alerts" },
                { id: "email", label: "Email Updates", icon: Mail, desc: "Daily or weekly digests" },
                { id: "sms", label: "SMS Alerts", icon: MessageSquare, desc: "Critical price changes only" }
              ].map((c) => {
                const Icon = c.icon
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{c.label}</span>
                        <span className="text-[10px] text-muted-foreground">{c.desc}</span>
                      </div>
                    </div>
                    <Switch 
                      checked={(channels as any)[c.id]} 
                      onCheckedChange={(checked) => setChannels({...channels, [c.id]: checked})}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap size={18} className="text-secondary" />
                Preferences
              </CardTitle>
              <CardDescription>Tailor your notification feed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Price Fluctuations (>2%)",
                "New Tax Legislations",
                "Product Comparisons",
                "Market Snapshots (Weekly)",
                "System Maintenance"
              ].map((pref) => (
                <div key={pref} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{pref}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Alert Feed */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h2 className="text-xl font-display font-medium flex items-center gap-2 px-2">
            <Bell size={20} className="text-primary" />
            Notification Feed
          </h2>

          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={cn(
                    "relative group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                    alert.read 
                      ? "bg-card/20 border-white/5 opacity-80" 
                      : "bg-white/5 border-primary/20 shadow-lg shadow-primary/5 active-item-glow"
                  )}
                >
                  {!alert.read && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}

                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    alert.priority === "high" ? "bg-destructive/10 text-destructive" :
                    alert.priority === "medium" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                  )}>
                    {alert.type === "Price Change" && <TrendingDown size={20} />}
                    {alert.type === "Regulation" && <Info size={20} />}
                    {alert.type === "Telecom" && <Zap size={20} />}
                    {alert.type === "Taxation" && <MessageSquare size={20} />}
                    {alert.type === "Medical" && <BellRing size={20} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-medium truncate">{alert.title}</h3>
                      <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase border-white/10 font-bold">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{alert.content}</p>
                  </div>

                  <div className="flex items-center md:flex-col md:items-end justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span className="font-sans">{alert.time}</span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium group/btn">
                      View Details
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <Bell size={48} className="mb-4" />
                <p className="text-lg font-medium">All clear! No alerts for now.</p>
                <p className="text-sm">We'll notify you when something important happens.</p>
              </div>
            )}
          </div>
          
          <button className="w-full py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-t border-white/5 mt-4">
            Load More Alerts
          </button>
        </div>
      </div>
    </div>
  )
}
