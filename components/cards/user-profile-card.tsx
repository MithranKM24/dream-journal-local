"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface UserProfileCardProps {
  onUpdate: (data: any) => void
}

export default function UserProfileCard({ onUpdate }: UserProfileCardProps) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    occupation: "",
    sleepPreferences: "",
    medicalHistory: "",
    medications: "",
  })

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="text-primary">User Profile</CardTitle>
        <CardDescription>Personal information & health background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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
      </CardContent>
    </Card>
  )
}
