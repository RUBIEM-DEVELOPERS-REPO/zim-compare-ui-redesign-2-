"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollNav() {
    const [showUp, setShowUp] = useState(false)
    const [showDown, setShowDown] = useState(false)
    const [scroller, setScroller] = useState<HTMLElement | null>(null)

    // Find the scrollable element. In this app, it's typically .workspace-content
    // for dashboard pages or main for others.
    const findScroller = useCallback(() => {
        const dashboardScroller = document.querySelector(".workspace-content") as HTMLElement
        if (dashboardScroller) return dashboardScroller

        const mainScroller = document.querySelector("main") as HTMLElement
        if (mainScroller && (mainScroller.scrollHeight > mainScroller.clientHeight || window.getComputedStyle(mainScroller).overflowY === "auto")) {
            return mainScroller
        }

        return null
    }, [])

    useEffect(() => {
        const updateScroller = () => {
            const found = findScroller()
            setScroller(found)
        }

        // Delay to ensure DOM is ready
        const timer = setTimeout(updateScroller, 500)
        
        // Also listen to navigation/resize
        window.addEventListener("resize", updateScroller)
        return () => {
            clearTimeout(timer)
            window.removeEventListener("resize", updateScroller)
        }
    }, [findScroller])

    const handleScroll = useCallback(() => {
        if (!scroller) return

        const { scrollTop, scrollHeight, clientHeight } = scroller
        setShowUp(scrollTop > 200)
        setShowDown(scrollTop + clientHeight < scrollHeight - 200)
    }, [scroller])

    useEffect(() => {
        if (!scroller) return

        scroller.addEventListener("scroll", handleScroll)
        // Initial check
        handleScroll()
        
        return () => scroller.removeEventListener("scroll", handleScroll)
    }, [scroller, handleScroll])

    const scrollToTop = () => {
        scroller?.scrollTo({ top: 0, behavior: "smooth" })
    }

    const scrollToBottom = () => {
        if (scroller) {
            scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" })
        }
    }

    if (!scroller) return null

    return (
        <div className="fixed right-6 bottom-24 z-[110] flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Scroll Up */}
            <button
                onClick={scrollToTop}
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500",
                    "glass-floating border-white/10 hover:border-primary/50 shadow-xl floating-hover",
                    showUp ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                )}
                title="Scroll to Top"
            >
                <ChevronUp className="h-6 w-6 text-primary" />
            </button>

            {/* Scroll Down */}
            <button
                onClick={scrollToBottom}
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500",
                    "glass-floating border-white/10 hover:border-primary/50 shadow-xl floating-hover",
                    showDown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                )}
                title="Scroll to Bottom"
            >
                <ChevronDown className="h-6 w-6 text-primary" />
            </button>
        </div>
    )
}
