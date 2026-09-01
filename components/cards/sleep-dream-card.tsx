"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface SleepDreamCardProps {
  onUpdate: (data: any) => void
}

export default function SleepDreamCard({ onUpdate }: SleepDreamCardProps) {
  const [formData, setFormData] = useState({
    bedtime: "",
    wakeTime: "",
    sleepDuration: "",
    sleepQuality: 5,
    dreamRecall: "sometimes",
    dreamDescription: "",
    dreamMood: "neutral",
    dreamType: "normal",
    vividness: 3,
    awakenings: 0,
  })

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-secondary/20">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
        <CardTitle className="text-secondary">Sleep & Dream</CardTitle>
        <CardDescription>Sleep patterns and dream details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedtime">Bedtime</Label>
            <Input
              id="bedtime"
              type="time"
              value={formData.bedtime}
              onChange={(e) => handleChange("bedtime", e.target.value)}
              className="border-secondary/30 focus:border-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wakeTime">Wake Time</Label>
            <Input
              id="wakeTime"
              type="time"
              value={formData.wakeTime}
              onChange={(e) => handleChange("wakeTime", e.target.value)}
              className="border-secondary/30 focus:border-secondary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sleepDuration">Sleep Duration (hours)</Label>
          <Input
            id="sleepDuration"
            type="number"
            step="0.5"
            placeholder="e.g., 7.5"
            value={formData.sleepDuration}
            onChange={(e) => handleChange("sleepDuration", e.target.value ? Number.parseFloat(e.target.value) : "")}
            className="border-secondary/30 focus:border-secondary"
          />
        </div>

        <div className="space-y-2">
          <Label>Sleep Quality: {formData.sleepQuality}/10</Label>
          <Slider
            value={[formData.sleepQuality]}
            onValueChange={(value) => handleChange("sleepQuality", value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dreamRecall">Dream Recall Frequency</Label>
          <Select value={formData.dreamRecall} onValueChange={(value) => handleChange("dreamRecall", value)}>
            <SelectTrigger className="border-secondary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rarely">Rarely</SelectItem>
              <SelectItem value="sometimes">Sometimes</SelectItem>
              <SelectItem value="often">Often</SelectItem>
              <SelectItem value="always">Always</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dreamDescription">Dream Description</Label>
          <Textarea
            id="dreamDescription"
            placeholder="Describe your dream in detail..."
            value={formData.dreamDescription}
            onChange={(e) => handleChange("dreamDescription", e.target.value)}
            className="border-secondary/30 focus:border-secondary resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dreamMood">Dream Mood</Label>
            <Select value={formData.dreamMood} onValueChange={(value) => handleChange("dreamMood", value)}>
              <SelectTrigger className="border-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="anxious">Anxious</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="fearful">Fearful</SelectItem>
                <SelectItem value="sad">Sad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dreamType">Dream Type</Label>
            <Select value={formData.dreamType} onValueChange={(value) => handleChange("dreamType", value)}>
              <SelectTrigger className="border-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="lucid">Lucid</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="nightmare">Nightmare</SelectItem>
                <SelectItem value="prophetic">Prophetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Vividness: {formData.vividness}/5</Label>
          <Slider
            value={[formData.vividness]}
            onValueChange={(value) => handleChange("vividness", value[0])}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="awakenings">Times Awakened</Label>
          <Input
            id="awakenings"
            type="number"
            min="0"
            value={formData.awakenings}
            onChange={(e) => handleChange("awakenings", Number.parseInt(e.target.value) || 0)}
            className="border-secondary/30 focus:border-secondary"
          />
        </div>
      </CardContent>
    </Card>
  )
}
