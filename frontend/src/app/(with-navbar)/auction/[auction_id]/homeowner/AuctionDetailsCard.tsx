import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Clock } from "lucide-react";
import { AuctionDetailsCardProps } from "../types";

export function AuctionDetailsCard({ auction }: AuctionDetailsCardProps) {
  return (
    <Card className="shadow-lg border-2 border-vendle-gray/20 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="border-b-2 border-vendle-gray/10 pb-6 bg-gradient-to-r from-vendle-blue/5 to-transparent">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <CardTitle className="text-3xl font-bold text-foreground tracking-tight">
              {auction?.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <Users className="h-3.5 w-3.5" />
                {auction?.bids?.length} bids
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <DollarSign className="h-3.5 w-3.5" />
                Current ${auction?.bids?.[0]?.amount}
              </Badge>
              <Badge className="rounded-full bg-[#5A9E8B]/10 px-3 py-1 text-xs font-semibold text-[#5A9E8B] border border-[#5A9E8B]/30">
                {auction?.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="border-b-2 border-vendle-blue/20 pb-3 text-sm font-bold uppercase tracking-wider text-vendle-blue">
              Project Description
            </h3>
            <div className="space-y-4 rounded-xl bg-gradient-to-br from-vendle-blue/5 to-transparent p-5 border border-vendle-gray/20 shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {auction?.aiSummary || auction?.additionalNotes || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Project Type
                </p>
                <p className="text-sm text-foreground">
                  {auction?.reconstructionType || "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="border-b-2 border-vendle-teal/20 pb-3 text-sm font-bold uppercase tracking-wider text-vendle-teal">
              Auction Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center rounded-xl border-2 border-vendle-blue/20 bg-gradient-to-r from-vendle-blue/5 to-transparent p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-vendle-blue/20 shadow-sm">
                  <DollarSign className="h-6 w-6 text-vendle-blue" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Starting Bid
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    ${auction?.totalJobValue?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center rounded-xl border-2 border-[#4A637D]/20 bg-gradient-to-r from-[#4A637D]/5 to-transparent p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A637D]/20 shadow-sm">
                  <Clock className="h-6 w-6 text-[#4A637D]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Auction Ends
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {new Date(auction?.endDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
