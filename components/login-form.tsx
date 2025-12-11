"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Api } from "@/lib/api"

export default function LoginForm() {
  const [apiKey, setApiKey] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!apiKey.trim()) return;

    try {
      // Validate key by fetching profile
      const profile = await Api.getProfile(apiKey);
      
      // Save to localStorage
      localStorage.setItem("apiKey", apiKey);
      
      // Store the user profile data (username, credits, role) returned by the backend
      if (profile) {
        localStorage.setItem("user", JSON.stringify(profile));
      }
      
      router.push("/dashboard")
    } catch (error) {
      console.error("❌ Login Failed:", error);
      alert("Invalid API Key or Server Error. Check console for details.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-terminal-accent rounded p-4 bg-black/30">
        <h1 className="text-2xl font-bold mb-2 text-terminal-accent">{"> COMMAND GATEWAY"}</h1>
        <p className="text-terminal-dim text-sm mb-6">$ authenticate with API key</p>

        <div className="space-y-4">
          <div>
            <label className="block text-terminal-accent text-sm mb-2">API_KEY</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_..."
              className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text placeholder-terminal-dim focus:border-terminal-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-terminal-accent text-terminal-bg font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {"> LOGIN"}
          </button>
        </div>
      </div>

      <div className="text-terminal-dim text-xs text-center space-y-1">
        <p>$ Terminal Command Gateway System</p>
        <p>$ API Key required for access</p>
      </div>
    </form>
  )
}
