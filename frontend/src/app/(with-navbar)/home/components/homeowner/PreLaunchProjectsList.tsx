import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PreLaunchProjectCard } from "./PreLaunchProjectCard";

interface PreLaunchProjectsListProps {
  claims: any[];
  isLoading: boolean;
  hasDetailPanelOpen: boolean;
  onViewDetails: (claim: any) => void;
  onInviteContractors: (claim: any) => void;
  onLaunch: (claim: any) => void;
  onNavigateToStartClaim: () => void;
}

export function PreLaunchProjectsList({
  claims,
  isLoading,
  hasDetailPanelOpen,
  onViewDetails,
  onInviteContractors,
  onLaunch,
  onNavigateToStartClaim
}: PreLaunchProjectsListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (claims.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No Pre-Launch Projects"
        description="Complete the Vendle It process to create a pre-launch project. Once submitted, it will appear here and be visible to contractors."
        actionLabel="Start Vendle It"
        onAction={onNavigateToStartClaim}
      />
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 lg:gap-8 transition-all duration-300 ${
      hasDetailPanelOpen
        ? 'grid-cols-1'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
    }`}>
      {claims.map((claim) => (
        <PreLaunchProjectCard
          key={claim.id}
          claim={claim}
          onViewDetails={() => onViewDetails(claim)}
          onInviteContractors={() => onInviteContractors(claim)}
          onLaunch={() => onLaunch(claim)}
        />
      ))}
    </div>
  );
}
