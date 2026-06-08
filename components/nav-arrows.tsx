"use client"

import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function NavArrows() {
    const router = useRouter()
    const pathname = usePathname()
    const [canGoBack, setCanGoBack] = useState(false)

    useEffect(() => {
        // Re-evaluate on every navigation
        // If we're not on the landing page, we can generally go back to something
        setCanGoBack(pathname !== "/")
    }, [pathname])

    return (
        <div className="flex items-center gap-1.5 relative z-[60]">
            <button
                onClick={() => router.back()}
                disabled={!canGoBack}
                title="Back"
                className={cn(
                    "p-1.5 rounded-full transition-all duration-200 border border-transparent",
                    "text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:border-border",
                    "disabled:opacity-20 disabled:cursor-not-allowed"
                )}
            >
                <ChevronLeft size={18} />
            </button>
            <button
                onClick={() => router.forward()}
                title="Forward"
                className={cn(
                    "p-1.5 rounded-full transition-all duration-200 border border-transparent",
                    "text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:border-border",
                    "disabled:opacity-20 disabled:cursor-not-allowed"
                )}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    )
}
