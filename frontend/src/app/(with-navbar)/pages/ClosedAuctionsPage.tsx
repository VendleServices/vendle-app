"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuctionCard } from "@/components/AuctionCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Plus, Archive } from "lucide-react";

interface ClosedAuction {
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

interface ClosedAuctionsPageProps {
  auctions?: ClosedAuction[];
  isLoading?: boolean;
  onDeleteAuction?: (auctionId: string) => void;
}

export function ClosedAuctionsPage({
  auctions = [],
  isLoading = false,
  onDeleteAuction,
}: ClosedAuctionsPageProps) {
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

  const handleDelete = (auctionId: string) => {
    if (onDeleteAuction) {
      onDeleteAuction(auctionId);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 sm:px-8 lg:px-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Closed Auctions
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              View and manage your closed auctions
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
              icon={Archive}
              title="No closed auctions yet"
              description="When you close auctions or they expire, they'll appear here for your reference."
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
                  status={auction.status as "closed" | "cancelled" | "expired"}
                  onViewDetails={() => handleViewDetails(auction.auction_id)}
                  onDelete={onDeleteAuction ? () => handleDelete(auction.auction_id) : undefined}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
