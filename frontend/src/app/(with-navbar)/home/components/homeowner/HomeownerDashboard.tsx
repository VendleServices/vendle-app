import { HomeownerTabNavigation } from "./HomeownerTabNavigation";
import { PreLaunchProjectsList } from "./PreLaunchProjectsList";
import { Phase1ProjectsList } from "./Phase1ProjectsList";
import { Phase2ProjectsList } from "./Phase2ProjectsList";
import { ActiveRebuildProjectsList } from "./ActiveRebuildProjectsList";
import {
  HomeownerTab,
  PhaseProject,
  HomeownerProject
} from "../types";

interface HomeownerDashboardProps {
  // Data
  preLaunchClaims: any[];
  phase1Projects: PhaseProject[];
  phase2Projects: PhaseProject[];
  activeRebuildProjects: HomeownerProject[];

  // Loading states
  claimsLoading: boolean;
  auctionsLoading: boolean;
  homeownerProjectsLoading: boolean;

  // UI state
  activeTab: HomeownerTab;
  hasDetailPanelOpen: boolean;

  // Callbacks
  onTabChange: (tab: HomeownerTab) => void;
  onNavigateToStartClaim: () => void;
  onNavigateToAuction: (auctionId: string) => void;
  onViewPreLaunchDetails: (claim: any) => void;
  onInviteContractors: (claim: any) => void;
  onLaunchClaim: (claim: any) => void;
  onNavigateToProject: (projectId: string) => void;
  onNavigateToClaim: (claimId: string) => void;
}

export function HomeownerDashboard({
  preLaunchClaims,
  phase1Projects,
  phase2Projects,
  activeRebuildProjects,
  claimsLoading,
  auctionsLoading,
  homeownerProjectsLoading,
  activeTab,
  hasDetailPanelOpen,
  onTabChange,
  onNavigateToStartClaim,
  onNavigateToAuction,
  onViewPreLaunchDetails,
  onInviteContractors,
  onLaunchClaim,
  onNavigateToProject,
  onNavigateToClaim
}: HomeownerDashboardProps) {
  return (
    <div className={`space-y-6 transition-all duration-300 px-4 py-8 max-w-full ${hasDetailPanelOpen ? 'pr-[480px]' : ''}`}>
      {/* Tab Navigation */}
      <HomeownerTabNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Tab Content */}
      <div>
        {activeTab === 'pre-launch' && (
          <PreLaunchProjectsList
            claims={preLaunchClaims}
            isLoading={claimsLoading}
            hasDetailPanelOpen={hasDetailPanelOpen}
            onViewDetails={onViewPreLaunchDetails}
            onInviteContractors={onInviteContractors}
            onLaunch={onLaunchClaim}
            onNavigateToStartClaim={onNavigateToStartClaim}
          />
        )}

        {activeTab === 'phase-1' && (
          <Phase1ProjectsList
            projects={phase1Projects}
            isLoading={auctionsLoading}
            hasDetailPanelOpen={hasDetailPanelOpen}
            onViewDetails={onNavigateToAuction}
          />
        )}

        {activeTab === 'phase-2' && (
          <Phase2ProjectsList
            projects={phase2Projects}
            isLoading={auctionsLoading}
            hasDetailPanelOpen={hasDetailPanelOpen}
            onViewDetails={onNavigateToAuction}
          />
        )}

        {activeTab === 'active-rebuild' && (
          <ActiveRebuildProjectsList
            projects={activeRebuildProjects}
            isLoading={homeownerProjectsLoading}
            hasDetailPanelOpen={hasDetailPanelOpen}
            onViewDetails={onNavigateToClaim}
            onManageProject={onNavigateToProject}
          />
        )}
      </div>
    </div>
  );
}
