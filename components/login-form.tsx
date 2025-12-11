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
      <div className="border border-terminal-accent rounded p-8 bg-black/30">
        <h1 className="text-6xl font-bold mb-3 text-terminal-accent tracking-tighter">Tether</h1>
        <p className="text-terminal-dim text-base mb-8 font-light">
          Secure Command Gateway & Execution System
          <br />
          <span className="text-xs opacity-50 font-mono mt-2 block">$ system_ready</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-terminal-accent text-xs mb-2 font-mono">ENTER API KEY</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_..."
              className="w-full px-3 py-2 bg-terminal-bg border border-terminal-dim rounded text-terminal-text placeholder-terminal-dim focus:border-terminal-accent focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-terminal-accent text-terminal-bg font-bold rounded hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {"> AUTHENTICATE"}
          </button>
        </div>
      </div>

      <div className="text-terminal-dim text-xs text-center space-y-1">
        <p>Tether v1.0.0</p>
      </div>
    </form>
  )
}
