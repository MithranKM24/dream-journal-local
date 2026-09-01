"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface UserProfilePageProps {
  data: any
  onUpdate: (data: any) => void
  onBack: () => void
}

export default function UserProfilePage({ data, onUpdate, onBack }: UserProfilePageProps) {
  const [formData, setFormData] = useState({
    name: data.name || "",
    age: data.age || "",
    gender: data.gender || "",
    occupation: data.occupation || "",
    sleepPreferences: data.sleepPreferences || "",
    medicalHistory: data.medicalHistory || "",
    medications: data.medications || "",
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const handleSave = () => {
    try {
      localStorage.setItem("dreamJournalProfile", JSON.stringify(formData))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">User Profile</h2>
          <p className="text-muted-foreground">Personal information & health background</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger className="border-primary/30">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                placeholder="Your occupation"
                value={formData.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="sleepPreferences">Sleep Preferences</Label>
              <Textarea
                id="sleepPreferences"
                placeholder="Describe your sleep habits and preferences"
                value={formData.sleepPreferences}
                onChange={(e) => handleChange("sleepPreferences", e.target.value)}
                className="border-primary/30 focus:border-primary resize-none"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                placeholder="Any sleep-related medical conditions"
                value={formData.medicalHistory}
                onChange={(e) => handleChange("medicalHistory", e.target.value)}
                className="border-primary/30 focus:border-primary resize-none"
                rows={2}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="medications">Medications/Supplements</Label>
              <Textarea
                id="medications"
                placeholder="Current medications or supplements"
                value={formData.medications}
                onChange={(e) => handleChange("medications", e.target.value)}
                className="border-primary/30 focus:border-primary resize-none"
                rows={2}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Profile Saved!
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
