"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { CheckCircle2, Sparkles, ArrowRight, X, Lightbulb } from "lucide-react"

// Контекстні підказки для кожного модуля
const moduleTooltips: Record<string, { title: string; description: string; action?: string }> = {
  "org-setup": {
    title: "Налаштуйте вашу організацію",
    description: "Встановіть назву, часовий пояс, валюту та інші базові налаштування. Це займе 2 хвилини.",
    action: "Відкрити налаштування",
  },
  "add-team-member": {
    title: "Додайте першого члена команди",
    description: "Запросіть ключових користувачів: CEO, CFO, менеджера операцій. Ви можете додати більше пізніше.",
    action: "Запросити команду",
  },
  "setup-domains": {
    title: "Створіть базові домени",
    description: "Домени допомагають організувати ваші рішення. Почніть з основних: Properties, Vehicles, Financial.",
    action: "Відкрити каталог",
  },
  "add-demo-items": {
    title: "Ваше перше рішення вже створено!",
    description: "Ми автоматично створли приклад рішення для вас. Перевірте його та дізнайтесь, як працюють workflows.",
    action: "Переглянути рішення",
  },
  "connect-integrations": {
    title: "Підключіть інтеграції",
    description: "Підключіть ваші улюблені інструменти: Bill.com, QuickBooks, Google Drive. Це спростить роботу.",
    action: "Відкрити інтеграції",
  },
  "configure-compliance": {
    title: "Налаштуйте комплаєнс",
    description: "Увімкніть аудит-трейл та звітність. Це важливо для дотримання нормативних вимог.",
    action: "Налаштувати",
  },
}

interface ProgressiveOnboardingProps {
  userRole: string | null
}

export function ProgressiveOnboarding({ userRole }: ProgressiveOnboardingProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [showFirstDecision, setShowFirstDecision] = useState(false)
  const [flowType, setFlowType] = useState<string | null>(null)

  useEffect(() => {
    // Отримуємо тип флоу
    const savedFlowType = localStorage.getItem("way2b1_flow_type")
    setFlowType(savedFlowType)

    // Перевіряємо, чи є активний модуль онбордингу
    const activeModule = localStorage.getItem("way2b1_active_module")
    if (activeModule && moduleTooltips[activeModule]) {
      // Показуємо підказку після невеликої затримки
      setTimeout(() => {
        setActiveTooltip(activeModule)
      }, 500)
    }

    // Перевіряємо, чи потрібно показати перше створене завдання
    const hasSeenFirstDecision = localStorage.getItem("way2b1_seen_first_decision")
    const hasFirstDecision = localStorage.getItem("way2b1_first_decision_created")
    
    if (!hasSeenFirstDecision && hasFirstDecision === "true") {
      setShowFirstDecision(true)
    }

    // Автоматично створюємо перше завдання для нових користувачів
    const isNewUser = !localStorage.getItem("way2b1_first_decision_created")
    const userRoleLocal = localStorage.getItem("way2b1_user_role")
    
    if (isNewUser && userRoleLocal && pathname === "/") {
      // Створюємо перше рішення автоматично
      setTimeout(() => {
        createFirstDecision()
      }, 2000)
    }
  }, [pathname])

  // Функція для автоматичного створення першого рішення
  const createFirstDecision = () => {
    // Позначаємо, що перше рішення створено
    localStorage.setItem("way2b1_first_decision_created", "true")
    
    // Показуємо повідомлення про створене рішення
    setShowFirstDecision(true)

    // Оновлюємо прогрес онбордингу
    const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
    progress["add-demo-items"] = true
    localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
    window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))

    // Запускаємо подію для святкування
    window.dispatchEvent(
      new CustomEvent("milestone-reached", {
        detail: {
          title: "Вітаємо! Ви створили перше рішення",
          description: "Ми автоматично створили приклад рішення для вас. Перевірте його та дізнайтесь, як працюють workflows.",
          type: "first-decision",
        },
      }),
    )
  }

  const handleTooltipAction = (moduleId: string) => {
    const tooltip = moduleTooltips[moduleId]
    if (!tooltip) return

    setActiveTooltip(null)
    
    // Навігація залежно від модуля
    const moduleRoutes: Record<string, string> = {
      "org-setup": "/settings",
      "add-team-member": "/team",
      "setup-domains": "/catalog",
      "add-demo-items": "/decisions",
      "connect-integrations": "/resources",
      "configure-compliance": "/compliance",
    }

    if (moduleRoutes[moduleId]) {
      router.push(moduleRoutes[moduleId])
    }
  }

  const handleDismissTooltip = (moduleId: string) => {
    setActiveTooltip(null)
    localStorage.setItem(`way2b1_tooltip_dismissed_${moduleId}`, "true")
  }

  const handleViewFirstDecision = () => {
    setShowFirstDecision(false)
    localStorage.setItem("way2b1_seen_first_decision", "true")
    router.push("/decisions")
  }

  // Не показуємо підказки для ролей Vendor/Guest або для Advisor флоу
  const shouldShowTooltip = (moduleId: string): boolean => {
    if (!userRole) return false
    
    // Для Advisor флоу показуємо обмежений онбординг
    if (flowType === "advisor") {
      const limitedModules = ["add-demo-items"]
      return limitedModules.includes(moduleId)
    }
    
    // Admin флоу - повний онбординг
    if (userRole === "family-principal" || userRole === "operations-manager") {
      return true
    }
    
    // Vendor/Guest бачать тільки обмежений онбординг
    const limitedModules = ["add-demo-items"]
    return limitedModules.includes(moduleId)
  }

  if (!activeTooltip || !shouldShowTooltip(activeTooltip)) {
    // Показуємо повідомлення про перше створене завдання
    if (showFirstDecision) {
      return (
        <div className="fixed bottom-6 right-6 bg-card border border-border rounded-xl shadow-2xl p-6 max-w-md z-[9999] animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">Ваше перше рішення готове! 🎉</h3>
                <button
                  onClick={() => setShowFirstDecision(false)}
                  className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Ми автоматично створили приклад рішення для вас. Перевірте його та дізнайтесь, як працюють workflows.
              </p>
              <button
                onClick={handleViewFirstDecision}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Переглянути рішення
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )
    }
    
    return null
  }

  const tooltip = moduleTooltips[activeTooltip]
  if (!tooltip) return null

  return (
    <div className="fixed bottom-6 right-6 bg-card border border-border rounded-xl shadow-2xl p-6 max-w-md z-[9999] animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">{tooltip.title}</h3>
            <button
              onClick={() => handleDismissTooltip(activeTooltip)}
              className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{tooltip.description}</p>
          {tooltip.action && (
            <button
              onClick={() => handleTooltipAction(activeTooltip)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {tooltip.action}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

