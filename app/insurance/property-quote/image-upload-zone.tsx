"use client"

import React, { useState, useRef } from "react"
import { Upload, X, ArrowLeft, ArrowRight, Image as ImageIcon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"

interface ImageUploadZoneProps {
  assetType: "house" | "car"
  onComplete: (files: File[]) => void
  onBack: () => void
}

export function ImageUploadZone({ assetType, onComplete, onBack }: ImageUploadZoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles].slice(0, 4)) // Max 4 images
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles].slice(0, 4))
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const startUpload = () => {
    setUploading(true)
    let p = 0
    const interval = setInterval(() => {
      p += 10
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setTimeout(() => onComplete(files), 500)
      }
    }, 150)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-medium">Upload {assetType === "house" ? "Property" : "Vehicle"} Images</h2>
        <p className="text-muted-foreground text-sm">
          Please provide 1-4 high-quality images. Our analysis works best with clear, daytime photos.
        </p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer h-64 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-3xl",
          files.length > 0 ? "bg-white/[0.02] border-primary/40" : "bg-white/[0.01] border-white/10 hover:border-primary/40 hover:bg-white/[0.03]"
        )}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" aria-label="Upload asset images" id="asset-image-upload" title="Upload asset images" placeholder="Choose images" />
        <label htmlFor="asset-image-upload" className="sr-only">Upload asset images</label>
        
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <div>
            <p className="text-lg font-medium">Drag & Drop images or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, HEIC supported. Max file size 10MB.</p>
          </div>
        </div>
      </div>

      {/* Previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {files.map((file, i) => (
              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Asset Preview" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  title="Remove image"
                  aria-label={`Remove image ${i + 1}`}
                >
                  <X size={14} />
                  <span className="sr-only">Remove image</span>
                </button>
              </div>
            ))}
            {files.length < 4 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors gap-2"
              >
                <Plus size={20} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Add More</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-8 border-t border-white/5">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft size={16} /> Change Asset Type
        </Button>
        
        {uploading ? (
          <div className="w-64 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
               <span>Uploading Images...</span>
               <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        ) : (
          <Button 
            disabled={files.length === 0} 
            onClick={startUpload}
            className="gap-2 px-8 py-6 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Process Images <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}

function Plus({ size }: { size: number }) {
  return (
    <div className={`p-1.5 rounded-lg bg-white/5`}>
       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </div>
  )
}
