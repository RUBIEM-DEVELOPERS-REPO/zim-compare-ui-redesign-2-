"use client"

import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { History } from "lucide-react"

export function RecentViews() {
  const { recentViews } = useAppStore()
  const { t } = useI18n()

  if (recentViews.length === 0) {
    return (
      <section className="surface-glass p-5 shadow-inner text-center">
        <h3 className="text-[9px] font-medium uppercase tracking-[0.3em] text-muted-foreground mb-3 opacity-60">{t("dashboard.recentViews")}</h3>
        <p className="text-lg font-display font-medium text-white/40">{t("dashboard.noRecentViews")}</p>
      </section>
    )
  }

  return (
    <section className="surface-glass p-5 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 text-primary/10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
        <History size={160} />
      </div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-display font-medium text-white tracking-tight">{t("dashboard.recentViews")}</h3>
          <p className="text-[9px] text-primary/80 font-medium uppercase tracking-widest mt-1 bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20 w-fit">Neural Usage Pattern</p>
        </div>
        <div className="p-2.5 rounded-2xl bg-card/10 border border-white/10 shadow-inner">
            <History className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {recentViews.slice(0, 8).map((v) => (
          <Link
            key={v.id + v.timestamp}
            href={`/${v.category}`}
            className="surface-glass px-4 py-2 flex items-center gap-3 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 floating-hover teal-glow group/pill"
          >
            <span className="text-xs font-display font-medium text-white group-hover/pill:text-primary transition-colors">{v.name}</span>
            <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
            <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-muted-foreground group-hover/pill:text-white transition-colors">{t(`nav.${v.category}`)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

