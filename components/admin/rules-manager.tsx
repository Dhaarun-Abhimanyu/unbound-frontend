"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface Rule {
  _id: string
  pattern: string
  action: "AUTO_ACCEPT" | "AUTO_REJECT" | "REQUIRE_APPROVAL"
  description?: string
  priority?: number
}

export default function RulesManager({ apiKey }: { apiKey: string }) {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [pattern, setPattern] = useState("")
  const [action, setAction] = useState<"AUTO_ACCEPT" | "AUTO_REJECT" | "REQUIRE_APPROVAL">("AUTO_ACCEPT")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      const data = await api.getRules(apiKey)
      setRules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rules")
    } finally {
      setLoading(false)
    }
  }

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await api.createRule(apiKey, { pattern, action, description })
      setPattern("")
      setDescription("")
      setAction("AUTO_ACCEPT")
      await loadRules()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rule")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRule = async (id: string) => {
    try {
      await api.deleteRule(apiKey, id)
      await loadRules()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete rule")
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-terminal-accent rounded p-4 bg-black/30">
        <h3 className="text-terminal-accent font-bold mb-4">{"> ADD NEW RULE"}</h3>

        <form onSubmit={handleAddRule} className="space-y-4">
          <div>
            <label className="block text-terminal-accent text-sm mb-2">REGEX PATTERN</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="^rm -rf"
              className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text placeholder-terminal-dim"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-terminal-accent text-sm mb-2">ACTION</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as "AUTO_ACCEPT" | "AUTO_REJECT" | "REQUIRE_APPROVAL")}
              className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text"
              disabled={submitting}
            >
              <option value="AUTO_ACCEPT">AUTO_ACCEPT</option>
              <option value="AUTO_REJECT">AUTO_REJECT</option>
              <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
            </select>
          </div>

          <div>
            <label className="block text-terminal-accent text-sm mb-2">DESCRIPTION (OPTIONAL)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text placeholder-terminal-dim"
              disabled={submitting}
            />
          </div>

          {error && <p className="text-terminal-error text-sm">{"> ERROR: " + error}</p>}

          <button
            type="submit"
            disabled={submitting || !pattern}
            className="w-full py-2 px-4 bg-terminal-accent text-terminal-bg font-bold rounded hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "> CREATING..." : "> CREATE RULE"}
          </button>
        </form>
      </div>

      <div className="border border-terminal-dim rounded p-4 bg-black/30">
        <h3 className="text-terminal-accent font-bold mb-4">{"> ACTIVE RULES"}</h3>

        {loading ? (
          <p className="text-terminal-dim">{"$ LOADING..."}</p>
        ) : rules.length === 0 ? (
          <p className="text-terminal-dim">{"$ NO RULES CONFIGURED"}</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rules.map((rule) => (
              <div key={rule._id} className="p-3 border border-terminal-dim rounded bg-black/50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <code className="text-terminal-info text-sm flex-1">{rule.pattern}</code>
                  <span
                    className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      rule.action === "AUTO_ACCEPT"
                        ? "bg-terminal-success/20 text-terminal-success"
                        : rule.action === "AUTO_REJECT"
                        ? "bg-terminal-error/20 text-terminal-error"
                        : "bg-terminal-warning/20 text-terminal-warning"
                    }`}
                  >
                    {rule.action}
                  </span>
                  <button
                    onClick={() => handleDeleteRule(rule._id)}
                    className="text-terminal-error hover:text-terminal-accent text-xs px-2 py-1 border border-terminal-dim rounded"
                  >
                    DELETE
                  </button>
                </div>
                {rule.description && <p className="text-terminal-dim text-xs">{rule.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
