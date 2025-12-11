"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import CommandSubmit from "@/components/command-submit"
import CommandHistory from "@/components/command-history"

interface CommandHistoryItem {
  id: string
  command: string
  status: string
  output?: string
  timestamp: string
}

export default function UserDashboard({ apiKey }: { apiKey: string }) {
  const [history, setHistory] = useState<CommandHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await api.getCommandHistory(apiKey)
        setHistory(data)
      } catch (err) {
        console.error("Failed to load history:", err)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [apiKey, refreshTrigger])

  const handleCommandSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <CommandSubmit apiKey={apiKey} onCommandSubmitted={handleCommandSubmitted} />
      </div>
      <div className="lg:col-span-2">
        <CommandHistory commands={history} loading={loading} />
      </div>
    </div>
  )
}
