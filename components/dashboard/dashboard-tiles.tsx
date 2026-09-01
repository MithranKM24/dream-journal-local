"use client"

import { useEffect, useState } from "react"
import { BellRing, BrainCircuit, ChevronRight, MoonStar, Sparkles, TimerReset } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DashboardTilesProps {
  onNavigate: (page: "tiles" | "profile" | "sleep" | "lifestyle" | "analytics") => void
}

export default function DashboardTiles({ onNavigate }: DashboardTilesProps) {
  const [reminderTime, setReminderTime] = useState("21:30")
  const [reminderActive, setReminderActive] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sleepsphere-reminder")
    if (saved) {
      const { time, active } = JSON.parse(saved)
      setReminderTime(time)
      setReminderActive(active)
    }
  }, [])

  useEffect(() => {
    if (!reminderActive) return
    const [hours, minutes] = reminderTime.split(":").map(Number)
    const next = new Date()
    next.setHours(hours, minutes, 0, 0)
    if (next <= new Date()) next.setDate(next.getDate() + 1)
    const timer = window.setTimeout(() => {
      if (Notification.permission === "granted") new Notification("A small moment for your dreams", { body: "Your two-minute Sleepsphere check-in is ready." })
    }, next.getTime() - Date.now())
    return () => window.clearTimeout(timer)
  }, [reminderActive, reminderTime])

  const toggleReminder = async () => {
    if (!reminderActive && "Notification" in window && Notification.permission !== "granted") await Notification.requestPermission()
    const active = !reminderActive
    setReminderActive(active)
    localStorage.setItem("sleepsphere-reminder", JSON.stringify({ time: reminderTime, active }))
  }

  return (
    <div className="space-y-6 animate-enter">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/30 via-background to-accent/20 p-6 shadow-2xl shadow-primary/10 md:p-10">
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="relative max-w-2xl"><p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> YOUR DAILY DREAM SPACE</p><h2 className="text-4xl font-black tracking-tight md:text-5xl">How did last night <span className="text-primary">feel?</span></h2><p className="mt-4 text-base leading-7 text-muted-foreground">No long forms. Start with a few taps, add a memory if you want, and get a personal pattern brief as you build your journal.</p><Button size="lg" onClick={() => onNavigate("sleep")} className="mt-6 gap-2 rounded-full px-7 shadow-lg shadow-primary/30 transition-transform hover:scale-105"><MoonStar className="h-5 w-5" /> Start tonight’s check-in <ChevronRight className="h-4 w-4" /></Button></div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <button onClick={() => onNavigate("sleep")} className="rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"><MoonStar className="h-6 w-6 text-primary" /><p className="mt-4 font-bold">2-minute check-in</p><p className="mt-1 text-sm text-muted-foreground">Mood, sleep and one dream memory.</p></button>
        <button onClick={() => onNavigate("analytics")} className="rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"><BrainCircuit className="h-6 w-6 text-accent" /><p className="mt-4 font-bold">Your pattern brief</p><p className="mt-1 text-sm text-muted-foreground">Discover what may shape your sleep.</p></button>
        <button onClick={() => onNavigate("profile")} className="rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl"><TimerReset className="h-6 w-6 text-secondary" /><p className="mt-4 font-bold">Tune your baseline</p><p className="mt-1 text-sm text-muted-foreground">Set a sleep goal when you’re ready.</p></button>
      </div>
      <section className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-card p-5 md:flex-row md:items-center md:justify-between"><div className="flex gap-3"><div className="rounded-xl bg-primary/10 p-3 text-primary"><BellRing className="h-5 w-5" /></div><div><p className="font-semibold">A gentle nightly nudge</p><p className="text-sm text-muted-foreground">A notification while Sleepsphere is open.</p></div></div><div className="flex items-center gap-3"><Input aria-label="Reminder time" type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} className="w-28" /><Button variant={reminderActive ? "default" : "outline"} onClick={toggleReminder}>{reminderActive ? "Reminder on" : "Turn on"}</Button></div></section>
    </div>
  )
}
