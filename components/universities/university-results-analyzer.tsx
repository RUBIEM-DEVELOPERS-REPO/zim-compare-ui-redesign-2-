"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { GraduationCap, Brain, Plus, Sparkles, Trophy, Target, TrendingUp, MapPin, CheckCircle2, Send, X, BookOpen, Fingerprint } from "lucide-react"

const A_LEVEL_SUBJECTS = [
    "Mathematics", "Biology", "Chemistry", "Physics", "Geography", 
    "History", "Economics", "Business Studies", "Accounting", 
    "Computer Science", "Literature", "Divinity"
]

const GRADES = ["A", "B", "C", "D", "E", "U"]

const MOCK_UNIVERSITIES = [
    {
        name: "University of Zimbabwe (UZ)",
        score: 97,
        program: "MBChB Medicine & Surgery",
        requirements: "15 Points (Biology, Chemistry, Physics/Maths)",
        reason: "Your high grades in Science subjects strongly align with UZ's competitive medical faculty.",
        location: "Harare"
    },
    {
        name: "National University of Science & Tech (NUST)",
        score: 95,
        program: "BEng Software Engineering",
        requirements: "12+ Points (Maths, Physics, Computer Science)",
        reason: "NUST's innovation-driven engineering curriculum fits your technical subject profile.",
        location: "Bulawayo"
    },
    {
        name: "Africa University",
        score: 93,
        program: "BSc International Relations",
        requirements: "10+ Points (History, Literature, Geography)",
        reason: "Global exposure and humanities focus match your strong English and History results.",
        location: "Mutare"
    },
    {
        name: "Midlands State University (MSU)",
        score: 91,
        program: "LLB Honours Law",
        requirements: "14+ Points (Literature, History, Divinity)",
        reason: "MSU's law faculty is highly regarded for its moot court and legal research programs.",
        location: "Gweru"
    },
    {
        name: "Chinhoyi University of Technology (CUT)",
        score: 88,
        program: "BSc Creative Design & Tech",
        requirements: "8+ Points (Mathematics, Geography, Any Technical)",
        reason: "Perfect match for students looking to bridge technology with creative problem solving.",
        location: "Chinhoyi"
    }
]

interface SubjectResult {
    subject: string
    grade: string
    mark: string
    included: boolean
}

