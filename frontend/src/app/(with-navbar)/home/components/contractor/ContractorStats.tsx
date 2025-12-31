import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileCheck, Briefcase } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Phase 1 Contract Value</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.phase1Value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {phase1ProjectCount} active project{phase1ProjectCount !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Phase 2 Contract Value</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.phase2Value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {phase2ProjectCount} active project{phase2ProjectCount !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeContracts}</div>
          <p className="text-xs text-muted-foreground">
            ${stats.activeValue.toLocaleString()} active value
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
