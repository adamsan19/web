import type React from "react"
import "./globals.css"

import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { SITENAME } from "@/lib/constants"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminProvider } from "@/contexts/admin-context"

const font = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: SITENAME,
  description: `${SITENAME} is a video sharing platform that allows users to upload, watch, and share videos.`,
  metadataBase: new URL("http://localhost:3000/"),
    generator: 'v0.dev'
}

export const runtime = "edge"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <AdminProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  )
}



import './globals.css'