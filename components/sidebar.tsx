"use client"

import { Home, Users2, Briefcase, Workflow, CheckSquare, DollarSign, FolderTree, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

interface SidebarProps {
  onStartTutorial: () => void
  onOpenTutorialCenter?: () => void
  onLogoClick?: () => void
}

export function Sidebar({ onStartTutorial, onOpenTutorialCenter, onLogoClick }: SidebarProps) {
  const pathname = usePathname()

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onLogoClick) {
      e.preventDefault()
      onLogoClick()
    }
  }

  return (
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
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
            pathname === "/settings"
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Admin</span>
        </Link>
      </nav>
    </aside>
  )
}
