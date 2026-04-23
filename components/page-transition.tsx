"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current === pathname) {
      // First render — just show children
      return
    }

    // Route changed — trigger exit animation, then update children
    setIsAnimating(true)
    const timeout = setTimeout(() => {
      setDisplayChildren(children)
      prevPathname.current = pathname
      // Small delay to allow React to paint the new children
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false)
        })
      })
    }, 120) // match the CSS exit duration

    return () => clearTimeout(timeout)
  }, [pathname, children])

  // Also update displayChildren when not navigating (e.g., initial hydration)
  useEffect(() => {
    if (!isAnimating) {
      setDisplayChildren(children)
    }
  }, [children, isAnimating])

  return (
    <div
      className={cn(
        "page-transition",
        isAnimating ? "page-transition--exit" : "page-transition--enter",
        className
      )}
    >
      {displayChildren}
    </div>
  )
}
