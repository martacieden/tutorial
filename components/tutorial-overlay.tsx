"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface TutorialStep {
  title: string
  content: string
  element: string | null
  position: "center" | "bottom" | "top" | "left" | "right"
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Way2B1",
    content: "Let's take a quick tour to help you get the most out of Way2B1. This will only take 2 minutes!",
    element: null,
    position: "center",
  },
  {
    title: "Your Dashboard",
    content:
      "This is your command center. See all your pending decisions, active tasks, and important metrics at a glance.",
    element: "statsGrid",
    position: "bottom",
  },
  {
    title: "Recent Decisions",
    content: "Track all your business decisions here. See what needs your attention and what has been approved.",
    element: "recentDecisions",
    position: "top",
  },
  {
    title: "Task Management",
    content: "Stay on top of your tasks with due dates and priorities. Check them off as you complete them.",
    element: "upcomingTasks",
    position: "top",
  },
  {
    title: "Quick Search",
    content: "Use the search bar or press ⌘K to quickly find anything in your workspace.",
    element: "searchBar",
    position: "bottom",
  },
  {
    title: "Create New Items",
    content: "Click here to quickly create new decisions, tasks, or projects.",
    element: "createButton",
    position: "bottom",
  },
  {
    title: "Navigation",
    content: "Access all your tools from the sidebar. Switch between Decisions, Tasks, Domains, and more.",
    element: "navigation",
    position: "right",
  },
  {
    title: "You're All Set!",
    content: "Explore the interactive hotspots to learn more about specific features. Press ⌘K anytime to search!",
    element: null,
    position: "center",
  },
]

interface TutorialOverlayProps {
  onEnd: () => void
}

export function TutorialOverlay({ onEnd }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({})
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  useEffect(() => {
    updatePositions()
    window.addEventListener("resize", updatePositions)
    return () => window.removeEventListener("resize", updatePositions)
  }, [currentStep])

  const updatePositions = () => {
    if (!step.element) {
      setSpotlightStyle({ display: "none" })
      setTooltipStyle({})
      return
    }

    const element = document.getElementById(step.element)
    if (!element || !tooltipRef.current) return

    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const padding = 16

    // Spotlight positioning
    setSpotlightStyle({
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      display: "block",
    })

    // Tooltip positioning
    let tooltipPos: React.CSSProperties = {}

    switch (step.position) {
      case "bottom":
        tooltipPos = {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.bottom + 24}px`,
          transform: "translateX(-50%)",
        }
        break
      case "top":
        tooltipPos = {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.top - tooltipRect.height - 24}px`,
          transform: "translateX(-50%)",
        }
        break
      case "left":
        tooltipPos = {
          left: `${rect.left - tooltipRect.width - 24}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: "translateY(-50%)",
        }
        break
      case "right":
        tooltipPos = {
          left: `${rect.right + 24}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: "translateY(-50%)",
        }
        break
    }

    setTooltipStyle(tooltipPos)
  }

  const handleNext = () => {
    if (isLastStep) {
      onEnd()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    onEnd()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="tutorial-overlay active">
      <div className="tutorial-backdrop" onClick={handleSkip} />

      {step.element && <div className="tutorial-spotlight pulse" style={spotlightStyle} />}

      <div
        ref={tooltipRef}
        className={`tutorial-tooltip ${!step.element ? "center" : ""}`}
        style={!step.element ? {} : tooltipStyle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-sm font-medium text-primary mb-2">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
            <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
          </div>
          <button onClick={handleSkip} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-6">{step.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? "bg-primary w-6" : "bg-border"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
