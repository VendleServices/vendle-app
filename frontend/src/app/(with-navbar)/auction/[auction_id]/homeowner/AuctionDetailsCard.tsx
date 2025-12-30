import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Clock } from "lucide-react";
import { AuctionDetailsCardProps } from "../types";

export function AuctionDetailsCard({ auction }: AuctionDetailsCardProps) {
  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <CardTitle className="text-2xl font-semibold text-foreground">
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
              <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {auction?.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Project Description
            </h3>
            <div className="space-y-4 rounded-xl bg-muted p-4">
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
            <h3 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Auction Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center rounded-xl border border-border bg-background p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(217,64%,23%)]/10">
                  <DollarSign className="h-5 w-5 text-[hsl(217,64%,23%)]" />
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
              <div className="flex items-center rounded-xl border border-border bg-background p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                  <Clock className="h-5 w-5 text-red-600" />
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
