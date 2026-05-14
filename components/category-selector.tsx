"use client"

import * as React from "react"
import { Filter, Zap, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "./neural-analysis-panel"

interface CategorySelectorProps {
    value: string
    onValueChange: (value: string) => void
    categories: readonly { readonly key: string; readonly label: string }[]
    label?: string
    className?: string
    mainCategory?: string
    enableAnalysis?: boolean
    onAnalysis?: (result: AnalysisResult | null) => void
}

export function CategorySelector({
    value,
    onValueChange,
    categories,
    label = "Category",
    className,
    mainCategory,
    enableAnalysis = true,
    onAnalysis,
}: CategorySelectorProps) {
    const [inputValue, setInputValue] = React.useState("")
    const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)

    const selectedCategory = categories.find((c) => c.key === value)

    // Reset when switching to overview
    React.useEffect(() => {
        if (value === "overview") {
            setInputValue("")
            setAnalysisResult(null)
            if (onAnalysis) onAnalysis(null)
        }
    }, [value, onAnalysis])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInputValue(val)
        
        if (val && mainCategory) {
            setIsAnalyzing(true)
            const timer = setTimeout(() => {
                const result = analyzeInput(mainCategory, value, val)
                setAnalysisResult(result)
                setIsAnalyzing(false)
                if (onAnalysis) onAnalysis(result)
            }, 600)
            return () => clearTimeout(timer)
        } else {
            setAnalysisResult(null)
            if (onAnalysis) onAnalysis(null)
        }
    }

    const getPlaceholder = () => {
        if (!mainCategory) return "Enter value..."
        switch (mainCategory) {
            case "banking": return "Enter Deposit/Loan Amount..."
            case "telecom": return "Enter Monthly GB Usage..."
            case "schools": return "Enter Monthly Budget..."
            case "insurance": return "Enter Sum Assured..."
            case "tax": return "Enter Monthly Salary..."
            default: return "Enter value for analysis..."
        }
    }

    return (
        <div className={cn("flex flex-col gap-6 w-full", className)}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                <div className="flex items-center gap-2 px-1 text-muted-foreground shrink-0">
                    <Filter className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                </div>
                
                <div className="w-full sm:w-[240px]">
                    <Select value={value} onValueChange={(val) => {
                        onValueChange(val)
                    }}>
                        <SelectTrigger className="h-12 w-full glass-floating border-primary/30 text-foreground rounded-[1.5rem] shadow-2xl hover:border-primary transition-all duration-500 font-bold text-[10px] uppercase tracking-[0.2em] teal-glow floating-hover">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[2rem] border-white/10 bg-background/60 backdrop-blur-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-500 glass-floating teal-glow">
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.key}
                                    value={category.key}
                                    className={cn(
                                        "rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 m-2",
                                        value === category.key
                                            ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-2xl teal-glow"
                                            : "hover:bg-primary/10 text-foreground focus:bg-primary/10"
                                    )}
                                >
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Smart Analysis Input — ONLY shown when Analysis is selected, except for Banking which has its own redesigned form */}
            {enableAnalysis && value === "analysis" && mainCategory !== "banking" && mainCategory !== "telecom" && (
                <div className="relative group/input w-full max-w-2xl animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Zap className={cn(
                            "h-5 w-5 transition-all duration-500",
                            inputValue ? "text-primary animate-pulse scale-110" : "text-muted-foreground opacity-50"
                        )} />
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Neural Analysis: I need a $1000 loan and earn $500/month, which bank is best?"
                        className="h-14 w-full pl-14 pr-4 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-500 glass-floating shadow-2xl teal-glow"
                    />
                    {isAnalyzing && (
                        <div className="absolute inset-y-0 right-6 flex items-center">
                            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            )}

            {/* Only show panel here if we are NOT on a special analysis tab (implied by if onAnalysis is NOT provided or if it's explicitly allowed) */}
            {analysisResult && value !== "analysis" && (
                <NeuralAnalysisPanel result={analysisResult} isLoading={isAnalyzing} />
            )}
        </div>
    )
}
