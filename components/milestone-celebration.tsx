"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Sparkles, X } from "lucide-react"

interface MilestoneCelebrationProps {
  milestone: {
    title: string
    description: string
    icon: "trophy" | "star" | "sparkles"
    reward?: string
  }
  onClose: () => void
}

export function MilestoneCelebration({ milestone, onClose }: MilestoneCelebrationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  const icons = {
    trophy: <Trophy className="w-12 h-12" />,
    star: <Star className="w-12 h-12" />,
    sparkles: <Sparkles className="w-12 h-12" />,
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300">
      <div
        className={`bg-card rounded-2xl p-8 max-w-md mx-4 shadow-2xl transition-all duration-500 ${
          show ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white animate-bounce">
            {icons[milestone.icon]}
          </div>

          <h2 className="text-3xl font-bold mb-3 text-foreground">Milestone Reached!</h2>
          <h3 className="text-xl font-semibold text-primary mb-2">{milestone.title}</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">{milestone.description}</p>

          {milestone.reward && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl mb-6">
              <div className="text-sm font-medium text-accent mb-1">Reward Unlocked</div>
              <div className="text-sm text-muted-foreground">{milestone.reward}</div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
