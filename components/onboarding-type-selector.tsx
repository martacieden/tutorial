"use client"

import { useState } from "react"
import { Shield, UserCircle, BookOpen, ArrowRight, Sparkles, CheckCircle2, Target, X } from "lucide-react"

interface OnboardingTypeSelectorProps {
  onSelectType: (type: "admin1" | "admin2" | "advisor") => void
  onClose?: () => void
}

export function OnboardingTypeSelector({ onSelectType, onClose }: OnboardingTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<"admin1" | "admin2" | "advisor" | null>(null)

  const types = [
    {
      id: "admin1" as const,
      title: "Admin 1",
      subtitle: "Guided Walkthrough",
      icon: <Shield className="w-8 h-8" />,
      description: "Step-by-step guided tours with interactive tooltips and highlights. Perfect for structured onboarding.",
      features: [
        "Interactive walkthroughs",
        "Visual step indicators",
        "Contextual tooltips",
        "Skip and navigation controls",
      ],
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "admin2" as const,
      title: "Admin 2",
      subtitle: "Learn by Doing",
      icon: <Target className="w-8 h-8" />,
      description: "Onboarding through real actions in the platform. Complete actual tasks that demonstrate system capabilities.",
      features: [
        "Real tasks in your queue",
        "Immediate positive feedback",
        "Native platform experience",
        "Self-contained onboarding",
      ],
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "advisor" as const,
      title: "Advisor",
      subtitle: "Consultative Approach",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Lightweight guidance for advisors. Contextual hints and suggestions as you work.",
      features: [
        "Contextual hints",
        "Non-intrusive guidance",
        "Flexible navigation",
        "Advisor-focused workflow",
      ],
      color: "from-emerald-500 to-emerald-600",
    },
  ]

  const selectedTypeData = selectedType ? types.find((t) => t.id === selectedType) : null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="bg-card rounded-2xl p-8 max-w-5xl w-full shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-foreground">Choose Onboarding Type</h2>
          <p className="text-muted-foreground leading-relaxed">
            Select how you'd like to be introduced to the platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedType === type.id
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  selectedType === type.id ? "bg-primary text-primary-foreground" : `bg-gradient-to-br ${type.color} text-white`
                }`}
              >
                {type.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{type.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{type.subtitle}</p>
              <p className="text-sm text-foreground mb-4">{type.description}</p>
              <ul className="space-y-2">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <button
          onClick={() => selectedType && onSelectType(selectedType)}
          disabled={!selectedType}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedType ? (
            <>
              Start {selectedTypeData?.title} Onboarding
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            "Select onboarding type"
          )}
        </button>
      </div>
    </div>
  )
}

