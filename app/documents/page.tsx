"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Upload, FileText, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { AIDocumentUpload } from "@/components/ai-document-upload"

export default function DocumentsPage() {
  const router = useRouter()
  const [walkthroughStep, setWalkthroughStep] = useState(0)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showAIUpload, setShowAIUpload] = useState(false)

  useEffect(() => {
    // Check if this is from onboarding checklist
    const activeModule = localStorage.getItem("way2b1_active_module")
    if (activeModule === "upload-document") {
      // Start walkthrough
      setWalkthroughStep(1)
      // Показуємо AI-powered завантаження для нових користувачів
      const userRole = localStorage.getItem("way2b1_user_role")
      const isFirstUpload = !localStorage.getItem("way2b1_document_uploaded")
      
      // AI-powered завантаження для Admin/Power User при першому завантаженні
      if ((userRole === "family-principal" || userRole === "investment-advisor" || userRole === "operations-manager") && isFirstUpload) {
        setShowAIUpload(true)
      }
    }
  }, [])

  const handleUploadClick = () => {
    if (walkthroughStep === 1) {
      setWalkthroughStep(2)
      setShowUploadModal(true)
    }
  }

  const handleFileSelect = () => {
    if (walkthroughStep === 2) {
      setShowUploadModal(false)
      setWalkthroughStep(3)
      setShowToast(true)

      // Mark module as complete
      const saved = localStorage.getItem("way2b1_module_progress")
      const progress = saved ? JSON.parse(saved) : {}
      progress["upload-document"] = true
      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
      localStorage.removeItem("way2b1_active_module")

      // Dispatch event to update progress badge
      window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))

      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-foreground mb-6">Documents</h1>

            {/* Empty state */}
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No documents yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload your first document to start sharing files with your team
              </p>

              {/* Upload button with walkthrough highlight */}
              <div className="relative inline-block">
                {walkthroughStep === 1 && !showAIUpload && (
                  <>
                    {/* Pulsing hotspot */}
                    <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
                    <div className="absolute -inset-4 bg-blue-500/30 rounded-full" />

                    <div className="absolute top-1/2 -translate-y-1/2 left-full ml-8 w-80 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl z-10">
                      <div className="font-semibold mb-2">Step 1: Upload Your First Document</div>
                      <div className="text-gray-300 leading-relaxed">
                        Натисніть кнопку "Завантажити документ" для завантаження файлу. AI автоматично проаналізує та створить структуру!
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-gray-900 rotate-45" />
                    </div>
                  </>
                )}

                {!showAIUpload && (
                  <button
                    onClick={handleUploadClick}
                    className="relative bg-[#4F7CFF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4F7CFF]/90 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Завантажити документ
                  </button>
                )}
              </div>

              {/* AI-Powered Upload для першого разу */}
              {showAIUpload && (
                <div className="max-w-md mx-auto mt-6">
                  <AIDocumentUpload
                    onUploadComplete={(document) => {
                      localStorage.setItem("way2b1_document_uploaded", "true")
                      setShowAIUpload(false)
                      setShowToast(true)
                      
                      // Mark module as complete
                      const saved = localStorage.getItem("way2b1_module_progress")
                      const progress = saved ? JSON.parse(saved) : {}
                      progress["upload-document"] = true
                      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
                      localStorage.removeItem("way2b1_active_module")
                      window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))

                      setTimeout(() => {
                        router.push("/")
                      }, 3000)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl relative">
            {walkthroughStep === 2 && (
              <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-80 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
                <div className="font-semibold mb-2">Step 2: Select a File</div>
                <div className="text-gray-300 leading-relaxed">
                  Choose any document from your computer. Supported formats include PDF, Word, Excel, and images. The
                  file will be securely stored and accessible to your team.
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45" />
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here</p>
              <p className="text-xs text-gray-500">or</p>
            </div>

            <button
              onClick={handleFileSelect}
              className="w-full bg-[#4F7CFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#4F7CFF]/90 transition-colors"
            >
              Choose File
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-xl">🎉</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Document uploaded!</div>
            <div className="text-sm text-gray-600">Your progress has been updated</div>
          </div>
        </div>
      )}
    </div>
  )
}
