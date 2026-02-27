"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const protectedRoutes = ["/dashboard", "/banking", "/telecom", "/schools", "/insurance", "/saved", "/summaries", "/chat", "/admin"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("zim_auth_token")
            const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))

            if (isProtectedRoute && !token) {
                setAuthorized(false)
                router.push("/signin")
            } else {
                setAuthorized(true)
            }
        }

        checkAuth()
    }, [pathname, router])

    if (!authorized && protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return <>{children}</>
}
