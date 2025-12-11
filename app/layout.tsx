import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tether",
  description: "Command execution control system",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
  },
  viewport: {
    themeColor: "#0a0a0a",
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-mono antialiased bg-terminal-bg text-terminal-text min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
