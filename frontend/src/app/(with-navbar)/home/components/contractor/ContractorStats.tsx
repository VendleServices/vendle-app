import { DollarSign, Briefcase, Gavel, Hammer } from "lucide-react";
import { ContractorStats as ContractorStatsType } from "../types";

interface ContractorStatsProps {
  stats: ContractorStatsType;
  phase1ProjectCount: number;
  phase2ProjectCount: number;
}

export function ContractorStats({
  stats,
  phase1ProjectCount,
  phase2ProjectCount
}: ContractorStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-vendle-blue/10 flex items-center justify-center flex-shrink-0">
            <Gavel className="h-4 w-4 text-vendle-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Phase 1 Value</p>
            <p className="text-lg font-semibold text-gray-900">${stats.phase1Value.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">
              {phase1ProjectCount} project{phase1ProjectCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
            <Hammer className="h-4 w-4 text-vendle-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Phase 2 Value</p>
            <p className="text-lg font-semibold text-gray-900">${stats.phase2Value.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">
              {phase2ProjectCount} project{phase2ProjectCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Briefcase className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Active Contracts</p>
            <p className="text-lg font-semibold text-gray-900">{stats.activeContracts}</p>
            <p className="text-[10px] text-gray-500">
              ${stats.activeValue.toLocaleString()} value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
