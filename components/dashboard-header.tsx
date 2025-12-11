"use client"

import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  profile: {
    username: string
    credits: number
    role: "ADMIN" | "MEMBER"
  }
}

export default function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("apiKey")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  return (
    <header className="border-b border-terminal-dim bg-black/30 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-terminal-accent font-bold text-lg">{"> COMMAND GATEWAY"}</h1>
          <p className="text-terminal-dim text-xs">
            {`user: ${profile.username} | role: ${profile.role} | credits: ${profile.credits}`}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-terminal-dim text-terminal-dim hover:text-terminal-accent hover:border-terminal-accent rounded transition-colors"
        >
          {"> LOGOUT"}
        </button>
      </div>
    </header>
  )
}
