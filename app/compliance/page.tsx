"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, CheckCircle2, FileCheck, AlertTriangle, Clock, ArrowLeft } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Sidebar } from "@/components/sidebar"

export default function CompliancePage() {
  const router = useRouter()
  const [isFromOnboarding, setIsFromOnboarding] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const [walkthroughStep, setWalkthroughStep] = useState(0)
  const [complianceEnabled, setComplianceEnabled] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const activeModule = localStorage.getItem("way2b1_active_module")
    if (activeModule === "configure-compliance") {
      setIsFromOnboarding(true)
      setShowWalkthrough(true)
    }

    // Check if compliance is already enabled
    const saved = localStorage.getItem("way2b1_compliance_enabled")
    if (saved === "true") {
      setComplianceEnabled(true)
    }
  }, [])

  const handleEnableCompliance = () => {
    setComplianceEnabled(true)
    localStorage.setItem("way2b1_compliance_enabled", "true")

    // Mark the onboarding task as complete
    if (isFromOnboarding) {
      const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
      progress["configure-compliance"] = true
      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
      window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
    }

    setShowSuccess(true)
    setShowWalkthrough(false)

    // Show success message then redirect
    setTimeout(() => {
      if (isFromOnboarding) {
        router.push("/")
      }
      try { window.dispatchEvent(new CustomEvent("requestFeedback")) } catch {}
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="border-b border-border bg-card">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Compliance Tracking</h1>
                  <p className="text-sm text-muted-foreground">Configure audit trails and regulatory reporting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {!complianceEnabled ? (
              // Empty State
              <div className="max-w-2xl mx-auto">
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Compliance Not Configured</h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Enable compliance tracking to ensure process transparency, maintain audit trails, and meet
                    regulatory requirements for your family office operations.
                  </p>

                  <div className="space-y-4 mb-8 text-left">
                    <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                      <FileCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground mb-1">Audit Trail Logging</div>
                        <div className="text-sm text-muted-foreground">
                          Track all decision changes, approvals, and document access
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground mb-1">Regulatory Compliance</div>
                        <div className="text-sm text-muted-foreground">
                          Meet SEC, FINRA, and other regulatory requirements
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground mb-1">Historical Reporting</div>
                        <div className="text-sm text-muted-foreground">
                          Generate compliance reports for any time period
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEnableCompliance}
                    className={`bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all ${
                      showWalkthrough && walkthroughStep === 0 ? "ring-4 ring-primary/30 animate-pulse" : ""
                    }`}
                  >
                    Enable Compliance Tracking
                  </button>
                </div>

                {/* Walkthrough Tooltip */}
                {showWalkthrough && walkthroughStep === 0 && (
                  <div className="mt-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">Set Up Compliance</div>
                        <div className="text-sm opacity-90">
                          Click "Enable Compliance Tracking" to configure audit trails and regulatory reporting for your
                          family office.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Compliance Enabled State
              <div className="max-w-4xl mx-auto">
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-emerald-700">Compliance Tracking Enabled</div>
                      <div className="text-sm text-foreground">
                        All decisions and documents are now tracked for audit purposes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Audit Logs</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      View complete history of all actions, approvals, and changes
                    </p>
                    <button className="text-sm text-primary hover:underline">View audit logs →</button>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Compliance Reports</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Generate regulatory compliance reports</p>
                    <button className="text-sm text-primary hover:underline">Generate report →</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Success Toast */}
          {showSuccess && (
            <div className="fixed bottom-6 right-6 bg-accent text-white px-6 py-4 rounded-lg shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3 z-50">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <div className="font-semibold">Compliance tracking enabled!</div>
                <div className="text-sm opacity-90">Your progress has been updated</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
