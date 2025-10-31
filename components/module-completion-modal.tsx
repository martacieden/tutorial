"use client"

import { useRouter } from "next/navigation"
import { Building2, Users, Sparkles, CheckCircle2, ArrowRight, X } from "lucide-react"

interface ModuleCompletionModalProps {
  show: boolean
  onClose: () => void
  moduleId: string
  moduleTitle: string
  nextModuleId?: string
  nextModuleTitle?: string
  nextModuleRoute?: string
}

export function ModuleCompletionModal({
  show,
  onClose,
  moduleId,
  moduleTitle,
  nextModuleId,
  nextModuleTitle,
  nextModuleRoute,
}: ModuleCompletionModalProps) {
  const router = useRouter()

  if (!show) return null

  const handleNextModule = () => {
    if (nextModuleId && nextModuleRoute) {
      localStorage.setItem("way2b1_active_module", nextModuleId)
      if (nextModuleId === "add-team-member") {
        localStorage.setItem("way2b1_start_team_walkthrough", "true")
      }
      router.push(nextModuleRoute)
    }
    onClose()
  }

  const handleContinue = () => {
    onClose()
  }

  return (
    <>
      {/* Confetti animation */}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#4F7CFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][
                  Math.floor(Math.random() * 5)
                ],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div className="bg-card rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in duration-500">
          <button
            onClick={handleContinue}
            className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Great job! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              You've successfully completed: <strong>{moduleTitle}</strong>
            </p>

            {/* Progress info */}
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <div className="text-sm text-muted-foreground mb-2">Onboarding Progress</div>
              <div className="text-2xl font-bold text-foreground">
                {(() => {
                  const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
                  const completed = Object.values(progress).filter(Boolean).length
                  const total = 6 // Total modules
                  return `${completed} of ${total}`
                })()}
              </div>
            </div>

            {/* Next module suggestion */}
            {nextModuleId && nextModuleTitle && nextModuleRoute && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground mb-1">Ready for the next step?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Continue with: <strong>{nextModuleTitle}</strong>
                    </p>
                    <button
                      onClick={handleNextModule}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm w-full justify-center"
                    >
                      Let's continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

