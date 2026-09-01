"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Sparkles, WandSparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisEngine } from "@/lib/analysis-engine"
import type { DreamEntry } from "@/lib/types"
import SleepTrendsChart from "./sleep-trends-chart"
import DreamMoodChart from "./dream-mood-chart"
import ThemesAndInsightsChart from "./themes-and-insights-chart"
import CorrelationChart from "./correlation-chart"
import DreamImageGenerator from "./dream-image-generator"
import HealthAlerts from "./health-alerts"

interface AnalyticsDashboardProps {
  entries: DreamEntry[]
}

export default function AnalyticsDashboard({ entries }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly")

  const analysis = useMemo(() => {
    return AnalysisEngine.analyzeDreams(entries)
  }, [entries])

  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        avgSleepQuality: 0,
        avgDreamVividness: 0,
        totalEntries: 0,
        nightmareCount: 0,
        avgSleepDuration: 0,
      }
    }

    const nightmares = entries.filter((e) => e.sleepDream?.nightmares).length

    return {
      avgSleepQuality: analysis.averageSleepQuality.toFixed(1),
      avgDreamVividness: analysis.averageDreamVividness.toFixed(1),
      avgSleepDuration: analysis.averageSleepDuration.toFixed(1),
      totalEntries: entries.length,
      nightmareCount: nightmares,
    }
  }, [entries, analysis])

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No entries yet. Fill in the input cards and save to see analytics.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/20 via-background to-accent/15 p-6 shadow-xl shadow-primary/10">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl animate-pulse" />
        <div className="relative"><p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-primary"><BrainCircuit className="h-4 w-4" /> SLEEPSPHERE INTELLIGENCE BRIEF</p><h3 className="mt-3 text-2xl font-black">Your dreams are starting to tell a story.</h3><p className="mt-2 max-w-2xl text-muted-foreground">Based on {entries.length} check-in{entries.length === 1 ? "" : "s"}, your sleep quality averages <strong>{stats.avgSleepQuality}/10</strong> and dream vividness averages <strong>{stats.avgDreamVividness}/10</strong>. Keep logging small details—patterns become sharper over time.</p><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-background/65 p-4 backdrop-blur"><Sparkles className="h-5 w-5 text-primary" /><p className="mt-2 text-sm font-semibold">Signal</p><p className="text-xs text-muted-foreground">{analysis.moodTrend || "Add a few more check-ins to reveal your mood signal."}</p></div><div className="rounded-2xl bg-background/65 p-4 backdrop-blur"><WandSparkles className="h-5 w-5 text-accent" /><p className="mt-2 text-sm font-semibold">Next experiment</p><p className="text-xs text-muted-foreground">Try a consistent wind-down time for three nights and compare your quality.</p></div><div className="rounded-2xl bg-background/65 p-4 backdrop-blur"><BrainCircuit className="h-5 w-5 text-secondary" /><p className="mt-2 text-sm font-semibold">Confidence</p><p className="text-xs text-muted-foreground">Growing — richer observations create more specific insights.</p></div></div></div>
      </section>
      <HealthAlerts entries={entries} />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Sleep Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.avgSleepQuality}/10</div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Dream Vividness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats.avgDreamVividness}/10</div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.totalEntries}</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Sleep Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.avgSleepDuration}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Sleep Trends</TabsTrigger>
          <TabsTrigger value="mood">Dream Mood</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <SleepTrendsChart entries={entries} />
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <DreamMoodChart entries={entries} />
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <ThemesAndInsightsChart analysis={analysis} />
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <CorrelationChart analysis={analysis} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.insights.length > 0 ? (
                  analysis.insights.map((insight, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="text-primary font-bold">•</div>
                      <p className="text-sm text-foreground">{insight}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No insights available yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dream Image Generator */}
      <DreamImageGenerator entries={entries} />
    </div>
  )
}
