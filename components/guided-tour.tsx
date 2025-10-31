"use client"

import { ReactNode, useEffect, useMemo, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export type GuidedStep = {
  id: string
  getTarget: () => HTMLElement | null
  content: ReactNode
}

export function GuidedTour({
  steps,
  open,
  initialStep = 0,
  onClose,
  totalSteps,
  currentStep,
}: {
  steps: GuidedStep[]
  open: boolean
  initialStep?: number
  onClose: () => void
  totalSteps?: number
  currentStep?: number
}) {
  const [index, setIndex] = useState(initialStep)
  const target = useMemo(() => (open ? steps[index]?.getTarget() : null), [steps, index, open])
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!target) {
      setRect(null)
      return
    }
    const r = target.getBoundingClientRect()
    setRect(r)
    // Recalculate on resize/scroll since layout can shift
    const handle = () => {
      try {
        const rr = target.getBoundingClientRect()
        setRect(rr)
      } catch {}
    }
    window.addEventListener("resize", handle)
    window.addEventListener("scroll", handle, true)
    const observer = new MutationObserver(handle)
    try { observer.observe(document.body, { childList: true, subtree: true, attributes: true }) } catch {}
    return () => {
      window.removeEventListener("resize", handle)
      window.removeEventListener("scroll", handle, true)
      observer.disconnect()
    }
  }, [target])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "Enter" || e.key === "ArrowRight") {
        setIndex((i) => (i + 1 < steps.length ? i + 1 : i))
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(0, i - 1))
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, steps.length, onClose])

  if (!open || !steps.length || !rect || rect.width === 0 || rect.height === 0) return null

  const total = totalSteps ?? steps.length
  const displayIndex = (currentStep ?? index) + 1

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Remove outline; show pulsing dot next to target */}
      {(() => {
        const dotSize = 10
        const top = Math.max(8, rect.top + rect.height / 2 - dotSize / 2)
        const left = Math.min(window.innerWidth - dotSize - 8, rect.right + 12)
        return (
          <div className="fixed pointer-events-none" style={{ top, left }}>
            <span className="absolute inline-flex rounded-full bg-[#4F7CFF]/60 opacity-75 animate-ping" style={{ width: dotSize, height: dotSize }} />
            <span className="relative inline-flex rounded-full bg-[#4F7CFF] shadow-md" style={{ width: dotSize, height: dotSize }} />
          </div>
        )
      })()}

      {/* Tooltip - dark coachmark placed near trigger with smart placement */}
      {(() => {
        const tooltipWidth = 340
        const preferRight = rect.right + 12 + tooltipWidth <= window.innerWidth - 16
        const left = preferRight ? rect.right + 12 : Math.max(rect.left, 16)
        const top = preferRight ? Math.max(16, rect.top) : Math.min(rect.bottom + 12, window.innerHeight - 180)
        return (
          <div className="fixed pointer-events-auto" style={{ top, left }}>
            <div className="relative bg-gray-900 text-white rounded-xl shadow-2xl w-[340px] p-4">
              {/* Arrow */}
              {preferRight ? (
                <div className="absolute left-[-6px] top-6 w-3 h-3 bg-gray-900 rotate-45" />
              ) : (
                <div className="absolute left-6 top-[-6px] w-3 h-3 bg-gray-900 rotate-45" />
              )}
          {/* Step label removed as requested */}
              {(() => {
                const active = steps[index] ?? steps[0]
                if (!active) return null
                return (
                  <div className="flex items-start justify-between gap-4 pr-1">
                    <div className="text-sm leading-relaxed">{active.content}</div>
                  </div>
                )
              })()}
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  className="px-3 py-1.5 text-xs rounded border border-white/20 text-white/90 hover:bg-white/10 disabled:opacity-40"
                  disabled={index === 0}
                >
                  <ChevronLeft className="w-4 h-4 inline -mt-0.5" /> Back
                </button>
                <div className="text-xs text-white/60">{displayIndex} of {total}</div>
                <button
                  onClick={() => (index + 1 < total ? setIndex(index + 1) : onClose())}
                  className="px-3 py-1.5 text-xs rounded bg-[#4F7CFF] text-white hover:bg-[#4F7CFF]/90"
                >
                  {index + 1 < total ? (
                    <>Next <ChevronRight className="w-4 h-4 inline -mt-0.5" /></>
                  ) : (
                    <>Done</>
                  )}
                </button>
              </div>
              {/* Skip control removed as requested */}
            </div>
          </div>
        )
      })()}

      {/* removed corner dot */}
    </div>
  )
}


