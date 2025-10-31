"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

interface OrganizationStep {
  title: string
  content: string
  elementId: string | null
  position: "center" | "bottom" | "top" | "left" | "right"
  canSkip?: boolean // Whether this step can be skipped
  waitForAction?: string // Element ID to wait for user action
}

const organizationSteps: OrganizationStep[] = [
  {
    title: "Let's Start!",
    content:
      "Welcome! Let's set up your organization. We'll start with the basics - adding a logo and configuring your organization information. Click 'Edit details' to get started.",
    elementId: "btn-edit",
    position: "bottom",
    canSkip: false,
    waitForAction: "btn-edit", // Wait for Edit button click - opens modal
  },
  {
    title: "Upload Organization Logo",
    content:
      "Click the 'Upload photo' button to add a logo for your organization. You can also change the organization name and sub-organization naming here.",
    elementId: "btn-upload-photo",
    position: "bottom",
    canSkip: true,
    waitForAction: "btn-upload-photo", // Wait for Upload photo button click
  },
  {
    title: "Create Sub-organization",
    content:
      "You can create separate workspaces for departments, teams, or clients. Each sub-organization will have independent permissions and data.",
    elementId: "btn-new-org",
    position: "top",
    canSkip: true,
    waitForAction: "btn-new-org", // Wait for New organization button click
  },
  {
    title: "Save Your Changes",
    content:
      "Great! You've set up your organization information. Click 'Save' to apply your changes and complete the setup.",
    elementId: "btn-save-org",
    position: "top",
    canSkip: false,
    waitForAction: "btn-save-org", // Wait for Save button click
  },
]

interface OrganizationWalkthroughProps {
  onClose: () => void
  onStepComplete?: (stepIndex: number) => void // Callback when step action is completed
}

export function OrganizationWalkthrough({ onClose, onStepComplete, onComplete }: OrganizationWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = organizationSteps[currentStep]
  const isLastStep = currentStep === organizationSteps.length - 1

  // Function to mark module as complete
  const markModuleComplete = useCallback(() => {
    const saved = localStorage.getItem("way2b1_module_progress")
    const progress = saved ? JSON.parse(saved) : {}
    progress["org-setup"] = true
    localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
    localStorage.setItem("way2b1_last_completed_module", "org-setup")
    localStorage.removeItem("way2b1_active_module")
    // Dispatch event to update progress in other components
    window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
  }, [])

  // Function to advance to next step
  const advanceToNext = useCallback(() => {
    setCurrentStep((prev) => {
      const nextIndex = prev + 1
      if (nextIndex >= organizationSteps.length) {
        // Mark module as complete when walkthrough finishes
        markModuleComplete()
        onClose()
        return prev
      }
      
      if (onStepComplete) {
        onStepComplete(prev)
      }
      
      return nextIndex
    })
  }, [onClose, onStepComplete, markModuleComplete])

  useEffect(() => {
    updatePositions()
    window.addEventListener("resize", updatePositions)
    window.addEventListener("scroll", updatePositions, true)
    return () => {
      window.removeEventListener("resize", updatePositions)
      window.removeEventListener("scroll", updatePositions, true)
    }
  }, [currentStep])

  // Add visual highlighting for elements
  useEffect(() => {
    if (step.elementId) {
      const element = document.getElementById(step.elementId)
      if (element) {
        // Add highlight class
        element.classList.add("walkthrough-highlight")
        return () => {
          // Remove highlight when step changes
          element.classList.remove("walkthrough-highlight")
        }
      }
    }
  }, [currentStep, step.elementId])

  // Listen for user actions to auto-advance steps
  useEffect(() => {
    if (!step.waitForAction) return

    const handleAction = () => {
      // If clicking Save button, complete the walkthrough
      if (step.waitForAction === "btn-save-org") {
        // Mark module as complete
        markModuleComplete()
        // Close walkthrough first
        onClose()
        // Navigate to dashboard after short delay
        setTimeout(() => {
          window.location.href = "/"
        }, 500)
        return
      }

      // If clicking Edit button, wait for modal to open before advancing
      if (step.waitForAction === "btn-edit") {
        // Wait for modal to render, then advance
        setTimeout(() => {
          // Check if modal is actually open
          const modal = document.querySelector('[class*="fixed inset-0 bg-black/50"]')
          if (modal) {
            advanceToNext()
          }
        }, 500) // Longer delay for modal to fully render
      } else {
        // For other actions, shorter delay
        setTimeout(() => {
          advanceToNext()
        }, 300)
      }
    }

    // Listen for clicks on the target element
    const targetElement = document.getElementById(step.waitForAction)
    if (targetElement) {
      targetElement.addEventListener("click", handleAction, { once: true })
      return () => {
        targetElement.removeEventListener("click", handleAction)
      }
    }
  }, [currentStep, step.waitForAction, advanceToNext, onComplete, markModuleComplete, onClose])

  const updatePositions = () => {
    if (!step.elementId) {
      setTooltipStyle({})
      return
    }

    const element = document.getElementById(step.elementId)
    if (!element || !tooltipRef.current) {
      return
    }

    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    // Tooltip positioning without spotlight
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
    advanceToNext()
  }

  const handleSkipStep = () => {
    advanceToNext()
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    // Don't mark as complete if user skips the walkthrough
    onClose()
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
    <div className="organization-walkthrough-overlay">
      {/* Hotspot indicator for target element - show on waitForAction element */}
      {step.waitForAction && (
        <WalkthroughHotspot elementId={step.waitForAction} />
      )}

      {/* Tooltip with instruction only */}
      <div
        ref={tooltipRef}
        className={`organization-walkthrough-tooltip ${!step.elementId ? "center" : ""}`}
        style={!step.elementId ? {} : tooltipStyle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-sm font-medium text-primary mb-2">
              Step {currentStep + 1} of {organizationSteps.length}
            </div>
            <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
          </div>
          <button onClick={handleSkip} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-muted-foreground leading-relaxed">{step.content}</p>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          {/* Progress dots - show for all steps */}
          <div className="flex gap-1.5">
            {organizationSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? "bg-primary w-6" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {/* Previous button - show if not first step */}
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            {/* Skip button - show for interactive steps that can be skipped */}
            {step.waitForAction && step.canSkip && (
              <button
                onClick={handleSkipStep}
                className="px-4 py-2 bg-transparent hover:bg-secondary/50 text-muted-foreground rounded-lg font-medium transition-colors"
              >
                Skip
              </button>
            )}

            {/* Next/Finish button - show for steps without waitForAction (welcome/final) */}
            {!step.waitForAction && (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
              >
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hotspot component for highlighting clickable elements
function WalkthroughHotspot({ elementId }: { elementId: string }) {
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null)

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(elementId)
      if (element) {
        const rect = element.getBoundingClientRect()
        setPosition({
          top: rect.top + rect.height / 2 - 12,
          left: rect.right + 8,
          width: rect.width,
          height: rect.height,
        })
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    // Check periodically in case element appears later
    const interval = setInterval(updatePosition, 100)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
      clearInterval(interval)
    }
  }, [elementId])

  if (!position) return null

  return (
    <div
      className="fixed pointer-events-none z-[10000]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <span className="absolute inline-flex rounded-full bg-primary/60 opacity-75 animate-ping" style={{ width: 24, height: 24 }} />
      <span className="relative inline-flex rounded-full bg-primary shadow-md border-2 border-white" style={{ width: 24, height: 24 }}>
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">!</span>
      </span>
    </div>
  )
}

