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
                <SelectTrigger className="h-9 w-full sm:w-[220px] bg-primary text-white border-primary rounded-xl shadow-lg hover:brightness-110 transition-all font-semibold text-xs border-2">
                    <SelectValue placeholder="Select Category">
                        {selectedCategory?.label}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-popover shadow-xl animate-in fade-in zoom-in-95">
                    {categories.map((category) => (
                        <SelectItem
                            key={category.key}
                            value={category.key}
                            className={cn(
                                "rounded-lg text-xs transition-colors",
                                value === category.key
                                    ? "bg-primary text-white focus:bg-primary focus:text-white"
                                    : "hover:bg-primary/10"
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
