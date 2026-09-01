"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserProfileCard from "./cards/user-profile-card"
import SleepDreamCard from "./cards/sleep-dream-card"
import LifestyleCard from "./cards/lifestyle-card"
import AnalyticsDashboard from "./analytics/analytics-dashboard"
import type { DreamData } from "@/lib/types"

export default function DreamJournalApp() {
  const [dreamData, setDreamData] = useState<DreamData>({
    userProfile: {},
    sleepDream: {},
    lifestyle: {},
    entries: [],
  })

  const [activeTab, setActiveTab] = useState("input")

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

  const saveEntry = () => {
    const newEntry = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      userProfile: dreamData.userProfile,
      sleepDream: dreamData.sleepDream,
      lifestyle: dreamData.lifestyle,
    }
    setDreamData((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
      userProfile: {},
      sleepDream: {},
      lifestyle: {},
    }))
    setActiveTab("analytics")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Dream Journal</h1>
          <p className="text-muted-foreground text-lg">
            Track, analyze, and understand your dreams with AI-powered insights
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="input">Input Data</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="animate-slide-in-up" style={{ animationDelay: "0s" }}>
                <UserProfileCard onUpdate={updateUserProfile} />
              </div>
              <div className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
                <SleepDreamCard onUpdate={updateSleepDream} />
              </div>
              <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
                <LifestyleCard onUpdate={updateLifestyle} />
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={saveEntry} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Entry & View Analytics
              </Button>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard entries={dreamData.entries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
