"use client"

import { X } from "lucide-react"

export function FlowStartModal({
  title,
  description,
  onStart,
  onSkip,
}: {
  title: string
  description: string
  onStart: () => void
  onSkip: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onSkip} className="p-1 rounded hover:bg-secondary">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-5 text-sm text-muted-foreground leading-relaxed">{description}</div>
        <div className="px-5 pb-5 flex items-center justify-end gap-2">
          <button onClick={onSkip} className="px-3 py-2 text-sm rounded-lg border">
            Not now
          </button>
          <button onClick={onStart} className="px-3 py-2 text-sm rounded-lg bg-[#4F7CFF] text-white">
            Let’s start
          </button>
        </div>
      </div>
    </div>
  )
}


