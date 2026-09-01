"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Cloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface LifestylePageProps {
  data: any
  onUpdate: (data: any) => void
  onBack: () => void
  onSave: () => void
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function LifestylePage({
  data,
  onUpdate,
  onBack,
  onSave,
  selectedDate,
  onDateChange,
}: LifestylePageProps) {
  const [formData, setFormData] = useState({
    date: selectedDate,
    stressLevel: data.stressLevel || 5,
    physicalActivity: data.physicalActivity || "",
    caffeine: data.caffeine || "",
    alcohol: data.alcohol || "",
    screenTime: data.screenTime || "",
    screenTimeUnit: data.screenTimeUnit || "hours",
    mealTiming: data.mealTiming || "",
    mealTimingUnit: data.mealTimingUnit || "hours",
    location: data.location || "",
    weather: data.weather || "",
    roomTemperature: data.roomTemperature || "",
    roomNoise: data.roomNoise || "",
    environmentalFactors: data.environmentalFactors || "",
  })

  const [weatherData, setWeatherData] = useState<any>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)

  useEffect(() => {
    setFormData({
      date: selectedDate,
      stressLevel: data.stressLevel || 5,
      physicalActivity: data.physicalActivity || "",
      caffeine: data.caffeine || "",
      alcohol: data.alcohol || "",
      screenTime: data.screenTime || "",
      screenTimeUnit: data.screenTimeUnit || "hours",
      mealTiming: data.mealTiming || "",
      mealTimingUnit: data.mealTimingUnit || "hours",
      location: data.location || "",
      weather: data.weather || "",
      roomTemperature: data.roomTemperature || "",
      roomNoise: data.roomNoise || "",
      environmentalFactors: data.environmentalFactors || "",
    })
  }, [data, selectedDate])

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const handleDateChange = (newDate: string) => {
    setFormData({ ...formData, date: newDate })
    onDateChange(newDate)
  }

  const fetchWeather = async () => {
    if (!formData.location.trim()) return
    setLoadingWeather(true)
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(formData.location)}&count=1&language=en&format=json`,
      )
      const geoData = await response.json()
      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude, name, country } = geoData.results[0]
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`,
        )
        const weather = await weatherResponse.json()
        const current = weather.current
        setWeatherData({
          location: `${name}, ${country}`,
          temperature: current.temperature_2m,
          condition: getWeatherCondition(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
        })
        handleChange("weather", `${current.temperature_2m}°C, ${getWeatherCondition(current.weather_code)}`)
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
    } finally {
      setLoadingWeather(false)
    }
  }

  const getWeatherCondition = (code: number): string => {
    const conditions: { [key: number]: string } = {
      0: "Clear",
      1: "Mostly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Heavy Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      71: "Slight Snow",
      73: "Moderate Snow",
      75: "Heavy Snow",
      80: "Slight Rain Showers",
      81: "Moderate Rain Showers",
      82: "Violent Rain Showers",
      85: "Slight Snow Showers",
      86: "Heavy Snow Showers",
      95: "Thunderstorm",
      96: "Thunderstorm with Hail",
      99: "Thunderstorm with Hail",
    }
    return conditions[code] || "Unknown"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Lifestyle</h2>
          <p className="text-muted-foreground">Monitor stress, exercise, and daily habits</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle>Lifestyle Information</CardTitle>
          <CardDescription>Track your daily habits and environmental factors</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level: {formData.stressLevel}/10</Label>
              <Slider
                value={[formData.stressLevel]}
                onValueChange={(value) => handleChange("stressLevel", value[0])}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalActivity">Physical Activity</Label>
              <Select
                value={formData.physicalActivity}
                onValueChange={(value) => handleChange("physicalActivity", value)}
              >
                <SelectTrigger className="border-primary/30">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="intense">Intense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caffeine">Caffeine Intake (cups)</Label>
              <Input
                id="caffeine"
                type="number"
                placeholder="e.g., 2"
                value={formData.caffeine}
                onChange={(e) => handleChange("caffeine", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alcohol">Alcohol Intake (units)</Label>
              <Input
                id="alcohol"
                type="number"
                placeholder="e.g., 1"
                value={formData.alcohol}
                onChange={(e) => handleChange("alcohol", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label>Screen Time Before Bed</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.5"
                  placeholder="Enter value"
                  value={formData.screenTime}
                  onChange={(e) => handleChange("screenTime", e.target.value)}
                  className="border-primary/30 focus:border-primary flex-1"
                />
                <Select
                  value={formData.screenTimeUnit}
                  onValueChange={(value) => handleChange("screenTimeUnit", value)}
                >
                  <SelectTrigger className="border-primary/30 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Last Meal Timing</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.5"
                  placeholder="Enter value"
                  value={formData.mealTiming}
                  onChange={(e) => handleChange("mealTiming", e.target.value)}
                  className="border-primary/30 focus:border-primary flex-1"
                />
                <Select
                  value={formData.mealTimingUnit}
                  onValueChange={(value) => handleChange("mealTimingUnit", value)}
                >
                  <SelectTrigger className="border-primary/30 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weather Section */}
            <div className="md:col-span-2 space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Weather Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Enter city name"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="border-primary/30 focus:border-primary"
                    />
                    <Button onClick={fetchWeather} disabled={loadingWeather} size="sm">
                      {loadingWeather ? "Loading..." : "Fetch"}
                    </Button>
                  </div>
                </div>

                {weatherData && (
                  <>
                    <div className="space-y-2">
                      <Label>Temperature</Label>
                      <div className="p-2 bg-background rounded border border-primary/20">
                        {weatherData.temperature}°C
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <div className="p-2 bg-background rounded border border-primary/20">{weatherData.condition}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Humidity</Label>
                      <div className="p-2 bg-background rounded border border-primary/20">{weatherData.humidity}%</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Wind Speed</Label>
                      <div className="p-2 bg-background rounded border border-primary/20">
                        {weatherData.windSpeed} km/h
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomTemperature">Room Temperature (°C)</Label>
              <Input
                id="roomTemperature"
                type="number"
                placeholder="e.g., 20"
                value={formData.roomTemperature}
                onChange={(e) => handleChange("roomTemperature", e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNoise">Room Noise Level</Label>
              <Select value={formData.roomNoise} onValueChange={(value) => handleChange("roomNoise", value)}>
                <SelectTrigger className="border-primary/30">
                  <SelectValue placeholder="Select noise level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="silent">Silent</SelectItem>
                  <SelectItem value="quiet">Quiet</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="loud">Loud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="environmentalFactors">Other Environmental Factors</Label>
              <Textarea
                id="environmentalFactors"
                placeholder="Any other factors affecting your sleep..."
                value={formData.environmentalFactors}
                onChange={(e) => handleChange("environmentalFactors", e.target.value)}
                className="border-primary/30 focus:border-primary resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onBack}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onSave}>
              Save & View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
