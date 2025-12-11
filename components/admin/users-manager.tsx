"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface User {
  _id: string
  username: string
  credits: number
  role: "ADMIN" | "MEMBER"
}

export default function UsersManager({ apiKey }: { apiKey: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER")
  const [credits, setCredits] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [newApiKey, setNewApiKey] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await api.getUsers(apiKey)
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setNewApiKey("")
    setSubmitting(true)

    try {
      const response = await api.createUser(apiKey, { username, role })
      setNewApiKey(response.api_key)
      setUsername("")
      setRole("MEMBER")
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddCredits = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || !credits) return

    setError("")
    setSubmitting(true)

    try {
      await api.addCredits(apiKey, selectedUserId, Number.parseInt(credits))
      setCredits("")
      setSelectedUserId("")
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add credits")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-terminal-accent rounded p-4 bg-black/30">
        <h3 className="text-terminal-accent font-bold mb-4">{"> CREATE USER"}</h3>

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-terminal-accent text-sm mb-2">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-terminal-accent text-sm mb-2">ROLE</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "MEMBER")}
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text"
                disabled={submitting}
              >
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !username}
            className="w-full py-2 px-4 bg-terminal-accent text-terminal-bg font-bold rounded hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "> CREATING..." : "> CREATE USER"}
          </button>
        </form>

        {newApiKey && (
          <div className="mt-4 p-3 bg-terminal-success/20 border border-terminal-success rounded">
            <p className="text-terminal-success font-bold mb-2">{"> API KEY CREATED"}</p>
            <p className="text-terminal-success text-sm break-all font-mono">{newApiKey}</p>
            <p className="text-terminal-success text-xs mt-2">{"$ Save this key - it won't be shown again!"}</p>
          </div>
        )}
      </div>

      <div className="border border-terminal-accent rounded p-4 bg-black/30">
        <h3 className="text-terminal-accent font-bold mb-4">{"> MANAGE CREDITS"}</h3>

        <form onSubmit={handleAddCredits} className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-terminal-accent text-sm mb-2">SELECT USER</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text"
                disabled={submitting}
              >
                <option value="">Choose user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-terminal-accent text-sm mb-2">AMOUNT</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text"
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedUserId || !credits}
            className="w-full py-2 px-4 bg-terminal-accent text-terminal-bg font-bold rounded hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "> ADDING..." : "> ADD CREDITS"}
          </button>
        </form>
      </div>

      <div className="border border-terminal-dim rounded p-4 bg-black/30">
        <h3 className="text-terminal-accent font-bold mb-4">{"> ALL USERS"}</h3>

        {loading ? (
          <p className="text-terminal-dim">{"$ LOADING..."}</p>
        ) : users.length === 0 ? (
          <p className="text-terminal-dim">{"$ NO USERS"}</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user._id} className="p-3 border border-terminal-dim rounded bg-black/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-terminal-text font-mono">{user.username}</p>
                    <p className="text-terminal-dim text-xs">{`role: ${user.role} | credits: ${user.credits}`}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-terminal-error/20 border border-terminal-error rounded text-terminal-error text-sm">
          {"> ERROR: " + error}
        </div>
      )}
    </div>
  )
}
