"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface WeeklyMonthlySummaryProps {
  entries: any[]
  timeRange: "weekly" | "monthly"
  setTimeRange: (range: "weekly" | "monthly") => void
}

export default function WeeklyMonthlySummary({ entries, timeRange, setTimeRange }: WeeklyMonthlySummaryProps) {
  const getChartData = () => {
    if (timeRange === "weekly") {
      const weekData = Array(7)
        .fill(null)
        .map((_, i) => ({
          name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          quality: 0,
          count: 0,
        }))

      entries.forEach((entry) => {
        const date = new Date(entry.date)
        const dayOfWeek = date.getDay()
        const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        weekData[idx].quality += entry.sleepQuality || 0
        weekData[idx].count += 1
      })

      return weekData.map((d) => ({
        ...d,
        quality: d.count > 0 ? (d.quality / d.count).toFixed(1) : 0,
      }))
    } else {
      const monthData = Array(4)
        .fill(null)
        .map((_, i) => ({
          name: `Week ${i + 1}`,
          quality: 0,
          count: 0,
        }))

      entries.forEach((entry) => {
        const date = new Date(entry.date)
        const week = Math.floor(date.getDate() / 7)
        monthData[week].quality += entry.sleepQuality || 0
        monthData[week].count += 1
      })

      return monthData.map((d) => ({
        ...d,
        quality: d.count > 0 ? (d.quality / d.count).toFixed(1) : 0,
      }))
    }
  }

  const chartData = getChartData()

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Sleep Quality Summary</CardTitle>
            <CardDescription>Average sleep quality over time</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={timeRange === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("monthly")}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="quality" fill="var(--color-primary)" name="Avg Sleep Quality" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
