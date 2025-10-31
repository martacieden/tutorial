"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Sparkles, ArrowRight, X } from "lucide-react"

interface LearnByDoingFeedbackProps {
  show: boolean
  onClose: () => void
  actionType: "decision" | "task"
  isFirstAction: boolean
}

export function LearnByDoingFeedback({
  show,
  onClose,
  actionType,
  isFirstAction,
}: LearnByDoingFeedbackProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (show) {
      setMounted(true)
    }
  }, [show])

  if (!show || !mounted) return null

  const messages = {
    decision: {
      first: {
        title: "Congrats — you created your first decision! 🎉",
        description: "You've taken your first step in collaborative decision-making. Keep going!",
      },
      subsequent: {
        title: "Decision created! ✅",
        description: "Your decision has been added successfully.",
      },
    },
    task: {
      first: {
        title: "Congrats — you completed your first task! 🎉",
        description: "Great job! You're learning the platform through real actions.",
      },
      subsequent: {
        title: "Task completed! ✅",
        description: "Well done! Your progress is being tracked.",
      },
    },
  }

  const message = messages[actionType][isFirstAction ? "first" : "subsequent"]

  return (
    <div className="fixed bottom-6 right-6 bg-card border border-border rounded-xl shadow-2xl p-6 max-w-md z-[9999] animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
          {isFirstAction ? (
            <Sparkles className="w-6 h-6 text-white" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">{message.title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{message.description}</p>
          {isFirstAction && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-foreground">
                <strong>Tip:</strong> Check your task queue for suggested next actions that will help you learn more about
                the platform.
              </p>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Got it
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

