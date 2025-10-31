"use client"

import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Dashboard } from "@/components/dashboard"

export default function MorePage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}


