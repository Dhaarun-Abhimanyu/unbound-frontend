"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, Trash2 } from "lucide-react"
import { api } from "@/lib/api"

interface Notification {
  _id: string
  message: string
  read: boolean
  created_at?: string
  createdAt?: string
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const key = localStorage.getItem("apiKey")
    setApiKey(key)
  }, [])

  const fetchNotifications = async () => {
    if (!apiKey) return
    try {
      const data = await api.getNotifications(apiKey)
      // Ensure data is an array
      if (Array.isArray(data)) {
        setNotifications(data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }

  useEffect(() => {
    if (!apiKey) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [apiKey])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!apiKey) return
    try {
      await api.deleteNotification(apiKey, id)
      setNotifications(prev => prev.filter(n => n._id !== id))
    } catch (error) {
      console.error("Failed to delete notification", error)
    }
  }

  const unreadCount = notifications.length

  if (!apiKey) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-terminal-dim hover:text-terminal-accent transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-terminal-error text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-50 bg-black/90 border border-terminal-dim rounded shadow-lg backdrop-blur-sm">
          <div className="p-3 border-b border-terminal-dim flex justify-between items-center">
            <h3 className="text-terminal-accent font-bold text-sm">{"> NOTIFICATIONS"}</h3>
            <button onClick={() => setIsOpen(false)} className="text-terminal-dim hover:text-terminal-text">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-terminal-dim text-xs">
                {"$ no new notifications"}
              </div>
            ) : (
              <div className="divide-y divide-terminal-dim/30">
                {notifications.map((notif) => (
                  <div key={notif._id} className="p-3 hover:bg-white/5 transition-colors group relative">
                    <p className="text-terminal-text text-sm pr-6 break-words">{notif.message}</p>
                    <p className="text-terminal-dim text-[10px] mt-1">
                      {new Date(notif.created_at || notif.createdAt || Date.now()).toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => handleDelete(notif._id, e)}
                      className="absolute top-3 right-2 text-terminal-dim hover:text-terminal-error opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}