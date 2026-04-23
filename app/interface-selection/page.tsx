"use client"

import { useRouter } from "next/navigation"
import { User, Building2, ShieldCheck, ArrowRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Role } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

export default function InterfaceSelectionPage() {
    const router = useRouter()
    const { setRole, userName } = useAppStore()
    const { t } = useI18n()

    const interfaces = [
        {
            id: "registered" as Role,
            titleKey: "common.consumer",
            descriptionKey: "common.consumerDesc",
            icon: User,
            color: "text-primary",
            accentColor: "rgba(19, 145, 135, 1)",
        },
        {
            id: "corporate" as Role,
            titleKey: "common.corporate",
            descriptionKey: "common.corporateDesc",
            icon: Building2,
            color: "text-indigo-600 dark:text-indigo-400",
            accentColor: "rgba(99, 102, 241, 1)",
        },
        {
            id: "admin" as Role,
            titleKey: "common.systemAdmin",
            descriptionKey: "common.systemAdminDesc",
            icon: ShieldCheck,
            color: "text-red-600 dark:text-red-400",
            accentColor: "rgba(239, 68, 68, 1)",
        }
    ]

    const handleSelect = (role: Role) => {
        setRole(role)
        if (role === "registered") {
            router.push("/chat")
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <div className="relative h-screen flex items-center justify-center bg-background overflow-hidden px-6 py-4">
            <div className="relative z-10 w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-3xl md:text-4xl font-display font-medium text-[#111827] dark:text-[rgba(255,255,255,0.92)] tracking-tight mb-2">
                        Welcome back,{" "}
                        <span className="text-primary">{userName || "User"}</span>
                    </h1>
                    <p className="text-sm md:text-base text-[#667085] dark:text-[rgba(255,255,255,0.68)] max-w-xl mx-auto leading-relaxed">
                        {t("common.selectInterface")}
                    </p>
                </div>

                {/* Role Selection Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {interfaces.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            className={cn(
                                "animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both stagger-item",
                                "group relative flex flex-col text-left glass-teal-card p-6 transition-all duration-500 active:scale-[0.98]",
                            )}
                        >
                            <div className="icon-highlight-strip mb-4 transition-all duration-500 group-hover:scale-[1.02] flex items-center justify-center">
                                <item.icon className={cn("w-10 h-10 text-primary")} />
                            </div>

                            <h3 className="text-xl font-display font-medium text-[#111827] dark:text-[rgba(255,255,255,0.92)] mb-2.5 flex items-center gap-3">
                                {t(item.titleKey)}
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                            </h3>

                            <p className="text-sm text-[#667085] dark:text-[rgba(255,255,255,0.68)] leading-relaxed flex-grow transition-colors">
                                {t(item.descriptionKey)}
                            </p>

                            <div className="mt-[18px] flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[rgba(17,24,39,0.42)] dark:text-[rgba(255,255,255,0.50)] group-hover:text-primary transition-all">
                                <span className="h-px bg-current opacity-10 flex-grow" />
                                {t("common.launchInterface")}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
