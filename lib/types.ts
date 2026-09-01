export interface UserProfile {
  name?: string
  age?: number
  gender?: string
  sleepGoal?: number
}

export interface SleepDreamData {
  date?: string
  sleepTime?: string
  wakeTime?: string
  sleepDuration?: number
  sleepDurationHours?: number
  sleepDurationMinutes?: number
  sleepQuality?: number
  dreamVividness?: number
  vividness?: number
  dreamRecall?: string
  mood?: string
  dreamType?: string
  dreamThemes?: string[]
  lucidDream?: boolean
  nightmares?: boolean
  awakenings?: number
  dreamDescription?: string
  notes?: string
}

export interface LifestyleData {
  exercise?: number
  caffeine?: number
  alcohol?: number
  screenTime?: number
  screenTimeBeforeBedHours?: number
  screenTimeBeforeBedMinutes?: number
  lastMealTimingHours?: number
  lastMealTimingMinutes?: number
  stressLevel?: number
  meditation?: number
  weather?: string
  location?: string
}

export interface DreamEntry {
  id?: string
  date: string
  userProfile: UserProfile
  sleepDream: SleepDreamData
  lifestyle: LifestyleData
  notes?: string
}

export interface DreamData {
  userProfile: UserProfile
  sleepDream: SleepDreamData
  lifestyle: LifestyleData
  entries: DreamEntry[]
}

export interface DreamAnalysis {
  averageSleepQuality: number
  averageDreamVividness: number
  averageSleepDuration: number
  commonThemes: string[]
  moodTrend: string
  correlations: {
    exerciseAndSleepQuality: number
    stressAndNightmares: number
    screenTimeAndSleepQuality: number
  }
  insights: string[]
}
