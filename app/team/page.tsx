"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Users, Plus, Mail, Search, X } from "lucide-react"
import { TeamWalkthrough } from "@/components/team-walkthrough"
import { TeamCreationWalkthrough } from "@/components/team-creation-walkthrough"
import { TeamCreationModal } from "@/components/team-creation-modal"
import { TeamsTable } from "@/components/teams-table"
import { useRef } from "react"

interface Team {
  id: string
  name: string
  organization: string
  members: Array<{ id: string; name: string; avatar?: string }>
  createdAt: string
  createdBy?: { name: string; avatar?: string }
}

export default function TeamPage() {
  const router = useRouter()
  const [hasTeamMembers, setHasTeamMembers] = useState(false)
  const [hasTeams, setHasTeams] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showTeamCreationModal, setShowTeamCreationModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const [showTeamCreationWalkthrough, setShowTeamCreationWalkthrough] = useState(false)
  const newTeamBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    // Check if walkthrough should be shown
    const activeModule = localStorage.getItem("way2b1_active_module")
    const shouldShowWalkthrough = localStorage.getItem("way2b1_start_team_walkthrough") === "true"
    
    const progress = localStorage.getItem("way2b1_module_progress")
    if (progress) {
      try {
        const parsed = JSON.parse(progress)
        setHasTeamMembers(parsed["add-team-member"] || false)
        setHasTeams(parsed["create-teams"] || false)
      } catch (e) {
        console.error("Failed to load progress", e)
      }
    }

    // Load teams from localStorage
    const loadTeams = () => {
      try {
        const savedTeams = localStorage.getItem("way2b1_teams")
        if (savedTeams) {
          const parsed = JSON.parse(savedTeams)
          setTeams(parsed)
          setHasTeams(parsed.length > 0)
        }
      } catch (e) {
        console.error("Failed to load teams", e)
      }
    }

    loadTeams()

    // Show team creation walkthrough for create-teams module
    if (activeModule === "create-teams" && shouldShowWalkthrough) {
      setTimeout(() => {
        setShowTeamCreationWalkthrough(true)
        localStorage.removeItem("way2b1_start_team_walkthrough")
        // Auto-scroll to button after a short delay
        setTimeout(() => {
          newTeamBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 500)
      }, 500)
    }

    // Listen for teams updates
    const handleTeamsUpdate = () => {
      loadTeams()
    }

    window.addEventListener("teamsUpdated", handleTeamsUpdate)

    // Show team walkthrough for add-team-member module
    if (activeModule === "add-team-member" && shouldShowWalkthrough) {
      setTimeout(() => {
        setShowWalkthrough(true)
        localStorage.removeItem("way2b1_start_team_walkthrough")
      }, 300)
    }

    return () => {
      window.removeEventListener("teamsUpdated", handleTeamsUpdate)
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Teams</h1>
                <p className="text-muted-foreground">Manage teams and their members</p>
              </div>
              {hasTeams && (
                <button
                  onClick={() => setShowTeamCreationModal(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New team
                </button>
              )}
            </div>

            {/* Filters and Search */}
            {hasTeams && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-0 outline-none text-sm text-gray-900 placeholder-gray-400 w-48"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  Filters
                </button>
              </div>
            )}

            {!hasTeams ? (
              <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Create your first team</h2>
                <p className="text-foreground/70 mb-8 max-w-md leading-relaxed">
                  Teams help you organize people and manage permissions across your organization. Group members by department, project, or function to streamline collaboration.
                </p>

                <button
                  id="btn-new-team"
                  ref={newTeamBtnRef}
                  onClick={() => {
                    setShowTeamCreationModal(true)
                  }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New team
                </button>
              </div>
            ) : (
              <div>
                {teams.length > 0 ? (
                  <>
                    <TeamsTable teams={teams} />
                    <div className="mt-4 text-sm text-gray-500">
                      Rows: {teams.length} Filtered: 0
                    </div>
                  </>
                ) : null}
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

      {/* Team Creation Modal */}
      {showTeamCreationModal && (
        <TeamCreationModal
          onClose={() => {
            setShowTeamCreationModal(false)
            setShowTeamCreationWalkthrough(false)
          }}
          onComplete={(team) => {
            setShowTeamCreationModal(false)
            setShowTeamCreationWalkthrough(false)
            // Teams will be loaded from localStorage via event listener
            setHasTeams(true)
            // Show success toast
            setShowToast(true)
            // Don't redirect, stay on page to see the created team in table
            setTimeout(() => {
              setShowToast(false)
            }, 3000)
          }}
        />
      )}

      {/* Team Creation Walkthrough */}
      {showTeamCreationWalkthrough && (
        <TeamCreationWalkthrough
          onClose={() => {
            setShowTeamCreationWalkthrough(false)
          }}
          onComplete={() => {
            setShowTeamCreationWalkthrough(false)
          }}
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
