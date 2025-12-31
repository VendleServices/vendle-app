import { FileCheck } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
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
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FileCheck}
        title="No Phase 1 Projects"
        description="You don't have any active Phase 1 projects at this time."
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
        <Phase1ProjectCard
          key={project.id}
          project={project}
          onViewDetails={() => onViewDetails(project.id)}
        />
      ))}
    </div>
  );
}
