import { Activity } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PhaseProject } from "../types";
import { Phase2ProjectCard } from "./Phase2ProjectCard";

interface Phase2ProjectsListProps {
  projects: PhaseProject[];
  isLoading: boolean;
  hasDetailPanelOpen: boolean;
  onViewDetails: (projectId: string) => void;
}

export function Phase2ProjectsList({
  projects,
  isLoading,
  hasDetailPanelOpen,
  onViewDetails
}: Phase2ProjectsListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No Phase 2 Projects"
        description="You don't have any Phase 2 projects at this time. Phase 2 projects will appear here once Phase 1 is completed."
      />
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 lg:gap-8 transition-all duration-300 ${
      hasDetailPanelOpen
        ? 'grid-cols-1'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
    }`}>
      {projects.map((project) => (
        <Phase2ProjectCard
          key={project.id}
          project={project}
          onViewDetails={() => onViewDetails(project.id)}
        />
      ))}
    </div>
  );
}
