"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Loader2, Cloud } from "lucide-react"
import { WeatherService, type WeatherData } from "@/lib/weather-service"

interface LifestyleCardProps {
  onUpdate: (data: any) => void
}

export default function LifestyleCard({ onUpdate }: LifestyleCardProps) {
  const [formData, setFormData] = useState({
    stressLevel: 5,
    physicalActivity: "",
    caffeine: "",
    alcohol: "",
    screenTime: "",
    mealTiming: "",
    roomTemperature: "",
    noiseLevel: "moderate",
    lighting: "dark",
    location: "",
    weather: null as WeatherData | null,
  })

  const [loadingWeather, setLoadingWeather] = useState(false)

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const fetchWeather = async () => {
    if (!formData.location.trim()) return

    setLoadingWeather(true)
    const weather = await WeatherService.getWeatherByLocation(formData.location)
    if (weather) {
      setFormData((prev) => ({ ...prev, weather }))
      onUpdate({ ...formData, weather })
    }
    setLoadingWeather(false)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-accent/20">
      <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
        <CardTitle className="text-accent">Lifestyle Factors</CardTitle>
        <CardDescription>Daily habits and environment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label>Daily Stress Level: {formData.stressLevel}/10</Label>
          <Slider
            value={[formData.stressLevel]}
            onValueChange={(value) => handleChange("stressLevel", value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="physicalActivity">Physical Activity (minutes)</Label>
          <Input
            id="physicalActivity"
            type="number"
            placeholder="Minutes of exercise"
            value={formData.physicalActivity}
            onChange={(e) => handleChange("physicalActivity", e.target.value)}
            className="border-accent/30 focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="caffeine">Caffeine (cups)</Label>
            <Input
              id="caffeine"
              type="number"
              placeholder="0"
              value={formData.caffeine}
              onChange={(e) => handleChange("caffeine", e.target.value)}
              className="border-accent/30 focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alcohol">Alcohol (units)</Label>
            <Input
              id="alcohol"
              type="number"
              placeholder="0"
              value={formData.alcohol}
              onChange={(e) => handleChange("alcohol", e.target.value)}
              className="border-accent/30 focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenTime">Screen Time Before Bed (minutes)</Label>
          <div className="flex gap-2">
            <Input
              id="screenTime"
              type="number"
              placeholder="Minutes"
              value={formData.screenTime}
              onChange={(e) => handleChange("screenTime", e.target.value)}
              className="border-accent/30 focus:border-accent flex-1"
            />
            <div className="text-xs text-muted-foreground flex items-center px-2 py-1 bg-muted rounded">
              {formData.screenTime ? (
                <span
                  className={
                    Number(formData.screenTime) > 60 ? "text-destructive font-semibold" : "text-green-600 font-semibold"
                  }
                >
                  {Number(formData.screenTime) > 60 ? "⚠️ High" : "✓ Good"}
                </span>
              ) : (
                "—"
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Recommended: Less than 30 minutes before bed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mealTiming">Last Meal Timing (hours before bed)</Label>
          <Input
            id="mealTiming"
            type="number"
            placeholder="Hours"
            value={formData.mealTiming}
            onChange={(e) => handleChange("mealTiming", e.target.value)}
            className="border-accent/30 focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomTemperature">Room Temperature (°C)</Label>
          <Input
            id="roomTemperature"
            type="number"
            placeholder="Temperature"
            value={formData.roomTemperature}
            onChange={(e) => handleChange("roomTemperature", e.target.value)}
            className="border-accent/30 focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location/City</Label>
          <div className="flex gap-2">
            <Input
              id="location"
              placeholder="Your city for weather data"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="border-accent/30 focus:border-accent flex-1"
            />
            <Button
              onClick={fetchWeather}
              disabled={loadingWeather || !formData.location.trim()}
              size="sm"
              variant="outline"
              className="px-3 bg-transparent"
            >
              {loadingWeather ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {formData.weather && (
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-foreground">{formData.weather.location}</span>
              <span className="text-lg font-bold text-blue-600">{formData.weather.temperature}°C</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{formData.weather.condition}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Humidity:</span>
                <span className="ml-1 font-semibold">{formData.weather.humidity}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Wind:</span>
                <span className="ml-1 font-semibold">{formData.weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="noiseLevel">Noise Level</Label>
          <select
            id="noiseLevel"
            value={formData.noiseLevel}
            onChange={(e) => handleChange("noiseLevel", e.target.value)}
            className="w-full px-3 py-2 border border-accent/30 rounded-md bg-background text-foreground focus:border-accent focus:outline-none"
          >
            <option value="quiet">Quiet</option>
            <option value="moderate">Moderate</option>
            <option value="loud">Loud</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lighting">Lighting</Label>
          <select
            id="lighting"
            value={formData.lighting}
            onChange={(e) => handleChange("lighting", e.target.value)}
            className="w-full px-3 py-2 border border-accent/30 rounded-md bg-background text-foreground focus:border-accent focus:outline-none"
          >
            <option value="dark">Dark</option>
            <option value="dim">Dim</option>
            <option value="bright">Bright</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
