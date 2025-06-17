"use client"

import { useState, useEffect } from "react"
import { Timer } from "@/components/timer"
import { Settings } from "@/components/settings"
import { Statistics } from "@/components/statistics"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

export type TimerMode = "work" | "shortBreak" | "longBreak"

export interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
}

export interface Session {
  id: string
  type: TimerMode
  duration: number
  completedAt: Date
}

const defaultSettings: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
}

export default function Home() {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings)
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentMode, setCurrentMode] = useState<TimerMode>("work")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoro-settings")
    const savedSessions = localStorage.getItem("pomodoro-sessions")
    const savedPomodoros = localStorage.getItem("completed-pomodoros")

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
    if (savedPomodoros) {
      setCompletedPomodoros(Number.parseInt(savedPomodoros))
    }
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem("pomodoro-sessions", JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem("completed-pomodoros", completedPomodoros.toString())
  }, [completedPomodoros])

  const addSession = (session: Omit<Session, "id">) => {
    const newSession: Session = {
      ...session,
      id: Date.now().toString(),
    }
    setSessions((prev) => [...prev, newSession])

    if (session.type === "work") {
      setCompletedPomodoros((prev) => prev + 1)
    }
  }

  const getNextMode = (): TimerMode => {
    if (currentMode === "work") {
      return completedPomodoros > 0 && (completedPomodoros + 1) % settings.longBreakInterval === 0
        ? "longBreak"
        : "shortBreak"
    }
    return "work"
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Header />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <Timer
                settings={settings}
                currentMode={currentMode}
                onModeChange={setCurrentMode}
                onSessionComplete={addSession}
                getNextMode={getNextMode}
                completedPomodoros={completedPomodoros}
              />
            </div>

            <div className="space-y-6">
              <Settings settings={settings} onSettingsChange={setSettings} />

              <Statistics sessions={sessions} completedPomodoros={completedPomodoros} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
