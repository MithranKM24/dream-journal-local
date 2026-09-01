import { NextResponse } from "next/server"
import { authenticateUser, sessionValue } from "@/lib/sqlite-database"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const user = authenticateUser(email ?? "", password ?? "")
  if (!user) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 })
  const response = NextResponse.json({ user })
  response.cookies.set("sleepsphere_session", sessionValue(user.email), { httpOnly: true, sameSite: "lax", path: "/" })
  return response
}
