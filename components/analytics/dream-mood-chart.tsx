"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface DreamMoodChartProps {
  entries: any[]
}

export default function DreamMoodChart({ entries }: DreamMoodChartProps) {
  const moodCounts = entries.reduce(
    (acc, entry) => {
      const mood = entry.sleepDream?.mood || "unknown"
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeCounts = entries.reduce(
    (acc, entry) => {
      const type = entry.sleepDream?.dreamType || "unknown"
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1).replace("-", " "),
    value: count,
  }))

  const typeData = Object.entries(typeCounts).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
  }))

  const COLORS = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-secondary/20">
        <CardHeader>
          <CardTitle>Dream Mood Distribution</CardTitle>
          <CardDescription>Emotional patterns in your dreams</CardDescription>
        </CardHeader>
        <CardContent>
          {moodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: `1px solid var(--color-border)`,
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No mood data recorded yet</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle>Dream Type Distribution</CardTitle>
          <CardDescription>Types of dreams you experience</CardDescription>
        </CardHeader>
        <CardContent>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
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
                <Bar dataKey="value" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No dream type data recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
