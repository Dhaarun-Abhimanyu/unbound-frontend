"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface PendingCommand {
  _id: string
  user_id: {
    username: string
    role: string
  }
  command: string
  executed_at: string
}

export default function PendingCommands({ apiKey }: { apiKey: string }) {
  const [commands, setCommands] = useState<PendingCommand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPending()
    const interval = setInterval(loadPending, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadPending = async () => {
    try {
      const data = await api.getPendingCommands(apiKey)
      setCommands(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pending commands")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await api.approvePendingCommand(apiKey, id, "APPROVE")
      await loadPending()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve")
    }
  }

  const handleReject = async (id: string) => {
    try {
      await api.approvePendingCommand(apiKey, id, "REJECT")
      await loadPending()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject")
    }
  }

  return (
    <div className="border border-terminal-dim rounded p-4 bg-black/30">
      <h2 className="text-terminal-accent font-bold mb-4">{"> PENDING COMMANDS"}</h2>

      {error && (
        <div className="p-3 bg-terminal-error/20 border border-terminal-error rounded text-terminal-error text-sm mb-4">
          {"> ERROR: " + error}
        </div>
      )}

      {loading ? (
        <p className="text-terminal-dim">{"$ LOADING..."}</p>
      ) : commands.length === 0 ? (
        <p className="text-terminal-dim">{"$ NO PENDING COMMANDS"}</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {commands.map((cmd) => (
            <div key={cmd._id} className="p-3 border border-terminal-warning rounded bg-black/50">
              <div className="mb-3">
                <p className="text-terminal-warning font-mono mb-1">{cmd.command}</p>
                <p className="text-terminal-dim text-xs">{`user: ${cmd.user_id?.username || 'Unknown'} | requested: ${cmd.executed_at}`}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(cmd._id)}
                  className="flex-1 py-1 px-3 bg-terminal-success/20 border border-terminal-success text-terminal-success text-sm rounded hover:bg-terminal-success/40"
                >
                  ✓ APPROVE
                </button>
                <button
                  onClick={() => handleReject(cmd._id)}
                  className="flex-1 py-1 px-3 bg-terminal-error/20 border border-terminal-error text-terminal-error text-sm rounded hover:bg-terminal-error/40"
                >
                  ✗ REJECT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
