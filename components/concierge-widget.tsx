"use client"

import { useState } from "react"
import { X, Send, Headphones } from "lucide-react"

export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      // In production, this would send to support system
      console.log("[v0] Concierge message:", message)
      setMessage("")
      // Show confirmation
      alert("Your message has been sent to our concierge team. We'll respond within 1 hour.")
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-[9997] flex items-center justify-center"
        aria-label="Open concierge support"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-card border border-border rounded-2xl shadow-2xl z-[9997] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Concierge Support</h3>
                <p className="text-xs opacity-90">We typically respond in under 1 hour</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-sm text-foreground">
                Hello! I'm your dedicated concierge. How can I help you with Way2B1 today?
              </p>
              <p className="text-xs text-muted-foreground mt-2">Common requests:</p>
              <div className="mt-2 space-y-1">
                <button className="text-xs text-primary hover:underline block">
                  • Help setting up decision workflows
                </button>
                <button className="text-xs text-primary hover:underline block">• Onboarding my team members</button>
                <button className="text-xs text-primary hover:underline block">• Configuring approval processes</button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
