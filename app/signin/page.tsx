"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useAppStore } from "@/lib/store"

export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const { login } = useAppStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simple mock auth
        const mockToken = "mock_token_" + Date.now()
        localStorage.setItem("zim_auth_token", mockToken)
        login(email, "User", "registered")
        router.push("/dashboard")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl shadow-primary/5">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                        <span className="text-xl font-bold text-primary-foreground">ZC</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground ml-1">Password</label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
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
                        Sign in
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
