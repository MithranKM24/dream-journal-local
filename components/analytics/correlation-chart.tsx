"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DreamAnalysis } from "@/lib/types"

interface CorrelationChartProps {
  analysis: DreamAnalysis
}

export default function CorrelationChart({ analysis }: CorrelationChartProps) {
  const correlations = [
    {
      label: "Exercise & Sleep Quality",
      value: analysis.correlations.exerciseAndSleepQuality,
      color: "bg-primary",
    },
    {
      label: "Stress & Nightmares",
      value: analysis.correlations.stressAndNightmares,
      color: "bg-destructive",
    },
    {
      label: "Screen Time & Sleep Quality",
      value: analysis.correlations.screenTimeAndSleepQuality,
      color: "bg-secondary",
    },
  ]

  const getCorrelationStrength = (value: number): string => {
    const absValue = Math.abs(value)
    if (absValue > 0.7) return "Strong"
    if (absValue > 0.4) return "Moderate"
    if (absValue > 0.2) return "Weak"
    return "Very Weak"
  }

  const getCorrelationDirection = (value: number): string => {
    if (value > 0) return "Positive"
    if (value < 0) return "Negative"
    return "None"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {correlations.map((corr, idx) => (
        <Card key={idx} className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{corr.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Correlation</span>
                <span className="text-lg font-bold text-foreground">{corr.value.toFixed(2)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${corr.color} transition-all duration-300`}
                  style={{ width: `${Math.abs(corr.value) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{getCorrelationStrength(corr.value)}</span>{" "}
                {getCorrelationDirection(corr.value)} correlation
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
