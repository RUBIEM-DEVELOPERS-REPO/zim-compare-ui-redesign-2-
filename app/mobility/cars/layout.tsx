"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const carTabs = [
    { key: "dealerships", label: "Dealerships", href: "/mobility/cars/dealerships" },
    { key: "prices", label: "Prices", href: "/mobility/cars/prices" },
    { key: "comparison", label: "Comparison", href: "/mobility/cars/comparison" },
]

export default function CarsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="space-y-4">
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {carTabs.map((t) => (
                    <Link
                        key={t.key}
                        href={t.href}
                        className={cn(
                            "shrink-0 glass-tab-base",
                            pathname === t.href && "glass-tab-active"
                        )}
                    >
                        {t.label}
                    </Link>
                ))}
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}
