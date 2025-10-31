"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { CheckCircle2, Circle, Users, FileText, Workflow, Shield, ChevronRight, Clock, Sparkles, Building2, FolderTree, ClipboardList, PlugZap } from "lucide-react"

interface Module {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  emptyStateTitle: string
  emptyStateDescription: string
  actionLabel: string
  route: string
  estimatedTime: string
}

function ProgressAnimation({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="animate-in zoom-in fade-in duration-500">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          <span className="text-xl font-bold">+20% Progress!</span>
        </div>
      </div>
    </div>
  )
}

function CompletionModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (show) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!show) return null

  const handleGoToResources = () => {
    onClose()
    router.push("/resources")
  }

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#4F7CFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][
                    Math.floor(Math.random() * 5)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You completed onboarding!</h2>
            <p className="text-gray-600 mb-6">Welcome to Way2B1. Your multi-family office workspace is ready.</p>
            <button
              onClick={handleGoToResources}
              className="bg-[#4F7CFF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4F7CFF]/90 transition-colors w-full"
            >
              Go to Resources & Guides
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function ModuleChecklist() {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([
    {
      id: "org-setup",
      title: "Create an organization",
      description: "Name, type, timezone, currency, language, branding",
      icon: <Building2 className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No organization configured",
      emptyStateDescription: "Set up the foundation for your workspace: organization profile and branding",
      actionLabel: "Open settings",
      route: "/more/organization",
      estimatedTime: "3 min",
    },
    {
      id: "add-team-member",
      title: "Invite key users",
      description: "CEO/Principal, CFO/Accountant, Ops Manager, EA",
      icon: <Users className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No teammates invited",
      emptyStateDescription: "Invite the core team so you can assign roles and approvals",
      actionLabel: "Invite team",
      route: "/team",
      estimatedTime: "2 min",
    },
    {
      id: "setup-domains",
      title: "Create base domains",
      description: "Properties, Vehicles, Financial/Bank Accounts, Legal/Documents",
      icon: <FolderTree className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No domain structure",
      emptyStateDescription: "Create folders/categories to organize assets and documents",
      actionLabel: "Open catalog",
      route: "/catalog",
      estimatedTime: "3 min",
    },
    {
      id: "add-demo-items",
      title: "Add demo items",
      description: "1 decision, 1 task, 1 property, 1 document",
      icon: <ClipboardList className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No demo content",
      emptyStateDescription: "Create a sample decision and task, add a property and a key document",
      actionLabel: "Create samples",
      route: "/decisions",
      estimatedTime: "4 min",
    },
    {
      id: "connect-integrations",
      title: "Connect integrations",
      description: "Bill.com, QuickBooks, Drive/OneDrive, Calendar",
      icon: <PlugZap className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No integrations connected",
      emptyStateDescription: "Connect finance, storage and calendar tools to streamline workflows",
      actionLabel: "Open integrations",
      route: "/resources",
      estimatedTime: "3 min",
    },
    {
      id: "configure-compliance",
      title: "Set up compliance tracking",
      description: "Enable audit trail and regulatory reporting",
      icon: <Shield className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "Compliance not configured",
      emptyStateDescription: "Enable compliance tracking to keep audit logs and generate reports",
      actionLabel: "Get started",
      route: "/compliance",
      estimatedTime: "2 min",
    },
  ])

  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [showProgressAnimation, setShowProgressAnimation] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [checklistHidden, setChecklistHidden] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("way2b1_module_progress")
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        setModules((prev) =>
          prev.map((module) => ({
            ...module,
            completed: progress[module.id] || false,
          })),
        )
      } catch (e) {
        console.error("Failed to load module progress", e)
      }
    }
  }, [])

  useEffect(() => {
    const completedCount = modules.filter((m) => m.completed).length
    const totalCount = modules.length

    if (completedCount === totalCount && completedCount > 0) {
      // Always show modal when all completed (even if seen before)
      setTimeout(() => {
        setShowCompletionModal(true)
        localStorage.setItem("way2b1_onboarding_completed", "true")
      }, 500)
    }
  }, [modules])

  const toggleModule = (moduleId: string) => {
    setModules((prev) => {
      const updated = prev.map((module) =>
        module.id === moduleId ? { ...module, completed: !module.completed } : module,
      )

      const progress = updated.reduce(
        (acc, module) => ({
          ...acc,
          [module.id]: module.completed,
        }),
        {},
      )
      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))

      // Dispatch custom event to notify OnboardingProgressBadge (defer to avoid setState during render)
      setTimeout(() => window.dispatchEvent(new CustomEvent("onboardingProgressUpdate")), 0)

      const wasCompleted = prev.find((m) => m.id === moduleId)?.completed
      const isNowCompleted = updated.find((m) => m.id === moduleId)?.completed
      if (!wasCompleted && isNowCompleted) {
        setShowProgressAnimation(true)
        setTimeout(() => setShowProgressAnimation(false), 2000)
      }

      return updated
    })
  }

  const handleModuleClick = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId)
  }

  const handleActionClick = (route: string, moduleId: string) => {
    localStorage.setItem("way2b1_active_module", moduleId)
    if (moduleId === "create-category") {
      try {
        localStorage.setItem("way2b1_start_category_flow", "true")
      } catch {}
    }
    if (moduleId === "org-setup") {
      // Start walkthrough directly
      localStorage.setItem("way2b1_start_org_walkthrough", "true")
      router.push("/more/organization")
      return
    }
    if (moduleId === "add-team-member") {
      // Start walkthrough directly
      localStorage.setItem("way2b1_start_team_walkthrough", "true")
      router.push("/team")
      return
    }
    if (moduleId === "setup-domains") {
      // Start hints for catalog page
      localStorage.setItem("way2b1_start_domains_walkthrough", "true")
      router.push("/catalog")
      return
    }
    router.push(route)
  }

  const completedCount = modules.filter((m) => m.completed).length
  const totalCount = modules.length
  const progress = (completedCount / totalCount) * 100
  const allCompleted = completedCount === totalCount && totalCount > 0

  // Hide checklist after completion modal is shown and closed
  if (checklistHidden || (allCompleted && localStorage.getItem("way2b1_onboarding_completed") === "true" && !showCompletionModal)) {
    return (
      <>
        <ProgressAnimation show={showProgressAnimation} />
      </>
    )
  }

  return (
    <>
      <ProgressAnimation show={showProgressAnimation} />

      <CompletionModal show={showCompletionModal} onClose={() => {
        setShowCompletionModal(false)
        setChecklistHidden(true)
      }} />

      <div className="bg-card rounded-xl p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">Family Office Setup</h3>
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {completedCount} of {totalCount}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {modules.map((module) => (
            <div key={module.id} className="border border-border rounded-lg overflow-hidden transition-all">
              <div
                className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => handleModuleClick(module.id)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleModule(module.id)
                  }}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                >
                  {module.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </button>

                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {module.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium ${module.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {module.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{module.description}</div>
                </div>

                {!module.completed && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                    <Clock className="w-3.5 h-3.5" />
                    {module.estimatedTime}
                  </div>
                )}

                <ChevronRight
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedModule === module.id ? "rotate-90" : ""
                  }`}
                />
              </div>

              {expandedModule === module.id && !module.completed && (
                <div className="border-t border-border bg-secondary/30 p-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col items-center text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                      {module.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{module.emptyStateTitle}</h4>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{module.emptyStateDescription}</p>
                    <button
                      onClick={() => handleActionClick(module.route, module.id)}
                      className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      {module.actionLabel}
                    </button>
                  </div>
                </div>
              )}

              {expandedModule === module.id && module.completed && (
                <div className="border-t border-border bg-accent/5 p-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-center gap-2 text-accent">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Task completed!</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {allCompleted && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎉</div>
              <div>
                <div className="font-semibold text-emerald-900">Congratulations!</div>
                <div className="text-sm text-emerald-700">Your multi-family collaboration workspace is ready</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
