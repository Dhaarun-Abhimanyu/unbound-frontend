"use client"
import LoginForm from "@/components/login-form"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
