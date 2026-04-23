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
                <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
            </div>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="h-11 w-full sm:w-[240px] glass-floating border-primary/50 text-foreground rounded-[1.25rem] shadow-2xl hover:border-primary transition-all duration-500 font-medium text-[10px] uppercase tracking-[0.2em] teal-glow floating-hover">
                    <SelectValue placeholder="Select Category">
                        {selectedCategory?.label}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-[1.5rem] border-white/20 bg-background/40 backdrop-blur-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-500 glass-floating teal-glow">
                    {categories.map((category) => (
                        <SelectItem
                            key={category.key}
                            value={category.key}
                            className={cn(
                                "rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all duration-300 m-1.5",
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
    )
}

