import { Wrench } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Job } from "../types";
import { MyJobCard } from "./MyJobCard";

interface MyJobsListProps {
  jobs: Job[];
  isLoading: boolean;
  hasDetailPanelOpen: boolean;
  onManageJob: (job: Job) => void;
  onOpenChat: (job: Job) => void;
}

export function MyJobsList({
  jobs,
  isLoading,
  hasDetailPanelOpen,
  onManageJob,
  onOpenChat
}: MyJobsListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No Active Jobs"
        description="You don't have any active jobs yet. Jobs will appear here once you win an auction and both parties accept the contract."
      />
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 lg:gap-8 transition-all duration-300 ${
      hasDetailPanelOpen
        ? 'grid-cols-1'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
    }`}>
      {jobs.map((job) => (
        <MyJobCard
          key={job.id}
          job={job}
          onManageJob={() => onManageJob(job)}
          onOpenChat={() => onOpenChat(job)}
        />
      ))}
    </div>
  );
}
