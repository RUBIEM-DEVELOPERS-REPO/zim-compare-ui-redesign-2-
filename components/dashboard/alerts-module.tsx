"use client"

import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { cn, formatDate } from "@/lib/utils"
import { Bell } from "lucide-react"

export function AlertsModule() {
  const { alerts, markAlertRead } = useAppStore()
  const { t } = useI18n()

  if (alerts.length === 0) return null

  return (
    <section className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4 container-breathable">
        <div>
          <h3 className="text-xl font-display font-medium text-foreground tracking-tight">{t("dashboard.recentAlerts")}</h3>
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-60">Real-time Market Events</p>
        </div>
        <Bell className="w-5 h-5 text-primary/30 animate-pulse" />
      </div>
      
      <div className="space-y-2">
        {alerts.slice(0, 2).map((alert) => (
          <button
            key={alert.id}
            onClick={() => markAlertRead(alert.id)}
            className={cn(
              "w-full flex items-center gap-3 surface-glass p-3 text-left floating-hover border-white/10",
              !alert.read ? "bg-primary/5 teal-glow ring-1 ring-primary/20" : "bg-card/20 opacity-80"
            )}
          >
            <div
              className={cn(
                "h-3 w-3 shrink-0 rounded-full",
                alert.type === "price_drop" && "bg-emerald-500 teal-glow shadow-emerald-500/50",
                alert.type === "new_promo" && "bg-blue-500 teal-glow shadow-blue-500/50",
                alert.type === "fee_increase" && "bg-amber-500 teal-glow shadow-amber-500/50",
                alert.type === "claims_change" && "bg-red-500 teal-glow shadow-red-500/50"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-display font-medium truncate leading-none mb-1">{alert.message}</p>
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-1">
                {formatDate(alert.createdAt)} &middot; {t(`nav.${alert.category}`)}
              </p>
            </div>
            {!alert.read && (
              <span className="shrink-0 text-[8px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium uppercase tracking-widest teal-glow">
                {t("dashboard.new")}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}

