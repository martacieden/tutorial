"use client"

import { Home, Users2, Briefcase, Workflow, CheckSquare, DollarSign, FolderTree, Settings, Building2, Users, PlugZap, Tag, Shield, FileText } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

interface SidebarProps {
  onStartTutorial: () => void
  onOpenTutorialCenter?: () => void
  onLogoClick?: () => void
}

export function Sidebar({ onStartTutorial, onOpenTutorialCenter, onLogoClick }: SidebarProps) {
  const pathname = usePathname()
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  // Auto-expand Admin section if on admin pages
  useEffect(() => {
    const adminPaths = ["/team", "/more/organization", "/settings"]
    setIsAdminOpen(adminPaths.some(path => pathname?.startsWith(path)))
  }, [pathname])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onLogoClick) {
      e.preventDefault()
      onLogoClick()
    }
  }

  return (
    <div className="flex">
      {/* Main Sidebar */}
      <aside className="w-[80px] bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-2 pt-6 pb-4">
          {onLogoClick ? (
            <button
              onClick={handleLogoClick}
              className="w-full text-xs font-bold text-gray-800 text-center hover:text-gray-600 transition-colors cursor-pointer"
            >
              WAY2B1
            </button>
          ) : (
            <Link href="/">
              <div className="text-xs font-bold text-gray-800 text-center">WAY2B1</div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1" id="navigation">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Users2 className="w-5 h-5" />
            <span className="text-xs">Clients</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs">Projects</span>
          </Link>
          <Link
            id="sidebar-decisions-link"
            href="/decisions"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/decisions"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Workflow className="w-5 h-5" />
            <span className="text-xs">Decisions</span>
          </Link>
          <Link
            id="sidebar-tasks-link"
            href="/tasks"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/tasks"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs">Tasks</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Budgets</span>
          </Link>
          <Link
            href="/catalog"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/catalog"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FolderTree className="w-5 h-5" />
            <span className="text-xs">Catalog</span>
          </Link>
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`w-full flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname?.startsWith("/team") || pathname?.startsWith("/more/organization") || pathname?.startsWith("/settings")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Admin</span>
          </button>
        </nav>
      </aside>

      {/* Admin Navigation Panel */}
      {isAdminOpen && (
        <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 pt-6 pb-4">
            <h2 className="text-sm font-semibold text-gray-900">Admin</h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <Link
              href="/more/organization"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/more/organization"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Organization profile</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Workflow className="w-4 h-4" />
              <span>Workflows</span>
            </Link>
            <Link
              href="/team"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/team"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teams</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Users2 className="w-4 h-4" />
              <span>Users</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <PlugZap className="w-4 h-4" />
              <span>Integration hub</span>
            </Link>
            <Link
              href="/catalog"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/catalog"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Task statuses</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Tag className="w-4 h-4" />
              <span>Tag management</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Permission sets</span>
            </Link>
          </nav>
        </aside>
      )}
    </div>
  )
}
