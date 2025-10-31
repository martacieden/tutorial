"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Users, Plus, Mail, Search, X } from "lucide-react"
import { TeamWalkthrough } from "@/components/team-walkthrough"
import { useRef } from "react"

export default function TeamPage() {
  const router = useRouter()
  const [hasTeamMembers, setHasTeamMembers] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  useEffect(() => {
    // Check if walkthrough should be shown
    const activeModule = localStorage.getItem("way2b1_active_module")
    const shouldShowWalkthrough = localStorage.getItem("way2b1_start_team_walkthrough") === "true"
    
    const progress = localStorage.getItem("way2b1_module_progress")
    if (progress) {
      try {
        const parsed = JSON.parse(progress)
        setHasTeamMembers(parsed["add-team-member"] || false)
      } catch (e) {
        console.error("Failed to load progress", e)
      }
    }

    if (activeModule === "add-team-member" && shouldShowWalkthrough) {
      // Small delay for page to load
      setTimeout(() => {
        setShowWalkthrough(true)
        localStorage.removeItem("way2b1_start_team_walkthrough")
      }, 300)
    }
  }, [])

  const handleInviteClick = () => {
    setShowInviteModal(true)
  }

  const handleAddMember = () => {
    setShowInviteModal(false)
    setShowToast(true)

    const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
    progress["add-team-member"] = true
    localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
    localStorage.removeItem("way2b1_active_module")

    window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
    // Kindly request feedback after success (throttled by Home)
    window.dispatchEvent(new CustomEvent("requestFeedback"))

    setHasTeamMembers(true)

    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Team</h1>
                <p className="text-muted-foreground">Manage team members and their access</p>
              </div>
              {hasTeamMembers && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Invite user
                </button>
              )}
            </div>

            {!hasTeamMembers ? (
              <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Team is empty</h2>
                <p className="text-foreground/70 mb-8 max-w-md leading-relaxed">
                  Add team members to start collaborating on decisions together. Invite colleagues via email and set up
                  their roles and permissions.
                </p>

                <button
                  id="btn-invite-first"
                  onClick={handleInviteClick}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Invite first user
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-lg text-primary-foreground font-semibold">
                        JD
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">John Doe</h3>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">Admin</span>
                      <span className="px-3 py-1 bg-secondary text-muted-foreground text-sm rounded-full">Active</span>
                    </div>
                  </div>
                  <div className="p-6 bg-secondary/30">
                    <p className="text-sm text-muted-foreground">
                      First team member successfully added! Now you can invite more colleagues to collaborate.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showInviteModal && (
        <InviteModal
          onSave={handleAddMember}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* Walkthrough */}
      {showWalkthrough && (
        <TeamWalkthrough
          onClose={() => setShowWalkthrough(false)}
          onStepComplete={(stepIndex) => {
            // Handle step completion if needed
            console.log("Step completed:", stepIndex)
          }}
        />
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-card border border-border rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-xl">🎉</span>
          </div>
          <div>
            <div className="font-semibold text-foreground">Team member invited!</div>
            <div className="text-sm text-muted-foreground">Returning to dashboard...</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Invite Modal Component
function InviteModal({
  onSave,
  onClose,
}: {
  onSave: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-card rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Invite Team Member</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              id="input-email"
              type="email"
              placeholder="colleague@example.com"
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Role</label>
            <select className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Team Member</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>

        <button
          id="btn-send-invitation"
          onClick={onSave}
          className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Send Invitation
        </button>
      </div>
    </div>
  )
}
