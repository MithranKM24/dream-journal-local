"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

interface SleepTrendsChartProps {
  entries: any[]
}

export default function SleepTrendsChart({ entries }: SleepTrendsChartProps) {
  const chartData = entries.map((entry, idx) => {
    let duration = 0

    if (entry.sleepDream?.sleepDuration) {
      duration = entry.sleepDream.sleepDuration
    } else if (entry.bedtime && entry.wakeTime) {
      const [bedHour, bedMin] = entry.bedtime.split(":").map(Number)
      const [wakeHour, wakeMin] = entry.wakeTime.split(":").map(Number)
      duration = (wakeHour - bedHour) * 60 + (wakeMin - bedMin)
      if (duration < 0) duration += 24 * 60
      duration = duration / 60
    }

    return {
      name: `Day ${idx + 1}`,
      duration: Number.parseFloat(duration.toFixed(1)),
      quality: entry.sleepDream?.sleepQuality || 0,
      date: entry.date,
    }
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-primary/20 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Sleep Duration & Quality Trends</CardTitle>
        <CardDescription>Track your sleep patterns over time - hover for details</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="var(--color-primary)"
              name="Sleep Duration (hours)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)", r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="quality"
              stroke="var(--color-secondary)"
              name="Sleep Quality (1-10)"
              strokeWidth={2}
              dot={{ fill: "var(--color-secondary)", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
