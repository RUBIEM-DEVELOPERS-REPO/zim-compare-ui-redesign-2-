"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DynamicBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  orientation?: "horizontal" | "vertical"
  variableName: string
}

const DynamicBar = React.forwardRef<HTMLDivElement, DynamicBarProps>(
  ({ value, max = 100, orientation = "horizontal", variableName, className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = (node: HTMLDivElement) => {
      // @ts-ignore
      internalRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement>).current = node
    }

    React.useEffect(() => {
      if (internalRef.current) {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
        internalRef.current.style.setProperty(variableName, `${percentage}%`)
      }
    }, [value, max, variableName])
    
    return (
      <div
        ref={combinedRef}
        className={cn(
          orientation === "horizontal" ? "dynamic-bar-width" : "dynamic-bar-height",
          className
        )}
        {...props}
      />
    )
  }
)
DynamicBar.displayName = "DynamicBar"

export { DynamicBar }
