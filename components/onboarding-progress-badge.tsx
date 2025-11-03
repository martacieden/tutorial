"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CheckCircle2, Circle, ChevronDown, Workflow, Users, FileText, Shield, Building2, FolderTree, ClipboardList, PlugZap } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Module {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  route: string
  buttonLabel: string
}

const DEFAULT_MODULES: Module[] = [
  {
    id: "setup-domains",
    title: "Create base category",
    description: "Categories in domains, decisions, tasks",
    icon: <FolderTree className="w-4 h-4" />,
    completed: false,
    route: "/decisions",
    buttonLabel: "Create category",
  },
  {
    id: "create-teams",
    title: "Create teams",
    description: "Set up team structure and groups",
    icon: <Users className="w-4 h-4" />,
    completed: false,
    route: "/team",
    buttonLabel: "Create teams",
  },
  {
    id: "add-demo-items",
    title: "Add demo items",
    description: "1 decision, 1 task, 1 property, 1 document",
    icon: <ClipboardList className="w-4 h-4" />,
    completed: false,
    route: "/decisions",
    buttonLabel: "Create samples",
  },
  {
    id: "connect-integrations",
    title: "Connect integrations",
    description: "Bill.com, QuickBooks, Drive/OneDrive, Calendar",
    icon: <PlugZap className="w-4 h-4" />,
    completed: false,
    route: "/resources",
    buttonLabel: "Open integrations",
  },
  {
    id: "add-team-member",
    title: "Invite key users",
    description: "CEO/Principal, CFO/Accountant, Ops Manager, EA",
    icon: <Users className="w-4 h-4" />,
    completed: false,
    route: "/team",
    buttonLabel: "Invite team",
  },
  {
    id: "configure-compliance",
    title: "Set up compliance tracking",
    description: "Enable audit trail and reporting",
    icon: <Shield className="w-4 h-4" />,
    completed: false,
    route: "/compliance",
    buttonLabel: "Get Started",
  },
]

export function OnboardingProgressBadge() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [modules, setModules] = useState<Module[]>(DEFAULT_MODULES)
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [flowType, setFlowType] = useState<string | null>(null)

  // Отримуємо роль користувача та тип флоу
  useEffect(() => {
    const savedRole = localStorage.getItem("way2b1_user_role")
    const savedFlowType = localStorage.getItem("way2b1_flow_type")
    setUserRole(savedRole)
    setFlowType(savedFlowType)
  }, [])

  // Role-aware модулі: фільтруємо модулі залежно від ролі та флоу
  const getFilteredModules = (allModules: Module[], currentRole: string | null, currentFlowType: string | null): Module[] => {
    if (!currentRole) return allModules

    // Для Advisor флоу - обмежений онбординг
    if (currentFlowType === "advisor") {
      return allModules.filter(
        (m) => m.id === "add-demo-items" || m.id === "setup-domains"
      )
    }

    // Admin флоу - повний онбординг для Family Principal та Operations Manager
    if (currentRole === "family-principal" || currentRole === "operations-manager") {
      return allModules
    }

    // Investment Advisor в Admin флоу також бачить повний онбординг
    if (currentRole === "investment-advisor" && currentFlowType === "admin") {
      return allModules
    }

    // Vendor/Guest: тільки основні модулі
    if (currentRole === "team-collaborator" || currentRole === "other") {
      return allModules.filter(
        (m) => m.id === "add-demo-items" || m.id === "setup-domains"
      )
    }

    // Compliance Officer: модулі пов'язані з комплаєнсом
    if (currentRole === "compliance-officer") {
      return allModules.filter(
        (m) => m.id === "add-demo-items" || m.id === "configure-compliance"
      )
    }

    return allModules
  }

  useEffect(() => {
    const updateProgress = () => {
      const saved = localStorage.getItem("way2b1_module_progress")

      const allModules: Module[] = DEFAULT_MODULES.map((module) => ({
        ...module,
        completed: saved ? JSON.parse(saved)[module.id] || false : false,
      }))

      // Фільтруємо модулі за роллю та флоу
      const filteredModules = getFilteredModules(allModules, userRole, flowType)

      setModules(filteredModules)

      const completed = filteredModules.filter((m) => m.completed).length
      const total = filteredModules.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      setProgress(percentage)
      setIsComplete(percentage === 100 && total > 0)
    }

    updateProgress()

    window.addEventListener("onboardingProgressUpdate", updateProgress)
    window.addEventListener("storage", updateProgress)

    return () => {
      window.removeEventListener("onboardingProgressUpdate", updateProgress)
      window.removeEventListener("storage", updateProgress)
    }
  }, [userRole, flowType])

  const handleModuleClick = (module: Module) => {
    if (!module.completed) {
      localStorage.setItem("way2b1_active_module", module.id)
      router.push(module.route)
      setIsOpen(false)
    }
  }

  if (isComplete) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span className="text-xs font-medium text-emerald-700">Setup Complete</span>
      </div>
    )
  }

  const completedCount = modules.filter((m) => m.completed).length
  const totalCount = modules.length
  const remainingCount = totalCount - completedCount

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors cursor-pointer">
          <span className="text-xs font-medium text-blue-700">
            {progress === 0 ? "Get Started" : `Onboarding ${progress}%`}
          </span>
          <ChevronDown className="w-3 h-3 text-blue-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-base text-foreground">Let's set up your workspace</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                {remainingCount === 0 ? "All done!" : `${remainingCount} step${remainingCount > 1 ? "s" : ""} left`}
              </p>
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-2">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg transition-colors ${
                module.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {module.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-blue-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      module.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {module.title}
                  </div>
                </div>
              </div>

              {!module.completed && (
                <Button
                  onClick={() => handleModuleClick(module)}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 h-8 text-xs font-medium border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  {module.buttonLabel}
                </Button>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
