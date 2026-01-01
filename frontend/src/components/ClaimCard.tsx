"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Compass, User, Eye, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/formatting";
import { useState } from "react";

interface ClaimCardProps {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  projectType: string;
  designPlan: string;
  needsAdjuster: boolean;
  insuranceProvider?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  onViewDetails: () => void;
  onCreateRestoration?: () => void;
  onDelete?: () => void;
}

export function ClaimCard({
  id,
  street,
  city,
  state,
  zipCode,
  projectType,
  designPlan,
  needsAdjuster,
  insuranceProvider,
  createdAt,
  updatedAt,
  onViewDetails,
  onCreateRestoration,
  onDelete,
}: ClaimCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const address = `${street}, ${city}, ${state} ${zipCode}`;

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
      <Card className="group relative h-full rounded-2xl border border-border/50 bg-card shadow-subtle hover:shadow-strong hover:border-primary/20 transition-all duration-200 cursor-pointer hover:translate-y-[-2px]">
        <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
          {/* Header Section */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-foreground leading-tight mb-1">
                  {address}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {insuranceProvider || "No provider specified"}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`capitalize text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium shadow-sm ${getDamageTypeColor(projectType)}`}
              >
                {projectType}
              </Badge>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Metadata Section */}
          <div className="flex-1 space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Filed:</span>
              <span className="text-sm font-medium text-foreground">
                {formatDate(createdAt)}
              </span>
            </div>

            {updatedAt && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(updatedAt)}
                  </span>
                </div>
              </>
            )}

            {designPlan && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Design Plan:</span>
                  <span className="text-sm font-medium text-foreground">{designPlan}</span>
                </div>
              </>
            )}

            <Separator />
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Needs Adjuster:</span>
              <Badge
                variant={needsAdjuster ? "default" : "secondary"}
                className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 shadow-sm ${needsAdjuster ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-gray-100 text-gray-600"}`}
              >
                {needsAdjuster ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <Button
                variant="default"
                size="sm"
                onClick={onCreateRestoration}
                className="w-full sm:flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap p-2"
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Create Restoration</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={onViewDetails}
                className="w-full sm:flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap hover:bg-primary hover:text-white transition-colors p-2"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">View Details</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to get damage type color
function getDamageTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "water damage":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
    case "fire damage":
      return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
    case "mold remediation":
      return "bg-vendle-teal/10 text-vendle-teal hover:bg-vendle-teal/15 border-vendle-teal/20";
    case "storm damage":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200";
    case "full":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
  }
}