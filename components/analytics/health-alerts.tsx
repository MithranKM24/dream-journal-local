"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { HealthDetectionService } from "@/lib/health-detection"

interface HealthAlertsProps {
  entries: any[]
}

export default function HealthAlerts({ entries }: HealthAlertsProps) {
  const alerts = HealthDetectionService.detectSleepDisorders(entries)

  if (alerts.length === 0) {
    return null
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Health Insights
        </CardTitle>
        <CardDescription>Sleep health analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`flex gap-3 p-3 rounded-lg border ${
              alert.type === "warning"
                ? "bg-destructive/5 border-destructive/20"
                : alert.type === "success"
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-blue-500/5 border-blue-500/20"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {alert.type === "warning" ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : alert.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Info className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
