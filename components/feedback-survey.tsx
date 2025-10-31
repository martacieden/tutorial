"use client"

import { useState } from "react"
import { X, ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react"

interface FeedbackSurveyProps {
  onClose: () => void
  onSubmit: (feedback: { rating: "positive" | "negative"; comment: string }) => void
}

export function FeedbackSurvey({ onClose, onSubmit }: FeedbackSurveyProps) {
  const [rating, setRating] = useState<"positive" | "negative" | null>(null)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating) {
      onSubmit({ rating, comment })
      setSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-card border border-border rounded-xl p-6 shadow-2xl max-w-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ThumbsUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Thank you!</h3>
            <p className="text-sm text-muted-foreground">Your feedback helps us improve Way2B1.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-xl p-6 shadow-2xl max-w-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">How are we doing?</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          We'd love to hear your thoughts on the onboarding experience.
        </p>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setRating("positive")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
              rating === "positive"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border hover:border-accent/50 text-muted-foreground"
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="font-medium">Good</span>
          </button>
          <button
            onClick={() => setRating("negative")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
              rating === "negative"
                ? "border-orange-500 bg-orange-500/10 text-orange-500"
                : "border-border hover:border-orange-500/50 text-muted-foreground"
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
            <span className="font-medium">Needs work</span>
          </button>
        </div>

        {rating && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more (optional)..."
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
