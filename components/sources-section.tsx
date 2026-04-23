"use client"

import React from "react"
import { ExternalLink, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Source } from "@/lib/sources-config"

interface SourcesSectionProps {
  sources: Source[]
  className?: string
}

export function SourcesSection({ sources, className }: SourcesSectionProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div className={cn(
      "mt-16 mb-8 pt-10 pb-8 px-6 md:px-10 rounded-[2.5rem] border border-border/10 bg-card/5 backdrop-blur-sm relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:opacity-50",
      className
    )}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
            <BookOpen size={14} className="text-primary" />
          </div>
          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary/80">
              Intelligence Sources
            </h3>
            <div className="h-[1px] w-8 bg-primary/30 mt-1" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {sources.slice(0, 5).map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 transition-all duration-300"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />
              <span className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors relative">
                {source.title}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary/40 transition-all duration-300 group-hover:w-full" />
              </span>
              <ExternalLink 
                size={11} 
                className="text-muted-foreground/30 group-hover:text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
              />
            </a>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/5">
          <p className="text-[10px] text-muted-foreground/40 italic leading-relaxed max-w-3xl">
            <span className="font-semibold text-muted-foreground/50 not-italic uppercase tracking-wider mr-2">Methodology:</span>
            The data presented is synthesized from official public records, regulatory filings, and primary research. 
            While we strive for 100% accuracy, users are encouraged to verify critical information directly with the cited institutions.
          </p>
        </div>
      </div>
    </div>
  )
}
