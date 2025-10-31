"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Info } from "lucide-react"

interface TooltipProps {
  id: string
  content: string
  position?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
}

export function ContextualTooltip({ id, content, position = "top", children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const dismissed = localStorage.getItem(`tooltip_dismissed_${id}`)
    if (dismissed) {
      setIsDismissed(true)
    } else {
      // Show tooltip after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [id])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem(`tooltip_dismissed_${id}`, "true")
  }

  if (isDismissed) {
    return <>{children}</>
  }

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div className="relative inline-block">
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg max-w-xs relative">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-primary-foreground/70 hover:text-primary-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-2 pr-6">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
