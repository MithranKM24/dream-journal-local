import type { DreamEntry } from "./types"

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? "The local database request failed.")
  return body.data as T
}

export class LocalStorageService {
  static getDreamEntries(): Promise<DreamEntry[]> {
    return request<DreamEntry[]>("/api/entries")
  }

  static getDreamEntryByDate(date: string): Promise<DreamEntry | null> {
    return request<DreamEntry | null>(`/api/entries?date=${encodeURIComponent(date)}`)
  }

  static saveDreamEntry(entry: Omit<DreamEntry, "id">): Promise<DreamEntry> {
    return request<DreamEntry>("/api/entries", { method: "POST", body: JSON.stringify(entry) })
  }

  static async updateDreamEntry(id: string, updates: Partial<DreamEntry>): Promise<void> {
    const entry = (await this.getDreamEntries()).find((item) => item.id === id)
    if (!entry) throw new Error("Dream entry not found.")
    await this.saveDreamEntry({ ...entry, ...updates, id: undefined } as Omit<DreamEntry, "id">)
  }

  static deleteDreamEntry(id: string): Promise<void> {
    return request<void>(`/api/entries?id=${encodeURIComponent(id)}`, { method: "DELETE" })
  }
}
