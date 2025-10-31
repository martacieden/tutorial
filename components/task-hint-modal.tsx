"use client"

import { useState } from "react"
import { X, Play, Image, ArrowRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaskHintModalProps {
  show: boolean
  onClose: () => void
  task: {
    id: string
    title: string
    description: string
    hint?: string
    videoUrl?: string
    illustrationUrl?: string
    steps?: string[]
  }
}

export function TaskHintModal({ show, onClose, task }: TaskHintModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="bg-card rounded-2xl p-8 max-w-3xl w-full shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-foreground">How to: {task.title}</h2>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
        </div>

        {/* Stepper for multi-step tasks */}
        {task.steps && task.steps.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-4">
              {task.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-center max-w-[100px]">
                      {step}
                    </div>
                  </div>
                  {index < task.steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${
                      index === 0 ? "bg-primary" : "bg-secondary"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media content */}
        {task.videoUrl && (
          <div className="mb-6 bg-secondary rounded-xl p-4 aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Video tutorial would play here</p>
              <p className="text-xs text-muted-foreground mt-1">{task.videoUrl}</p>
            </div>
          </div>
        )}

        {task.illustrationUrl && (
          <div className="mb-6 bg-secondary rounded-xl p-4 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Image className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Illustration would show here</p>
              <p className="text-xs text-muted-foreground mt-1">{task.illustrationUrl}</p>
            </div>
          </div>
        )}

        {/* Hint text */}
        {task.hint && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground leading-relaxed">{task.hint}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Got it
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2"
          >
            Start task
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

