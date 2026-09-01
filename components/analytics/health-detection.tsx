"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface HealthDetectionProps {
  entries: any[]
}

export default function HealthDetection({ entries }: HealthDetectionProps) {
  const alerts: Array<{ type: "warning" | "success"; title: string; description: string }> = []

  if (entries.length > 0) {
    const sleepDurations = entries
      .map((e) => {
        const sleepTime = e?.sleep_time || e?.sleepDream?.sleepTime
        const wakeTime = e?.wake_time || e?.sleepDream?.wakeTime

        if (!sleepTime || !wakeTime) return 0

        try {
          const [sleepHour, sleepMin] = sleepTime.split(":").map(Number)
          const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)

          const sleepDate = new Date(2024, 0, 1, sleepHour, sleepMin)
          const wakeDate = new Date(2024, 0, 1, wakeHour, wakeMin)

          if (wakeDate < sleepDate) {
            wakeDate.setDate(wakeDate.getDate() + 1)
          }

          const durationMs = wakeDate.getTime() - sleepDate.getTime()
          const durationHours = durationMs / (1000 * 60 * 60)

          return durationHours > 0 ? durationHours : 0
        } catch {
          return 0
        }
      })
      .filter((d) => d > 0)

    const avgDuration =
      sleepDurations.length > 0 ? sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length : 0

    if (avgDuration < 6) {
      alerts.push({
        type: "warning",
        title: "Low Sleep Duration",
        description: `Your average sleep is ${avgDuration.toFixed(1)} hours. Aim for 7-9 hours per night.`,
      })
    } else if (avgDuration > 10) {
      alerts.push({
        type: "warning",
        title: "High Sleep Duration",
        description: `Your average sleep is ${avgDuration.toFixed(1)} hours. This may indicate oversleeping.`,
      })
    } else {
      alerts.push({
        type: "success",
        title: "Healthy Sleep Duration",
        description: `Your average sleep of ${avgDuration.toFixed(1)} hours is within the recommended range.`,
      })
    }

    // Check nightmares
    const nightmares = entries.filter((e) => e.sleepDream?.dreamType === "nightmare").length
    if (nightmares >= 3) {
      alerts.push({
        type: "warning",
        title: "Frequent Nightmares",
        description: `You've had ${nightmares} nightmares. Consider stress management techniques.`,
      })
    }

    // Check sleep quality
    const avgQuality = entries.reduce((sum, e) => sum + (e.sleepDream?.sleepQuality || 0), 0) / entries.length
    if (avgQuality < 5) {
      alerts.push({
        type: "warning",
        title: "Poor Sleep Quality",
        description: `Your average sleep quality is ${avgQuality.toFixed(1)}/10. Review your sleep environment and habits.`,
      })
    } else {
      alerts.push({
        type: "success",
        title: "Good Sleep Quality",
        description: `Your average sleep quality is ${avgQuality.toFixed(1)}/10. Keep up the good habits!`,
      })
    }

    const validAwakenings = entries
      .map((e) => {
        const awakenings = Number(e.sleepDream?.awakenings) || 0
        return Math.min(awakenings, 10) // Cap at 10 to prevent unrealistic values
      })
      .filter((a) => a > 0)

    if (validAwakenings.length > 0) {
      const avgAwakenings = validAwakenings.reduce((a, b) => a + b, 0) / validAwakenings.length
      if (avgAwakenings > 3) {
        alerts.push({
          type: "warning",
          title: "Frequent Awakenings",
          description: `You wake up ${avgAwakenings.toFixed(1)} times per night on average. This may indicate sleep fragmentation.`,
        })
      } else if (avgAwakenings > 0) {
        alerts.push({
          type: "success",
          title: "Normal Sleep Fragmentation",
          description: `You wake up ${avgAwakenings.toFixed(1)} times per night on average, which is normal.`,
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Health Analysis</CardTitle>
          <CardDescription>Sleep disorder detection and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert, idx) => (
            <Alert
              key={idx}
              className={
                alert.type === "warning"
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-green-500/50 bg-green-500/5"
              }
            >
              {alert.type === "warning" ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
