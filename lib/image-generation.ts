export async function generateImage(description: string): Promise<string> {
  // Placeholder for image generation
  // In production, this would call Fal AI or similar service
  return `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(description)}`
}
