// Simple authentication service using localStorage
export interface User {
  id: string
  email: string
  name: string
}

const STORAGE_KEY = "dream_journal_user"

export function setUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}
