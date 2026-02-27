import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Old_Standard_TT } from "next/font/google"
import { TopNav } from "@/components/top-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { CompareBar } from "@/components/compare-bar"
import { AuthGuard } from "@/components/auth-guard"
import { ChatWidget } from "@/components/chat-widget"
import { NavArrows } from "@/components/nav-arrows"

const inter = Inter({ subsets: ["latin"] })
const oldCentury = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-old-century",
})

import "./globals.css"

export const metadata: Metadata = {
  title: "Fintech - Compare Banks, Telecoms, Schools & Insurance in Zimbabwe",
  description:
    "Zimbabwe's premier comparison platform for banking, telecom, schools, and insurance. Make informed decisions with real data.",
}

export const viewport: Viewport = {
  themeColor: "#0d1117",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${oldCentury.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TopNav />
          <div className="mx-auto max-w-7xl px-4 pt-4">
            <NavArrows />
          </div>
          <main className="mx-auto max-w-7xl px-4 py-6">
            <AuthGuard>
              {children}
            </AuthGuard>
          </main>
          <CompareBar />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
