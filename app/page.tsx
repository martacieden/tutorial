"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Dashboard } from "@/components/dashboard"
import { TutorialOverlay } from "@/components/tutorial-overlay"
import { Hotspots } from "@/components/hotspots"
import { WelcomeModal } from "@/components/welcome-modal"
import { FeedbackSurvey } from "@/components/feedback-survey"
import { RoleSelector } from "@/components/role-selector"
import { TutorialCenter } from "@/components/tutorial-center"
import { MilestoneCelebration } from "@/components/milestone-celebration"
import { AIAssistantButton } from "@/components/ai-assistant-button"
import { ModuleCompletionModal } from "@/components/module-completion-modal"
import { OnboardingTypeSelector } from "@/components/onboarding-type-selector"
import { LearnByDoingFeedback } from "@/components/learn-by-doing-feedback"

export default function Home() {
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [flowType, setFlowType] = useState<"admin" | "advisor" | null>(null)
  const [showOnboardingTypeSelector, setShowOnboardingTypeSelector] = useState(false)
  const [onboardingType, setOnboardingType] = useState<"admin1" | "admin2" | "advisor" | null>(null)
  const [showTutorialCenter, setShowTutorialCenter] = useState(false)
  const [milestone, setMilestone] = useState<any>(null)
  const [showCompletionModal, setShowCompletionModal] = useState<any>(null)

  const [tutorialActive, setTutorialActive] = useState(false)
  const [showHotspots, setShowHotspots] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [showLearnFeedback, setShowLearnFeedback] = useState<any>(null)

  // Check for module completion modal
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const checkCompletion = () => {
      const saved = localStorage.getItem("way2b1_module_progress")
      const lastCompleted = localStorage.getItem("way2b1_last_completed_module")
      
      if (saved && lastCompleted) {
        try {
          const progress = JSON.parse(saved)
          const moduleId = lastCompleted
          
          // Check if module was just completed
          if (progress[moduleId] === true) {
            // Get module info
            const moduleInfo: Record<string, { title: string; nextId?: string; nextTitle?: string; nextRoute?: string }> = {
              "org-setup": {
                title: "Create an organization",
                nextId: "add-team-member",
                nextTitle: "Invite key users",
                nextRoute: "/team",
              },
              "add-team-member": {
                title: "Invite key users",
                nextId: "setup-domains",
                nextTitle: "Create base domains",
                nextRoute: "/catalog",
              },
            }
            
            const info = moduleInfo[moduleId]
            if (info) {
              setShowCompletionModal({
                moduleId,
                moduleTitle: info.title,
                nextModuleId: info.nextId,
                nextModuleTitle: info.nextTitle,
                nextModuleRoute: info.nextRoute,
              })
              localStorage.removeItem("way2b1_last_completed_module")
            }
          }
        } catch (e) {
          console.error("Failed to parse progress", e)
        }
      }
    }
    
    checkCompletion()
    
    // Listen for progress updates
    const handleProgressUpdate = () => {
      setTimeout(checkCompletion, 500)
    }
    
    window.addEventListener("onboardingProgressUpdate", handleProgressUpdate)
    return () => {
      window.removeEventListener("onboardingProgressUpdate", handleProgressUpdate)
    }
  }, [])

  useEffect(() => {
    const SURVEY_COOLDOWN_HOURS = 24
    const canShowSurvey = () => {
      if (typeof window === "undefined") return false
      const last = localStorage.getItem("way2b1_last_survey_prompt")
      if (!last) return true
      const elapsed = Date.now() - Number(last)
      return elapsed > SURVEY_COOLDOWN_HOURS * 60 * 60 * 1000
    }
    
    // Перевіряємо збережені налаштування (тільки на клієнті)
    if (typeof window === "undefined") return
    
    const savedFlowType = localStorage.getItem("way2b1_flow_type")
    const savedRole = localStorage.getItem("way2b1_user_role")
    const hasVisited = localStorage.getItem("way2b1_visited")
    const surveyShown = localStorage.getItem("way2b1_survey_shown")

    if (savedFlowType) {
      setFlowType(savedFlowType as "admin" | "advisor")
      
      // Для демо роль встановлюється автоматично при виборі флоу
      if (savedRole) {
        setUserRole(savedRole)
        if (!hasVisited) {
          setTimeout(() => {
            setShowWelcome(true)
          }, 1000)
        } else {
          setShowHotspots(true)
          if (!surveyShown && canShowSurvey()) {
            setTimeout(() => {
              setShowSurvey(true)
              localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
            }, 30000)
          }
        }
      }
    }

    const handleMilestone = (event: CustomEvent) => {
      setMilestone(event.detail)
    }
    window.addEventListener("milestone-reached" as any, handleMilestone)
    const handleRequestFeedback = () => {
      if (canShowSurvey()) {
        setShowSurvey(true)
        localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
      }
    }
    const handleLearnByDoingFeedback = (event: CustomEvent) => {
      setShowLearnFeedback(event.detail)
    }
    window.addEventListener("requestFeedback", handleRequestFeedback)
    window.addEventListener("learnByDoingFeedback", handleLearnByDoingFeedback as any)
    return () => {
      window.removeEventListener("milestone-reached" as any, handleMilestone)
      window.removeEventListener("requestFeedback", handleRequestFeedback)
      window.removeEventListener("learnByDoingFeedback", handleLearnByDoingFeedback as any)
    }
  }, [])

  const handleOnboardingTypeSelect = (type: "admin1" | "admin2" | "advisor") => {
    setOnboardingType(type)
    setShowOnboardingTypeSelector(false)
    localStorage.setItem("way2b1_onboarding_type", type)

    // Встановлюємо flowType та роль залежно від типу onboarding
    if (type === "admin1" || type === "admin2") {
      setFlowType("admin")
      localStorage.setItem("way2b1_flow_type", "admin")
      const adminRole = "family-principal"
      setUserRole(adminRole)
      localStorage.setItem("way2b1_user_role", adminRole)
      localStorage.setItem("way2b1_user_goals", JSON.stringify(["Review and approve key decisions", "Monitor family portfolio performance"]))
    } else {
      // advisor type
      setFlowType("advisor")
      localStorage.setItem("way2b1_flow_type", "advisor")
      const advisorRole = "investment-advisor"
      setUserRole(advisorRole)
      localStorage.setItem("way2b1_user_role", advisorRole)
      localStorage.setItem("way2b1_user_goals", JSON.stringify(["Create investment decisions", "Share documents with families"]))
    }

    // Показуємо welcome modal після вибору типу onboarding
    setTimeout(() => {
      setShowWelcome(true)
    }, 500)
  }

  const handleRoleComplete = (role: string, goals: string[]) => {
    setUserRole(role)
    setShowRoleSelector(false)
    localStorage.setItem("way2b1_user_role", role)
    localStorage.setItem("way2b1_user_goals", JSON.stringify(goals))

    // Track analytics
    console.log("[v0] User role selected:", role, "Goals:", goals)

    // Show welcome modal after role selection
    setTimeout(() => {
      setShowWelcome(true)
    }, 500)
  }

  const handleStartTutorial = () => {
    setShowWelcome(false)
    setTutorialActive(true)
    setShowHotspots(false)
    console.log("[v0] Tutorial started")
  }

  const handleEndTutorial = () => {
    setTutorialActive(false)
    setShowHotspots(true)
    localStorage.setItem("way2b1_visited", "true")
    console.log("[v0] Tutorial completed")
    setTimeout(() => {
      setShowSurvey(true)
    }, 2000)
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setShowHotspots(true)
    localStorage.setItem("way2b1_visited", "true")
    console.log("[v0] Welcome flow completed")
  }

  const handleSkipTutorial = () => {
    setShowWelcome(false)
    setShowHotspots(true)
    localStorage.setItem("way2b1_visited", "true")
    console.log("[v0] Tutorial skipped")
  }

  const handleSurveySubmit = (feedback: { rating: "positive" | "negative"; comment: string }) => {
    console.log("[v0] Feedback submitted:", feedback)
    localStorage.setItem("way2b1_survey_shown", "true")
    localStorage.setItem("way2b1_feedback", JSON.stringify(feedback))
    localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
  }

  const handleSurveyClose = () => {
    setShowSurvey(false)
    localStorage.setItem("way2b1_survey_shown", "true")
    console.log("[v0] Survey closed")
    localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
  }

  const handleOpenTutorialCenter = () => {
    setShowTutorialCenter(true)
  }

  const handleStartSpecificTutorial = (tutorialId: string) => {
    setShowTutorialCenter(false)
    setTutorialActive(true)
    console.log("[v0] Starting tutorial:", tutorialId)
  }

  const handleOpenFlowSelector = () => {
    setShowOnboardingTypeSelector(true)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        onStartTutorial={handleStartTutorial} 
        onOpenTutorialCenter={handleOpenTutorialCenter}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <Dashboard />
        </main>
      </div>


      {showRoleSelector && <RoleSelector onComplete={handleRoleComplete} />}

      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} onSkip={handleSkipTutorial} />}

      {tutorialActive && <TutorialOverlay onEnd={handleEndTutorial} />}
      {showHotspots && <Hotspots />}
      {showSurvey && <FeedbackSurvey onClose={handleSurveyClose} onSubmit={handleSurveySubmit} />}

      {showTutorialCenter && (
        <TutorialCenter onClose={() => setShowTutorialCenter(false)} onStartTutorial={handleStartSpecificTutorial} />
      )}

      {milestone && <MilestoneCelebration milestone={milestone} onClose={() => setMilestone(null)} />}

      {showCompletionModal && (
        <ModuleCompletionModal
          show={true}
          onClose={() => setShowCompletionModal(null)}
          moduleId={showCompletionModal.moduleId}
          moduleTitle={showCompletionModal.moduleTitle}
          nextModuleId={showCompletionModal.nextModuleId}
          nextModuleTitle={showCompletionModal.nextModuleTitle}
          nextModuleRoute={showCompletionModal.nextModuleRoute}
        />
      )}

      <AIAssistantButton />

      {/* Learn by Doing Feedback */}
      {showLearnFeedback && (
        <LearnByDoingFeedback
          show={true}
          onClose={() => setShowLearnFeedback(null)}
          actionType={showLearnFeedback.actionType || "task"}
          isFirstAction={showLearnFeedback.isFirstAction || false}
        />
      )}
    </div>
  )
}
