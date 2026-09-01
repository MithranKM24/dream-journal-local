"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface SleepDreamPageProps {
  data: any
  onUpdate: (data: any) => void
  onBack: () => void
  onSave: () => void
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function SleepDreamPage({
  data,
  onUpdate,
  onBack,
  onSave,
  selectedDate,
  onDateChange,
}: SleepDreamPageProps) {
  const [formData, setFormData] = useState({
    date: selectedDate,
    sleepTime: data.sleepTime || "",
    wakeTime: data.wakeTime || "",
    sleepQuality: data.sleepQuality || 5,
    dreamRecall: data.dreamRecall || "",
    mood: data.mood || "",
    dreamType: data.dreamType || "",
    vividness: data.vividness || 5,
    awakenings: data.awakenings || "",
    dreamDescription: data.dreamDescription || "",
  })

  useEffect(() => {
    setFormData({
      date: selectedDate,
      sleepTime: data.sleepTime || "",
      wakeTime: data.wakeTime || "",
      sleepQuality: data.sleepQuality || 5,
      dreamRecall: data.dreamRecall || "",
      mood: data.mood || "",
      dreamType: data.dreamType || "",
      vividness: data.vividness || 5,
      awakenings: data.awakenings || "",
      dreamDescription: data.dreamDescription || "",
    })
  }, [data, selectedDate])

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const handleDateChange = (newDate: string) => {
    setFormData({ ...formData, date: newDate })
    onDateChange(newDate)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Sleep & Dream</h2>
          <p className="text-muted-foreground">Track your sleep duration and dream details</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle>Sleep & Dream Information</CardTitle>
          <CardDescription>Record your sleep and dream data</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleepTime">Sleep Time</Label>
              <Input
                id="sleepTime"
                type="time"
                value={formData.sleepTime}
                onChange={(e) => handleChange("sleepTime", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wakeTime">Wake Time</Label>
              <Input
                id="wakeTime"
                type="time"
                value={formData.wakeTime}
                onChange={(e) => handleChange("wakeTime", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleepQuality">Sleep Quality: {formData.sleepQuality}/10</Label>
              <Slider
                value={[formData.sleepQuality]}
                onValueChange={(value) => handleChange("sleepQuality", value[0])}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dreamRecall">Dream Recall</Label>
              <Select value={formData.dreamRecall} onValueChange={(value) => handleChange("dreamRecall", value)}>
                <SelectTrigger className="border-primary/30">
                  <SelectValue placeholder="Select recall level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vague">Vague</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="clear">Clear</SelectItem>
                  <SelectItem value="vivid">Vivid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood Upon Waking</Label>
              <Select value={formData.mood} onValueChange={(value) => handleChange("mood", value)}>
                <SelectTrigger className="border-primary/30">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-negative">Very Negative</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="very-positive">Very Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dreamType">Dream Type</Label>
              <Select value={formData.dreamType} onValueChange={(value) => handleChange("dreamType", value)}>
                <SelectTrigger className="border-primary/30">
                  <SelectValue placeholder="Select dream type" />
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

            <div className="space-y-2">
              <Label htmlFor="vividness">Vividness: {formData.vividness}/10</Label>
              <Slider
                value={[formData.vividness]}
                onValueChange={(value) => handleChange("vividness", value[0])}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="awakenings">Number of Awakenings</Label>
              <Input
                id="awakenings"
                type="number"
                placeholder="e.g., 2"
                value={formData.awakenings}
                onChange={(e) => handleChange("awakenings", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="dreamDescription">Dream Description</Label>
              <Textarea
                id="dreamDescription"
                placeholder="Describe your dream in detail..."
                value={formData.dreamDescription}
                onChange={(e) => handleChange("dreamDescription", e.target.value)}
                className="border-primary/30 focus:border-primary resize-none"
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onBack}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onSave}>
              Next: Lifestyle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
