"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Building2, 
  Car, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Internal Components
import { AssetSelector } from "./asset-selector"
import { ImageUploadZone } from "./image-upload-zone"
import { AssetDetailForm } from "./asset-detail-form"
import { AnalysisOverlay } from "./analysis-overlay"
import { RecommendationView } from "./recommendation-view"

type Step = "asset-select" | "upload" | "details" | "analyzing" | "recommendations"

export function PropertyQuoteWizard() {
  const [step, setStep] = useState<Step>("asset-select")
  const [assetType, setAssetType] = useState<"house" | "car" | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState<any>({})
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleAssetSelect = (type: "house" | "car") => {
    setAssetType(type)
    setStep("upload")
  }

  const handleUploadComplete = (uploadedFiles: File[]) => {
    setImages(uploadedFiles)
    setStep("details")
  }

  const handleFormSubmit = (data: any) => {
    setFormData(data)
    setStep("analyzing")
    simulateAnalysis()
  }

  const simulateAnalysis = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        setAnalysisProgress(100)
        clearInterval(interval)
        setTimeout(() => setStep("recommendations"), 800)
      } else {
        setAnalysisProgress(progress)
      }
    }, 400)
  }

  const reset = () => {
    setStep("asset-select")
    setAssetType(null)
    setImages([])
    setFormData({})
    setAnalysisProgress(0)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-700">
      {/* Header & Steps */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-medium text-sm tracking-wider uppercase">
             <Sparkles size={16} />
             <span>AI Risk Intelligence</span>
          </div>
          <h1 className="text-4xl font-display font-medium text-foreground tracking-tight">Property Quote</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
             Visual asset analysis for smarter insurance recommendations. Instant, indicative, and secure.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Current Progress</span>
             <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-all duration-500",
                      i === 1 && step !== "asset-select" ? "bg-primary" : 
                      i === 1 && step === "asset-select" ? "bg-primary animate-pulse" :
                      i === 2 && (step === "details" || step === "analyzing" || step === "recommendations") ? "bg-primary" :
                      i === 2 && step === "upload" ? "bg-primary animate-pulse" :
                      i === 3 && (step === "analyzing" || step === "recommendations") ? "bg-primary" :
                      i === 3 && step === "details" ? "bg-primary animate-pulse" :
                      i === 4 && step === "recommendations" ? "bg-primary" :
                      i === 4 && step === "analyzing" ? "bg-primary animate-pulse" : "bg-white/10"
                    )} 
                  />
                ))}
             </div>
          </div>
          {step !== "asset-select" && step !== "analyzing" && step !== "recommendations" && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-foreground">
              Restart
            </Button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {step === "asset-select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AssetSelector onSelect={handleAssetSelect} />
            </motion.div>
          )}

          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ImageUploadZone 
                assetType={assetType!} 
                onComplete={handleUploadComplete}
                onBack={() => setStep("asset-select")}
              />
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AssetDetailForm 
                assetType={assetType!} 
                onSubmit={handleFormSubmit}
                onBack={() => setStep("upload")}
              />
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalysisOverlay progress={analysisProgress} assetType={assetType!} />
            </motion.div>
          )}

          {step === "recommendations" && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={reset} className="gap-2">
                   <ArrowLeft size={14} /> Start New Scan
                </Button>
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20">
                   <CheckCircle2 size={14} />
                   Analysis Complete
                </div>
              </div>
              <RecommendationView assetType={assetType!} formData={formData} images={images} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust & Privacy Disclaimer */}
      {step !== "recommendations" && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-muted-foreground text-[10px] leading-relaxed max-w-2xl">
          <ShieldCheck size={16} className="text-primary shrink-0" />
          <p>
            Your privacy is our priority. Uploaded images are processed solely for generating insurance risk recommendations and are not permanently stored in our public databases. Final quotes are indicative and subject to verification by the selected insurance provider.
          </p>
        </div>
      )}
    </div>
  )
}
