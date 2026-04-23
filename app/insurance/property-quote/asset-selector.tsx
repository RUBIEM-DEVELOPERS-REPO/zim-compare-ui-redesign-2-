"use client"

import React from "react"
import { Building2, Car, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AssetSelectorProps {
  onSelect: (type: "house" | "car") => void
}

export function AssetSelector({ onSelect }: AssetSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-medium">Select Asset Type</h2>
        <p className="text-muted-foreground text-sm">Choose the asset you would like to analyze for risk assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* House Selection */}
        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("house")}
          className="group relative flex flex-col items-center justify-center p-12 rounded-[2.5rem] bg-card/10 border border-white/10 backdrop-blur-3xl overflow-hidden transition-all hover:bg-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10 w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <Building2 size={48} />
          </div>
          
          <div className="relative z-10 text-center space-y-2">
            <h3 className="text-2xl font-display font-medium">Residential Property</h3>
            <p className="text-xs text-muted-foreground max-w-[180px]">Houses, apartments, and household contents</p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
            Start Analysis <ArrowRight size={14} />
          </div>
        </motion.button>

        {/* Car Selection */}
        <motion.button
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("car")}
          className="group relative flex flex-col items-center justify-center p-12 rounded-[2.5rem] bg-card/10 border border-white/10 backdrop-blur-3xl overflow-hidden transition-all hover:bg-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10 w-24 h-24 rounded-3xl bg-secondary/20 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
            <Car size={48} />
          </div>
          
          <div className="relative z-10 text-center space-y-2">
            <h3 className="text-2xl font-display font-medium">Motor Vehicle</h3>
            <p className="text-xs text-muted-foreground max-w-[180px]">Private, business, and commercial vehicles</p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
            Start Analysis <ArrowRight size={14} />
          </div>
        </motion.button>
      </div>
    </div>
  )
}
