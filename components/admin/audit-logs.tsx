"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface AuditLog {
  id: string
  user: string
  command: string
  status: string
  timestamp: string
}

export default function AuditLogs({ apiKey }: { apiKey: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    loadLogs()
  }, [filter])

  const loadLogs = async () => {
    try {
      const data = await api.getAuditLogs(apiKey, filter)
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-terminal-dim rounded p-4 bg-black/30">
        <h3 className="text-terminal-accent font-bold mb-4">{"> FILTER LOGS"}</h3>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text"
        >
          <option value="">ALL STATUSES</option>
          <option value="EXECUTED">EXECUTED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      <div className="border border-terminal-dim rounded p-4 bg-black/30">
        <h2 className="text-terminal-accent font-bold mb-4">{"> AUDIT LOGS"}</h2>

        {error && (
          <div className="p-3 bg-terminal-error/20 border border-terminal-error rounded text-terminal-error text-sm mb-4">
            {"> ERROR: " + error}
          </div>
        )}

        {loading ? (
          <p className="text-terminal-dim">{"$ LOADING..."}</p>
        ) : logs.length === 0 ? (
          <p className="text-terminal-dim">{"$ NO LOGS"}</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-3 border border-terminal-dim rounded bg-black/50">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <code className="text-terminal-info text-sm flex-1">{log.command}</code>
                  <span
                    className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      log.status === "EXECUTED"
                        ? "bg-terminal-success/20 text-terminal-success"
                        : "bg-terminal-error/20 text-terminal-error"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <p className="text-terminal-dim text-xs">{`user: ${log.user} | time: ${log.timestamp}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
