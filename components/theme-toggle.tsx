"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-6 z-[110] animate-in fade-in slide-in-from-top-4 duration-1000">
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={cn(
          "group relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500",
          "glass-floating border-white/10 hover:border-primary/50",
          "shadow-lg floating-hover"
        )}
        title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className="relative h-6 w-6">
          <Sun 
            className={cn(
              "absolute inset-0 h-6 w-6 transition-all duration-500 ease-spring",
              resolvedTheme === "dark" 
                ? "rotate-90 scale-0 opacity-0" 
                : "rotate-0 scale-100 opacity-100 text-amber-500"
            )} 
          />
          <Moon 
            className={cn(
              "absolute inset-0 h-6 w-6 transition-all duration-500 ease-spring",
              resolvedTheme === "dark" 
                ? "rotate-0 scale-100 opacity-100 text-primary" 
                : "-rotate-90 scale-0 opacity-0"
            )} 
          />
        </div>
        
        {/* Decorative Ring */}
        <div className={cn(
            "absolute inset-0 rounded-full border border-primary/20 scale-0 group-hover:scale-110 transition-transform duration-700",
            resolvedTheme === "dark" ? "bg-primary/5" : "bg-amber-500/5"
        )} />
      </button>
    </div>
  )
}
