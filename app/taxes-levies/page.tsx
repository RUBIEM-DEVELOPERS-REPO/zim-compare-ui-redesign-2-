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
  ReceiptText, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  TrendingDown,
  Building2,
  User2,
  Globe2,
  Landmark
} from "lucide-react"
import { PageHeader } from "@/components/page-header"


const taxItems = [
  { 
    id: "vat", 
    title: "Value Added Tax (VAT)", 
    rate: "15%", 
    applicability: "Most goods and services", 
    icon: ReceiptText,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Standard rate applicable on most taxable supplies."
  },
  { 
    id: "imtt", 
    title: "IMTT", 
    rate: "1-2%", 
    applicability: "Electronic transfers", 
    icon: Globe2,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    description: "Intermediate Money Transfer Tax on local currency and USD transfers."
  },
  { 
    id: "cit", 
    title: "Corporate Tax", 
    rate: "24.72%", 
    applicability: "Company net profits", 
    icon: Building2,
    color: "text-accent",
    bgColor: "bg-accent/10",
    description: "Including the 3% AIDS levy on top of base rate."
  },
  { 
    id: "pit", 
    title: "Income Tax (PIT)", 
    rate: "0-40%", 
    applicability: "Employment income", 
    icon: User2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    description: "Progressive PAYE system based on income brackets."
  }
]

const levies = [
  { id: 1, name: "AIDS Levy", rate: "3% of Income Tax", category: "Social Finance", authority: "ZIMRA" },
  { id: 2, name: "Carbon Tax", rate: "Variable", category: "Energy", authority: "ZIMRA/ZERA" },
  { id: 3, name: "Tobacco Levy", rate: "0.75%", category: "Agriculture", authority: "TRB" },
  { id: 4, name: "Intermediary Tax", rate: "2%", category: "Financial", authority: "RBZ/ZIMRA" },
  { id: 5, name: "Capital Gains Tax", rate: "20% (Base)", category: "Investment", authority: "ZIMRA" },
  { id: 6, name: "Youth Development Levy", rate: "TBD", category: "Social", authority: "Ministry of Finance" },
]

export default function TaxesLeviesPage() {
  const [search, setSearch] = useState("")

  const filteredLevies = levies.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Tax & Levy Intelligence"
        subtitle="A comprehensive guide to Zimbabwe's fiscal landscape, including statutory rates and levy applicabilities."
      >
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1 font-sans">FY 2024/25</Badge>
          <Badge variant="outline" className="px-3 py-1 font-sans border-primary/20 text-primary">Live Updates</Badge>
        </div>
      </PageHeader>


      {/* Major Tax Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {taxItems.map((tax) => {
          const Icon = tax.icon
          return (
            <Card key={tax.id} className="glass-card hover:border-primary/20 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className={`p-2 rounded-xl ${tax.bgColor} ${tax.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <div className="text-xl font-display font-bold">{tax.rate}</div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">{tax.title}</CardTitle>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{tax.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-white/5 p-2 rounded-lg">
                  <Info size={12} className="text-primary" />
                  <span>{tax.applicability}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Levy Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-display font-medium flex items-center gap-2">
              <Landmark size={20} className="text-primary" />
              Statutory Levies Directory
            </h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search levies..." 
                className="pl-9 h-9 bg-white/5 border-white/10 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-card/5 backdrop-blur-xl">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Levy Name</TableHead>
                  <TableHead>Rate / Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Authority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLevies.map((l) => (
                  <TableRow key={l.id} className="group border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell className="font-sans font-medium">{l.rate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter border-white/10">
                        {l.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs font-medium text-muted-foreground">{l.authority}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Insight Panel */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingDown size={120} />
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle size={18} className="text-primary" />
                Compliance Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ensure your ZIMRA returns are filed by the 25th of each month to avoid daily compounding penalties and interest charges.
              </p>
              <ul className="space-y-2">
                {["VAT Returns", "PAYE Returns", "CIT Forecasts"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-medium">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Recent Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 py-1">
                  <div className="text-sm font-medium mb-1">VAT Adjusted</div>
                  <div className="text-xs text-muted-foreground">Reverted to 15% from transient zero-rated status for selected imports.</div>
                </div>
                <div className="border-l-2 border-secondary pl-4 py-1">
                  <div className="text-sm font-medium mb-1">IMTT Update</div>
                  <div className="text-xs text-muted-foreground">Exemption threshold increased to $100 for individuals only.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
