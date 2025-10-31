"use client"

import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { BookOpen, FileText, HelpCircle, ExternalLink, Play, Workflow, Users, Shield } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Resources & Guides</h1>
              <p className="text-muted-foreground">
                Everything you need to master Way2B1 and manage your family office effectively
              </p>
            </div>

            {/* Quick Start Guides */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Start Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Workflow className="w-5 h-5" />,
                    title: "Creating Decision Workflows",
                    description: "Learn how to set up approval workflows for important decisions",
                    time: "5 min read",
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: "Team Collaboration",
                    description: "Invite members and manage multi-family collaboration",
                    time: "4 min read",
                  },
                  {
                    icon: <FileText className="w-5 h-5" />,
                    title: "Document Management",
                    description: "Upload, organize, and share documents securely",
                    time: "3 min read",
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "Compliance & Audit Trails",
                    description: "Set up compliance tracking and maintain audit history",
                    time: "6 min read",
                  },
                ].map((guide, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        {guide.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{guide.description}</p>
                        <span className="text-xs text-primary font-medium">{guide.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Video Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Getting Started with Way2B1", duration: "3:45" },
                  { title: "Advanced Workflow Configuration", duration: "5:20" },
                  { title: "Multi-Family Collaboration Tips", duration: "4:15" },
                ].map((video, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                      <span className="text-sm text-muted-foreground">{video.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External Resources */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">External Resources</h2>
              <div className="space-y-3">
                {[
                  { icon: <BookOpen className="w-5 h-5" />, title: "Confluence Documentation", url: "#" },
                  { icon: <FileText className="w-5 h-5" />, title: "Figma Design System", url: "#" },
                  { icon: <HelpCircle className="w-5 h-5" />, title: "FAQ & Support", url: "#" },
                ].map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {resource.icon}
                      </div>
                      <span className="font-medium text-foreground">{resource.title}</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>

            {/* Replay Walkthrough */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Want to see the walkthrough again?</h3>
                  <p className="text-sm text-muted-foreground">
                    Replay the interactive tutorial to refresh your knowledge
                  </p>
                </div>
                <button className="bg-[#4F7CFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#4F7CFF]/90 transition-colors flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Replay Tutorial
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
