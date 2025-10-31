"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Settings, User, Bell, Palette } from "lucide-react"

export default function SettingsPage() {
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const progress = localStorage.getItem("way2b1_module_progress")
    if (progress) {
      try {
        const parsed = JSON.parse(progress)
        setIsConfigured(parsed["configure-settings"] || false)
      } catch (e) {
        console.error("Failed to load progress", e)
      }
    }
  }, [])

  const handleConfigure = () => {
    const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
    progress["configure-settings"] = true
    localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
    setIsConfigured(true)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">Personalize your workspace</p>
            </div>

            {!isConfigured ? (
              <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Settings className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Profile not configured</h2>
                <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                  Set up your profile and preferences for a better experience. Add a photo, choose a theme, and
                  configure notifications.
                </p>
                <button
                  onClick={handleConfigure}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Configure profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Theme</h3>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 p-4 bg-primary/10 border-2 border-primary rounded-lg text-foreground font-medium">
                      Light
                    </button>
                    <button className="flex-1 p-4 bg-secondary border border-border rounded-lg text-muted-foreground hover:bg-secondary/80">
                      Dark
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-foreground">Email notifications</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-foreground">Push notifications</span>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
