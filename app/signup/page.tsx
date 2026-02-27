"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useAppStore } from "@/lib/store"
import { Role } from "@/lib/types"
import { User, Info, Shield, Zap, Layout, Bot } from "lucide-react"

const USER_TYPE_DESCRIPTIONS: Record<Role, { title: string, desc: string, icon: any }> = {
    guest: {
        title: "Guest User",
        desc: "Can view limited comparisons",
        icon: User
    },
    registered: {
        title: "Registered User",
        desc: "Can save comparisons and preferences",
        icon: Shield
    },
    paid: {
        title: "Paid User",
        desc: "Full access to AI chatbot, predictions, summaries",
        icon: Zap
    },
    admin: {
        title: "Admin User",
        desc: "Manages data, pricing updates, institutions",
        icon: Layout
    },
    ai: {
        title: "System AI",
        desc: "Recommendation & prediction engine",
        icon: Bot
    }
}

export default function SignUpPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [userType, setUserType] = useState<Role>("guest")
    const [isFocused, setIsFocused] = useState(false)

    const router = useRouter()
    const { login } = useAppStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simple mock auth
        const mockToken = "mock_token_" + Date.now()
        localStorage.setItem("zim_auth_token", mockToken)
        login(email, name, userType)
        router.push("/dashboard")
    }

    const currentDescription = USER_TYPE_DESCRIPTIONS[userType]
    const IconComponent = currentDescription.icon

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl shadow-primary/5">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                        <span className="text-xl font-bold text-primary-foreground">ZC</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
                    <p className="text-sm text-muted-foreground mt-1">Join ZimCompare today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Email address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-foreground ml-1">User Type</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value as Role)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer"
                        >
                            <option value="guest">Guest User</option>
                            <option value="registered">Registered User</option>
                            <option value="paid">Paid User</option>
                            <option value="admin">Admin User</option>
                            <option value="ai">System AI</option>
                        </select>
                        <div className="absolute right-4 top-[38px] pointer-events-none text-muted-foreground">
                            <Info size={16} />
                        </div>

                        {/* Floating Pop-up */}
                        {isFocused && (
                            <div className="absolute z-50 md:left-full md:top-0 md:ml-4 md:w-64 w-full mt-2 animate-in fade-in zoom-in duration-200">
                                <div className="bg-[#FFFDF0] border border-orange-100 rounded-xl p-4 shadow-lg relative">
                                    {/* Desktop Arrow */}
                                    <div className="hidden md:block absolute -left-2 top-4 w-4 h-4 bg-[#FFFDF0] border-l border-t border-orange-100 rotate-[-45deg]" />
                                    {/* Mobile Arrow */}
                                    <div className="md:hidden absolute -top-2 left-8 w-4 h-4 bg-[#FFFDF0] border-l border-t border-orange-100 rotate-[45deg]" />

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1.5 bg-orange-100 rounded-lg text-orange-600">
                                            <IconComponent size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-sm">{currentDescription.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                {currentDescription.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all mt-2 active:scale-[0.98]"
                    >
                        Create account
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
