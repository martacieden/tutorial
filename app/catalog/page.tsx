"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, FileText, Share2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { CatalogHints } from "@/components/catalog-hints"

export default function CatalogPage() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [itemName, setItemName] = useState("")

  // Check if we should show hints when page loads
  useEffect(() => {
    const shouldShowHints = localStorage.getItem("way2b1_start_domains_walkthrough") === "true"
    if (shouldShowHints) {
      localStorage.setItem("way2b1_show_catalog_hints", "true")
      localStorage.removeItem("way2b1_start_domains_walkthrough")
    }
  }, [])

  const handleSubmit = () => {
    setShowCreateModal(false)
    setShowToast(true)
    try {
      const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
      progress["add-catalog-item"] = true
      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
      window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
    } catch {}
    setTimeout(() => router.push("/"), 1200)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Left Sidebar - Categories (static) */}
            <div className="w-72 border-r border-border bg-card p-4">
              <div className="space-y-1">
                {["All items", "Legal documents", "Standard procedures", "Service providers"].map((name, i) => (
                  <button key={i} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"}`}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{name}</span>
                    </div>
                    <span className={`text-xs ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>0</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Top Bar */}
              <div className="border-b border-border bg-card px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><MoreHorizontal className="w-4 h-4" /> 9/9 columns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button id="btn-create-collection" className="flex items-center gap-2 bg-[#4F7CFF] text-white" onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4" />
                      New item
                    </Button>
                  </div>
                </div>
              </div>

              {/* Empty State */}
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No records to show</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Add new records to get started. Try adjusting your filters or search settings if you're expecting to see something specific.
                  </p>
                  <button id="btn-create-collection-empty" onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 bg-[#4F7CFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    New item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex relative">
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-semibold text-gray-900">Create new catalog item</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Name */}
              <div className="px-6 py-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="flex-1 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="px-6 py-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Organization <span className="text-red-500">*</span></label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Select organization</button>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Select category</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Workspace</label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Select workspace</button>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Tags</label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Add tags</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Cancel</button>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Share <Share2 className="w-4 h-4 ml-2" /></button>
                  <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-[#4F7CFF] rounded-lg hover:bg-[#4F7CFF]/90 transition-colors">Create</button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Add to catalog item</h3>
              <div className="space-y-2">
                {["Decisions", "Tasks", "Linked to", "Attachments", "Custom field", "Gallery"].map((t) => (
                  <button 
                    key={t} 
                    id={t === "Attachments" ? "btn-attachments" : t === "Gallery" ? "btn-gallery" : undefined}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">🎉</div>
          <div>
            <div className="font-semibold text-emerald-700">Item created!</div>
            <div className="text-sm text-foreground">Your progress has been updated</div>
          </div>
        </div>
      )}

      {/* Catalog Hints */}
      <CatalogHints />
    </div>
  )
}


