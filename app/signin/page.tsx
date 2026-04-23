"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppStore } from "@/lib/store"

export default function SignInPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const { login } = useAppStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
<<<<<<< Updated upstream
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign in')
            }

            localStorage.setItem("zim_auth_token", data.token)
            login(data.user.email, data.user.name, data.user.role)
            router.push("/dashboard")
        } catch (error: any) {
            alert(error.message)
        }
=======
        const mockToken = "mock_token_" + Date.now()
        localStorage.setItem("zim_auth_token", mockToken)
        login(email, username || email.split("@")[0], "registered")
        router.push("/interface-selection")
>>>>>>> Stashed changes
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
                        <h1 className="text-2xl font-display font-medium text-foreground leading-tight">Welcome back</h1>
                        <p className="text-[13px] text-muted-foreground mt-1 font-medium tracking-tight">Please enter your details to sign in.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-10 px-4 glass-input outline-none transition-all text-[14px] font-medium placeholder:text-muted-foreground/50"
                                placeholder="your_username"
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
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-primary hover:opacity-80 transition-opacity"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 px-4 glass-input outline-none transition-all text-[14px] font-medium placeholder:text-muted-foreground/50"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[44px] glass-primary-button text-sm font-medium mt-1 active:scale-[0.98] transition-all"
                        >
                            Sign in to Fintech
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-5 pt-4 glass-divider">
                        <p className="text-center text-sm text-muted-foreground font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-primary font-medium hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
