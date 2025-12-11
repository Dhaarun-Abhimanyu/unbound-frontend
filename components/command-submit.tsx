"use client"

import type React from "react"

import { useState } from "react"
import { Api } from '@/lib/api';

export async function submit(apiKey: string, command: string) {
  return Api.submitCommand(apiKey, { command });
}

interface CommandSubmitProps {
  apiKey: string
  onCommandSubmitted: () => void
}

export default function CommandSubmit({ apiKey, onCommandSubmitted }: CommandSubmitProps) {
  const [command, setCommand] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)

    try {
      const data = await submit(apiKey, command)
      setResult(data)
      setCommand("")
      onCommandSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit command")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-terminal-accent rounded p-4 bg-black/30">
      <h2 className="text-terminal-accent font-bold mb-4">{"> SUBMIT COMMAND"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-terminal-accent text-sm mb-2">{"$ COMMAND"}</label>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="ls -la"
            className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text placeholder-terminal-dim focus:border-terminal-accent focus:outline-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !command}
          className="w-full py-2 px-4 bg-terminal-accent text-terminal-bg font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "> EXECUTING..." : "> EXECUTE"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-terminal-error/20 border border-terminal-error rounded text-terminal-error text-sm">
          <p>{"> ERROR"}</p>
          <code className="text-xs">{error}</code>
        </div>
      )}

      {result && (
        <div
          className={`mt-4 p-3 border rounded text-sm ${
            result.status === "EXECUTED"
              ? "bg-terminal-success/20 border-terminal-success text-terminal-success"
              : "bg-terminal-warning/20 border-terminal-warning text-terminal-warning"
          }`}
        >
          <p className="font-bold mb-2">{`> [${result.status}]`}</p>
          {result.output && (
            <pre className="text-xs bg-black/50 p-2 rounded border border-terminal-dim overflow-x-auto">
              {result.output}
            </pre>
          )}
          {result.credits_remaining !== undefined && (
            <p className="mt-2 text-xs">{`$ credits_remaining: ${result.credits_remaining}`}</p>
          )}
        </div>
      )}
    </div>
  )
}
