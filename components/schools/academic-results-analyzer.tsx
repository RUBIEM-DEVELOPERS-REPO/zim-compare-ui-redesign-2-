"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { GraduationCap, Brain, Search, Plus, Sparkles, Trophy, Target, TrendingUp, MapPin, DollarSign, CheckCircle2, Upload, Send } from "lucide-react"

const MOCK_RECOMMENDED_SCHOOLS = [
    {
        name: "St George's College",
        match: 98,
        location: "Harare",
        type: "Private Boarding / Day",
        fees: "$3,500 - $4,200",
        reason: "Elite academic history and strong STEM focus aligns with your Science strengths.",
        path: "Engineering & Natural Sciences",
        color: "text-blue-400"
    },
    {
        name: "Peterhouse Boys",
        match: 96,
        location: "Marondera",
        type: "Private Boarding",
        fees: "$4,000 - $5,000",
        reason: "Premier A-Level performance and leadership programs fit your high-caliber results.",
        path: "Global Leadership & Humanities",
        color: "text-amber-400"
    },
    {
        name: "Arundel School",
        match: 95,
        location: "Harare",
        type: "Private Girls Boarding",
        fees: "$3,800 - $4,500",
        reason: "Exceptional Humanities and Arts track record matches your Language profile.",
        path: "Law & International Relations",
        color: "text-purple-400"
    },
    {
        name: "Prince Edward School",
        match: 89,
        location: "Harare",
        type: "Government Boarding",
        fees: "$800 - $1,200",
        reason: "Historic excellence in Mathematics and Sports. High-value matching for your profile.",
        path: "Technical & Applied Sciences",
        color: "text-primary"
    },
    {
        name: "Dominican Convent High School",
        match: 94,
        location: "Harare",
        type: "Catholic Girls Day",
        fees: "$1,500 - $2,000",
        reason: "Consistent Top-3 national ranking in O & A Level results.",
        path: "Medicine & Life Sciences",
        color: "text-emerald-400"
    },
    {
        name: "Gateway High School",
        match: 91,
        location: "Harare",
        type: "Private Christian Day",
        fees: "$2,200 - $2,800",
        reason: "Strong focus on holistic development and robust commercial department.",
        path: "Business & Commerce",
        color: "text-sky-400"
    },
    {
        name: "Lomagundi College",
        match: 87,
        location: "Chinhoyi",
        type: "Private Boarding",
        fees: "$3,200 - $3,800",
        reason: "Excellent facilities and strong Geography/Environmental science focus.",
        path: "Earth Sciences & Geography",
        color: "text-orange-400"
    },
    {
        name: "Churchill Boys High School",
        match: 85,
        location: "Harare",
        type: "Government Boarding",
        fees: "$700 - $1,100",
        reason: "Strong reputation for discipline and solid academic foundation in technical subjects.",
        path: "Mechanical & Civil Engineering",
        color: "text-indigo-400"
    }
]

const O_LEVEL_SUBJECTS = [
    "Mathematics", "English Language", "Science", "Geography", "History", 
    "Commerce", "Accounts", "Biology", "Chemistry", "Physics"
]

const A_LEVEL_SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Economics", 
    "Business Studies", "Accounting", "Geography", "History"
]

const GRADES = ["A", "B", "C", "D", "E", "U"]

interface ResultEntry {
    subject: string
    grade: string
}

