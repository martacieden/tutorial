"use client"

import { useState } from "react"
import { X, ArrowRight, CheckCircle2, Clock } from "lucide-react"

interface WelcomeModalProps {
  onComplete: () => void
  onSkip: () => void
}

export function WelcomeModal({ onComplete, onSkip }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Way2B1!",
      description: "Way2B1 helps your team make better decisions faster. Let's take a quick tour of the key features.",
      icon: "🎯",
      time: "30 sec",
    },
    {
      title: "Modules and Tasks",
      description:
        "We've created an onboarding checklist for you. Complete these tasks to set up your workspace and start working with your team.",
      icon: "✅",
      time: "1 min",
    },
    {
      title: "Track Decisions",
      description:
        "Create decisions to document important team choices. Track status, priorities, and outcomes all in one place.",
      icon: "📋",
      time: "45 sec",
    },
    {
      title: "Collaborate with Team",
      description:
        "Invite team members, assign tasks, and work together on decision-making. All changes sync in real-time.",
      icon: "👥",
      time: "1 min",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl p-8 max-w-lg mx-4 shadow-2xl animate-in zoom-in duration-300 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentStepData.icon}</div>
          <h2 className="text-2xl font-bold mb-3 text-foreground text-balance">{currentStepData.title}</h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">{currentStepData.description}</p>
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-3">
            <Clock className="w-4 h-4" />
            <span>{currentStepData.time}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Skip link */}
        {!isLastStep && (
          <button
            onClick={onSkip}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  )
}
