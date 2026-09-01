"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Moon, AlertCircle, CheckCircle } from "lucide-react"
import { setUser } from "@/lib/auth"

interface LoginPageProps {
  onLogin: (name: string, email: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (isSignUp) {
        // Sign up validation
        if (!name.trim()) {
          setError("Please enter your name")
          setIsLoading(false)
          return
        }
        if (!email.trim()) {
          setError("Please enter your email")
          setIsLoading(false)
          return
        }
        if (!password.trim()) {
          setError("Please enter a password")
          setIsLoading(false)
          return
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters")
          setIsLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) })
        const body = await response.json()
        if (!response.ok) throw new Error(body.error ?? "Could not create the account.")
        setUser({ name: body.user.name, email: body.user.email, id: body.user.email })
        onLogin(body.user.name, body.user.email)
      } else {
        const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
        const body = await response.json()
        if (!response.ok) throw new Error(body.error ?? "Incorrect email or password.")
        setUser({ name: body.user.name, email: body.user.email, id: body.user.email })
        onLogin(body.user.name, body.user.email)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Sleepsphere</h1>
          </div>
          <p className="text-muted-foreground">Track and analyze your dreams with AI-powered insights</p>
        </div>

        {/* Login/Sign Up Card */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardTitle>{isSignUp ? "Create Account" : "Welcome"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Sign up for a new account" : "Sign in to your dream journal"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-primary/30 focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-primary/30 focus:border-primary"
                  />
                </div>
              )}

              {error && (
                <div className="flex gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-200 p-3 rounded">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-200 p-3 rounded">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError("")
                    setSuccess("")
                    setName("")
                    setEmail("")
                    setPassword("")
                    setConfirmPassword("")
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
