"use client"

import { Plus, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DecisionsEmptyStateProps {
  onCreateDecision: () => void
}

export function DecisionsEmptyState({ onCreateDecision }: DecisionsEmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
          <Workflow className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No records to show</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Add new records or import data to get started. Try adjusting your filters or search settings if
          you're expecting to see something specific.
        </p>
        <Button
          onClick={onCreateDecision}
          className="inline-flex items-center gap-2 bg-[#4F7CFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New decision
        </Button>
      </div>
    </div>
  )
}

