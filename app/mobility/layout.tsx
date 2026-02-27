"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function MobilityLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Mobility</h1>
                <p className="text-sm text-muted-foreground">Compare car dealerships, vehicles, driving schools, and bus routes in Zimbabwe</p>
            </div>

            <div className="pt-2">
                {children}
            </div>
        </div>
    )
}
