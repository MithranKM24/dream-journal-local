import type { DreamEntry, DreamAnalysis } from "./types"

export class AnalysisEngine {
  static analyzeDreams(entries: DreamEntry[]): DreamAnalysis {
    if (!entries || entries.length === 0) {
      return this.getEmptyAnalysis()
    }

    const sleepQualities = entries.map((e) => e?.sleepDream?.sleepQuality || 0).filter((q) => q > 0)
    const dreamVividness = entries.map((e) => e?.sleepDream?.dreamVividness || 0).filter((v) => v > 0)

    const sleepDurations = entries
      .map((e) => {
        // Try to get from sleepTime/wakeTime (nested structure)
        let sleepTime = e?.sleepDream?.sleepTime
        let wakeTime = e?.sleepDream?.wakeTime

        if (!sleepTime || !wakeTime) return 0

        try {
          const [sleepHour, sleepMin] = sleepTime.split(":").map(Number)
          const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)

          const sleepDate = new Date(2024, 0, 1, sleepHour, sleepMin)
          const wakeDate = new Date(2024, 0, 1, wakeHour, wakeMin)

          // If wake time is earlier than sleep time, assume it's the next day
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

    const averageSleepQuality =
      sleepQualities.length > 0 ? sleepQualities.reduce((a, b) => a + b, 0) / sleepQualities.length : 0

    const averageDreamVividness =
      dreamVividness.length > 0 ? dreamVividness.reduce((a, b) => a + b, 0) / dreamVividness.length : 0

    const averageSleepDuration =
      sleepDurations.length > 0 ? sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length : 0

    const commonThemes = this.extractCommonThemes(entries)
    const moodTrend = this.analyzeMoodTrend(entries)
    const correlations = this.calculateCorrelations(entries)
    const insights = this.generateInsights(
      entries,
      averageSleepQuality,
      commonThemes,
      correlations,
      averageSleepDuration,
    )

    return {
      averageSleepQuality,
      averageDreamVividness,
      averageSleepDuration,
      commonThemes,
      moodTrend,
      correlations,
      insights,
    }
  }

  private static extractCommonThemes(entries: DreamEntry[]): string[] {
    const themeMap = new Map<string, number>()

    entries.forEach((entry) => {
      if (entry?.sleepDream?.dreamThemes && entry.sleepDream.dreamThemes.length > 0) {
        entry.sleepDream.dreamThemes.forEach((theme) => {
          themeMap.set(theme, (themeMap.get(theme) || 0) + 1)
        })
      } else if (entry?.sleepDream?.dreamDescription) {
        // Extract keywords from description
        const keywords = this.extractKeywordsFromDescription(entry.sleepDream.dreamDescription)
        keywords.forEach((keyword) => {
          themeMap.set(keyword, (themeMap.get(keyword) || 0) + 1)
        })
      }
    })

    return Array.from(themeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme)
  }

  private static extractKeywordsFromDescription(description: string): string[] {
    const keywords: string[] = []
    const commonKeywords = [
      "flying",
      "falling",
      "water",
      "chase",
      "chase",
      "people",
      "family",
      "friends",
      "house",
      "building",
      "nature",
      "animals",
      "death",
      "danger",
      "adventure",
      "journey",
      "lost",
      "found",
      "running",
      "walking",
    ]

    const lowerDesc = description.toLowerCase()
    commonKeywords.forEach((keyword) => {
      if (lowerDesc.includes(keyword)) {
        keywords.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
      }
    })

    return keywords.length > 0 ? keywords : ["General"]
  }

  private static analyzeMoodTrend(entries: DreamEntry[]): string {
    if (!entries || entries.length === 0) return "No data"

    const recentEntries = entries.slice(-7)
    const moodCounts = new Map<string, number>()

    recentEntries.forEach((entry) => {
      const mood = entry?.sleepDream?.mood || "neutral"
      moodCounts.set(mood, (moodCounts.get(mood) || 0) + 1)
    })

    const dominantMood = Array.from(moodCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]

    return dominantMood || "neutral"
  }

  private static calculateCorrelations(entries: DreamEntry[]): DreamAnalysis["correlations"] {
    if (!entries || entries.length < 2) {
      return {
        exerciseAndSleepQuality: 0,
        stressAndNightmares: 0,
        screenTimeAndSleepQuality: 0,
      }
    }

    const exerciseValues = entries.map((e) => {
      const activity = e?.lifestyle?.exercise
      const activityMap: { [key: string]: number } = { none: 0, light: 2, moderate: 5, intense: 8 }
      return typeof activity === "string" ? activityMap[activity] || 0 : activity || 0
    })
    const sleepQualityValues = entries.map((e) => e?.sleepDream?.sleepQuality || 0)
    const stressValues = entries.map((e) => e?.lifestyle?.stressLevel || 0)
    const nightmareFlags = entries.map((e) => (e?.sleepDream?.nightmares ? 1 : 0))
    const screenTimeValues = entries.map((e) => {
      const screenTime = e?.lifestyle?.screenTime
      return typeof screenTime === "string" ? Number.parseFloat(screenTime) : screenTime || 0
    })

    return {
      exerciseAndSleepQuality: this.calculatePearsonCorrelation(exerciseValues, sleepQualityValues),
      stressAndNightmares: this.calculatePearsonCorrelation(stressValues, nightmareFlags),
      screenTimeAndSleepQuality: this.calculatePearsonCorrelation(screenTimeValues, sleepQualityValues),
    }
  }

  private static calculatePearsonCorrelation(x: number[], y: number[]): number {
    if (!x || !y || x.length !== y.length || x.length === 0) return 0

    const n = x.length
    const meanX = x.reduce((a, b) => a + b, 0) / n
    const meanY = y.reduce((a, b) => a + b, 0) / n

    let numerator = 0
    let denominatorX = 0
    let denominatorY = 0

    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX
      const dy = y[i] - meanY
      numerator += dx * dy
      denominatorX += dx * dx
      denominatorY += dy * dy
    }

    const denominator = Math.sqrt(denominatorX * denominatorY)
    return denominator === 0 ? 0 : numerator / denominator
  }

  private static generateInsights(
    entries: DreamEntry[],
    avgSleepQuality: number,
    commonThemes: string[],
    correlations: DreamAnalysis["correlations"],
    avgSleepDuration: number,
  ): string[] {
    const insights: string[] = []

    if (avgSleepDuration < 6) {
      insights.push(
        `Your average sleep duration is ${avgSleepDuration.toFixed(1)} hours. Aim for 7-9 hours per night for optimal health.`,
      )
    } else if (avgSleepDuration >= 7 && avgSleepDuration <= 9) {
      insights.push(
        `Excellent! Your average sleep duration of ${avgSleepDuration.toFixed(1)} hours is in the healthy range.`,
      )
    } else if (avgSleepDuration > 9) {
      insights.push(
        `Your average sleep duration is ${avgSleepDuration.toFixed(1)} hours. Consider if you're getting enough quality sleep.`,
      )
    }

    if (avgSleepQuality > 7) {
      insights.push("Your sleep quality has been excellent! Keep up your current sleep habits.")
    } else if (avgSleepQuality > 5) {
      insights.push(
        "Your sleep quality is moderate. Try improving sleep hygiene: consistent bedtime, dark room, and relaxation.",
      )
    } else if (avgSleepQuality > 0) {
      insights.push(
        "Your sleep quality needs improvement. Consider meditation, exercise, or consulting a sleep specialist.",
      )
    }

    if (commonThemes.length > 0) {
      const themeText = commonThemes.length > 1 ? commonThemes.join(", ") : commonThemes[0]
      insights.push(
        `Your most common dream theme${commonThemes.length > 1 ? "s are" : " is"}: ${themeText}. These may reflect your subconscious concerns.`,
      )
    }

    if (Math.abs(correlations.exerciseAndSleepQuality) > 0.3) {
      if (correlations.exerciseAndSleepQuality > 0) {
        insights.push("Exercise appears to improve your sleep quality! Try to maintain regular physical activity.")
      } else {
        insights.push("Consider adjusting your exercise timing - exercising too close to bedtime may affect sleep.")
      }
    }

    if (Math.abs(correlations.stressAndNightmares) > 0.3) {
      if (correlations.stressAndNightmares > 0) {
        insights.push(
          "High stress levels correlate with more nightmares. Try stress reduction: deep breathing, yoga, or journaling.",
        )
      } else {
        insights.push("Your stress management is working well - nightmares are minimal despite stress levels.")
      }
    }

    if (Math.abs(correlations.screenTimeAndSleepQuality) > 0.3) {
      if (correlations.screenTimeAndSleepQuality < 0) {
        insights.push(
          "Reducing screen time before bed may improve your sleep quality. Try a 30-minute digital detox before sleep.",
        )
      } else {
        insights.push("Your screen time doesn't seem to negatively impact your sleep quality.")
      }
    }

    const nightmareCount = entries.filter((e) => e?.sleepDream?.nightmares).length
    if (nightmareCount > entries.length * 0.3) {
      insights.push(
        `You've been experiencing nightmares frequently (${nightmareCount} out of ${entries.length} entries). Consider stress management techniques.`,
      )
    } else if (nightmareCount > 0) {
      insights.push(`You've had ${nightmareCount} nightmare${nightmareCount > 1 ? "s" : ""} in your recent entries.`)
    }

    const avgVividness = entries.reduce((sum, e) => sum + (e?.sleepDream?.dreamVividness || 0), 0) / entries.length
    if (avgVividness > 7) {
      insights.push("Your dreams are very vivid! This indicates excellent dream recall and healthy REM sleep.")
    } else if (avgVividness > 4) {
      insights.push("Your dreams have moderate vividness. This is typical and healthy for most people.")
    } else if (avgVividness > 0) {
      insights.push("Your dream vividness is low. This may improve with better sleep quality and consistency.")
    }

    const avgCaffeine = entries.reduce((sum, e) => sum + (e?.lifestyle?.caffeine || 0), 0) / entries.length
    if (avgCaffeine > 2) {
      insights.push(
        `Your average caffeine intake is ${avgCaffeine.toFixed(1)} cups per day. Consider reducing to improve sleep quality.`,
      )
    }

    const avgAlcohol = entries.reduce((sum, e) => sum + (e?.lifestyle?.alcohol || 0), 0) / entries.length
    if (avgAlcohol > 1) {
      insights.push(
        `Your average alcohol intake is ${avgAlcohol.toFixed(1)} units per day. Alcohol can disrupt sleep cycles.`,
      )
    }

    const avgStress = entries.reduce((sum, e) => sum + (e?.lifestyle?.stressLevel || 0), 0) / entries.length
    if (avgStress > 7) {
      insights.push(
        `Your average stress level is ${avgStress.toFixed(1)}/10. High stress impacts sleep quality significantly.`,
      )
    }

    return insights.length > 0 ? insights : ["Start logging more dreams to get personalized insights!"]
  }

  private static getEmptyAnalysis(): DreamAnalysis {
    return {
      averageSleepQuality: 0,
      averageDreamVividness: 0,
      averageSleepDuration: 0,
      commonThemes: [],
      moodTrend: "No data",
      correlations: {
        exerciseAndSleepQuality: 0,
        stressAndNightmares: 0,
        screenTimeAndSleepQuality: 0,
      },
      insights: ["Start logging your dreams to get personalized insights!"],
    }
  }
}
