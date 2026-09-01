import { NextResponse } from "next/server"
import { createUser, sessionValue } from "@/lib/sqlite-database"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) return NextResponse.json({ error: "Please provide a name, email, and password of at least 6 characters." }, { status: 400 })
    const user = createUser(name, email, password)
    const response = NextResponse.json({ user })
    response.cookies.set("sleepsphere_session", sessionValue(user.email), { httpOnly: true, sameSite: "lax", path: "/" })
    return response
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create the account." }, { status: 400 })
  }
}