export function AcademicResultsAnalyzer() {
    const [oLevelResults, setOLevelResults] = useState<ResultEntry[]>(
        O_LEVEL_SUBJECTS.map(s => ({ subject: s, grade: "" }))
    )
    const [aLevelResults, setALevelResults] = useState<ResultEntry[]>(
        A_LEVEL_SUBJECTS.map(s => ({ subject: s, grade: "" }))
    )
    const [report, setReport] = useState<any | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [applyingSchool, setApplyingSchool] = useState<any | null>(null)
    const [applicationStatus, setApplicationStatus] = useState<"idle" | "submitting" | "success">("idle")

    const handleGradeChange = (level: "O" | "A", index: number, grade: string) => {
        if (level === "O") {
            const newResults = [...oLevelResults]
            newResults[index].grade = grade
            setOLevelResults(newResults)
        } else {
            const newResults = [...aLevelResults]
            newResults[index].grade = grade
            setALevelResults(newResults)
        }
    }

    const analyzeResults = () => {
        setIsAnalyzing(true)
        setReport(null)
        // Simulate neural analysis delay
        setTimeout(() => {
            const oGrades = oLevelResults.filter(r => r.grade !== "").map(r => r.grade)
            const aGrades = aLevelResults.filter(r => r.grade !== "").map(r => r.grade)
            
            const allGrades = [...oGrades, ...aGrades]
            const aCount = allGrades.filter(g => g === "A").length
            const bCount = allGrades.filter(g => g === "B").length
            
            const performanceSummary = aCount > 5 ? "Elite Academic Performance" : aCount + bCount > 5 ? "Strong Academic Standing" : "Competent Academic Foundation"
            
            setReport({
                summary: performanceSummary,
                strengths: oLevelResults.filter(r => r.grade === "A").map(r => r.subject).slice(0, 3),
                weaknesses: oLevelResults.filter(r => r.grade === "D" || r.grade === "E").map(r => r.subject),
                schoolTypes: ["Top-Tier Private Boarding", "National Government Schools", "Group A Trust Schools"],
                universities: ["University of Zimbabwe", "NUST", "Africa University", "International Ivy League Candidates"],
                careers: ["Medicine & Health Sciences", "Actuarial Science", "Neural Engineering", "Corporate Law"]
            })
            setIsAnalyzing(false)
        }, 1500)
    }

    const handleAddSubject = (level: "O" | "A") => {
        if (level === "O") {
            setOLevelResults([...oLevelResults, { subject: "", grade: "" }])
        } else {
            setALevelResults([...aLevelResults, { subject: "", grade: "" }])
        }
    }

    const handleSubjectNameChange = (level: "O" | "A", index: number, name: string) => {
        if (level === "O") {
            const newResults = [...oLevelResults]
            newResults[index].subject = name
            setOLevelResults(newResults)
        } else {
            const newResults = [...aLevelResults]
            newResults[index].subject = name
            setALevelResults(newResults)
        }
    }

    const submitApplication = () => {
        setApplicationStatus("submitting")
        setTimeout(() => {
            setApplicationStatus("success")
        }, 2000)
    }

    const renderTable = (title: string, results: ResultEntry[], level: "O" | "A") => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{title}</h3>
                <button 
                    onClick={() => handleAddSubject(level)}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    Add Subject
                </button>
            </div>
            <div className="glass-panel overflow-hidden border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Subject</th>
                            <th className="p-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest w-24">Grade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.map((res, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-3">
                                    {O_LEVEL_SUBJECTS.includes(res.subject) || A_LEVEL_SUBJECTS.includes(res.subject) ? (
                                        <span className="text-xs font-medium text-white">{res.subject}</span>
                                    ) : (
                                        <input 
                                            type="text"
                                            value={res.subject}
                                            placeholder="Enter Subject Name"
                                            aria-label="Subject Name"
                                            onChange={(e) => handleSubjectNameChange(level, i, e.target.value)}
                                            className="bg-transparent border-none text-xs font-medium text-white focus:outline-none w-full placeholder:text-muted-foreground/30"
                                        />
                                    )}
                                </td>
                                <td className="p-3">
                                    <select 
                                        value={res.grade}
                                        aria-label="Select Grade"
                                        onChange={(e) => handleGradeChange(level, i, e.target.value)}
                                        className="bg-background/40 border border-white/10 rounded-lg text-xs font-bold text-primary p-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 w-full"
                                    >
                                        <option value="">-</option>
                                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid gap-8 lg:grid-cols-2">
                {renderTable("O-Level Results", oLevelResults, "O")}
                {renderTable("A-Level Results", aLevelResults, "A")}
            </div>

            <div className="flex flex-col items-center gap-4">
                <button 
                    onClick={analyzeResults}
                    disabled={isAnalyzing}
                    className="group relative px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    {isAnalyzing ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                        <Brain className="w-4 h-4" />
                    )}
                    {isAnalyzing ? "Processing..." : "Analyze Academic Results"}
                </button>
            </div>

            {report && (
                <div className="space-y-12">
                    <div className="glass-panel p-8 border-primary/30 relative overflow-hidden animate-in zoom-in-95 duration-500 teal-glow">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                <Sparkles className="text-primary w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Neural Academic Intelligence Report</h2>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Signal Strength: High-Fidelity Match</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Performance Summary</span>
                                    </div>
                                    <p className="text-sm font-medium text-white">{report.summary}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Strength Subjects</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {report.strengths.length > 0 ? report.strengths.map((s: string) => (
                                            <span key={s} className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-md text-[9px] font-bold text-primary uppercase">{s}</span>
                                        )) : <span className="text-xs text-muted-foreground italic">No core strengths detected.</span>}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Suggested Career Paths</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {report.careers.map((c: string) => (
                                            <li key={c} className="text-xs text-white/80 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-3">Recommended Institutions</span>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase mb-1">Schools</p>
                                            <p className="text-xs text-white/80">{report.schoolTypes.join(", ")}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase mb-1">Universities</p>
                                            <p className="text-xs text-white/80">{report.universities.join(", ")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Neural School Recommendations</h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Top algorithm matches based on your academic signal</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {MOCK_RECOMMENDED_SCHOOLS.map((school) => (
                                <div key={school.name} className="glass-panel p-6 floating-hover group relative flex flex-col h-full border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <GraduationCap size={80} />
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="max-w-[70%]">
                                            <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight leading-tight">{school.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-primary" />
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{school.location}</span>
                                            </div>
                                        </div>
                                        <div className="bg-primary/20 px-2 py-1 rounded-lg flex items-center gap-1 border border-primary/20 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                                            <span className="text-[10px] font-black text-primary">{school.match}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6 flex-1">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest block mb-1">Type</span>
                                                <span className="text-[10px] font-bold text-white leading-none">{school.type}</span>
                                            </div>
                                            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest block mb-1">Fees</span>
                                                <span className="text-[10px] font-bold text-primary leading-none">{school.fees}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest block mb-1">Neural Match Reason</span>
                                            <p className="text-[11px] text-white/70 leading-relaxed italic">"{school.reason}"</p>
                                        </div>

                                        <div>
                                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest block mb-1">Recommended Path</span>
                                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", school.color)}>{school.path}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            setApplyingSchool(school)
                                            setApplicationStatus("idle")
                                        }}
                                        className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Application Modal */}
            {applyingSchool && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-panel w-full max-w-lg p-8 border-primary/30 relative overflow-hidden teal-glow scale-in-center">
                        <button 
                            onClick={() => setApplyingSchool(null)}
                            aria-label="Close application portal"
                            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                <GraduationCap className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Application Portal</h2>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Applying to {applyingSchool.name}</p>
                            </div>
                        </div>

                        {applicationStatus === "success" ? (
                            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary mb-6 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                                    <CheckCircle2 className="text-primary w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Application Submitted!</h3>
                                <p className="text-sm text-muted-foreground max-w-[280px]">Your academic profile and results have been successfully transmitted to the admissions office.</p>
                                <button 
                                    onClick={() => setApplyingSchool(null)}
                                    className="mt-8 px-8 py-3 bg-secondary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                                >
                                    Close Portal
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Student Full Name</label>
                                        <input type="text" placeholder="e.g. John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Email Address</label>
                                        <input type="email" placeholder="student@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary/50" />
                                    </div>
                                </div>

                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Results Confirmation</span>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-primary" />
                                            <span className="text-[8px] text-primary font-bold uppercase">Verified by Neural Engine</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/70 leading-relaxed italic">
                                        "Your O-Level and A-Level results entered in the analyzer will be attached as a verified transcript."
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Additional Documents (Optional)</label>
                                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors cursor-pointer group">
                                        <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <p className="text-[10px] text-muted-foreground group-hover:text-white transition-colors uppercase font-bold tracking-widest">Click to upload birth cert or past reports</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={submitApplication}
                                    disabled={applicationStatus === "submitting"}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {applicationStatus === "submitting" ? (
                                        <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {applicationStatus === "submitting" ? "Transmitting..." : "Submit Secure Application"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    )
}
