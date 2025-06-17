"use client"

import { BarChart3, Clock, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Session } from "@/app/page"

interface StatisticsProps {
  sessions: Session[]
  completedPomodoros: number
}

export function Statistics({ sessions, completedPomodoros }: StatisticsProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaySessions = sessions.filter((session) => new Date(session.completedAt) >= today)

  const todayPomodoros = todaySessions.filter((session) => session.type === "work").length

  const todayFocusTime = todaySessions
    .filter((session) => session.type === "work")
    .reduce((total, session) => total + session.duration, 0)

  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)

  const weekSessions = sessions.filter((session) => new Date(session.completedAt) >= thisWeek)

  const weekPomodoros = weekSessions.filter((session) => session.type === "work").length

  const stats = [
    {
      title: "Today",
      value: todayPomodoros,
      subtitle: `${Math.round(todayFocusTime)} min focused`,
      icon: Target,
      color: "text-red-400",
    },
    {
      title: "This Week",
      value: weekPomodoros,
      subtitle: `${sessions.length} total sessions`,
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      title: "Total",
      value: completedPomodoros,
      subtitle: "Pomodoros completed",
      icon: BarChart3,
      color: "text-blue-400",
    },
  ]

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Clock className="w-5 h-5" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className={`p-2 rounded-full bg-white/10 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.title}</div>
              <div className="text-xs text-white/50">{stat.subtitle}</div>
            </div>
          </div>
        ))}

        {todaySessions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-white/90 mb-3">Today's Sessions</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {todaySessions
                .slice(-5)
                .reverse()
                .map((session) => (
                  <div key={session.id} className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded text-white/90 ${
                        session.type === "work"
                          ? "bg-red-500/20"
                          : session.type === "shortBreak"
                            ? "bg-green-500/20"
                            : "bg-blue-500/20"
                      }`}
                    >
                      {session.type === "work" ? "Work" : session.type === "shortBreak" ? "Short Break" : "Long Break"}
                    </span>
                    <span className="text-white/60">
                      {new Date(session.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
