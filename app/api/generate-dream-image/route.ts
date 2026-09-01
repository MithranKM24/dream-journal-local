export async function POST(request: Request) {
  try {
    const { description } = await request.json()

    if (!description) {
      return Response.json({ error: "Description is required" }, { status: 400 })
    }

    // Generate a placeholder image URL for now
    // In production, integrate with Fal AI or similar service
    const imageUrl = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(description)}`

    return Response.json({ imageUrl })
  } catch (error) {
    console.error("Error generating image:", error)
    return Response.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