export function UniversityResultsAnalyzer() {
    const [results, setResults] = useState<SubjectResult[]>(
        A_LEVEL_SUBJECTS.map(s => ({ subject: s, grade: "", mark: "", included: true }))
    )
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [report, setReport] = useState<any | null>(null)
    const [applyingUni, setApplyingUni] = useState<any | null>(null)
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")

    const handleUpdate = (index: number, field: keyof SubjectResult, value: any) => {
        const newResults = [...results]
        newResults[index] = { ...newResults[index], [field]: value }
        setResults(newResults)
    }

    const analyzeFit = () => {
        setIsAnalyzing(true)
        setReport(null)
        setTimeout(() => {
            const includedResults = results.filter(r => r.included && r.grade !== "")
            const pointsMap: Record<string, number> = { "A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "U": 0 }
            const totalPoints = includedResults.reduce((acc, curr) => acc + pointsMap[curr.grade], 0)
            
            setReport({
                points: totalPoints,
                recommendations: MOCK_UNIVERSITIES.filter(u => {
                    const req = parseInt(u.requirements.split(" ")[0])
                    return totalPoints >= req - 2 // Relaxed for mock
                })
            })
            setIsAnalyzing(false)
        }, 2000)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="glass-panel overflow-hidden border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Included</th>
                            <th className="p-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest">A-Level Subject</th>
                            <th className="p-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest w-32">Grade</th>
                            <th className="p-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest w-32">Mark (%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.map((res, i) => (
                            <tr key={res.subject} className={cn("hover:bg-white/5 transition-colors", !res.included && "opacity-40")}>
                                <td className="p-4">
                                    <input 
                                        type="checkbox" 
                                        checked={res.included}
                                        aria-label={`Include ${res.subject} in analysis`}
                                        onChange={(e) => handleUpdate(i, "included", e.target.checked)}
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                                    />
                                </td>
                                <td className="p-4 text-xs font-medium text-white">{res.subject}</td>
                                <td className="p-4">
                                    <select 
                                        value={res.grade}
                                        aria-label={`Select grade for ${res.subject}`}
                                        onChange={(e) => handleUpdate(i, "grade", e.target.value)}
                                        disabled={!res.included}
                                        className="bg-background/40 border border-white/10 rounded-lg text-xs font-bold text-primary p-2 focus:outline-none focus:ring-1 focus:ring-primary/50 w-full"
                                    >
                                        <option value="">Grade</option>
                                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <input 
                                        type="text"
                                        placeholder="Optional"
                                        aria-label={`Mark percentage for ${res.subject}`}
                                        value={res.mark}
                                        disabled={!res.included}
                                        onChange={(e) => handleUpdate(i, "mark", e.target.value)}
                                        className="bg-background/40 border border-white/10 rounded-lg text-xs font-medium text-white p-2 focus:outline-none focus:ring-1 focus:ring-primary/50 w-full"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={analyzeFit}
                    disabled={isAnalyzing}
                    className="group relative px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    {isAnalyzing ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                        <Fingerprint className="w-4 h-4" />
                    )}
                    {isAnalyzing ? "Scanning Fit..." : "Analyze University Fit"}
                </button>
            </div>

            {report && (
                <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Aggregated Point Score: {report.points} Points</span>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Neural Fit Intelligence</h2>
                        <p className="text-xs text-muted-foreground max-w-lg mt-2">Our algorithm has mapped your {report.points}-point profile against Zimbabwe's top university enrollment gates.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {report.recommendations.map((uni: any) => (
                            <div key={uni.name} className="glass-panel p-8 border-white/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <GraduationCap size={100} />
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight leading-tight">{uni.name}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{uni.location}</span>
                                        </div>
                                    </div>
                                    <div className="bg-primary/20 px-3 py-1.5 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                        <span className="text-xs font-black text-primary">{uni.score}% FIT</span>
                                    </div>
                                </div>

                                <div className="space-y-5 flex-1">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Recommended Program</span>
                                        </div>
                                        <p className="text-sm font-bold text-white">{uni.program}</p>
                                        <p className="text-[10px] text-primary font-bold uppercase mt-1">Req: {uni.requirements}</p>
                                    </div>

                                    <div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Neural Match Reason</span>
                                        <p className="text-xs text-white/70 italic leading-relaxed">"{uni.reason}"</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        setApplyingUni(uni)
                                        setStatus("idle")
                                    }}
                                    className="w-full mt-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/10"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* University Application Modal */}
            {applyingUni && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="glass-panel w-full max-w-xl p-10 border-primary/30 relative overflow-hidden teal-glow">
                        <button 
                            onClick={() => setApplyingUni(null)} 
                            aria-label="Close enrollment modal"
                            className="absolute top-6 right-6 text-muted-foreground hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                <GraduationCap className="text-primary w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">University Enrollment</h2>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Applying for {applyingUni.program} at {applyingUni.name}</p>
                            </div>
                        </div>

                        {status === "success" ? (
                            <div className="py-12 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary mb-8 animate-bounce shadow-[0_0_40px_rgba(20,184,166,0.3)]">
                                    <CheckCircle2 className="text-primary w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-3">Transmission Successful</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">Your verified A-Level transcript and academic profile have been successfully submitted to the University registrar.</p>
                                <button 
                                    onClick={() => setApplyingUni(null)}
                                    className="mt-10 px-10 py-4 bg-secondary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                                >
                                    Return to Intelligence Hub
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Legal Name</label>
                                        <input 
                                            type="text" 
                                            aria-label="Full Legal Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">National ID Number</label>
                                        <input 
                                            type="text" 
                                            aria-label="National ID Number"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50" 
                                        />
                                    </div>
                                </div>

                                <div className="p-5 bg-primary/10 rounded-2xl border border-primary/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Verified Academic Signal Attached</span>
                                    </div>
                                    <p className="text-[11px] text-white/80 leading-relaxed italic">
                                        "A verified aggregate of your {report?.points} A-Level points will be transmitted alongside your application as a high-fidelity credential."
                                    </p>
                                </div>

                                <button 
                                    onClick={() => {
                                        setStatus("submitting")
                                        setTimeout(() => setStatus("success"), 2500)
                                    }}
                                    disabled={status === "submitting"}
                                    className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    {status === "submitting" ? (
                                        <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                    {status === "submitting" ? "TRANSMITTING DATA..." : "SECURE ENROLLMENT SUBMISSION"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
