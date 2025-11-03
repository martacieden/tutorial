import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { OnboardingProgressBadge } from "./onboarding-progress-badge"

export function Topbar() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      {/* Left side: Search */}
      <div className="flex items-center gap-6 flex-1">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="user-search-input"
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4" id="actionButtons">
        <OnboardingProgressBadge />
        
        <a id="user-current-gen-switch" href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Go to Way2B1
        </a>

        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        
        <Avatar id="user-profile-avatar" className="w-9 h-9 cursor-pointer">
          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">MK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
