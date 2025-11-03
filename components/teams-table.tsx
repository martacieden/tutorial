"use client"

import { Users, MoreVertical, ChevronDown } from "lucide-react"

interface Team {
  id: string
  name: string
  organization: string
  members: Array<{ id: string; name: string; avatar?: string }>
  createdAt: string
  createdBy?: { name: string; avatar?: string }
}

interface TeamsTableProps {
  teams: Team[]
}

export function TeamsTable({ teams }: TeamsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (teams.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Team members
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Created by
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Created on
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Last update
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{team.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {team.members.slice(0, 3).map((member, idx) => (
                      <div
                        key={member.id || idx}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
                        style={{ marginLeft: idx > 0 ? "-8px" : "0" }}
                      >
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                        ) : (
                          getInitials(member.name)
                        )}
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">+{team.members.length - 3}</span>
                    )}
                    {team.members.length === 0 && (
                      <span className="text-xs text-gray-400">No members</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{team.organization}</td>
                <td className="px-4 py-3">
                  {team.createdBy ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                        {team.createdBy.avatar ? (
                          <img
                            src={team.createdBy.avatar}
                            alt={team.createdBy.name}
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          getInitials(team.createdBy.name)
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{team.createdBy.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(team.createdAt)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(team.createdAt)}</td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

