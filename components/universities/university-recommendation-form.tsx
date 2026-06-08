"use client"

import * as React from "react"
import { Sparkles, TrendingUp, Info, CheckCircle2, Zap, GraduationCap, ShieldCheck, MapPin, Plus, Trash2, BookOpen, Fingerprint, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const SUBJECTS = [
    "Mathematics", "Biology", "Chemistry", "Physics", "Geography", 
    "History", "Economics", "Business Studies", "Accounting", 
    "Computer Science", "Literature", "Divinity"
]

const GRADES = ["A", "B", "C", "D", "E", "U"]

const LOCATIONS = ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Bindura", "Chinhoyi", "Any"]

const PROGRAMMES = [
    "Medicine", "Law", "Computer Science", "Accounting", "Business Management", 
    "Civil Engineering", "Nursing", "Education", "Agriculture", "Economics"
]

const CATEGORIES = [
    "Public University",
    "Private University",
    "Teachers College",
    "Polytechnic",
    "Technical College",
    "Any"
]

const STUDY_MODES = ["Conventional", "Visiting", "Weekend Class"]

interface SubjectRow {
    id: string
    subject: string
    grade: string
}

export function UniversityRecommendationForm() {
    const [budget, setBudget] = React.useState("")
    const [subjects, setSubjects] = React.useState<SubjectRow[]>([
        { id: "1", subject: "Mathematics", grade: "A" }
    ])
    const [location, setLocation] = React.useState("Any")
    const [programme, setProgramme] = React.useState("")
    const [category, setCategory] = React.useState("Any")
    const [accommodation, setAccommodation] = React.useState("No")
    const [scholarship, setScholarship] = React.useState("No")
    const [studyMode, setStudyMode] = React.useState("Conventional")
    
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)
    const [result, setResult] = React.useState<any>(null)

    const addSubject = () => {
        setSubjects([...subjects, { id: Math.random().toString(), subject: "Biology", grade: "B" }])
    }

    const removeSubject = (id: string) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter(s => s.id !== id))
        }
    }

    const updateSubject = (id: string, field: keyof SubjectRow, value: string) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s))
    }

    const handleClear = () => {
        setBudget("")
        setSubjects([{ id: "1", subject: "Mathematics", grade: "A" }])
        setLocation("Any")
        setProgramme("")
        setCategory("Any")
        setAccommodation("No")
        setScholarship("No")
        setStudyMode("Conventional")
        setResult(null)
    }

    const handleOptimize = () => {
        setIsAnalyzing(true)
        setTimeout(() => {
            setResult({
                institution: "University of Zimbabwe (UZ)",
                programme: programme || "Computer Science",
                score: 98,
                analysis: `Based on your A-Level profile and budget of $${budget || "1,200"}, the University of Zimbabwe's ${programme || "Computer Science"} faculty is the neural leader. It aligns perfectly with your location preference (${location}) and study mode.`,
                metrics: [
                    { label: "Programme Match", value: 99, color: "from-teal-400 to-emerald-500" },
                    { label: "Tuition Fit", value: 95, color: "from-teal-400 to-emerald-500" },
                    { label: "Location Fit", value: 92, color: "from-blue-400 to-indigo-500" },
                    { label: "Neural Trust", value: 97, color: "from-teal-400 to-teal-600" }
                ],
                stats: [
                    { label: "Accomodation", value: accommodation === "Yes" ? "Available" : "N/A", icon: MapPin },
                    { label: "Scholarship", value: scholarship === "Yes" ? "Eligible" : "None", icon: Info },
                    { label: "Study Mode", value: studyMode, icon: BookOpen },
                    { label: "Admission Probability", value: "94%", icon: CheckCircle2 }
                ]
            })
            setIsAnalyzing(false)
        }, 1500)
    }

    const inputPillStyle = "h-[48px] w-full px-6 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
    const labelStyle = "text-[10px] font-bold text-teal-400/60 uppercase tracking-[0.2em] mb-1.5 ml-3 block"

    return (
        <div className="max-w-[1280px] mx-auto space-y-8 relative pb-20">
            {/* Background Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
            
            {/* 1. Main Input Panel */}
            <div className="p-8 group glass-anti-gravity rounded-[2.5rem]">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20">
                        <GraduationCap className="w-5 h-5 text-teal-400" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Uni Recommendation Inputs</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {/* Budget */}
                    <div>
                        <label className={labelStyle}>Tuition Budget ($)</label>
                        <input 
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="Enter tuition budget"
                            className={inputPillStyle.replace("appearance-none cursor-pointer", "")}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className={labelStyle}>Preferred Location</label>
                        <div className="relative">
                            <select 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={inputPillStyle}
                                aria-label="Preferred Location"
                            >
                                {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0a1419] text-white">{l}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400/50">
                                <MapPin size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Programme */}
                    <div>
                        <label className={labelStyle}>Preferred Programme</label>
                        <div className="relative">
                            <select 
                                value={programme}
                                onChange={(e) => setProgramme(e.target.value)}
                                className={inputPillStyle}
                                aria-label="Preferred Programme"
                            >
                                <option value="" className="bg-[#0a1419]">Select programme</option>
                                {PROGRAMMES.map(p => <option key={p} value={p} className="bg-[#0a1419]">{p}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400/50">
                                <BookOpen size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Institution Category */}
                    <div>
                        <label className={labelStyle}>Institution Category</label>
                        <div className="relative">
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={inputPillStyle}
                                aria-label="Institution Category"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a1419] text-white">{c}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400/50">
                                <Search size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Study Mode */}
                    <div>
                        <label className={labelStyle}>Study Mode</label>
                        <div className="relative">
                            <select 
                                value={studyMode}
                                onChange={(e) => setStudyMode(e.target.value)}
                                className={inputPillStyle}
                                aria-label="Study Mode"
                            >
                                {STUDY_MODES.map(m => <option key={m} value={m} className="bg-[#0a1419] text-white">{m}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400/50">
                                <BookOpen size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Accommodation */}
                    <div>
                        <label className={labelStyle}>Accommodation Required</label>
                        <select 
                            value={accommodation}
                            onChange={(e) => setAccommodation(e.target.value)}
                            className={inputPillStyle}
                            aria-label="Accommodation Required"
                        >
                            <option value="Yes" className="bg-[#0a1419]">Yes</option>
                            <option value="No" className="bg-[#0a1419]">No</option>
                        </select>
                    </div>

                    {/* Scholarship */}
                    <div>
                        <label className={labelStyle}>Scholarship Needed</label>
                        <select 
                            value={scholarship}
                            onChange={(e) => setScholarship(e.target.value)}
                            className={inputPillStyle}
                            aria-label="Scholarship Needed"
                        >
                            <option value="Yes" className="bg-[#0a1419]">Yes</option>
                            <option value="No" className="bg-[#0a1419]">No</option>
                        </select>
                    </div>
                </div>

                {/* A-Level Subjects Section */}
                <div className="border-t border-white/5 pt-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <label className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em]">A-Level Subjects + Grades</label>
                        <button 
                            onClick={addSubject}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/20 transition-all"
                        >
                            <Plus size={14} /> Add Subject
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjects.map((row) => (
                            <div key={row.id} className="flex items-center gap-2 p-2 rounded-full bg-white/5 border border-white/10 group/row hover:border-teal-500/30 transition-all">
                                <select 
                                    value={row.subject}
                                    onChange={(e) => updateSubject(row.id, "subject", e.target.value)}
                                    className="flex-1 bg-transparent border-none text-xs font-bold text-white px-4 py-1 focus:outline-none"
                                    aria-label="Select Subject"
                                >
                                    {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#0a1419]">{s}</option>)}
                                </select>
                                <select 
                                    value={row.grade}
                                    onChange={(e) => updateSubject(row.id, "grade", e.target.value)}
                                    className="w-16 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs font-black text-teal-400 p-1 text-center focus:outline-none"
                                    aria-label="Select Grade"
                                >
                                    {GRADES.map(g => <option key={g} value={g} className="bg-[#0a1419]">{g}</option>)}
                                </select>
                                <button 
                                    onClick={() => removeSubject(row.id)}
                                    className="p-2 text-white/20 hover:text-red-400 transition-colors"
                                    aria-label="Remove Subject"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                    <button 
                        onClick={handleOptimize}
                        disabled={isAnalyzing}
                        className="h-[56px] w-full md:w-auto px-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(20,184,166,0.6)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isAnalyzing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Fingerprint size={18} />
                        )}
                        Get Recommendations
                    </button>
                    <button 
                        onClick={handleClear}
                        className="h-[56px] w-full md:w-auto px-10 rounded-full bg-white/5 border border-white/10 text-white/60 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all"
                    >
                        Clear Form
                    </button>
                </div>
            </div>

            {/* 2. Results Section */}
            {result && (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="min-h-[260px] p-8 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-10 group glass-anti-gravity rounded-[2.5rem]">
                        {/* Left Section */}
                        <div className="flex flex-col justify-center lg:border-r border-white/5 lg:pr-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-[64px] h-[64px] bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                                    <GraduationCap className="w-8 h-8 text-teal-400" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 w-fit mb-2">
                                        <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{result.score}% FIT</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight uppercase tracking-tight">{result.institution}</h3>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-white/60">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <BookOpen size={14} className="text-teal-400/80" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Top Choice • High Acceptance</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/60">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <ShieldCheck size={14} className="text-teal-400/80" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Neural Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles size={18} className="text-teal-400 animate-pulse" />
                                <span className="text-[11px] font-black text-teal-400 uppercase tracking-[0.3em]">Neural Fit Recommendation</span>
                            </div>
                            <p className="text-[15px] text-white/90 leading-relaxed font-medium mb-8 italic">
                                “{result.analysis}”
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    `Programme: ${result.programme}`,
                                    "Tuition Budget Aligned",
                                    "Location Match Confirmed",
                                    "Neural Trust High"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                                        <span className="text-[12px] text-white/70 font-bold tracking-tight">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col justify-between shadow-inner">
                            <div className="mb-4">
                                <span className="text-[10px] font-black text-teal-400/60 uppercase tracking-[0.3em] block text-center">Fit Scorecard</span>
                            </div>
                            
                            <div className="space-y-5">
                                {result.metrics.map((stat: any, i: number) => (
                                    <div key={i} className="h-[36px] flex flex-col justify-center space-y-1.5">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-black text-white/50 uppercase tracking-tighter">{stat.label}</span>
                                            <span className="text-[11px] font-black text-teal-400">{stat.value}%</span>
                                        </div>
                                        <Progress 
                                            value={stat.value} 
                                            className="h-[6px] w-full bg-white/10"
                                            indicatorClassName={cn("bg-gradient-to-r", stat.color)}
                                            aria-label={stat.label}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <button className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all">
                                View Full Requirements
                            </button>
                        </div>
                    </div>

                    {/* 3. Additional Info Stats */}
                    <div className="flex flex-wrap gap-6 justify-center">
                        {result.stats.map((stat: any, i: number) => (
                            <div 
                                key={i}
                                className="w-[200px] h-[100px] p-5 flex flex-col justify-between group/stat glass-anti-gravity rounded-2xl cursor-default"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-teal-400/60 uppercase tracking-[0.2em] leading-tight">
                                        {stat.label}
                                    </span>
                                    <stat.icon size={14} className="text-teal-400/40 group-hover/stat:text-teal-400 transition-colors" />
                                </div>
                                <span className="text-lg font-bold text-white tracking-tight">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function X({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    )
}
