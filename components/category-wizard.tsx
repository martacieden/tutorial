"use client"

import { useEffect, useRef, useState } from "react"
import { GuidedTour } from "@/components/guided-tour"
import { X, ChevronRight, ChevronLeft, Settings, Info } from "lucide-react"

type CategoryDraft = {
  name: string
  type: string
  description?: string
  parent?: string
  scope: "selected" | "all"
  capsules: { id: string; enabled: boolean }[]
}

export function CategoryWizard({ onClose, onComplete }: { onClose: () => void; onComplete: (category: { name: string }) => void }) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<CategoryDraft>({
    name: "",
    type: "Decisions",
    description: "",
    parent: "",
    scope: "all",
    capsules: [
      { id: "amounts", enabled: false },
      { id: "attachments", enabled: false },
      { id: "linked", enabled: false },
      { id: "themes", enabled: false },
    ],
  })

  // Coachmarks targeting
  const nameRef = useRef<HTMLInputElement | null>(null)
  const firstCapsuleRef = useRef<HTMLButtonElement | null>(null)
  const previewRef = useRef<HTMLButtonElement | null>(null)
  const nextBtnRef = useRef<HTMLButtonElement | null>(null)
  const stepsForTour = () => {
    if (step === 1) {
      return [
        { id: "name", getTarget: () => nameRef.current, content: <div>Enter a clear category name. You can change it later.</div> },
        { id: "next", getTarget: () => nextBtnRef.current, content: <div>When ready, click Continue to proceed.</div> },
      ]
    }
    if (step === 3) {
      return [
        { id: "save", getTarget: () => nextBtnRef.current, content: <div>When you're done, click Save. This will finish creating your category.</div> },
      ]
    }
    return [
      { id: "preview", getTarget: () => previewRef.current, content: <div>Preview how the workflow will look for this category.</div> },
      { id: "finish", getTarget: () => nextBtnRef.current, content: <div>Finish to save your category.</div> },
    ]
  }

  const canContinue = () => {
    if (step === 1) return draft.name.trim().length > 0 && draft.type.length > 0
    return true
  }

  const handleContinue = () => {
    if (step === 1) {
      // Skip directly to custom fields
      setStep(3)
      return
    }
    if (step === 3) {
      // Treat as Save and finish
      try {
        localStorage.setItem("way2b1_new_category", JSON.stringify({ name: draft.name }))
      } catch {}
      onComplete({ name: draft.name })
      return
    }
    if (step < 4) {
      setStep(step + 1)
    } else {
      try {
        localStorage.setItem("way2b1_new_category", JSON.stringify({ name: draft.name }))
      } catch {}
      onComplete({ name: draft.name })
    }
  }

  const CapsuleRow = ({ id, title, description }: { id: string; title: string; description: string }) => {
    const enabled = draft.capsules.find((c) => c.id === id)?.enabled
    return (
      <button
        className={`w-full text-left border rounded-lg px-4 py-3 flex items-center justify-between ${
          enabled ? "bg-card border-primary/40" : "bg-background border-border"
        }`}
        onClick={() =>
          setDraft((d) => ({
            ...d,
            capsules: d.capsules.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
          }))
        }
        ref={id === "amounts" ? firstCapsuleRef : undefined}
      >
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings className="w-4 h-4" />
          <div className={`w-10 h-6 rounded-full ${enabled ? "bg-primary" : "bg-secondary"}`} />
        </div>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl">
        <div className="flex h-[560px]">
          {/* Progress sidebar */}
          <div className="w-60 border-r border-border bg-card p-4">
            {[
              { n: 1, t: "Category details" },
              { n: 2, t: "Select category capsules" },
              { n: 3, t: "Set up custom fields" },
              { n: 4, t: "Select a workflow" },
            ].map((s) => (
              <div key={s.n} className={`py-2 text-sm ${step === s.n ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {s.n}. {s.t}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="text-lg font-semibold">Create new category</div>
              <button onClick={onClose} className="p-1 rounded hover:bg-secondary">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 relative">
              {/* Guided tour disabled for this flow */}
              <GuidedTour steps={stepsForTour()} open={false} initialStep={0} onClose={() => {}} />
              {step === 1 && (
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm mb-1">Name *</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Enter category name..."
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      ref={nameRef}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Category type *</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={draft.type}
                      onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                    >
                      <option>Decisions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Category description</label>
                    <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Make this a subcategory of</label>
                    <input className="w-full border rounded-lg px-3 py-2" placeholder="Choose parent (optional)" value={draft.parent} onChange={(e) => setDraft({ ...draft, parent: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Where can this category be used? *</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" checked={draft.scope === "selected"} onChange={() => setDraft({ ...draft, scope: "selected" })} />
                        In selected organization only
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" checked={draft.scope === "all"} onChange={() => setDraft({ ...draft, scope: "all" })} />
                        In selected and all its child organizations
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3 max-w-3xl">
                  <CapsuleRow id="amounts" title="Track amounts & budgets" description="Require users to enter monetary values with budget options" />
                  <CapsuleRow id="attachments" title="Upload attachments" description="Require users to attach files from their computer or drives" />
                  <CapsuleRow id="linked" title="Link related items" description="Require users to link to other decisions, tasks, etc" />
                  <CapsuleRow id="themes" title="Organize by themes" description="Require users to categorize items using themes" />
                </div>
              )}

              {step === 3 && (
                <div className="text-sm text-muted-foreground">Custom fields setup placeholder</div>
              )}

              {step === 4 && (
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-start gap-2 text-sm">
                    <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    Workflow adapts based on the chosen category and may change when inputs change.
                  </div>
                  <button ref={previewRef} className="px-3 py-2 border rounded-lg text-sm w-fit">Preview workflow</button>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <button disabled={step === 1} onClick={() => setStep(step - 1)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${step === 1 ? "opacity-50" : ""}`}>
                <ChevronLeft className="w-4 h-4" /> Go back
              </button>
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="px-3 py-2 text-sm">Cancel</button>
                <button ref={nextBtnRef} onClick={handleContinue} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4F7CFF] text-white`}>
                  {step === 3 ? (
                    <>Save <ChevronRight className="w-4 h-4" /></>
                  ) : step < 4 ? (
                    <>Continue <ChevronRight className="w-4 h-4" /></>
                  ) : (
                    <>Finish <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


