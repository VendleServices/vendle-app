import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Calculator, Trash2, Info, DollarSign } from "lucide-react";
import { Phase2BidActionsProps } from "../types";

export function Phase2BidActions({
  mockPhase1Bid,
  adjustingBid,
  adjustedBidData,
  onConfirmBid,
  onAdjustBid,
  onSubmitAdjustedBid,
  onWithdraw,
  onCancelAdjust,
  setAdjustedBidData
}: Phase2BidActionsProps) {
  return (
    <>
      {/* Header with gradient */}
      <div className="rounded-t-2xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Your Phase 1 Bid</h2>
          <Badge className="bg-white/20 text-white border-white/30">
            <Check className="w-3 h-3 mr-1" />
            Selected
          </Badge>
        </div>
        <p className="text-white/90 text-sm">
          Review and confirm your bid, or make adjustments
        </p>
      </div>

      {/* Phase 2 content */}
      <div className="bg-white rounded-b-2xl border-2 border-t-0 border-vendle-gray/20 p-6 space-y-6 shadow-xl">
        {!adjustingBid ? (
          <>
            {/* Current bid display */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Your Phase 1 Bid Amount
                  </p>
                  <p className="text-4xl font-bold text-foreground">
                    ${mockPhase1Bid.bid_amount.toLocaleString()}
                  </p>
                </div>

                {/* Cost breakdown */}
                <div className="pt-4 border-t border-green-200 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Cost Breakdown
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Materials</p>
                      <p className="font-semibold text-foreground">
                        ${mockPhase1Bid.budgetTotal.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Labor</p>
                      <p className="font-semibold text-foreground">
                        ${mockPhase1Bid.laborCosts.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Subcontractors</p>
                      <p className="font-semibold text-foreground">
                        ${mockPhase1Bid.subContractorExpenses.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Overhead</p>
                      <p className="font-semibold text-foreground">
                        ${mockPhase1Bid.overhead.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit</p>
                      <p className="font-semibold text-foreground">
                        ${mockPhase1Bid.profit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Allowance</p>
                      <p className="font-semibold text-foreground">
                        ${mockPhase1Bid.allowance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={onConfirmBid}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirm Phase 1 Bid
              </Button>

              <Button
                onClick={onAdjustBid}
                variant="outline"
                className="w-full h-12 border-2 border-vendle-blue text-vendle-blue hover:bg-vendle-blue hover:text-white font-bold"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Adjust Bid
              </Button>

              <Button
                onClick={onWithdraw}
                variant="outline"
                className="w-full h-12 border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Withdraw from Auction
              </Button>
            </div>
          </>
        ) : (
          // Adjust bid form
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Adjust your bid amounts below
              </p>
            </div>

            {/* Adjusted total bid */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-vendle-blue/5 to-vendle-teal/5 border-2 border-vendle-blue/20">
              <Label className="text-base font-bold text-foreground mb-3 block">
                New Total Bid Amount
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-vendle-blue">
                  $
                </span>
                <Input
                  type="number"
                  value={adjustedBidData.amount}
                  onChange={(e) =>
                    setAdjustedBidData({ ...adjustedBidData, amount: Number(e.target.value) })
                  }
                  className="h-16 pl-12 text-3xl font-bold border-2 border-vendle-blue/30"
                />
              </div>
            </div>

            {/* Adjusted cost breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Materials</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={adjustedBidData.budgetTotal}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        budgetTotal: Number(e.target.value),
                      })
                    }
                    className="h-11 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Labor</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={adjustedBidData.laborCosts}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        laborCosts: Number(e.target.value),
                      })
                    }
                    className="h-11 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Subcontractors</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={adjustedBidData.subContractorExpenses}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        subContractorExpenses: Number(e.target.value),
                      })
                    }
                    className="h-11 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Overhead</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={adjustedBidData.overhead}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        overhead: Number(e.target.value),
                      })
                    }
                    className="h-11 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Profit</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={adjustedBidData.profit}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        profit: Number(e.target.value),
                      })
                    }
                    className="h-11 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Allowance</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={adjustedBidData.allowance}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        allowance: Number(e.target.value),
                      })
                    }
                    className="h-11 pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onSubmitAdjustedBid}
                className="flex-1 h-12 bg-gradient-to-r from-vendle-blue to-vendle-teal hover:shadow-xl text-white font-bold"
              >
                <Check className="w-5 h-5 mr-2" />
                Submit Adjusted Bid
              </Button>
              <Button onClick={onCancelAdjust} variant="outline" className="h-12 border-2">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
