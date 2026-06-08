"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4", className)}>
      <div className="space-y-1">
        <h1 className="text-4xl md:text-[3.25rem] lg:text-[3.25rem] font-display font-medium text-foreground tracking-tight leading-[1.1]">
          {title}
        </h1>


        {subtitle && (
          <p className="text-sm text-muted-foreground font-sans max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-4">
          {children}
        </div>
      )}
    </div>
  )
}
