"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ShieldCheck, Search, Database, Fingerprint, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisOverlayProps {
  progress: number
  assetType: "house" | "car"
}

const analysisSteps = [
  "Extracting visual metadata...",
  "Running structural integrity checks...",
  "Analyzing regional risk factors...",
  "Cross-referencing with insurer guidelines...",
  "Finalizing risk score..."
]

export function AnalysisOverlay({ progress, assetType }: AnalysisOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const barRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const step = Math.min(Math.floor((progress / 100) * analysisSteps.length), analysisSteps.length - 1)
    setCurrentStep(step)
    if (barRef.current) {
      barRef.current.style.width = `${progress}%`
    }
  }, [progress])

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-20 min-h-[500px]">
      {/* Scanning Animation */}
      <div className="relative w-64 h-64">
        {/* Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
        />
        
        {/* Inner Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border border-dashed border-primary/40 rounded-full"
        />

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
             <motion.div
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary backdrop-blur-3xl border border-primary/20"
             >
                <Sparkles size={48} />
             </motion.div>
             
             {/* Scanning Line */}
             <motion.div 
               animate={{ top: ["-10%", "110%", "-10%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
             />
          </div>
        </div>

        {/* Floating Tags */}
        <div className="absolute -top-4 -right-8 flex flex-col gap-2">
           {[
             { icon: Eye, label: "Visual Scan" },
             { icon: Database, label: "Data Cross" }
           ].map((tag, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.5 }}
               className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-xl"
             >
                <tag.icon size={12} className="text-primary" />
                {tag.label}
             </motion.div>
           ))}
        </div>
      </div>

      <div className="text-center space-y-6 max-w-sm">
        <div className="space-y-1">
          <h3 className="text-2xl font-display font-medium">Analyzing Asset</h3>
          <p className="text-muted-foreground text-sm">Visual neural networks are processing your {assetType} details.</p>
        </div>

        <div className="space-y-4">
           {/* Progress Bar */}
           <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                ref={barRef}
                className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              />
           </div>

           {/* Current Step Text */}
           <AnimatePresence mode="wait">
             <motion.p 
               key={currentStep}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary"
             >
                {analysisSteps[currentStep]}
             </motion.p>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
