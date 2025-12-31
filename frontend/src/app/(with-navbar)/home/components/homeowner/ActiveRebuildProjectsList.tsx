import { Wrench } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { HomeownerProject } from "../types";
import { ActiveRebuildProjectCard } from "./ActiveRebuildProjectCard";

interface ActiveRebuildProjectsListProps {
  projects: HomeownerProject[];
  isLoading: boolean;
  hasDetailPanelOpen: boolean;
  onViewDetails: (projectId: string) => void;
  onManageProject: (projectId: string) => void;
}

export function ActiveRebuildProjectsList({
  projects,
  isLoading,
  hasDetailPanelOpen,
  onViewDetails,
  onManageProject
}: ActiveRebuildProjectsListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No Active Rebuild Projects"
        description="Projects that have completed all phases will appear here once construction begins."
      />
    );
  }

  return (
    <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
      hasDetailPanelOpen
        ? 'grid-cols-1 md:grid-cols-1'
        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
    }`}>
      {projects.map((project) => (
        <ActiveRebuildProjectCard
          key={project.id}
          project={project}
          onViewDetails={() => onViewDetails(project.claimId)}
          onManageProject={() => onManageProject(project.id)}
        />
      ))}
    </div>
  );
}
