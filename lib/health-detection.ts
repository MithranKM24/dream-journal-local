export interface HealthAlert {
  type: "warning" | "info" | "success"
  title: string
  message: string
}

export class HealthDetectionService {
  static detectSleepDisorders(entries: any[]): HealthAlert[] {
    const alerts: HealthAlert[] = []

    if (entries.length === 0) return alerts

    const avgSleepQuality = entries.reduce((sum, e) => sum + (e.sleepDream?.sleepQuality || 0), 0) / entries.length

    const avgSleepDuration =
      entries.reduce((sum, e) => {
        // First, try to use direct sleepDuration input
        if (e.sleepDream?.sleepDuration) {
          return sum + e.sleepDream.sleepDuration
        }
        // Fallback to calculating from bedtime and wakeTime
        const bedtime = e.sleepDream?.bedtime
        const wakeTime = e.sleepDream?.wakeTime
        if (bedtime && wakeTime) {
          const [bedHour, bedMin] = bedtime.split(":").map(Number)
          const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)
          let duration = wakeHour * 60 + wakeMin - (bedHour * 60 + bedMin)
          if (duration < 0) duration += 24 * 60
          return sum + duration / 60
        }
        return sum
      }, 0) / entries.length

    const nightmareCount = entries.filter((e) => e.sleepDream?.dreamType === "nightmare").length
    const avgAwakenings = entries.reduce((sum, e) => sum + (e.sleepDream?.awakenings || 0), 0) / entries.length

    // Insomnia detection
    if (avgSleepDuration < 6) {
      alerts.push({
        type: "warning",
        title: "Possible Insomnia",
        message: `Average sleep duration is ${avgSleepDuration.toFixed(1)} hours. Aim for 7-9 hours per night.`,
      })
    }

    // Poor sleep quality
    if (avgSleepQuality < 4) {
      alerts.push({
        type: "warning",
        title: "Poor Sleep Quality",
        message: "Your sleep quality is consistently low. Consider improving sleep hygiene and environment.",
      })
    }

    // Nightmare disorder
    if (nightmareCount > entries.length * 0.3) {
      alerts.push({
        type: "warning",
        title: "Frequent Nightmares",
        message: `${((nightmareCount / entries.length) * 100).toFixed(0)}% of your dreams are nightmares. This may indicate stress or anxiety.`,
      })
    }

    // Sleep fragmentation
    if (avgAwakenings > 2) {
      alerts.push({
        type: "warning",
        title: "Sleep Fragmentation",
        message: `You're waking up ${avgAwakenings.toFixed(1)} times per night on average. This disrupts sleep quality.`,
      })
    }

    // Hypersomnia detection
    if (avgSleepDuration > 10) {
      alerts.push({
        type: "info",
        title: "Extended Sleep Duration",
        message: `Average sleep duration is ${avgSleepDuration.toFixed(1)} hours. Monitor for signs of hypersomnia.`,
      })
    }

    // Positive feedback
    if (avgSleepQuality >= 7 && avgSleepDuration >= 7 && avgSleepDuration <= 9 && nightmareCount === 0) {
      alerts.push({
        type: "success",
        title: "Excellent Sleep Health",
        message: "Your sleep patterns are healthy! Keep maintaining your current sleep habits.",
      })
    }

    return alerts
  }
}
