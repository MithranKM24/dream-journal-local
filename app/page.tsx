"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginPage from "@/components/auth/login-page"
import Dashboard from "@/components/dashboard/dashboard"
import { getUser } from "@/lib/auth"

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    setMounted(true)
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    }

    const user = getUser()
    if (user) {
        setIsAuthenticated(true)
        setUserEmail(user.email)
        setUserName(user.name)
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLogin = (name: string, email: string) => {
    setIsAuthenticated(true)
    setUserName(name)
    setUserEmail(email)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserName("")
    setUserEmail("")
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      {isAuthenticated ? (
        <Dashboard userName={userName} userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </main>
  )
}
