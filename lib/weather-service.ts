export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
}

export class WeatherService {
  static async getWeatherByLocation(location: string): Promise<WeatherData | null> {
    try {
      // Using Open-Meteo free API (no API key required)
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
      )

      if (!geoResponse.ok) return null

      const geoData = await geoResponse.json()
      if (!geoData.results || geoData.results.length === 0) return null

      const { latitude, longitude, name } = geoData.results[0]

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`,
      )

      if (!weatherResponse.ok) return null

      const weatherData = await weatherResponse.json()
      const current = weatherData.current

      return {
        temperature: current.temperature_2m,
        condition: this.getWeatherCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        location: name,
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
      return null
    }
  }

  private static getWeatherCondition(code: number): string {
    const conditions: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Thunderstorm with hail",
    }
    return conditions[code] || "Unknown"
  }
}
