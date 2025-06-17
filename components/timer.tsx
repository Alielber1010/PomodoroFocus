"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TimerSettings, TimerMode, Session } from "@/app/page"

interface TimerProps {
  settings: TimerSettings
  currentMode: TimerMode
  onModeChange: (mode: TimerMode) => void
  onSessionComplete: (session: Omit<Session, "id">) => void
  getNextMode: () => TimerMode
  completedPomodoros: number
}

export function Timer({
  settings,
  currentMode,
  onModeChange,
  onSessionComplete,
  getNextMode,
  completedPomodoros,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [totalTime, setTotalTime] = useState(0)

  const getDuration = useCallback(
    (mode: TimerMode): number => {
      switch (mode) {
        case "work":
          return settings.workDuration * 60
        case "shortBreak":
          return settings.shortBreakDuration * 60
        case "longBreak":
          return settings.longBreakDuration * 60
      }
    },
    [settings],
  )

  const resetTimer = useCallback(() => {
    const duration = getDuration(currentMode)
    setTimeLeft(duration)
    setTotalTime(duration)
    setIsRunning(false)
  }, [currentMode, getDuration])

  useEffect(() => {
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && totalTime > 0) {
      // Timer completed
      onSessionComplete({
        type: currentMode,
        duration: totalTime / 60,
        completedAt: new Date(),
      })

      // Play notification sound
      if (settings.soundEnabled) {
        const audio = new Audio("/notification.mp3")
        audio.play().catch(() => {
          // Fallback to system beep if audio file not available
          console.log("Timer completed!")
        })
      }

      // Auto-start next session if enabled
      const nextMode = getNextMode()
      onModeChange(nextMode)

      const shouldAutoStart =
        (currentMode === "work" && settings.autoStartBreaks) || (currentMode !== "work" && settings.autoStartPomodoros)

      if (shouldAutoStart) {
        setTimeout(() => setIsRunning(true), 1000)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, totalTime, currentMode, settings, onSessionComplete, getNextMode, onModeChange])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  const modeConfig = {
    work: {
      title: "Focus Time",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-500/20",
      textColor: "text-red-400",
    },
    shortBreak: {
      title: "Short Break",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
      textColor: "text-green-400",
    },
    longBreak: {
      title: "Long Break",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      textColor: "text-blue-400",
    },
  }

  const config = modeConfig[currentMode]

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">{config.title}</h2>
            <div className={`inline-block px-3 py-1 rounded-full text-sm ${config.bgColor} ${config.textColor}`}>
              Session #{completedPomodoros + 1}
            </div>
          </div>

          <div className="relative">
            <div
              className={`text-8xl font-mono font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="lg"
              className={`bg-gradient-to-r ${config.color} hover:opacity-90 text-white px-8`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>

            <Button
              onClick={() => {
                const nextMode = getNextMode()
                onModeChange(nextMode)
              }}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Skip
            </Button>
          </div>

          <div className="flex justify-center gap-2">
            {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((mode) => (
              <Button
                key={mode}
                onClick={() => onModeChange(mode)}
                variant={currentMode === mode ? "default" : "ghost"}
                size="sm"
                className={`${
                  currentMode === mode
                    ? `bg-gradient-to-r ${modeConfig[mode].color} text-white`
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {mode === "work" ? "Work" : mode === "shortBreak" ? "Short Break" : "Long Break"}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
