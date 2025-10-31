"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Sparkles, Search, BarChart3, Settings } from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const features: Record<string, Feature> = {
  navigation: {
    id: "navigation",
    title: "Smart Navigation",
    description:
      "Quickly switch between different sections of your workspace. Everything is organized for maximum efficiency.",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  search: {
    id: "search",
    title: "Powerful Search",
    description: "Find anything instantly with our smart search. Use ⌘K to open search from anywhere in the app.",
    icon: <Search className="w-5 h-5" />,
  },
  create: {
    id: "create",
    title: "Tutorial Guide",
    description: "Complete the onboarding checklist to get started with Way2B1. Follow the steps to set up your family office workspace.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  aiAssistant: {
    id: "aiAssistant",
    title: "AI Assistant",
    description: "Get instant help from our AI assistant. Ask questions, get guidance, and discover features powered by artificial intelligence.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  settings: {
    id: "settings",
    title: "Customize Everything",
    description: "Personalize your workspace with themes, notifications, and workflow preferences.",
    icon: <Settings className="w-5 h-5" />,
  },
}

export function Hotspots() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [hiddenHotspots, setHiddenHotspots] = useState<Set<string>>(new Set())
  const [showSearchHint, setShowSearchHint] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Отримуємо роль користувача
  useEffect(() => {
    const savedRole = localStorage.getItem("way2b1_user_role")
    setUserRole(savedRole)
  }, [])

  // Перевіряємо тип флоу для демо
  const flowType = localStorage.getItem("way2b1_flow_type")

  // Role-aware hotspots: різні hotspots для різних ролей та флоу
  const getHotspots = () => {
    // Advisor флоу - обмежені hotspots
    if (flowType === "advisor") {
      return [
        { id: "nav", feature: "navigation", left: "40px", top: "200px" },
        { id: "search", feature: "search", left: "180px", top: "32px" },
      ]
    }

    // Admin флоу - повний набір hotspots (без navigation)
    if (userRole === "family-principal" || userRole === "operations-manager") {
      return [
        // Search hotspot - вказує на поле пошуку в topbar (80px sidebar + gap + search)
        { id: "search", feature: "search", left: "180px", top: "32px" },
        // Create hotspot - вказує на кнопку Onboarding в topbar справа
        { id: "create", feature: "create", right: "280px", top: "32px" },
        // Settings hotspot - вказує на аватар справа
        { id: "settings", feature: "settings", right: "24px", top: "32px" },
        // AI Assistant hotspot - вказує на кнопку AI Assistant внизу справа
        { id: "aiAssistant", feature: "aiAssistant", right: "24px", bottom: "80px" },
      ]
    }
    
    // Vendor/Guest: тільки основні hotspots
    if (userRole === "team-collaborator" || userRole === "other") {
      return [
        { id: "nav", feature: "navigation", left: "40px", top: "200px" },
        { id: "search", feature: "search", left: "180px", top: "32px" },
      ]
    }

    // За замовчуванням показуємо для Admin флоу (без navigation)
    return [
      { id: "search", feature: "search", left: "180px", top: "32px" },
      { id: "create", feature: "create", right: "280px", top: "32px" },
      { id: "settings", feature: "settings", right: "24px", top: "32px" },
      { id: "aiAssistant", feature: "aiAssistant", right: "24px", bottom: "80px" },
    ]
  }

  const hotspots = getHotspots()

  const handleHotspotClick = (featureId: string, hotspotId: string) => {
    setActiveFeature(featureId)
    setHiddenHotspots((prev) => new Set([...prev, hotspotId]))
  }

  const handleCloseFeature = () => {
    setActiveFeature(null)
  }

  // Приховуємо підказку пошуку через 5 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSearchHint(false)
    }, 5000)

    // Очищаємо таймер при розмонтуванні компонента
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* Hotspots */}
      {hotspots.map(
        (hotspot) =>
          !hiddenHotspots.has(hotspot.id) && (
            <button
              key={hotspot.id}
              className="hotspot"
              style={{
                left: hotspot.left,
                right: hotspot.right,
                top: hotspot.top,
                bottom: hotspot.bottom,
              }}
              onClick={() => handleHotspotClick(hotspot.feature, hotspot.id)}
            >
              ?
            </button>
          ),
      )}

      {/* Feature Cards */}
      {activeFeature && (
        <div
          className="feature-card show"
          style={{
            ...(activeFeature === "navigation" 
              ? { left: "100px", top: "200px" }
              : activeFeature === "search"
              ? { left: "180px", top: "64px" }
              : activeFeature === "aiAssistant"
              ? { right: "24px", bottom: "80px" }
              : { right: activeFeature === "settings" ? "24px" : "280px", top: "64px" }
            ),
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              {features[activeFeature].icon}
            </div>
            <button onClick={handleCloseFeature} className="p-1 hover:bg-secondary rounded transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <h4 className="font-semibold text-foreground mb-2">{features[activeFeature].title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{features[activeFeature].description}</p>
        </div>
      )}

      {/* Search Hint */}
      {showSearchHint && (
        <div
          className="search-hint fixed bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-[999]"
          style={{ left: "180px", top: "64px" }}
        >
          💡 Press ⌘K to search anytime!
        </div>
      )}
    </>
  )
}
