"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { useAppStore } from "@/lib/store"
import { Role } from "@/lib/types"
import { 
    User, Mail, Lock, Phone, MapPin, 
    Target, Wallet, Heart, Activity, 
    Airplay, ShieldCheck, CheckCircle2,
    ChevronRight, ChevronLeft, Info,
    PieChart, Coins, Banknote, Shield
} from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface FormData {
    // Step 1: Basic Info
    name: string
    email: string
    phone: string
    password: string
    location: string
    userType: Role
    // Step 2: Preferences
    goal: "save" | "value" | "premium" | ""
    budget: string
    // Step 3: Budget Profile
    income: string
    monthlyBudgetLimit: string
    currency: string
    budgetStyle: "conservative" | "balanced" | "aggressive" | ""
    // Step 4: Interests
    interests: string[]
    // Step 5: Usage
    dataUsage: "low" | "medium" | "high" | ""
    travelFrequency: string
    needs: string[]
    // Step 6: AI Settings
    aiPreference: "cheapest" | "value" | "ai" | ""
    // Step 7: Consent
    consentTerms: boolean
    consentAI: boolean
}

const STEPS = [
    { title: "Basic Info", icon: User },
    { title: "Goals", icon: Target },
    { title: "Budget Profile", icon: PieChart },
    { title: "Interests", icon: Heart },
    { title: "Usage", icon: Activity },
    { title: "AI Settings", icon: Airplay },
    { title: "Consent", icon: ShieldCheck },
]

export default function SignUpPage() {
    const [step, setStep] = useState<Step>(1)
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        password: "",
        location: "",
        userType: "registered",
        goal: "",
        budget: "",
        income: "",
        monthlyBudgetLimit: "",
        currency: "USD",
        budgetStyle: "",
        interests: [],
        dataUsage: "",
        travelFrequency: "",
        needs: [],
        aiPreference: "",
        consentTerms: false,
        consentAI: false
    })

    const router = useRouter()
    const { login } = useAppStore()

<<<<<<< Updated upstream
    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }

    const nextStep = () => {
        if (step < 7) setStep(prev => (prev + 1) as Step)
    }

    const prevStep = () => {
        if (step > 1) setStep(prev => (prev - 1) as Step)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (step < 7) {
            nextStep()
            return
        }

        // Final submission logic
        console.log("Structured Signup Data:", JSON.stringify(formData, null, 2))
        
        // Simple mock auth
        const mockToken = "mock_token_" + Date.now()
        localStorage.setItem("zim_auth_token", mockToken)
        login(formData.email, formData.name, formData.userType)
        router.push("/dashboard")
=======
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, role: userType })
            })
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign up')
            }

            localStorage.setItem("zim_auth_token", data.token)
            login(data.user.email, data.user.name, data.user.role)
            router.push("/dashboard")
        } catch (error: any) {
            alert(error.message)
        }
