"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MilestoneData {
  stage: string;
  label: string;
  percentage: number;
  amount: number;
}

interface PaymentBreakdownProps {
  baseAmount: number;
  currentStage?: string;
  paidStages?: string[];
  showTotals?: boolean;
  compact?: boolean;
}

const MILESTONES: MilestoneData[] = [
  { stage: "DOWN_PAYMENT", label: "Down Payment", percentage: 20, amount: 0 },
  { stage: "STAGE_1", label: "Stage 1", percentage: 20, amount: 0 },
  { stage: "STAGE_2", label: "Stage 2", percentage: 20, amount: 0 },
  { stage: "FINAL_STAGE", label: "Final Stage", percentage: 30, amount: 0 },
  { stage: "RETAINAGE", label: "Retainage", percentage: 10, amount: 0 },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export function PaymentBreakdown({
  baseAmount,
  currentStage = "DOWN_PAYMENT",
  paidStages = [],
  showTotals = true,
  compact = false,
}: PaymentBreakdownProps) {
  const serviceFee = baseAmount * 0.05;
  const allInTotal = baseAmount + serviceFee;

  const milestones = MILESTONES.map((m) => ({
    ...m,
    amount: baseAmount * (m.percentage / 100),
  }));

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      {/* Totals Section */}
      {showTotals && (
        <div className="p-4 rounded-xl bg-vendle-blue/10 border-2 border-vendle-blue/20 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Total</span>
            <span className="font-medium">{formatCurrency(baseAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vendle Service Fee (5%)</span>
            <span className="font-medium">{formatCurrency(serviceFee)}</span>
          </div>
          <div className="border-t border-vendle-blue/20 pt-2 flex justify-between">
            <span className="font-bold">All-in Total</span>
            <span className="text-xl font-bold text-vendle-blue">
              {formatCurrency(allInTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Milestone Breakdown */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Payment Breakdown
        </h4>
        <div className={cn("space-y-2", compact && "space-y-1.5")}>
          {milestones.map((milestone) => {
            const isPaid = paidStages.includes(milestone.stage);
            const isCurrent = milestone.stage === currentStage && !isPaid;

            return (
              <div
                key={milestone.stage}
                className={cn(
                  "flex items-center justify-between rounded-lg border-2 transition-all",
                  compact ? "p-2" : "p-3",
                  isPaid && "bg-green-50 border-green-200",
                  isCurrent &&
                    "bg-vendle-blue/10 border-vendle-blue/40 ring-2 ring-vendle-blue/20",
                  !isPaid && !isCurrent && "bg-muted/30 border-muted opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  {isPaid ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-vendle-blue flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                  )}

                  {/* Milestone Info */}
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        compact && "text-sm",
                        isPaid && "text-green-700",
                        isCurrent && "text-vendle-blue"
                      )}
                    >
                      {milestone.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {milestone.percentage}% of base
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold",
                      compact && "text-sm",
                      isPaid && "text-green-700"
                    )}
                  >
                    {formatCurrency(milestone.amount)}
                  </p>
                  {isPaid && (
                    <span className="text-xs text-green-600 font-medium">Paid</span>
                  )}
                  {isCurrent && (
                    <span className="text-xs text-vendle-blue font-medium">Current</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}