"use client"

import { useSearchParams } from "next/navigation"
import { apiGet } from "@/lib/api"
import { useI18n } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Star, Check, X, Shield, Award, Users, Heart, Briefcase, ShoppingCart } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { SwitchSaveSimulator } from "@/components/dashboard/switch-save-simulator"

function CompareContent() {
    const searchParams = useSearchParams()
    const { clearCompareTray } = useAppStore()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const { t } = useI18n()

    const [hotels, setHotels] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        clearCompareTray()
        apiGet('/hotels')
            .then(res => {
                setHotels(res.hotels || [])
                setLoading(false)
            })
            .catch(() => {
                setHotels([])
                setLoading(false)
            })
    }, [clearCompareTray])

    const selectedHotels = hotels.filter((h) => ids.includes(h.id))

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">Loading comparison...</div>
    }

    if (selectedHotels.length < 2) {
        return (
            <div className="text-center py-24">
                <h1 className="text-xl font-medium mb-4">Stay Comparison</h1>
                <p className="text-muted-foreground">Select 2 or 3 hotels to see the AI analysis.</p>
            </div>
        )
    }

    // AI Scoring Logic
    const calculateScores = () => {
        const scored = selectedHotels.map(hotel => {
            // 1. Rating Score (40%)
            const ratingScore = (hotel.rating / 5) * 40

            // 2. Amenities Score (30%)
            const amenities = [hotel.hasWifi, hotel.hasPool, hotel.hasBreakfast, hotel.hasGym, hotel.hasSpa, hotel.hasParking]
            const amMatch = amenities.filter(Boolean).length
            const amScore = (amMatch / 6) * 30

            // 3. Price Score (20%) - Normalize relative to the max price in selection
            const maxPrice = Math.max(...selectedHotels.map(h => h.pricePerNight))
            const priceScore = (1 - (hotel.pricePerNight / (maxPrice * 1.5))) * 20 // Scaled inverse

            // 4. Star Score (10%)
            const starScore = (hotel.stars / 5) * 10

            const totalScore = Math.round(ratingScore + amScore + priceScore + starScore)

            return { ...hotel, totalScore }
        }).sort((a, b) => b.totalScore - a.totalScore)

        return scored
    }

    const scoredHotels = calculateScores()
    const winner = scoredHotels[0]

    // Category Logic
    const getCategoryWinner = (category: string) => {
        switch (category) {
            case "value":
                return [...selectedHotels].sort((a, b) => (a.pricePerNight / a.rating) - (b.pricePerNight / b.rating))[0]
            case "luxury":
                return [...selectedHotels].sort((a, b) => b.stars - a.stars || b.pricePerNight - a.pricePerNight)[0]
            case "business":
                return [...selectedHotels].sort((a, b) => {
                    const aScore = (a.hasWifi ? 2 : 0) + (a.hasParking ? 1 : 0) + (a.hasGym ? 1 : 0)
                    const bScore = (b.hasWifi ? 2 : 0) + (b.hasParking ? 1 : 0) + (b.hasGym ? 1 : 0)
                    return bScore - aScore
                })[0]
            case "couples":
                return [...selectedHotels].sort((a, b) => {
                    const aScore = (a.hasSpa ? 2 : 0) + (a.hasPool ? 1 : 0) + (a.rating >= 4.5 ? 1 : 0)
                    const bScore = (b.hasSpa ? 2 : 0) + (b.hasPool ? 1 : 0) + (b.rating >= 4.5 ? 1 : 0)
                    return bScore - aScore
                })[0]
            case "family":
                return [...selectedHotels].sort((a, b) => {
                    const aScore = (a.hasPool ? 2 : 0) + (a.hasBreakfast ? 1 : 0) + (a.type === "lodge" ? 1 : 0)
                    const bScore = (b.hasPool ? 2 : 0) + (b.hasBreakfast ? 1 : 0) + (b.type === "lodge" ? 1 : 0)
                    return bScore - aScore
                })[0]
            default:
                return selectedHotels[0]
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-12">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-medium text-foreground">Stay Comparison</h1>
                    <p className="text-muted-foreground mt-1">AI-powered decision analysis for your Zimbabwe trip</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1 font-medium bg-primary/5 text-primary border-primary/20">
                        {selectedHotels.length} Properties Compared
                    </Badge>
                </div>
            </div>

            {/* 1. Comparison Summary Table */}
            <section className="space-y-4">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Comparison Summary Table
                </h2>
                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-secondary/30">
                                <th className="text-left p-4 border-b border-border text-muted-foreground font-medium">Feature</th>
                                {selectedHotels.map(h => (
                                    <th key={h.id} className="p-4 border-b border-border text-center font-medium text-foreground">
                                        {h.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 border-b border-border bg-secondary/10 font-medium">Location</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 border-b border-border text-center text-foreground">{h.city}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-border bg-secondary/10 font-medium">Star Rating</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 border-b border-border text-center">
                                        <div className="flex justify-center">
                                            {[...Array(h.stars)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-border bg-secondary/10 font-medium">Price / Night</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 border-b border-border text-center text-foreground font-medium">${h.pricePerNight}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-border bg-secondary/10 font-medium">WiFi</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 border-b border-border text-center">
                                        {h.hasWifi ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-border bg-secondary/10 font-medium">Pool</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 border-b border-border text-center">
                                        {h.hasPool ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-border bg-secondary/10 font-medium">Breakfast</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 border-b border-border text-center">
                                        {h.hasBreakfast ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 border-b border-border bg-secondary/10 font-medium">Reviews</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 border-b border-border text-center text-foreground font-medium">
                                        {h.rating} / 5 ({h.reviewCount} reviews)
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 bg-secondary/10 font-medium">Room Types</td>
                                {selectedHotels.map(h => (
                                    <td key={h.id} className="p-4 text-center text-foreground text-xs italic">
                                        {h.roomTypes.length > 0 ? h.roomTypes.join(", ") : "Not provided"}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 2. Strengths & Weaknesses */}
            <section className="space-y-4">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Strengths & Weaknesses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedHotels.map(h => {
                        const strengths = []
                        const weaknesses = []

                        if (h.rating >= 4.5) strengths.push("Excellent reputation")
                        if (h.stars === 5) strengths.push("World-class luxury")
                        if (h.pricePerNight < 100) strengths.push("Budget friendly")
                        if (h.hasWifi && h.hasPool && h.hasBreakfast) strengths.push("Comprehensive amenities")
                        if (h.recommended) strengths.push("Verified excellence")

                        if (h.pricePerNight > 250) weaknesses.push("Premium pricing")
                        if (!h.hasWifi) weaknesses.push("No WiFi")
                        if (!h.hasGym && !h.hasSpa) weaknesses.push("Limited wellness facilities")
                        if (h.reviewCount < 20) weaknesses.push("Limited guest feedback")

                        return (
                            <div key={h.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-medium text-lg mb-4 text-foreground">{h.name}</h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Strengths</p>
                                        <ul className="space-y-1.5">
                                            {strengths.map((s, i) => (
                                                <li key={i} className="text-xs text-foreground flex items-start gap-2">
                                                    <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                            {strengths.length === 0 && <li className="text-xs text-muted-foreground italic">None significant</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Weaknesses</p>
                                        <ul className="space-y-1.5">
                                            {weaknesses.map((w, i) => (
                                                <li key={i} className="text-xs text-foreground flex items-start gap-2">
                                                    <X className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />
                                                    {w}
                                                </li>
                                            ))}
                                            {weaknesses.length === 0 && <li className="text-xs text-muted-foreground italic">None significant</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* 3. Best Picks by Category */}
            <section className="space-y-4">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Best Picks by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { cat: "value", icon: <ShoppingCart className="h-4 w-4" />, label: "Value for Money" },
                        { cat: "luxury", icon: <Award className="h-4 w-4" />, label: "Luxury" },
                        { cat: "business", icon: <Briefcase className="h-4 w-4" />, label: "Business" },
                        { cat: "couples", icon: <Heart className="h-4 w-4" />, label: "Couples" },
                        { cat: "family", icon: <Users className="h-4 w-4" />, label: "Family" }
                    ].map(item => {
                        const pick = getCategoryWinner(item.cat)
                        return (
                            <div key={item.cat} className="flex flex-col items-center text-center p-4 bg-secondary/20 rounded-2xl border border-secondary/30">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                                    {item.icon}
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">{item.label}</p>
                                <p className="text-xs font-medium text-foreground leading-tight">{pick.name}</p>
                            </div>
                        )
                    })}
                    {/* Instant Booking */}
                    <div className="flex flex-col items-center text-center p-4 bg-primary text-primary-foreground rounded-2xl border border-primary/20 shadow-lg shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:scale-110 transition-transform">
                            <Star className="h-12 w-12 fill-white" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center mb-2 relative z-10">
                            <Check className="h-4 w-4" />
                        </div>
                        <p className="text-[10px] text-white/70 uppercase font-medium mb-1 relative z-10">Instant Booking</p>
                        <p className="text-xs font-bold leading-tight relative z-10">{winner.name}</p>
                    </div>
                </div>
            </section>

            {/* 3.5 Switch & Save Simulator */}
            <section className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="glass-floating p-8 bg-secondary/10 border-border/50 rounded-3xl flex flex-col justify-center">
                    <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Value Optimization Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Our engine has identified potential savings by comparing your primary choice with the highest value property in this set.
                    </p>
                </div>
                <SwitchSaveSimulator
                    category="hotels"
                    current={selectedHotels[0]}
                    recommended={getCategoryWinner("value")}
                />
            </section>

            {/* 4. Final AI Recommendation */}
            <section className="rounded-3xl bg-primary/[0.03] border border-primary/20 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
                    <Shield className="h-48 w-48 text-primary" />
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-6">
                        <div>
                            <Badge className="mb-4 bg-primary text-primary-foreground font-medium px-4 py-1 hover:bg-primary">AI TOP PICK</Badge>
                            <h2 className="text-3xl font-medium text-foreground mb-2">{winner.name}</h2>
                            <p className="text-lg text-muted-foreground italic">"Based on our 40/30/20/10 weighted analysis, this is the most optimal choice for your stay."</p>
                        </div>

                        <div className="space-y-4">
                            <p className="font-medium text-sm text-foreground">Why this hotel won:</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <li className="flex items-start gap-3 text-sm text-foreground/80">
                                    <div className="h-5 w-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">✓</div>
                                    <span>Superior <strong>{winner.rating}</strong>/5 user rating from {winner.reviewCount} guests.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-foreground/80">
                                    <div className="h-5 w-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">✓</div>
                                    <span>Highest Amenities Match Score ({(scoredHotels[0].totalScore / 100 * 10).toFixed(0)}/10 pts)</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-foreground/80">
                                    <div className="h-5 w-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">✓</div>
                                    <span>Optimized price-to-quality ratio at <strong>${winner.pricePerNight}</strong>/night.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-foreground/80">
                                    <div className="h-5 w-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">✓</div>
                                    <span>Consistent <strong>{winner.stars}-star</strong> performance across all metrics.</span>
                                </li>
                            </ul>
                        </div>

                        {scoredHotels.length > 1 && (
                            <div className="pt-4 border-t border-primary/10">
                                <p className="text-xs text-muted-foreground">
                                    <strong>Tie-breaker Analysis:</strong> While {scoredHotels[1].name} offered
                                    {scoredHotels[1].pricePerNight < winner.pricePerNight ? " lower pricing," : " a high rating,"}
                                    {winner.name} secured the lead through
                                    {winner.hasSpa && !scoredHotels[1].hasSpa ? " superior wellness amenities (Spa)" : " a better balance of reviews and star-rating reliability"}.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-64 flex flex-col items-center gap-4">
                        <div className="relative h-48 w-48 flex items-center justify-center">
                            <svg className="h-full w-full transform -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-primary/5"
                                />
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 80}
                                    strokeDashoffset={2 * Math.PI * 80 * (1 - winner.totalScore / 100)}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    className="text-primary transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-medium text-foreground">{winner.totalScore}%</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest">Confidence</span>
                            </div>
                        </div>
                        <button className="w-full bg-primary text-primary-foreground font-medium py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            BOOK NOW
                        </button>
                    </div>
                </div>
            </section>

            <div className="text-center">
                <button
                    onClick={() => window.history.back()}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
                >
                    Go back to property search
                </button>
            </div>
        </div>
    )
}

export default function HotelComparePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading AI Comparison...</div>}>
            <CompareContent />
        </Suspense>
    )
}

