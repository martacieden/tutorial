"use client"
import { X, CheckCircle2, Clock, BookOpen, FileText, Users, Workflow, Shield } from "lucide-react"

interface TutorialCenterProps {
  onClose: () => void
  onStartTutorial: (tutorialId: string) => void
}

export function TutorialCenter({ onClose, onStartTutorial }: TutorialCenterProps) {
  const tutorials = [
    {
      id: "getting-started",
      title: "Getting Started with Way2B1",
      description: "Learn the basics of navigating your family office workspace",
      duration: "3 min",
      completed: false,
      icon: <BookOpen className="w-5 h-5" />,
      category: "Basics",
    },
    {
      id: "decision-workflows",
      title: "Decision Workflows & Approvals",
      description: "Create decisions, set up approval workflows, and track progress",
      duration: "4 min",
      completed: false,
      icon: <Workflow className="w-5 h-5" />,
      category: "Core Features",
    },
    {
      id: "document-sharing",
      title: "Document Sharing & Collaboration",
      description: "Upload, share, and collaborate on documents with your team",
      duration: "3 min",
      completed: false,
      icon: <FileText className="w-5 h-5" />,
      category: "Core Features",
    },
    {
      id: "team-collaboration",
      title: "Multi-Family Collaboration",
      description: "Invite team members, assign roles, and work together across families",
      duration: "3 min",
      completed: false,
      icon: <Users className="w-5 h-5" />,
      category: "Collaboration",
    },
    {
      id: "compliance-tracking",
      title: "Compliance & Audit Trails",
      description: "Track decision history, maintain compliance, and generate reports",
      duration: "4 min",
      completed: false,
      icon: <Shield className="w-5 h-5" />,
      category: "Advanced",
    },
  ]

  const categories = Array.from(new Set(tutorials.map((t) => t.category)))

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Tutorial Center</h2>
              <p className="text-sm text-muted-foreground">Master Way2B1 at your own pace</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{category}</h3>
            <div className="space-y-3">
              {tutorials
                .filter((t) => t.category === category)
                .map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      {tutorial.completed ? <CheckCircle2 className="w-6 h-6 text-accent" /> : tutorial.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground mb-1">{tutorial.title}</div>
                      <div className="text-sm text-muted-foreground">{tutorial.description}</div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {tutorial.duration}
                      </div>
                      <button
                        onClick={() => onStartTutorial(tutorial.id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {tutorial.completed ? "Replay" : "Start"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
          <p className="text-sm text-muted-foreground text-center">
            Need personalized help?{" "}
            <button className="text-primary hover:underline font-medium">Contact your concierge</button> for white-glove
            support
          </p>
        </div>
      </div>
    </div>
  )
}
