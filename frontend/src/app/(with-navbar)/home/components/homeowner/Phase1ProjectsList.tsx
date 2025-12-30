import { Activity } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PhaseProject } from "../types";
import { Phase1ProjectCard } from "./Phase1ProjectCard";

interface Phase1ProjectsListProps {
  projects: PhaseProject[];
  isLoading: boolean;
  hasDetailPanelOpen: boolean;
  onViewDetails: (projectId: string) => void;
}

export function Phase1ProjectsList({
  projects,
  isLoading,
  hasDetailPanelOpen,
  onViewDetails
}: Phase1ProjectsListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No Phase 1 Projects"
        description="You don't have any Phase 1 projects at this time. Phase 1 projects will appear here once contractors accept NDAs and begin work."
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
        <Phase1ProjectCard
          key={project.id}
          project={project}
          onViewDetails={() => onViewDetails(project.id)}
        />
      ))}
    </div>
  );
}
