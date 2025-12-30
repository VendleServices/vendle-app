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
    <div className={`grid gap-6 sm:gap-8 transition-all duration-300 ${
      hasDetailPanelOpen
        ? 'grid-cols-1 md:grid-cols-1'
        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
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
