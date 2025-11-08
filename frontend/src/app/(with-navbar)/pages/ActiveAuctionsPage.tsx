"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuctionCard } from "@/components/AuctionCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Plus, Users, Clock } from "lucide-react";

interface ActiveAuction {
  auction_id: string;
  claim_id: string;
  title: string;
  project_type: string;
  starting_bid: number;
  current_bid: number;
  bid_count: number;
  end_date: string;
  status: string;
  property_address: string;
  design_plan: string;
}

interface ActiveAuctionsPageProps {
  auctions?: ActiveAuction[];
  isLoading?: boolean;
}

export function ActiveAuctionsPage({
  auctions = [],
  isLoading = false,
}: ActiveAuctionsPageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartNewClaim = () => {
    router.push("/start-claim");
  };

  const handleViewDetails = (auctionId: string) => {
    router.push(`/auction/${auctionId}`);
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
              Active Auctions
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Browse and manage your active auctions
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
          ) : auctions.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No active auctions"
              description="There are currently no active auctions to display. Start a new claim to create an auction."
              actionLabel="Start New Claim"
              onAction={handleStartNewClaim}
            />
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {auctions.map((auction) => (
                <AuctionCard
                  key={auction.auction_id}
                  title={auction.title}
                  scope={auction.project_type}
                  finalBid={auction.current_bid}
                  totalBids={auction.bid_count}
                  endedAt={auction.end_date}
                  status="open" // Active auctions should show as "open"
                  onViewDetails={() => handleViewDetails(auction.auction_id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

