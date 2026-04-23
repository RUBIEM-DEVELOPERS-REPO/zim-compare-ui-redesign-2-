"use client"

import React, { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  History, 
  Scale, 
  ArrowUpRight, 
  ArrowDownRight,
  Fuel,
  Zap,
  Coffee,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"


const regulatedPrices = [
  { id: 1, product: "Petrol (E20)", category: "Energy", price: 1.68, unit: "Litre", status: "Stable", lastUpdated: "2024-05-15", change: 0 },
  { id: 2, product: "Diesel (EN590)", category: "Energy", price: 1.72, unit: "Litre", status: "Increased", lastUpdated: "2024-05-15", change: 2.4 },
  { id: 3, product: "Electricity (Domestic)", category: "Utilities", price: 0.14, unit: "kWh", status: "Stable", lastUpdated: "2024-04-01", change: 0 },
  { id: 4, product: "Bread (Standard Loaf)", category: "Food", price: 1.10, unit: "Unit", status: "Decreased", lastUpdated: "2024-05-10", change: -4.5 },
  { id: 5, product: "Sugar (White)", category: "Food", price: 3.20, unit: "2kg", status: "Stable", lastUpdated: "2024-05-01", change: 0 },
  { id: 6, product: "Cooking Oil", category: "Food", price: 3.50, unit: "2L", status: "Increased", lastUpdated: "2024-05-12", change: 1.2 },
  { id: 7, product: "LPG Gas", category: "Energy", price: 1.95, unit: "kg", status: "Stable", lastUpdated: "2024-05-01", change: 0 },
  { id: 8, product: "Maize Meal (Roller)", category: "Food", price: 12.50, unit: "10kg", status: "Stable", lastUpdated: "2024-04-20", change: 0 },
]

export default function RegulatedPricesPage() {
  const [search, setSearch] = useState("")

  const filteredPrices = regulatedPrices.filter(p => 
    p.product.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Price Intelligence"
        subtitle="Official government-mandated pricing for essential commodities and utilities in Zimbabwe."
      >
        <div className="flex items-center gap-2 text-xs font-medium text-primary/80 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
          <Calendar size={14} />
          <span>Last Comprehensive Audit: May 17, 2024</span>
        </div>
      </PageHeader>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Energy Index</CardTitle>
            <Fuel className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold">+1.2%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reflecting global oil price adjustments
            </p>
            <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fuel size={80} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Food Basket</CardTitle>
            <Coffee className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold font-sans">Stable</div>
            <p className="text-xs text-muted-foreground mt-1">
              No major changes in basic commodities
            </p>
            <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Coffee size={80} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Utility Tariffs</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold font-sans">Effective</div>
            <p className="text-xs text-muted-foreground mt-1">
              Current ZESA tariffs valid until June
            </p>
            <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={80} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/10 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search commodities or categories..." 
            className="pl-10 bg-white/5 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm">
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm">
            <History size={16} />
            <span>Price History</span>
          </button>
        </div>
      </div>

      {/* Price Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-card/5 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (USD)</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrices.map((p) => (
              <TableRow key={p.id} className="group border-white/5 hover:bg-white/[0.02]">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      <Scale size={16} />
                    </div>
                    {p.product}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-white/5 border-white/10 font-normal">
                    {p.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-sans font-medium text-lg">
                  ${p.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground">{p.unit}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {p.status === "Increased" && <ArrowUpRight className="text-destructive" size={16} />}
                    {p.status === "Decreased" && <ArrowDownRight className="text-emerald-500" size={16} />}
                    <span className={cn(
                      "text-sm font-medium",
                      p.status === "Increased" && "text-destructive",
                      p.status === "Decreased" && "text-emerald-500",
                      p.status === "Stable" && "text-muted-foreground"
                    )}>
                      {p.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground font-sans">{p.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
