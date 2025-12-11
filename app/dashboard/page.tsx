"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import UserDashboard from "@/components/dashboards/user-dashboard"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import DashboardHeader from "@/components/dashboard-header"

interface Profile {
  username: string
  credits: number
  role: "ADMIN" | "MEMBER"
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const apiKey = localStorage.getItem("apiKey")
        if (!apiKey) {
          router.push("/")
          return
        }

        const data = await api.getProfile(apiKey)
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center">
        <div className="border border-terminal-accent rounded p-4">
          <p className="text-terminal-accent">{"> LOADING..."}</p>
        </div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center">
        <div className="border border-terminal-error rounded p-4">
          <p className="text-terminal-error">{"> ERROR: " + error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-terminal-bg text-terminal-text">
      <DashboardHeader profile={profile} />
      <div className="container mx-auto p-4">
        {profile.role === "ADMIN" ? (
          <AdminDashboard apiKey={localStorage.getItem("apiKey")!} />
        ) : (
          <UserDashboard apiKey={localStorage.getItem("apiKey")!} />
        )}
      </div>
    </main>
  )
}
