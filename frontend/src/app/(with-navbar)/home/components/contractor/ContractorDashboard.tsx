import { ContractorStats } from "./ContractorStats";
import { ContractorTabNavigation } from "./ContractorTabNavigation";
import { PendingNDAsList } from "./PendingNDAsList";
import { Phase1ProjectsList } from "./Phase1ProjectsList";
import { Phase2ProjectsList } from "./Phase2ProjectsList";
import { MyJobsList } from "./MyJobsList";
import {
  ContractorTab,
  PendingNDA,
  PhaseProject,
  Job,
  ContractorStats as ContractorStatsType
} from "../types";
import { toast } from "sonner";

interface ContractorDashboardProps {
  // Data
  contractorStats: ContractorStatsType;
  pendingNDAs: PendingNDA[];
  phase1Projects: PhaseProject[];
  phase2Projects: PhaseProject[];
  myJobs: Job[];

  // Loading states
  jobsLoading: boolean;

  // UI state
  activeTab: ContractorTab;
  hasJobDetailPanelOpen: boolean;

  // Callbacks
  onTabChange: (tab: ContractorTab) => void;
  onNavigateToAuction: (auctionId: string) => void;
  onManageJob: (job: Job) => void;
  onOpenChat: (job: Job) => void;
}

export function ContractorDashboard({
  contractorStats,
  pendingNDAs,
  phase1Projects,
  phase2Projects,
  myJobs,
  jobsLoading,
  activeTab,
  hasJobDetailPanelOpen,
  onTabChange,
  onNavigateToAuction,
  onManageJob,
  onOpenChat
}: ContractorDashboardProps) {
  const handleReviewNDA = () => {
    toast("NDA review functionality coming soon");
  };

  return (
    <div className={`space-y-6 transition-all duration-300 ${hasJobDetailPanelOpen ? 'pr-[480px]' : ''}`}>
      {/* Stats Grid */}
      <ContractorStats
        stats={contractorStats}
        phase1ProjectCount={phase1Projects.length}
        phase2ProjectCount={phase2Projects.length}
      />

      {/* Tab Navigation */}
      <ContractorTabNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Tab Content */}
      <div>
        {activeTab === 'pending-ndas' && (
          <PendingNDAsList
            ndas={pendingNDAs}
            isLoading={false}
            hasDetailPanelOpen={hasJobDetailPanelOpen}
            onReviewNDA={handleReviewNDA}
          />
        )}

        {activeTab === 'phase-1' && (
          <Phase1ProjectsList
            projects={phase1Projects}
            isLoading={false}
            hasDetailPanelOpen={hasJobDetailPanelOpen}
            onViewDetails={onNavigateToAuction}
          />
        )}

        {activeTab === 'phase-2' && (
          <Phase2ProjectsList
            projects={phase2Projects}
            isLoading={false}
            hasDetailPanelOpen={hasJobDetailPanelOpen}
            onViewDetails={onNavigateToAuction}
          />
        )}

        {activeTab === 'my-jobs' && (
          <MyJobsList
            jobs={myJobs}
            isLoading={jobsLoading}
            hasDetailPanelOpen={hasJobDetailPanelOpen}
            onManageJob={onManageJob}
            onOpenChat={onOpenChat}
          />
        )}
      </div>
    </div>
  );
}
