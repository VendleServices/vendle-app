"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ClaimCard } from "@/components/ClaimCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Plus, FileText } from "lucide-react";

interface Claim {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  projectType: string;
  designPlan: string;
  needsAdjuster: boolean;
  insuranceProvider?: string;
  insuranceEstimateFilePath: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface ClaimsPageProps {
  claims?: Claim[];
  isLoading?: boolean;
  onDeleteClaim?: (id: string) => void;
}

export function ClaimsPage({
  claims = [],
  isLoading = false,
  onDeleteClaim,
}: ClaimsPageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartNewClaim = () => {
    router.push("/start-claim");
  };

  const handleViewDetails = (claimId: string) => {
    router.push(`/claim/${claimId}`);
  };

  const handleCreateRestoration = (claimId: string) => {
    router.push(`/start-claim/create-restor/${claimId}`);
  };

  const handleDelete = (claimId: string) => {
    if (onDeleteClaim) {
      onDeleteClaim(claimId);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Claims
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              View and manage your insurance claims
            </p>
          </div>
          <Button
            onClick={handleStartNewClaim}
            className="gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Start New Claim
          </Button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : claims.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No claims found"
              description="You haven't filed any claims yet. Start a new claim to get started with your recovery process."
              actionLabel="Start New Claim"
              onAction={handleStartNewClaim}
            />
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {claims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  id={claim.id}
                  street={claim.street}
                  city={claim.city}
                  state={claim.state}
                  zipCode={claim.zipCode}
                  projectType={claim.projectType}
                  designPlan={claim.designPlan}
                  needsAdjuster={claim.needsAdjuster}
                  insuranceProvider={claim.insuranceProvider}
                  createdAt={claim.createdAt}
                  updatedAt={claim.updatedAt}
                  onViewDetails={() => handleViewDetails(claim.id)}
                  onCreateRestoration={() => handleCreateRestoration(claim.id)}
                  onDelete={onDeleteClaim ? () => handleDelete(claim.id) : undefined}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

