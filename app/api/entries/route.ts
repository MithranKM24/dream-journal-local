import { NextResponse } from "next/server"
import { deleteEntry, findEntryByDate, listEntries, saveEntry, sessionEmail } from "@/lib/sqlite-database"

export const runtime = "nodejs"

function userEmail(request: Request): string | null {
  return sessionEmail(request.headers.get("cookie"))
}

export async function GET(request: Request) {
  const email = userEmail(request)
  if (!email) return NextResponse.json({ error: "Please sign in." }, { status: 401 })
  const date = new URL(request.url).searchParams.get("date")
  return NextResponse.json({ data: date ? findEntryByDate(email, date) : listEntries(email) })
}

export async function POST(request: Request) {
  const email = userEmail(request)
  if (!email) return NextResponse.json({ error: "Please sign in." }, { status: 401 })
  const entry = await request.json()
  if (!entry?.date) return NextResponse.json({ error: "An entry date is required." }, { status: 400 })
  return NextResponse.json({ data: saveEntry(email, entry) })
}

export async function DELETE(request: Request) {
  const email = userEmail(request)
  if (!email) return NextResponse.json({ error: "Please sign in." }, { status: 401 })
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "An entry id is required." }, { status: 400 })
  deleteEntry(email, id)
  return NextResponse.json({ ok: true })
}
