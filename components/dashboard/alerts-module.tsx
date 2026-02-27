"use client"

import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function AlertsModule() {
  const { alerts, markAlertRead } = useAppStore()
  const { t } = useI18n()

  if (alerts.length === 0) return null

  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.recentAlerts")}</h3>
      <div className="space-y-2">
        {alerts.slice(0, 5).map((alert) => (
          <button
            key={alert.id}
            onClick={() => markAlertRead(alert.id)}
            className={cn(
              "w-full flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 backdrop-blur-sm bg-card/60",
              !alert.read && "border-primary/30 bg-primary/5"
            )}
          >
            <div
              className={cn(
                "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                alert.type === "price_drop" && "bg-emerald-400",
                alert.type === "new_promo" && "bg-blue-400",
                alert.type === "fee_increase" && "bg-amber-400",
                alert.type === "claims_change" && "bg-red-400"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(alert.createdAt).toLocaleDateString()} &middot; {t(`nav.${alert.category}`)}
              </p>
            </div>
            {!alert.read && (
              <span className="shrink-0 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                {t("dashboard.new")}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
