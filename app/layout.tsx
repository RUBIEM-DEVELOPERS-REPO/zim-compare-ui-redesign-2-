import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Old_Standard_TT, DM_Serif_Display, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientShell } from "@/components/client-shell"

const inter = Inter({ subsets: ["latin"] })
const oldCentury = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-old-century",
})
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
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
      <body className={`${inter.className} ${oldCentury.variable} ${dmSerif.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientShell>
            {children}
          </ClientShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
