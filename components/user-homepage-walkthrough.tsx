"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, ChevronLeft, ChevronRight, Search, User, ArrowRight, CheckSquare } from "lucide-react"

interface WalkthroughStep {
  id: string
  title: string
  content: string
  elementId: string | null
  position: "top" | "bottom" | "left" | "right" | "center"
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "search",
    title: "Швидкий пошук",
    content: "Тут ви можете швидко знайти будь-яку інформацію в системі. Використовуйте ⌘K для відкриття пошуку з будь-якого місця.",
    elementId: "user-search-input",
    position: "bottom",
  },
  {
    id: "profile",
    title: "Ваш профіль",
    content: "У цьому розділі ви можете керувати своїм профілем та налаштуваннями. Там також знаходяться кнопки Support та Feedback, якщо у вас є питання чи проблеми.",
    elementId: "user-profile-avatar",
    position: "bottom",
  },
  {
    id: "current-gen",
    title: "Перемикач середовища",
    content: "Ця кнопка дозволяє перемикатися між різними середовищами. (Ми її потім приберемо)",
    elementId: "user-current-gen-switch",
    position: "bottom",
  },
  {
    id: "next-tab",
    title: "Ваш робочий простір",
    content: "Тут ви знайдете всі призначені вам завдання та рішення. Це буде ваш основний робочий простір. Перейдіть до Tasks або Decisions, щоб почати роботу.",
    elementId: "sidebar-tasks-link",
    position: "right",
  },
]

interface UserHomePageWalkthroughProps {
  onComplete: () => void
  onSkip: () => void
}

export function UserHomePageWalkthrough({ onComplete, onSkip }: UserHomePageWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({})
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = walkthroughSteps[currentStep]
  const isLastStep = currentStep === walkthroughSteps.length - 1

  useEffect(() => {
    updatePositions()
    window.addEventListener("resize", updatePositions)
    return () => window.removeEventListener("resize", updatePositions)
  }, [currentStep])

  const updatePositions = () => {
    if (!step.elementId) {
      setSpotlightStyle({ display: "none" })
      setTooltipStyle({})
      return
    }

    const element = document.getElementById(step.elementId)
    if (!element || !tooltipRef.current) {
      // Якщо елемент ще не завантажився, спробуємо ще раз через невелику затримку
      setTimeout(updatePositions, 100)
      return
    }

    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const padding = 16

    // Spotlight positioning - підсвітка елемента
    setSpotlightStyle({
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      display: "block",
    })

    // Tooltip positioning - позиціонування підказки
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
      case "center":
        tooltipPos = {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }
        break
    }

    setTooltipStyle(tooltipPos)
  }

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
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
    onSkip()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip()
      } else if (e.key === "ArrowRight" && !isLastStep) {
        handleNext()
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        handlePrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, isLastStep])

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "search":
        return <Search className="w-5 h-5" />
      case "profile":
        return <User className="w-5 h-5" />
      case "current-gen":
        return <ArrowRight className="w-5 h-5" />
      case "next-tab":
        return <CheckSquare className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop з затемненням */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={handleSkip}
      />

      {/* Spotlight - підсвітка поточного елемента */}
      {step.elementId && (
        <div
          className="absolute border-4 border-blue-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none animate-pulse"
          style={spotlightStyle}
        />
      )}

      {/* Tooltip з описом */}
      <div
        ref={tooltipRef}
        className={`absolute bg-white rounded-xl shadow-2xl p-6 max-w-sm pointer-events-auto ${
          !step.elementId ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : ""
        }`}
        style={!step.elementId ? {} : tooltipStyle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
              {getStepIcon(step.id)}
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-600 mb-1">
                Крок {currentStep + 1} з {walkthroughSteps.length}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">{step.content}</p>

        {/* Індикатор прогресу */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {walkthroughSteps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? "bg-blue-500 w-8" : "bg-gray-200 w-2"
              }`}
            />
          ))}
        </div>

        {/* Кнопки навігації */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Пропустити
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {isLastStep ? "Завершити" : "Далі"}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

