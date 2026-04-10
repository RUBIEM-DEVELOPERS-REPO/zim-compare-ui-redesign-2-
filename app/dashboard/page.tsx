"use client"

import { DecisionSnapshot } from "@/components/dashboard/decision-snapshot"
import { MarketHighlights } from "@/components/dashboard/market-highlights"
import { AlertsModule } from "@/components/dashboard/alerts-module"
import { RecentViews } from "@/components/dashboard/recent-views"
import { useAppStore } from "@/lib/store"
import Link from "next/link"
import { NewsPopup } from "@/components/dashboard/news-popup"
import { useI18n } from "@/lib/i18n"

export default function DashboardPage() {
    const { savedComparisons } = useAppStore()
    const { t } = useI18n()


    const cardStyle = "glass-card p-4 group h-full"

    return (
        <div className="space-y-8">
            <DecisionSnapshot />
            <MarketHighlights />

            <div className="grid gap-6 lg:grid-cols-2">
                <AlertsModule />
                <section>
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t("nav.saved")}</h3>

                    {savedComparisons.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border p-6 text-center">
                            <p className="text-sm text-muted-foreground">{t("dashboard.noSavedComparisons")}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t("dashboard.browseAndSave")}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {savedComparisons.slice(0, 5).map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/${c.category}/compare?ids=${c.itemIds.join(",")}`}
                                    className="glass-card p-3 flex items-center justify-between group"
                                >
                                    <div>
                                        <p className="text-sm text-foreground">{c.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {c.category} &middot; {c.itemIds.length} {t("dashboard.items")}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <RecentViews />

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.quickActions")}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: t("nav.banking"), href: "/banking", desc: "Fees, rates, digital banking" },
                        { label: t("nav.telecom"), href: "/telecom", desc: "Data bundles, voice, coverage" },
                        { label: t("nav.schools"), href: "/schools", desc: "Fees, academics, facilities" },
                        { label: t("nav.insurance"), href: "/insurance", desc: "Motor, medical, life, property" },
                    ].map((a) => (
                        <Link
                            key={a.href}
                            href={a.href}
                            className={cardStyle}
                        >
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {a.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{t(`nav.${a.label.toLowerCase()}_desc`)}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <NewsPopup />
        </div>
    )
}

