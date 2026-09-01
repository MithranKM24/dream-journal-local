"use client"

import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardTiles from "./dashboard-tiles"
import UserProfilePage from "../pages/user-profile-page"
import DailyCheckIn from "../pages/daily-check-in"
import LifestylePage from "../pages/lifestyle-page"
import AnalyticsPage from "../pages/analytics-page"
import { LocalStorageService } from "@/lib/local-storage-service"
import { clearUser } from "@/lib/auth"
import type { DreamData } from "@/lib/types"

interface DashboardProps {
  userName: string
  userEmail: string
  onLogout: () => void
}

export default function Dashboard({ userName, userEmail, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<"tiles" | "profile" | "sleep" | "lifestyle" | "analytics">("tiles")
  const [dreamData, setDreamData] = useState<DreamData>({
    userProfile: {},
    sleepDream: {},
    lifestyle: {},
    entries: [],
  })
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true)
        const entries = await LocalStorageService.getDreamEntries()
        setDreamData((prev) => ({
          ...prev,
          entries: entries,
        }))
      } catch (error) {
        console.error("Error loading entries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [userName])

  useEffect(() => {
    const loadDateData = async () => {
      try {
        const entry = await LocalStorageService.getDreamEntryByDate(selectedDate)
        if (entry) {
          setDreamData((prev) => ({
            ...prev,
            userProfile: entry.userProfile || {},
            sleepDream: entry.sleepDream || {},
            lifestyle: entry.lifestyle || {},
          }))
        } else {
          setDreamData((prev) => ({
            ...prev,
            userProfile: {},
            sleepDream: { date: selectedDate },
            lifestyle: {},
          }))
        }
      } catch (error) {
        console.error("Error loading date data:", error)
      }
    }

    loadDateData()
  }, [selectedDate])

  const updateUserProfile = (data: any) => {
    setDreamData((prev) => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...data },
    }))
  }

  const updateSleepDream = (data: any) => {
    setDreamData((prev) => ({
      ...prev,
      sleepDream: { ...prev.sleepDream, ...data },
    }))
  }

  const updateLifestyle = (data: any) => {
    setDreamData((prev) => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, ...data },
    }))
  }

  const saveEntry = async () => {
    if (
      !dreamData.sleepDream.sleepTime ||
      !dreamData.sleepDream.wakeTime ||
      !dreamData.sleepDream.mood
    ) {
      alert("Choose how you felt on waking before saving your check-in.")
      return
    }

    try {
      const newEntry = {
        date: selectedDate,
        userProfile: dreamData.userProfile,
        sleepDream: {
          ...dreamData.sleepDream,
          sleepQuality: dreamData.sleepDream.sleepQuality || 0,
          dreamVividness: dreamData.sleepDream.vividness ?? dreamData.sleepDream.dreamVividness ?? 0,
          awakenings: dreamData.sleepDream.awakenings ? Number.parseInt(String(dreamData.sleepDream.awakenings)) : 0,
        },
        lifestyle: dreamData.lifestyle || {},
        notes: dreamData.sleepDream.notes || "",
      }

      await LocalStorageService.saveDreamEntry(newEntry)

      const entries = await LocalStorageService.getDreamEntries()
      setDreamData((prev) => ({
        ...prev,
        entries: entries,
        sleepDream: { date: selectedDate },
        lifestyle: {},
      }))

      setCurrentPage("analytics")
    } catch (error) {
      console.error("Error saving entry:", error)
      alert("Error saving entry. Please try again.")
    }
  }

  const handleLogoutClick = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    clearUser()
    onLogout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sleepsphere</h1>
            <p className="text-sm text-muted-foreground">Welcome, {userName}</p>
          </div>
          <Button variant="outline" onClick={handleLogoutClick} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {currentPage === "tiles" && <DashboardTiles onNavigate={setCurrentPage} />}
        {currentPage === "profile" && (
          <UserProfilePage
            data={dreamData.userProfile}
            onUpdate={updateUserProfile}
            onBack={() => setCurrentPage("tiles")}
          />
        )}
        {currentPage === "sleep" && (
          <DailyCheckIn
            data={dreamData.sleepDream}
            onUpdate={updateSleepDream}
            onBack={() => setCurrentPage("tiles")}
            onSave={saveEntry}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
        {currentPage === "lifestyle" && (
          <LifestylePage
            data={dreamData.lifestyle}
            onUpdate={updateLifestyle}
            onBack={() => setCurrentPage("tiles")}
            onSave={saveEntry}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
        {currentPage === "analytics" && (
          <AnalyticsPage entries={dreamData.entries} onBack={() => setCurrentPage("tiles")} />
        )}
      </main>
    </div>
  )
}