>>>>>>> Stashed changes
    }

    const toggleMultiSelect = (field: "interests" | "needs", value: string) => {
        setFormData(prev => {
            const current = (prev[field] as string[]) || []
            const exists = current.includes(value)
            const updated = exists 
                ? current.filter(i => i !== value)
                : [...current, value]
            return { ...prev, [field]: updated }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-background/50">
            {/* Header / Brand */}
            <div className="flex flex-col items-center mb-8">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                    <span className="text-2xl font-black text-primary-foreground tracking-tighter">ZC</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">Join ZimCompare</h1>
                <p className="text-muted-foreground mt-2 font-medium">Fintech AI Comparison Platform</p>
            </div>

            <div className="w-full max-w-2xl">
                {/* Progress Bar Container */}
                <div className="mb-10 px-2">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Step {step} of 7</span>
                        <span className="text-sm font-medium text-muted-foreground">{STEPS[step - 1].title}</span>
                    </div>
                    <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / 7) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                    {/* Small Icons Progress */}
                    <div className="flex justify-between mt-4">
                        {STEPS.map((s, idx) => {
                            const Icon = s.icon
                            const isActive = step === idx + 1
                            const isCompleted = step > idx + 1
                            return (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : 
                                          isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground opacity-40"}
                                    `}>
                                        {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Form Content - Glass Panel */}
                <div className="glass-panel p-8 md:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {step === 1 && renderStep1(formData, updateFormData)}
                                {step === 2 && renderStep2(formData, updateFormData)}
                                {step === 3 && renderStep3(formData, updateFormData)}
                                {step === 4 && renderStep4(formData, toggleMultiSelect)}
                                {step === 5 && renderStep5(formData, updateFormData, toggleMultiSelect)}
                                {step === 6 && renderStep6(formData, updateFormData)}
                                {step === 7 && renderStep7(formData, updateFormData)}

                                {/* Navigation Buttons */}
                                <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-8">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-muted-foreground bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                                        >
                                            <ChevronLeft size={18} />
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={step === 7 && (!formData.consentTerms || !formData.consentAI)}
                                        className={`
                                            flex-[2] flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-primary-foreground transition-all shadow-xl
                                            ${step === 7 && (!formData.consentTerms || !formData.consentAI) 
                                                ? "bg-muted opacity-50 cursor-not-allowed" 
                                                : "bg-primary hover:scale-[1.02] active:scale-[0.98] shadow-primary/20"}
                                        `}
                                    >
                                        {step === 7 ? "Complete Signup" : "Continue"}
                                        {step < 7 && <ChevronRight size={18} />}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary font-bold hover:underline transition-all">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

/* Step Render Functions - Defined outside for cleaner JSX */

const renderStep1 = (data: FormData, update: (d: Partial<FormData>) => void) => (
    <div className="space-y-5">
        <h2 className="text-xl font-bold text-foreground">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        required
                        value={data.name}
                        onChange={(e) => update({ name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 glass-input text-sm"
                        placeholder="John Doe"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => update({ email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 glass-input text-sm"
                        placeholder="john@example.com"
                    />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="tel"
                        required
                        value={data.phone}
                        onChange={(e) => update({ phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 glass-input text-sm"
                        placeholder="+263 7..."
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        required
                        value={data.location}
                        onChange={(e) => update({ location: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 glass-input text-sm"
                        placeholder="Harare, Zimbabwe"
                    />
                </div>
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
            <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type="password"
                    required
                    value={data.password}
                    onChange={(e) => update({ password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 glass-input text-sm"
                    placeholder="••••••••"
                />
            </div>
        </div>
    </div>
)

const renderStep2 = (data: FormData, update: (d: Partial<FormData>) => void) => (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Your Financial Goals</h2>
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Primary Goal</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                    { id: "save", label: "Save Money", icon: Wallet },
                    { id: "value", label: "Best Value", icon: Target },
                    { id: "premium", label: "Premium Experience", icon: Activity },
                ].map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => update({ goal: option.id as any })}
                        className={`
                            flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all
                            ${data.goal === option.id 
                                ? "bg-primary/20 border-primary text-primary" 
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}
                        `}
                    >
                        <option.icon size={24} />
                        <span className="text-sm font-bold">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Budget Range (Monthly)</label>
            <Select
                value={data.budget}
                onValueChange={(val) => update({ budget: val })}
            >
                <SelectTrigger className="w-full h-14 pl-4 pr-4 glass-input text-sm border-white/10">
                    <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent className="glass-premium border-white/10">
                    <SelectItem value="low">Under $100</SelectItem>
                    <SelectItem value="mid_low">$100 - $500</SelectItem>
                    <SelectItem value="mid">$500 - $1000</SelectItem>
                    <SelectItem value="mid_high">$1000 - $5000</SelectItem>
                    <SelectItem value="high">$5000+</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
)

const renderStep3 = (data: FormData, update: (d: Partial<FormData>) => void) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <PieChart size={24} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Global Budget Profile</h2>
        </div>
        
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
            <Info className="text-primary shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-muted-foreground leading-relaxed">
                This budget profile powers personalized recommendations across <span className="text-primary font-bold">Banking, Telecom, Stayscape, and more</span>. It ensures we only suggest products you can actually afford.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Monthly Income</label>
                <div className="relative group">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="number"
                        required
                        value={data.income}
                        onChange={(e) => update({ income: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 glass-input text-sm"
                        placeholder="0.00"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Monthly Budget Limit</label>
                <div className="relative group">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="number"
                        required
                        value={data.monthlyBudgetLimit}
                        onChange={(e) => update({ monthlyBudgetLimit: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 glass-input text-sm"
                        placeholder="0.00"
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Currency</label>
                <Select
                    value={data.currency}
                    onValueChange={(val) => update({ currency: val })}
                >
                    <SelectTrigger className="w-full h-14 pl-4 pr-4 glass-input text-sm border-white/10">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="glass-premium border-white/10">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="ZWG">ZWG (ZiG)</SelectItem>
                        <SelectItem value="ZAR">ZAR (R)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Budgeting Style</label>
                <Select
                    value={data.budgetStyle}
                    onValueChange={(val) => update({ budgetStyle: val as any })}
                >
                    <SelectTrigger className="w-full h-14 pl-4 pr-4 glass-input text-sm border-white/10">
                        <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent className="glass-premium border-white/10">
                        <SelectItem value="conservative">Conservative (Safe & Steady)</SelectItem>
                        <SelectItem value="balanced">Balanced (Optimized)</SelectItem>
                        <SelectItem value="aggressive">Aggressive (Growth Focused)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
)

const renderStep4 = (data: FormData, toggle: (f: "interests", v: string) => void) => (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">What interests you?</h2>
        <p className="text-sm text-muted-foreground -mt-4">Select categories you'd like the AI to monitor for you.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
                "Banks", "Insurance", "Telecoms", 
                "Education", "Mobility", "Utilities", "Hospitality"
            ].map((interest) => (
                <button
                    key={interest}
                    type="button"
                    onClick={() => toggle("interests", interest)}
                    className={`
                        px-4 py-3 rounded-xl border text-sm font-bold transition-all
                        ${data.interests.includes(interest)
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/25"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}
                    `}
                >
                    {interest}
                </button>
            ))}
        </div>
    </div>
)

const renderStep5 = (data: FormData, update: (d: Partial<FormData>) => void, toggle: (f: "needs", v: string) => void) => (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Usage & Lifestyle</h2>
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Data Usage</label>
            <div className="flex gap-4">
                {["Low", "Medium", "High"].map((val) => (
                    <button
                        key={val}
                        type="button"
                        onClick={() => update({ dataUsage: val.toLowerCase() as any })}
                        className={`
                            flex-1 py-3 rounded-xl border text-sm font-bold transition-all
                            ${data.dataUsage === val.toLowerCase()
                                ? "bg-primary/20 border-primary text-primary"
                                : "bg-white/5 border-white/10 text-muted-foreground"}
                        `}
                    >
                        {val}
                    </button>
                ))}
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Travel Frequency</label>
            <Select
                value={data.travelFrequency}
                onValueChange={(val) => update({ travelFrequency: val })}
            >
                <SelectTrigger className="w-full h-14 pl-4 pr-4 glass-input text-sm border-white/10">
                    <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="glass-premium border-white/10">
                    <SelectItem value="rarely">Rarely</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                    <SelectItem value="frequently">Frequently</SelectItem>
                    <SelectItem value="business">Frequent Business Travel</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Needs</label>
            <div className="grid grid-cols-2 gap-3">
                {["Car", "Education"].map((need) => (
                    <button
                        key={need}
                        type="button"
                        onClick={() => toggle("needs", need)}
                        className={`
                            px-4 py-3 rounded-xl border text-sm font-bold transition-all
                            ${data.needs.includes(need)
                                ? "bg-primary border-primary text-white"
                                : "bg-white/5 border-white/10 text-muted-foreground"}
                        `}
                    >
                        {need}
                    </button>
                ))}
            </div>
        </div>
    </div>
)

const renderStep6 = (data: FormData, update: (d: Partial<FormData>) => void) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Airplay size={24} />
            </div>
            <h2 className="text-xl font-bold text-foreground">AI Personalization</h2>
        </div>
        <p className="text-sm text-muted-foreground">How should our AI engine prioritize recommendations for you?</p>
        <div className="space-y-3">
            {[
                { id: "cheapest", label: "Strictly Cheapest", desc: "Priority on the lowest absolute cost." },
                { id: "value", label: "Best Value", desc: "Balance between features and price." },
                { id: "ai", label: "AI Recommended", desc: "Personalized based on your unique usage patterns." },
            ].map((pref) => (
                <button
                    key={pref.id}
                    type="button"
                    onClick={() => update({ aiPreference: pref.id as any })}
                    className={`
                        w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between
                        ${data.aiPreference === pref.id
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/5"
                            : "bg-white/5 border-white/10 hover:bg-white/10"}
                    `}
                >
                    <div>
                        <h4 className={`text-sm font-bold ${data.aiPreference === pref.id ? "text-primary" : "text-foreground"}`}>
                            {pref.label}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{pref.desc}</p>
                    </div>
                    {data.aiPreference === pref.id && <CheckCircle2 className="text-primary" size={20} />}
                </button>
            ))}
        </div>
    </div>
)

const renderStep7 = (data: FormData, update: (d: Partial<FormData>) => void) => (
    <div className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-foreground">Almost Done!</h2>
            <p className="text-sm text-muted-foreground">We take your data privacy seriously. Please review and accept the following.</p>
        </div>

        <div className="space-y-4">
            <label className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                <input
                    type="checkbox"
                    checked={data.consentTerms}
                    onChange={(e) => update({ consentTerms: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded-md border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer"
                />
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Accept Terms & Conditions</h4>
                    <p className="text-xs text-muted-foreground mt-1">I agree to the ZimCompare terms of service and privacy policy.</p>
                </div>
            </label>

            <label className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                <input
                    type="checkbox"
                    checked={data.consentAI}
                    onChange={(e) => update({ consentAI: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded-md border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer"
                />
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">AI Data Processing</h4>
                    <p className="text-xs text-muted-foreground mt-1">Allow ZimCompare to use my data to provide personalized AI-driven financial recommendations.</p>
                </div>
            </label>
        </div>

        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 items-start">
            <Info className="text-orange-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-orange-200/80 leading-relaxed">
                Note: You can withdraw your consent and request data deletion at any time from your account settings.
            </p>
        </div>
    </div>
)

