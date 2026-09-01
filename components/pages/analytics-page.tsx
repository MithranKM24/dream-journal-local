"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnalyticsDashboard from "../analytics/analytics-dashboard"

interface AnalyticsPageProps {
  entries: any[]
  onBack: () => void
}

export default function AnalyticsPage({ entries, onBack }: AnalyticsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground">View insights and dream analysis</p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard entries={entries} />
    </div>
  )
}
