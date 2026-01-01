import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, Clock } from "lucide-react";
import { ProjectOverviewCardProps } from "../types";

export function ProjectOverviewCard({ auction }: ProjectOverviewCardProps) {
  return (
    <Card className="shadow-lg border-2 border-vendle-gray/20 hover:shadow-xl transition-all duration-300 bg-white">
      <CardHeader className="border-b-2 border-vendle-gray/10 pb-5 bg-vendle-blue/5">
        <h2 className="text-2xl font-bold text-foreground">Project Overview</h2>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-vendle-blue border-b-2 border-vendle-blue/20 pb-2">
            Description
          </h3>
          <p className="text-base leading-relaxed text-foreground">
            {auction?.aiSummary || auction?.additionalNotes}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-xl bg-vendle-blue/10 p-5 border-2 border-vendle-blue/20 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wide text-vendle-blue">
              Starting Bid
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${auction?.totalJobValue?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Minimum opening bid set by homeowner
            </p>
          </div>

          <div className="space-y-3 rounded-xl bg-[#4A637D]/10 p-5 border-2 border-[#4A637D]/20 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-wide text-[#4A637D]">
              Auction Ends
            </p>
            <p className="text-lg font-bold text-foreground">
              {new Date(auction?.endDate).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Bids after this time will not be accepted
            </p>
          </div>
        </section>

        {auction?.reconstructionType && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-vendle-teal border-b-2 border-vendle-teal/20 pb-2">
              Scope of Work
            </h3>
            <div className="rounded-xl border-2 border-vendle-teal/20 bg-vendle-teal/5 p-5 shadow-sm">
              <p className="text-sm text-foreground font-medium">{auction?.reconstructionType}</p>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
