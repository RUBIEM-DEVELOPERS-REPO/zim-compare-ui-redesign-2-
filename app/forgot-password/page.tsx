"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock API call
        setTimeout(() => {
            setIsSubmitted(true)
        }, 1000)
    }

    return (
        <div className="h-screen-dynamic overflow-y-auto scrollbar-premium">
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl shadow-primary/5">
                    <div className="flex flex-col items-center mb-8">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /><circle cx="16.5" cy="7.5" r=".5" /></svg>
                        </div>
                        <h1 className="text-2xl font-medium text-foreground">Forgot Password?</h1>
                        <p className="text-sm text-muted-foreground mt-1 text-center">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-[0.98]"
                            >
                                Send Reset Link
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-medium text-foreground">Check your email</h3>
                                <p className="text-sm text-muted-foreground">
                                    We've sent a password reset link to <br />
                                    <span className="font-medium text-foreground">{email}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-sm text-primary font-medium hover:underline mt-2"
                            >
                                Resend email
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-border flex justify-center">
                        <Link href="/signin" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

