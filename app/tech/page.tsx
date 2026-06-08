"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Shield, BarChart2, Cloud, Bot, Code2,
  Check, X, Star, ChevronDown, Cpu, Zap, Globe, Lock, Users, Trash2
} from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

// ─── Types ──────────────────────────────────────────────────────────────────
interface TechTool {
  id: string
  name: string
  category: string
  monthlyPrice: string
  bestUse: string
  zimAvailable: boolean
  aiScore: number
  tags: string[]
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const tools: TechTool[] = [
  // Cybersecurity
  { id:"nordvpn",     name:"NordVPN",      category:"Cybersecurity Tools",   monthlyPrice:"$4.99", bestUse:"Secure browsing & VPN",          zimAvailable:true,  aiScore:92, tags:["VPN","Privacy","Multi-device"] },
  { id:"expressvpn",  name:"ExpressVPN",   category:"Cybersecurity Tools",   monthlyPrice:"$8.32", bestUse:"Fast VPN for streaming",          zimAvailable:true,  aiScore:90, tags:["VPN","Speed","Streaming"] },
  { id:"bitdefender", name:"Bitdefender",  category:"Cybersecurity Tools",   monthlyPrice:"$3.33", bestUse:"Antivirus & threat protection",   zimAvailable:true,  aiScore:88, tags:["Antivirus","Firewall","Ransomware"] },
  { id:"kaspersky",   name:"Kaspersky",    category:"Cybersecurity Tools",   monthlyPrice:"$2.50", bestUse:"Endpoint security for SMEs",      zimAvailable:true,  aiScore:83, tags:["Antivirus","SME","Endpoint"] },
  { id:"1password",   name:"1Password",    category:"Cybersecurity Tools",   monthlyPrice:"$2.99", bestUse:"Password manager for teams",      zimAvailable:true,  aiScore:91, tags:["Passwords","Teams","2FA"] },
  { id:"bitwarden",   name:"Bitwarden",    category:"Cybersecurity Tools",   monthlyPrice:"$0.83", bestUse:"Free open-source password mgr",  zimAvailable:true,  aiScore:87, tags:["Passwords","Open-source","Free"] },
  // Productivity
  { id:"m365",        name:"Microsoft 365",category:"Productivity Apps",     monthlyPrice:"$6.99", bestUse:"Office suite & Teams collab",     zimAvailable:true,  aiScore:93, tags:["Office","Teams","OneDrive"] },
  { id:"gworkspace",  name:"Google Workspace",category:"Productivity Apps",  monthlyPrice:"$6.00", bestUse:"Cloud-first team collaboration",  zimAvailable:true,  aiScore:91, tags:["Docs","Meet","Drive"] },
  { id:"notion",      name:"Notion",       category:"Productivity Apps",     monthlyPrice:"$8.00", bestUse:"Notes, wikis & project management",zimAvailable:true, aiScore:88, tags:["Notes","Wiki","Database"] },
  { id:"trello",      name:"Trello",       category:"Productivity Apps",     monthlyPrice:"$5.00", bestUse:"Kanban-style task management",    zimAvailable:true,  aiScore:82, tags:["Kanban","Tasks","Free tier"] },
  // Cloud Storage
  { id:"gdrive",      name:"Google Drive", category:"Cloud Storage",         monthlyPrice:"$1.99", bestUse:"Personal & team file storage",   zimAvailable:true,  aiScore:92, tags:["15GB free","Docs","Mobile"] },
  { id:"onedrive",    name:"OneDrive",     category:"Cloud Storage",         monthlyPrice:"$1.99", bestUse:"Windows & Office integration",   zimAvailable:true,  aiScore:88, tags:["Office","5GB free","Windows"] },
  { id:"dropbox",     name:"Dropbox",      category:"Cloud Storage",         monthlyPrice:"$9.99", bestUse:"Team file sync & sharing",       zimAvailable:true,  aiScore:84, tags:["Sync","Teams","API"] },
  { id:"icloud",      name:"iCloud",       category:"Cloud Storage",         monthlyPrice:"$0.99", bestUse:"Apple ecosystem storage",        zimAvailable:true,  aiScore:79, tags:["Apple","Photos","iWork"] },
  // AI Tools
  { id:"chatgpt",     name:"ChatGPT",      category:"AI Tools",              monthlyPrice:"$20.00",bestUse:"General AI assistant & writing",  zimAvailable:true,  aiScore:95, tags:["GPT-4","Writing","Code"] },
  { id:"gemini",      name:"Gemini",       category:"AI Tools",              monthlyPrice:"$0.00", bestUse:"Multimodal AI with Google Search",zimAvailable:true,  aiScore:91, tags:["Multimodal","Google","Free"] },
  { id:"copilot",     name:"Copilot",      category:"AI Tools",              monthlyPrice:"$0.00", bestUse:"AI for Windows & Office 365",    zimAvailable:true,  aiScore:87, tags:["Microsoft","Office","Free"] },
  { id:"claude",      name:"Claude",       category:"AI Tools",              monthlyPrice:"$20.00",bestUse:"Long-form analysis & reasoning",  zimAvailable:true,  aiScore:93, tags:["Anthropic","Analysis","Safe AI"] },
  // Web Dev
  { id:"vscode",      name:"VS Code",      category:"Web Development Apps",  monthlyPrice:"$0.00", bestUse:"Code editor for all languages",  zimAvailable:true,  aiScore:97, tags:["Free","Extensions","Debugging"] },
  { id:"github",      name:"GitHub",       category:"Web Development Apps",  monthlyPrice:"$4.00", bestUse:"Version control & CI/CD",        zimAvailable:true,  aiScore:96, tags:["Git","Actions","Copilot"] },
  { id:"netlify",     name:"Netlify",      category:"Web Development Apps",  monthlyPrice:"$0.00", bestUse:"Frontend deployment & hosting",  zimAvailable:true,  aiScore:88, tags:["Deploy","CDN","Free tier"] },
  { id:"vercel",      name:"Vercel",       category:"Web Development Apps",  monthlyPrice:"$0.00", bestUse:"Next.js & edge deployments",     zimAvailable:true,  aiScore:90, tags:["Next.js","Edge","Free tier"] },
  { id:"figma",       name:"Figma",        category:"Web Development Apps",  monthlyPrice:"$0.00", bestUse:"Collaborative UI/UX design",     zimAvailable:true,  aiScore:94, tags:["Design","Prototyping","Free"] },
  { id:"webflow",     name:"Webflow",      category:"Web Development Apps",  monthlyPrice:"$14.00",bestUse:"No-code website builder",        zimAvailable:true,  aiScore:85, tags:["No-code","CMS","Hosting"] },
]

const categories = [
  "Overview",
  "Cybersecurity Tools",
  "Productivity Apps",
  "Cloud Storage",
  "AI Tools",
  "Web Development Apps",
]

const categoryIcons: Record<string, React.ElementType> = {
  "Overview":              BarChart2,
  "Cybersecurity Tools":   Shield,
  "Productivity Apps":     BarChart2,
  "Cloud Storage":         Cloud,
  "AI Tools":              Bot,
  "Web Development Apps":  Code2,
}

// ─── Tech Overview ───────────────────────────────────────────────────────────
function TechOverview({ onSelect }: { onSelect: (cat: string) => void }) {
  const summaryData = [
    { name: "Cybersecurity Tools",  desc: "Protect your digital identity with VPNs and password managers.", count: 6, icon: Shield },
    { name: "Productivity Apps",    desc: "Collaborate efficiently with world-class office and note-taking tools.", count: 4, icon: BarChart2 },
    { name: "Cloud Storage",        desc: "Securely store and sync your files across all your devices.", count: 4, icon: Cloud },
    { name: "AI Tools",             desc: "Harness the power of AI for writing, coding, and analysis.", count: 4, icon: Bot },
    { name: "Web Development Apps", desc: "Build and deploy modern web applications with ease.", count: 6, icon: Code2 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {summaryData.map((cat) => (
        <div
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className="group relative rounded-[2.5rem] p-8 cursor-pointer border border-white/10 bg-white/5 dark:bg-white/[0.02] backdrop-blur-2xl hover:border-primary/40 hover:bg-white/10 transition-all duration-500 overflow-hidden w-full min-h-[220px] flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700 pointer-events-none">
            <cat.icon size={120} />
          </div>
          
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <cat.icon size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground leading-tight">{cat.name}</h3>
                <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">{cat.count} Tools Available</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[90%]">
              {cat.desc}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em] group-hover:gap-4 transition-all">
            <span>Explore Category</span>
            <Zap size={14} className="fill-primary/20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Tool card ───────────────────────────────────────────────────────────────
function ToolCard({
  tool,
  selected,
  onToggle,
}: {
  tool: TechTool
  selected: boolean
  onToggle: (id: string) => void
}) {
  const Icon = categoryIcons[tool.category] ?? Cpu
  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] p-6 transition-all duration-500 group",
        "border backdrop-blur-2xl",
        selected
          ? "border-primary/60 bg-primary/10 shadow-[0_0_40px_rgba(20,184,166,0.15)] scale-[1.02]"
          : "border-white/10 bg-white/5 dark:bg-white/[0.02] hover:border-primary/30 hover:bg-white/10"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
          <Icon size={22} className="text-primary" />
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">AI Score</span>
            <span className="text-sm font-display font-bold text-foreground">{tool.aiScore}</span>
          </div>
          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${tool.aiScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-display font-bold text-foreground leading-tight mb-1">{tool.name}</h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{tool.category}</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Price</span>
          <span className="font-bold text-foreground">{tool.monthlyPrice}/mo</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Zim Availability</span>
          <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase", tool.zimAvailable ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
            {tool.zimAvailable ? "Full" : "Limited"}
          </span>
        </div>
        <div className="pt-2">
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 italic">
            "{tool.bestUse}"
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {tool.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-muted-foreground group-hover:border-primary/20 transition-colors">
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => onToggle(tool.id)}
        className={cn(
          "w-full py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2",
          selected
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : "bg-white/5 border border-white/10 text-foreground hover:bg-primary hover:text-white hover:border-primary"
        )}
      >
        {selected ? (
          <>
            <Check size={14} />
            Selected
          </>
        ) : (
          <>
            <Zap size={14} />
            Compare
          </>
        )}
      </button>
    </div>
  )
}

// ─── Logic ──────────────────────────────────────────────────────────────────
function generateTechRecommendation(selected: TechTool[]) {
  if (selected.length < 2) return null
  const best = selected.reduce((a, b) => (a.aiScore > b.aiScore ? a : b))
  
  let reason = "Optimal blend of local availability and high-performance AI features."
  if (best.aiScore >= 95) reason = "Industry-leading performance and feature set for power users."
  else if (best.monthlyPrice === "$0.00") reason = "Best value choice for comprehensive features without recurring costs."
  
  return {
    tool: best,
    reason,
    metrics: [
      { label: "Price Comparison", fn: (t: TechTool) => t.monthlyPrice === "$0.00" ? "Free" : t.monthlyPrice },
      { label: "Feature set",      fn: (t: TechTool) => t.tags.slice(0, 2).join(", ") },
      { label: "Ease-of-use",      fn: (t: TechTool) => t.aiScore > 92 ? "Intuitive" : "User-friendly" },
      { label: "Zimbabwe Ready",   fn: (t: TechTool) => t.zimAvailable ? "✓ Verified" : "Limited" },
      { label: "Overall Score",    fn: (t: TechTool) => `${t.aiScore}%` },
    ]
  }
}

// ─── Comparison Panel ─────────────────────────────────────────────────────────
function ComparisonPanel({ 
  recommendation, 
  selected, 
  onClear 
}: { 
  recommendation: any, 
  selected: TechTool[], 
  onClear: () => void 
}) {
  const { tool: best, reason, metrics } = recommendation

  return (
    <div className="mt-12 rounded-[3rem] border border-primary/30 bg-card/40 backdrop-blur-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Bot size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">AI Intelligence Report</span>
          </div>
          <h2 className="text-3xl font-display font-medium text-foreground">Recommended Tech Option</h2>
        </div>
        <button
          onClick={onClear}
          className="px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all duration-500"
        >
          Clear Comparison
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-[2rem] bg-primary/10 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Star size={80} className="text-primary" />
            </div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Best Match Tool</p>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">{best.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {best.name} is recommended because {reason.toLowerCase()}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Match Score</span>
                <span className="text-2xl font-display font-bold text-primary">{best.aiScore}%</span>
              </div>
              <div className="h-8 w-[1px] bg-primary/20" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Efficiency</span>
                <span className="text-2xl font-display font-bold text-foreground">High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="py-4 px-6 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Metric</th>
                    {selected.map(t => (
                      <th key={t.id} className="py-4 px-6 text-center">
                        <span className={cn("text-[11px] font-bold uppercase tracking-wider", t.id === best.id ? "text-primary" : "text-foreground")}>
                          {t.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {metrics.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase">{row.label}</td>
                      {selected.map((t: TechTool) => (
                        <td key={t.id} className="py-4 px-6 text-center text-xs text-foreground">
                          {row.fn(t)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Floating BG shapes ───────────────────────────────────────────────────────
function TechBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[140px]" />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
      
      <div className="tech-floating-orb orb-1" />
      <div className="tech-floating-orb orb-2" />
      <div className="tech-floating-orb orb-3" />
      <div className="tech-floating-orb orb-4" />
    </div>
  )
}

// ─── Comparison Bar ──────────────────────────────────────────────────────────
function TechCompareBar({ 
  selected, 
  onClear, 
  onAnalyze 
}: { 
  selected: TechTool[], 
  onClear: () => void, 
  onAnalyze: () => void 
}) {
  if (selected.length < 2) return null

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-24 z-40 mb-8"
    >
      {/* Subtle anti-gravity effect behind the bar */}
      <div className="absolute -inset-2 pointer-events-none -z-10 overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-[40px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-[60px]" />
      </div>

      <div className="glass-panel px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-primary/20 shadow-2xl backdrop-blur-3xl teal-glow overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="flex -space-x-3">
            {selected.map(tool => (
              <div 
                key={tool.id}
                className="h-12 w-12 rounded-full border-2 border-background overflow-hidden bg-primary/10 flex items-center justify-center font-bold text-primary text-[11px] uppercase shadow-xl backdrop-blur-md"
              >
                {tool.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm text-foreground font-bold uppercase tracking-tight leading-none mb-1.5">
              {selected.length} products selected
            </p>
            <button 
              onClick={onClear}
              className="text-[10px] text-muted-foreground hover:text-red-500 flex items-center gap-1.5 transition-colors uppercase font-bold tracking-widest"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          </div>
        </div>
        
        <button
          onClick={onAnalyze}
          className="rounded-2xl px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          Analyze Comparison
          <Zap size={14} className="fill-white" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function TechPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [recommendation, setRecommendation] = useState<any>(null)
  const [showRecommendation, setShowRecommendation] = useState(false)

  const filtered = useMemo(
    () => tools.filter(t => t.category === selectedCategory),
    [selectedCategory]
  )

  const selectedTools = useMemo(
    () => tools.filter(t => selectedIds.includes(t.id)),
    [selectedIds]
  )

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id))
    } else {
      setSelectedIds(prev => [...prev, id])
    }
    setShowRecommendation(false)
  }

  const handleClear = () => {
    setSelectedIds([])
    setRecommendation(null)
    setShowRecommendation(false)
  }

  const handleAnalyze = () => {
    if (selectedTools.length >= 2) {
      const rec = generateTechRecommendation(selectedTools)
      setRecommendation(rec)
      setShowRecommendation(true)
    }
  }

  return (
    <div className="relative space-y-10 min-h-screen pb-32">
      <TechBackground />

      <PageHeader
        title="Technology Intelligence"
        subtitle="Compare Zimbabwe's most used digital tools with AI-powered recommendations."
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 px-1 text-muted-foreground shrink-0">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Category Filter</span>
          </div>
          <div className="w-full sm:w-[280px]">
            <Select value={selectedCategory} onValueChange={(val) => {
              setSelectedCategory(val)
              handleClear()
            }}>
              <SelectTrigger className="h-14 w-full glass-floating border-primary/30 text-foreground rounded-[1.75rem] shadow-2xl hover:border-primary transition-all duration-500 font-bold text-[11px] uppercase tracking-[0.2em] teal-glow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-[2rem] border-white/10 bg-background/80 backdrop-blur-3xl shadow-2xl glass-floating">
                {categories.map(cat => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className={cn(
                      "rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 m-2",
                      selectedCategory === cat ? "bg-primary text-white" : "hover:bg-primary/10"
                    )}
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedCategory !== "Overview" && (
        <TechCompareBar 
          selected={selectedTools}
          onClear={handleClear}
          onAnalyze={handleAnalyze}
        />
      )}

      {selectedCategory === "Overview" ? (
        <TechOverview onSelect={setSelectedCategory} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              selected={selectedIds.includes(tool.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={false}
        animate={{ 
          height: showRecommendation ? "auto" : 0,
          opacity: showRecommendation ? 1 : 0
        }}
        className="overflow-hidden"
      >
        {showRecommendation && recommendation && (
          <ComparisonPanel 
            recommendation={recommendation}
            selected={selectedTools} 
            onClear={handleClear} 
          />
        )}
      </motion.div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-20 border-t border-white/10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Globe size={18} />
            <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Intelligence Sources</h3>
          </div>
          <ul className="space-y-4">
            {["Official Government Gazette", "Zimbabwe Open Data Portal"].map(source => (
              <li key={source} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{source}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Shield size={18} />
            <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Methodology</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The data presented is synthesized from official public records, regulatory filings, and primary research. 
            While we strive for 100% accuracy, users are encouraged to verify critical information directly with 
            the cited institutions.
          </p>
        </div>
      </div>
    </div>
  )
}
