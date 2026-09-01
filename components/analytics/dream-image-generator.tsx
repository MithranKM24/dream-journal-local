"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface DreamImageGeneratorProps {
  entries: any[]
}

export default function DreamImageGenerator({ entries }: DreamImageGeneratorProps) {
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: number; description: string; imageUrl: string }>>(
    [],
  )
  const [loading, setLoading] = useState(false)

  const generateImages = async () => {
    setLoading(true)
    const newImages: Array<{ id: number; description: string; imageUrl: string }> = []

    for (const entry of entries) {
      if (entry.dreamDescription) {
        try {
          // Generate a unique seed based on dream description for consistent placeholder images
          const seed = entry.dreamDescription.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
          const imageUrl = `/placeholder.svg?height=300&width=400&query=dream%20visualization%20${entry.dreamMood}%20${entry.dreamType}`

          newImages.push({
            id: entry.id,
            description: entry.dreamDescription,
            imageUrl,
          })
        } catch (error) {
          console.error("Error generating image:", error)
        }
      }
    }

    setGeneratedImages(newImages)
    setLoading(false)
  }

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Dream Visualizations
        </CardTitle>
        <CardDescription>AI-generated images based on your dream descriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generateImages} disabled={loading || entries.length === 0} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Images...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Dream Images
            </>
          )}
        </Button>

        {generatedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((img) => (
              <div key={img.id} className="space-y-2 group">
                <div className="relative overflow-hidden rounded-lg border border-accent/20 bg-muted">
                  <img
                    src={img.imageUrl || "/placeholder.svg"}
                    alt={img.description}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{img.description}</p>
              </div>
            ))}
          </div>
        )}

        {generatedImages.length === 0 && !loading && entries.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Click the button above to generate dream visualizations</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
