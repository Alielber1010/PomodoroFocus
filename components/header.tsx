import { Timer } from "lucide-react"

export function Header() {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
          <Timer className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white">Pomodoro Focus</h1>
      </div>
      <p className="text-white/70 text-lg max-w-2xl mx-auto">
        Boost your productivity with the proven Pomodoro Technique. Work in focused 25-minute intervals with strategic
        breaks.
      </p>
    </header>
  )
}
