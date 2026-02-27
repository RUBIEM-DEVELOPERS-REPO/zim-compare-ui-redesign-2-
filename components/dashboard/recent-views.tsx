"use client"

import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"

export function RecentViews() {
  const { recentViews } = useAppStore()
  const { t } = useI18n()

  if (recentViews.length === 0) {
    return (
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.recentViews")}</h3>
        <p className="text-sm text-muted-foreground">{t("dashboard.noRecentViews")}</p>
      </section>
    )
  }

  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.recentViews")}</h3>
      <div className="flex gap-2 flex-wrap">
        {recentViews.slice(0, 8).map((v) => (
          <Link
            key={v.id + v.timestamp}
            href={`/${v.category}`}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-card/60"
          >
            <span className="text-foreground">{v.name}</span>
            <span className="text-xs text-muted-foreground ml-2 capitalize">{t(`nav.${v.category}`)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
