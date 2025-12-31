import { Shield } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { PendingNDA } from "../types";
import { PendingNDACard } from "./PendingNDACard";

interface PendingNDAsListProps {
  ndas: PendingNDA[];
  isLoading: boolean;
  hasDetailPanelOpen: boolean;
  onReviewNDA: (nda: PendingNDA) => void;
}

export function PendingNDAsList({
  ndas,
  isLoading,
  hasDetailPanelOpen,
  onReviewNDA
}: PendingNDAsListProps) {
  if (ndas.length === 0) {
    return (
      <EmptyState
        icon={Shield}
        title="No Pending NDAs"
        description="You don't have any pending NDAs at this time."
      />
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 lg:gap-8 transition-all duration-300 ${
      hasDetailPanelOpen
        ? 'grid-cols-1'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
    }`}>
      {ndas.map((nda) => (
        <PendingNDACard
          key={nda.id}
          nda={nda}
          onReviewNDA={() => onReviewNDA(nda)}
        />
      ))}
    </div>
  );
}
