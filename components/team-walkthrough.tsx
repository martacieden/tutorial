"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

interface TeamStep {
  title: string
  content: string
  elementId: string | null
  position: "center" | "bottom" | "top" | "left" | "right"
  canSkip?: boolean
  waitForAction?: string
}

const teamSteps: TeamStep[] = [
  {
    title: "Invite Key Users",
    content:
      "Welcome! Let's invite your team members. This will help you collaborate on decisions and manage your family office workspace together.",
    elementId: null,
    position: "center",
    canSkip: false,
  },
  {
    title: "Invite Your First Team Member",
    content:
      "Click the 'Invite first user' button to add colleagues to your workspace. Team members can collaborate on decisions and access shared documents.",
    elementId: "btn-invite-first",
    position: "right",
    canSkip: true,
    waitForAction: "btn-invite-first",
  },
  {
    title: "Enter Team Member Details",
    content:
      "Enter the email address and select a role for your team member. They'll receive an invitation to join your workspace and can start collaborating immediately.",
    elementId: "input-email",
    position: "bottom",
    canSkip: true,
    waitForAction: "btn-send-invitation", // This is the final action - clicking Send Invitation completes the walkthrough
  },
]

interface TeamWalkthroughProps {
  onClose: () => void
  onStepComplete?: (stepIndex: number) => void
}

export function TeamWalkthrough({ onClose, onStepComplete }: TeamWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = teamSteps[currentStep]
  const isLastStep = currentStep === teamSteps.length - 1

  // Function to mark module as complete
  const markModuleComplete = useCallback(() => {
    const saved = localStorage.getItem("way2b1_module_progress")
    const progress = saved ? JSON.parse(saved) : {}
    progress["add-team-member"] = true
    localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
    localStorage.removeItem("way2b1_active_module")
    // Dispatch event to update progress in other components
    window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
  }, [])

  // Function to advance to next step
  const advanceToNext = useCallback(() => {
    setCurrentStep((prev) => {
      const nextIndex = prev + 1
      if (nextIndex >= teamSteps.length) {
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
      // If this is the final action (btn-send-invitation), complete the walkthrough
      if (step.waitForAction === "btn-send-invitation") {
        // Mark module as complete and close walkthrough
        markModuleComplete()
        setTimeout(() => {
          onClose()
        }, 300)
      } else {
        // Small delay to ensure action completes, then advance to next step
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
  }, [currentStep, step.waitForAction, advanceToNext, markModuleComplete, onClose])

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

    // Find if element is inside a modal (check parent elements for modal classes)
    let modalElement: HTMLElement | null = element
    let isInModal = false
    let modalRect: DOMRect | null = null

    while (modalElement && modalElement !== document.body) {
      const classList = modalElement.classList
      // Check for common modal patterns
      if (
        classList.contains("fixed") &&
        (classList.contains("inset-0") || classList.contains("bg-black/50"))
      ) {
        isInModal = true
        modalRect = modalElement.getBoundingClientRect()
        break
      }
      modalElement = modalElement.parentElement
    }

    // Tooltip positioning
    let tooltipPos: React.CSSProperties = {}

    // If element is inside a modal, position tooltip outside the modal
    if (isInModal && modalRect) {
      // Position tooltip to the right of the modal with some margin
      const margin = 24
      const viewportWidth = window.innerWidth
      const spaceOnRight = viewportWidth - modalRect.right
      const tooltipWidth = tooltipRect.width || 400 // Default width if not measured yet

      // If there's enough space on the right, put tooltip there
      if (spaceOnRight >= tooltipWidth + margin) {
        tooltipPos = {
          left: `${modalRect.right + margin}px`,
          top: `${modalRect.top + 100}px`, // Position near top of modal
          transform: "none",
          maxWidth: `${Math.min(tooltipWidth, 400)}px`,
        }
      } else {
        // If not enough space on right, position on left side
        const spaceOnLeft = modalRect.left
        if (spaceOnLeft >= tooltipWidth + margin) {
          tooltipPos = {
            right: `${viewportWidth - modalRect.left + margin}px`,
            top: `${modalRect.top + 100}px`,
            transform: "none",
            maxWidth: `${Math.min(tooltipWidth, 400)}px`,
          }
        } else {
          // Fallback: position below the modal
          tooltipPos = {
            left: `${modalRect.left + modalRect.width / 2}px`,
            top: `${modalRect.bottom + margin}px`,
            transform: "translateX(-50%)",
            maxWidth: `${Math.min(tooltipWidth, modalRect.width)}px`,
          }
        }
      }
    } else {
      // Normal positioning if not in modal
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
              Step {currentStep + 1} of {teamSteps.length}
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
            {teamSteps.map((_, i) => (
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

