"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppStore } from "@/lib/store"

export default function SignUpPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { login } = useAppStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)
        
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: "registered" })
            })

            const contentType = response.headers.get("content-type")
            let data: any = {}
            if (contentType && contentType.includes("application/json")) {
                data = await response.json()
            }
            
            if (!response.ok) {
                setError(data.error || 'Failed to sign up')
                setIsLoading(false)
                return
            }

            localStorage.setItem("zim_auth_token", data.token)
            login(data.user.email, data.user.name, data.user.role)
            router.push("/interface-selection")
        } catch (err: any) {
            console.error('Sign up error:', err)
            setError('Network error. Please check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen w-full overflow-hidden bg-background flex items-center justify-center relative">
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            {/* Card */}
            <div className="w-full max-w-[390px] relative z-10 px-4">
                <div className="signin-glass-card px-7 py-6 shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="h-10 w-10 glass-badge flex items-center justify-center mb-3">
                            <span className="text-[21px] font-medium text-primary tracking-tighter">FT</span>
                        </div>
                        <h1 className="text-2xl font-display font-medium text-foreground leading-tight">Create Account</h1>
                        <p className="text-[13px] text-muted-foreground mt-1 font-medium tracking-tight">Join the Fintech AI comparison platform.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-10 px-4 glass-input outline-none transition-all text-[14px] font-medium placeholder:text-muted-foreground/50"
                                placeholder="John Doe"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-10 px-4 glass-input outline-none transition-all text-[14px] font-medium placeholder:text-muted-foreground/50"
                                placeholder="name@example.com"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 px-4 glass-input outline-none transition-all text-[14px] font-medium placeholder:text-muted-foreground/50"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[44px] glass-primary-button text-sm font-medium mt-1 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                "Sign up to Fintech"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-5 pt-4 glass-divider">
                        <p className="text-center text-sm text-muted-foreground font-medium">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-primary font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}