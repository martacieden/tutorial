"use client"

import type React from "react"
import { CheckCircle2, Clock } from "lucide-react"

interface Module {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  route: string
  estimatedTime: string
  emptyStateTitle?: string
  emptyStateDescription?: string
  actionLabel?: string
}

interface ModuleChecklistItemProps {
  module: Module
  onActionClick: (route: string, moduleId: string) => void
  onResetClick?: (moduleId: string) => void
}

export function ModuleChecklistItem({ module, onActionClick, onResetClick }: ModuleChecklistItemProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden transition-all hover:border-primary/20 hover:bg-secondary/30">
      <div className="flex items-center gap-3 p-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          {module.icon && <div className="scale-90">{module.icon}</div>}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div
            className={`text-sm font-medium mb-0.5 ${module.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
            {module.title}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{module.description}</span>
            {!module.completed && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                <Clock className="w-2.5 h-2.5" />
                {module.estimatedTime}
              </span>
            )}
          </div>
        </div>

        {/* Action button - Custom label or Completed */}
        {module.completed ? (
          <button
            onClick={() => onResetClick && onResetClick(module.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium shrink-0 hover:bg-blue-200 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </button>
        ) : (
          <button
            onClick={() => onActionClick(module.route, module.id)}
            className="px-3 py-1.5 bg-[#4F7CFF] text-white rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-colors shrink-0"
          >
            {module.actionLabel || "Start"}
          </button>
        )}
      </div>
    </div>
  )
}

