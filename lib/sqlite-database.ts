import { createHash, randomUUID, scryptSync, timingSafeEqual } from "node:crypto"
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"
import type { DreamEntry } from "./types"

type UserRow = { email: string; name: string; password_hash: string }
type EntryRow = { id: string; entry_json: string }

let database: DatabaseSync | undefined

function getDatabase(): DatabaseSync {
  if (database) return database
  const directory = join(process.cwd(), "data")
  mkdirSync(directory, { recursive: true })
  database = new DatabaseSync(join(directory, "sleepsphere.db"))
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS dream_entries (
      id TEXT PRIMARY KEY NOT NULL,
      user_email TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      entry_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, entry_date),
      FOREIGN KEY(user_email) REFERENCES users(email)
    );
  `)
  return database
}

function passwordHash(password: string): string {
  const salt = randomUUID()
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

function passwordMatches(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":")
  if (!salt || !hash) return false
  const supplied = scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, "hex")
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

export function createUser(name: string, email: string, password: string): { email: string; name: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const db = getDatabase()
  const existing = db.prepare("SELECT email FROM users WHERE email = ?").get(normalizedEmail)
  if (existing) throw new Error("This email is already registered. Please sign in instead.")
  db.prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)").run(normalizedEmail, name.trim(), passwordHash(password))
  return { email: normalizedEmail, name: name.trim() }
}

export function authenticateUser(email: string, password: string): { email: string; name: string } | null {
  const normalizedEmail = email.trim().toLowerCase()
  const user = getDatabase().prepare("SELECT email, name, password_hash FROM users WHERE email = ?").get(normalizedEmail) as UserRow | undefined
  if (!user || !passwordMatches(password, user.password_hash)) return null
  return { email: user.email, name: user.name }
}

export function listEntries(email: string): DreamEntry[] {
  const rows = getDatabase().prepare("SELECT id, entry_json FROM dream_entries WHERE user_email = ? ORDER BY entry_date DESC").all(email) as EntryRow[]
  return rows.map((row) => ({ ...JSON.parse(row.entry_json), id: row.id }) as DreamEntry)
}

export function findEntryByDate(email: string, date: string): DreamEntry | null {
  const row = getDatabase().prepare("SELECT id, entry_json FROM dream_entries WHERE user_email = ? AND entry_date = ?").get(email, date) as EntryRow | undefined
  return row ? ({ ...JSON.parse(row.entry_json), id: row.id } as DreamEntry) : null
}

export function saveEntry(email: string, entry: Omit<DreamEntry, "id">): DreamEntry {
  const current = findEntryByDate(email, entry.date)
  const id = current?.id ?? randomUUID()
  const stored = { ...entry, id }
  getDatabase()
    .prepare(`INSERT INTO dream_entries (id, user_email, entry_date, entry_json, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_email, entry_date) DO UPDATE SET entry_json = excluded.entry_json, updated_at = CURRENT_TIMESTAMP`)
    .run(id, email, entry.date, JSON.stringify(stored))
  return stored
}

export function deleteEntry(email: string, id: string): void {
  getDatabase().prepare("DELETE FROM dream_entries WHERE id = ? AND user_email = ?").run(id, email)
}

export function sessionValue(email: string): string {
  return createHash("sha256").update(email).digest("hex").slice(0, 16) + "." + Buffer.from(email).toString("base64url")
}

export function sessionEmail(cookieHeader: string | null): string | null {
  const cookie = cookieHeader?.split(";").map((value) => value.trim()).find((value) => value.startsWith("sleepsphere_session="))
  if (!cookie) return null
  const value = cookie.slice("sleepsphere_session=".length)
  const encodedEmail = value.split(".")[1]
  if (!encodedEmail) return null
  try {
    const email = Buffer.from(encodedEmail, "base64url").toString("utf8")
    return value === sessionValue(email) ? email : null
  } catch {
    return null
  }
}
