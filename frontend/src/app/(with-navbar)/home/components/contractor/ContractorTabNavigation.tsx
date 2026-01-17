import { Shield, FileCheck, Wrench } from "lucide-react";
import { ContractorTab } from "../types";

interface ContractorTabNavigationProps {
  activeTab: ContractorTab;
  onTabChange: (tab: ContractorTab) => void;
}

export function ContractorTabNavigation({
  activeTab,
  onTabChange
}: ContractorTabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {/* Section 1: Pending Auctions */}
        <button
          onClick={() => onTabChange('pending-ndas')}
          className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'pending-ndas'
              ? 'border-vendle-blue text-vendle-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Pending Auctions
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
            <FileCheck className="h-4 w-4" />
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
            <FileCheck className="h-4 w-4" />
            Phase 2
          </div>
        </button>

        {/* Separator */}
        <div className="border-l border-gray-300 h-8 my-auto"></div>

        {/* Section 3: My Jobs */}
        <button
          onClick={() => onTabChange('my-jobs')}
          className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            activeTab === 'my-jobs'
              ? 'border-vendle-blue text-vendle-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            My Jobs
          </div>
        </button>
      </nav>
    </div>
  );
}
