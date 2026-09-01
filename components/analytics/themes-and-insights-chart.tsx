"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { DreamAnalysis } from "@/lib/types"

interface ThemesAndInsightsChartProps {
  analysis: DreamAnalysis
}

export default function ThemesAndInsightsChart({ analysis }: ThemesAndInsightsChartProps) {
  const themeData = analysis.commonThemes.map((theme, idx) => ({
    name: theme,
    frequency: analysis.commonThemes.length - idx,
  }))

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Common Dream Themes</CardTitle>
        <CardDescription>Most frequent themes in your dreams</CardDescription>
      </CardHeader>
      <CardContent>
        {themeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={themeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="frequency" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center py-8">No themes recorded yet</p>
        )}
      </CardContent>
    </Card>
  )
}
