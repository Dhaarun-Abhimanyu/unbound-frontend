"use client"
import LoginForm from "@/components/login-form"
import Squares from "@/components/ui/Squares"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Squares 
          speed={0.4} 
          squareSize={40}
          direction='diagonal'
          borderColor='#333'
          hoverFillColor='#474646ff'
        />
      </div>
      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </main>
  )
}
