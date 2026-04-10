"use client"

import * as React from "react"
import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CategorySelectorProps {
    value: string
    onValueChange: (value: string) => void
    categories: readonly { readonly key: string; readonly label: string }[]
    label?: string
    className?: string
}

export function CategorySelector({
    value,
    onValueChange,
    categories,
    label = "Category",
    className,
}: CategorySelectorProps) {
    const selectedCategory = categories.find((c) => c.key === value)

    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2", className)}>
            <div className="flex items-center gap-1.5 px-1 text-muted-foreground shrink-0">
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="h-10 w-full sm:w-[220px] glass-tab-base border-primary/40 text-foreground rounded-xl shadow-lg hover:border-primary transition-all font-semibold text-xs border-2">
                    <SelectValue placeholder="Select Category">
                        {selectedCategory?.label}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/20 bg-background/60 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95">
                    {categories.map((category) => (
                        <SelectItem
                            key={category.key}
                            value={category.key}
                            className={cn(
                                "rounded-lg text-xs transition-colors m-1",
                                value === category.key
                                    ? "bg-primary text-white focus:bg-primary focus:text-white shadow-lg"
                                    : "hover:bg-primary/20 text-foreground"
                            )}
                        >
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
