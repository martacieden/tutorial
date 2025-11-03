"use client"

import { useState, useEffect, useRef } from "react"
import { X, ChevronDown } from "lucide-react"

type TeamDraft = {
  name: string
  organization: string
  invitedPeople: Array<{ id: string; name: string; avatar?: string }>
}

interface TeamCreationModalProps {
  onClose: () => void
  onComplete: (team: { name: string; organization: string }) => void
}

export function TeamCreationModal({ onClose, onComplete }: TeamCreationModalProps) {
  const [draft, setDraft] = useState<TeamDraft>({
    name: "",
    organization: "",
    invitedPeople: [],
  })

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus name input when modal opens
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 100)
  }, [])

  const canCreate = () => {
    return draft.name.trim().length > 0 && draft.organization.trim().length > 0
  }

  const handleCreate = () => {
    if (!canCreate()) return

    try {
      // Get current user name from localStorage or use default
      const userName = localStorage.getItem("way2b1_user_name") || "Current User"
      const userEmail = localStorage.getItem("way2b1_user_email") || ""
      
      // Create team data
      const teamData = {
        id: `team-${Date.now()}`,
        name: draft.name,
        organization: draft.organization,
        members: draft.invitedPeople,
        createdAt: new Date().toISOString(),
        createdBy: {
          name: userName,
          email: userEmail,
        },
      }
      
      // Save to localStorage
      const existingTeams = JSON.parse(localStorage.getItem("way2b1_teams") || "[]")
      existingTeams.push(teamData)
      localStorage.setItem("way2b1_teams", JSON.stringify(existingTeams))
      
      // Dispatch event to update teams list
      window.dispatchEvent(new CustomEvent("teamsUpdated"))
      
      // Mark create-teams module as complete
      const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
      progress["create-teams"] = true
      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
      window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
      
      onComplete({ name: draft.name, organization: draft.organization, id: teamData.id })
    } catch {}
  }

  const handleInvitePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Simple implementation: on Enter or comma, add person
    // For now, we'll just store the input value
    // In a real app, you'd parse names and create chips
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden"
        style={{
          boxShadow: "0px 16px 36px -20px rgba(0, 6, 46, 0.20), 0px 16px 64px 0px rgba(0, 0, 85, 0.02), 0px 12px 60px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 gap-2">
          <h2 className="text-[16px] font-bold text-gray-900 flex-1">Create new team</h2>
          <button className="w-6 h-6 flex items-center justify-center" onClick={onClose}>
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-6 flex flex-col overflow-y-auto overflow-x-hidden">
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                Name
                <span className="text-red-500 font-semibold">*</span>
              </label>
              <input
                id="team-creation-name-input"
                type="text"
                placeholder="Name your team"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ref={nameInputRef}
              />
            </div>

            {/* Organization Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                Organization
                <span className="text-red-500 font-semibold">*</span>
              </label>
              <div className="relative">
                <select
                  id="team-creation-organization-select"
                  value={draft.organization}
                  onChange={(e) => setDraft({ ...draft, organization: e.target.value })}
                  className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg text-[13px] text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an organization</option>
                  <option value="McCoy Family">McCoy Family</option>
                  <option value="Cresset">Cresset</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Invite People Field */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-900">Invite people</label>
              <div
                id="team-creation-invite-people"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-400 bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
              >
                {draft.invitedPeople.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {draft.invitedPeople.map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-[13px] text-gray-900"
                      >
                        {person.avatar ? (
                          <img src={person.avatar} alt={person.name} className="w-5 h-5 rounded-full" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                            {person.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{person.name}</span>
                        <button
                          onClick={() =>
                            setDraft({
                              ...draft,
                              invitedPeople: draft.invitedPeople.filter((p) => p.id !== person.id),
                            })
                          }
                          className="ml-1 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add one or more people"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          const name = e.currentTarget.value.trim()
                          setDraft({
                            ...draft,
                            invitedPeople: [
                              ...draft.invitedPeople,
                              { id: `person-${Date.now()}`, name },
                            ],
                          })
                          e.currentTarget.value = ""
                          e.preventDefault()
                        }
                      }}
                      className="flex-1 min-w-[200px] border-0 outline-none bg-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Add one or more people"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const name = e.currentTarget.value.trim()
                        setDraft({
                          ...draft,
                          invitedPeople: [{ id: `person-${Date.now()}`, name }],
                        })
                        e.currentTarget.value = ""
                        e.preventDefault()
                      }
                    }}
                    className="w-full border-0 outline-none bg-transparent text-gray-400 placeholder-gray-400"
                  />
                )}
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                Type names and press Enter to add people to your team. You can also do this later.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-6 border-t border-gray-200">
          <button
            className="px-4 py-2 text-[13px] font-semibold text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            id="team-creation-create-btn"
            onClick={handleCreate}
            disabled={!canCreate()}
            className={`px-6 py-2 text-[13px] font-semibold text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors ${
              !canCreate() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

