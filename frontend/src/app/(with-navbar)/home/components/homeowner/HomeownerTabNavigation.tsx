import { Building2, Activity, Wrench } from "lucide-react";
import { HomeownerTab } from "../types";

interface HomeownerTabNavigationProps {
  activeTab: HomeownerTab;
  onTabChange: (tab: HomeownerTab) => void;
}

export function HomeownerTabNavigation({
  activeTab,
  onTabChange
}: HomeownerTabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {/* Section 1: Pre-Launch */}
        <button
          onClick={() => onTabChange('pre-launch')}
          className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'pre-launch'
              ? 'border-vendle-blue text-vendle-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Pre-Launch
          </div>
        </button>

        {/* Separator */}
        <div className="border-l border-gray-300 h-8 my-auto"></div>

        {/* Section 2: Phase 1 and Phase 2 */}
        <button
          onClick={() => onTabChange('phase-1')}
          className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'phase-1'
              ? 'border-vendle-blue text-vendle-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Phase 1
          </div>
        </button>
        <button
          onClick={() => onTabChange('phase-2')}
          className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'phase-2'
              ? 'border-vendle-blue text-vendle-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Phase 2
          </div>
        </button>

        {/* Separator */}
        <div className="border-l border-gray-300 h-8 my-auto"></div>

        {/* Section 3: Active Rebuild */}
        <button
          onClick={() => onTabChange('active-rebuild')}
          className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'active-rebuild'
              ? 'border-vendle-blue text-vendle-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Active Rebuild
          </div>
        </button>
      </nav>
    </div>
  );
}
