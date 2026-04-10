"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { apiGet } from "@/lib/api"

const protectedRoutes = ["/dashboard", "/banking", "/telecom", "/schools", "/insurance", "/saved", "/summaries", "/chat", "/admin"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [authorized, setAuthorized] = useState(false)
    const { login, logout } = useAppStore()

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("zim_auth_token")
            const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))

            if (token) {
                try {
                    const data = await apiGet("/auth/me")
                    if (data.user) {
                        login(data.user.email, data.user.name, data.user.role)
                    }
                } catch (e) {
                    localStorage.removeItem("zim_auth_token")
                    logout()
                    if (isProtectedRoute) {
                        setAuthorized(false)
                        router.push("/signin")
                        return
                    }
                }
            }

            if (isProtectedRoute && !token) {
                setAuthorized(false)
                router.push("/signin")
            } else {
                setAuthorized(true)
            }
        }

        checkAuth()
    }, [pathname, router, login, logout])

    if (!authorized && protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return <>{children}</>
}
