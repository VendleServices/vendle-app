import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, Clock } from "lucide-react";
import { ProjectOverviewCardProps } from "../types";

export function ProjectOverviewCard({ auction }: ProjectOverviewCardProps) {
  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader className="border-b border-border pb-5">
        <h2 className="text-lg font-semibold text-foreground">Project Overview</h2>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </h3>
          <p className="text-base leading-relaxed text-foreground">
            {auction?.aiSummary || auction?.additionalNotes}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-xl bg-muted p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Starting Bid
            </p>
            <p className="text-2xl font-semibold text-foreground">
              ${auction?.totalJobValue?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Minimum opening bid set by homeowner
            </p>
          </div>

          <div className="space-y-3 rounded-xl bg-muted p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Auction Ends
            </p>
            <p className="text-base font-semibold text-foreground">
              {new Date(auction?.endDate).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Bids after this time will not be accepted
            </p>
          </div>
        </section>

        {auction?.reconstructionType && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Scope of Work
            </h3>
            <div className="rounded-xl border border-dashed border-border bg-background/60 p-4">
              <p className="text-sm text-foreground">{auction?.reconstructionType}</p>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
