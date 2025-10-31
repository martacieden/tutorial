"use client"

import { useState, useEffect } from "react"

interface HintElement {
  elementId: string
  label?: string // Optional label for the hint
}

export function CatalogHints() {
  const [showHints, setShowHints] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    // Check if we should show hints (from localStorage or module checklist)
    const shouldShow = localStorage.getItem("way2b1_show_catalog_hints") === "true"
    setShowHints(shouldShow)

    // Listen for modal open/close
    const checkModal = () => {
      const modal = document.querySelector('[class*="fixed inset-0 bg-black/50"]')
      setModalOpen(!!modal)
    }

    const interval = setInterval(checkModal, 100)

    return () => clearInterval(interval)
  }, [])

  if (!showHints) return null

  // Elements to highlight based on modal state
  const hintsToShow: HintElement[] = []

  if (!modalOpen) {
    // Show hint on "Create collection" button
    hintsToShow.push({ elementId: "btn-create-collection" })
    hintsToShow.push({ elementId: "btn-create-collection-empty" })
  } else {
    // Show hints in modal: Attachments and Gallery
    hintsToShow.push({ elementId: "btn-attachments", label: "Upload documents here" })
    hintsToShow.push({ elementId: "btn-gallery", label: "Add images and files" })
  }

  return (
    <>
      {hintsToShow.map((hint) => (
        <HintHotspot key={hint.elementId} elementId={hint.elementId} label={hint.label} />
      ))}
    </>
  )
}

// Hotspot component for individual hints
function HintHotspot({ elementId, label }: { elementId: string; label?: string }) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(elementId)
      if (element) {
        const rect = element.getBoundingClientRect()
        setPosition({
          top: rect.top + rect.height / 2 - 12,
          left: rect.right + 8,
        })
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    // Check periodically in case element appears later (e.g., modal opens)
    const interval = setInterval(updatePosition, 100)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
      clearInterval(interval)
    }
  }, [elementId])

  if (!isVisible || !position) return null

  return (
    <div
      className="fixed pointer-events-none z-[10000]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Pulsing indicator */}
      <span className="absolute inline-flex rounded-full bg-blue-500/60 opacity-75 animate-ping" style={{ width: 24, height: 24 }} />
      <span className="relative inline-flex rounded-full bg-blue-500 shadow-md border-2 border-white" style={{ width: 24, height: 24 }}>
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">!</span>
      </span>

      {/* Optional label tooltip */}
      {label && (
        <div
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm text-foreground whitespace-nowrap pointer-events-auto"
          style={{ maxWidth: "200px" }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

