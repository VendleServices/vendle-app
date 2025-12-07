"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { Coins, Users, Clock, Eye, ArrowRight } from "lucide-react";
import { useState } from "react";

interface AuctionCardProps {
  title: string;
  scope?: string;
  finalBid?: number | null;
  totalBids: number;
  endedAt: string | Date;
  status: "closed" | "cancelled" | "expired" | "open";
  onViewDetails: () => void;
  onDelete?: () => void;
}

export function AuctionCard({
  title,
  scope,
  finalBid,
  totalBids,
  endedAt,
  status,
  onViewDetails,
  onDelete,
}: AuctionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="group relative h-full rounded-2xl border bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:translate-y-[-2px]">
        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
          {/* Header Section */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-foreground leading-tight mb-1">
                  {title}
                </h3>
                {scope && (
                  <p className="text-sm text-muted-foreground">
                    {scope}
                  </p>
                )}
              </div>
              <Badge 
                variant="secondary" 
                className={`capitalize text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(status)}`}
              >
                {status}
              </Badge>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Metadata Section */}
          <div className="flex-1 space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Coins className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{status === "open" ? "Current Bid:" : "Final Bid:"}</span>
              <span className="text-sm font-medium text-foreground">
                {finalBid ? formatCurrency(finalBid) : "No bids"}
              </span>
            </div>

            <Separator />
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Total Bids:</span>
              <span className="text-sm font-medium text-foreground">
                {totalBids}
              </span>
            </div>

            <Separator />
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{status === "open" ? "Ends:" : "Ended:"}</span>
              <span className="text-sm font-medium text-foreground">
                {formatDate(endedAt)}
              </span>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onViewDetails}
              className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
            
            {status === "open" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewDetails}
                className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-primary hover:text-white transition-colors p-2"
              >
                <ArrowRight className="h-4 w-4" />
                Place Bid
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
    case "closed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
    case "expired":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
  }
}
