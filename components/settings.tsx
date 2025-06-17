"use client"

import { SettingsIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { TimerSettings } from "@/app/page"

interface SettingsProps {
  settings: TimerSettings
  onSettingsChange: (settings: TimerSettings) => void
}

export function Settings({ settings, onSettingsChange }: SettingsProps) {
  const updateSetting = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <SettingsIcon className="w-5 h-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="work-duration" className="text-white/90">
              Work Duration (minutes)
            </Label>
            <Input
              id="work-duration"
              type="number"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) => updateSetting("workDuration", Number.parseInt(e.target.value) || 25)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label htmlFor="short-break" className="text-white/90">
              Short Break (minutes)
            </Label>
            <Input
              id="short-break"
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => updateSetting("shortBreakDuration", Number.parseInt(e.target.value) || 5)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label htmlFor="long-break" className="text-white/90">
              Long Break (minutes)
            </Label>
            <Input
              id="long-break"
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => updateSetting("longBreakDuration", Number.parseInt(e.target.value) || 15)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label htmlFor="long-break-interval" className="text-white/90">
              Long Break Interval
            </Label>
            <Input
              id="long-break-interval"
              type="number"
              min="2"
              max="10"
              value={settings.longBreakInterval}
              onChange={(e) => updateSetting("longBreakInterval", Number.parseInt(e.target.value) || 4)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-start-breaks" className="text-white/90">
              Auto-start breaks
            </Label>
            <Switch
              id="auto-start-breaks"
              checked={settings.autoStartBreaks}
              onCheckedChange={(checked) => updateSetting("autoStartBreaks", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-start-pomodoros" className="text-white/90">
              Auto-start pomodoros
            </Label>
            <Switch
              id="auto-start-pomodoros"
              checked={settings.autoStartPomodoros}
              onCheckedChange={(checked) => updateSetting("autoStartPomodoros", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="text-white/90">
              Sound notifications
            </Label>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
