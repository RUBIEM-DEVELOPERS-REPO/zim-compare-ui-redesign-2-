"use client"

import { universities } from "@/lib/mock/universities"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"

interface UniversitiesProfilesProps {
    location?: string
}

export function UniversitiesProfiles({ location }: UniversitiesProfilesProps) {
    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter((u) => u.city === location)
        : universities

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Detailed Institution Profiles</h3>
                <div className="grid gap-6">
                    {filteredUniversities.map((uni) => (
                        <div
                            key={uni.id}
                            className={cn(
                                "rounded-2xl border bg-card p-6 transition-all duration-300",
                                "border-border hover:border-teal-200/50 hover:shadow-lg hover:shadow-teal-500/5"
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
                                <div>
                                    <h4 className="text-lg font-bold text-foreground uppercase tracking-tight">{uni.name}</h4>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                                        {uni.city}, {uni.province}
                                    </p>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
                                    {uni.type.replace("_", " ")}
                                </span>
                            </div>

                            {/* Scores */}
                            <div className="flex gap-2 flex-wrap mb-6">
                                <ScoreBadge score={uni.academicScore} label="Academic" />
                                <ScoreBadge score={uni.affordabilityScore} label="Affordability" />
                                <ScoreBadge score={uni.employabilityScore} label="Employability" />
                                <ScoreBadge score={uni.studentLifeRating} label="Student Life" />
                                <ScoreBadge score={uni.graduateEmployabilityScore} label="Graduate Employment" />
                            </div>

                            {/* Key Information Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Annual Fees</p>
                                    <p className="text-sm font-bold text-teal-600">${uni.annualFees.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Application Fee</p>
                                    <p className="text-sm font-bold text-foreground">${uni.applicationFee}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Ranking</p>
                                    <p className="text-sm font-bold text-foreground">
                                        {uni.ranking.local ? `#${uni.ranking.local}` : "N/A"}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Acceptance Rate</p>
                                    <p className="text-sm font-bold text-foreground">
                                        {uni.acceptanceRate ? `${uni.acceptanceRate}%` : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Accreditation */}
                            <div className="mb-6">
                                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Accreditation Status</p>
                                <p className="text-sm font-medium text-foreground">{uni.accreditationStatus}</p>
                            </div>

                            {/* Faculties */}
                            <div className="mb-6">
                                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Faculties ({uni.faculties.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {uni.faculties.map((faculty) => (
                                        <span
                                            key={faculty}
                                            className="text-[10px] font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100"
                                        >
                                            {faculty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Programs */}
                            <div className="mb-6">
                                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Key Programs ({uni.programs.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {uni.programs.map((program) => (
                                        <span
                                            key={program}
                                            className="text-[10px] font-medium bg-secondary/50 text-foreground px-3 py-1.5 rounded-full border border-border/30"
                                        >
                                            {program}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Facilities */}
                            <div className="mb-6">
                                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Facilities & Services</p>
                                <div className="flex flex-wrap gap-2">
                                    {uni.accommodationAvailable && (
                                        <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100">
                                            On-Campus Accommodation
                                        </span>
                                    )}
                                    {uni.onlineLearningAvailable && (
                                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                                            Online Learning
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Application Requirements */}
                            <div>
                                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Application Requirements</p>
                                <ul className="space-y-1">
                                    {uni.applicationRequirements.map((req, idx) => (
                                        <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                                            <span className="text-teal-600 mt-0.5">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Disclaimer />
        </div>
    )
}
