import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Pencil, X, DollarSign } from "lucide-react";
import { Phase2BidActionsProps } from "../types";

export function Phase2BidActions({
  contractorPhase1Bid,
  adjustingBid,
  adjustedBidData,
  onConfirmBid,
  onAdjustBid,
  onSubmitAdjustedBid,
  onWithdraw,
  onCancelAdjust,
  setAdjustedBidData,
  disableConfirmBid,
  disableAdjustBid,
  disableWithdrawBid
}: Phase2BidActionsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Your Phase 1 Bid</h2>
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-vendle-teal/10 text-[10px] font-medium text-vendle-teal">
            <Check className="w-3 h-3" />
            Selected
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {adjustingBid ? "Adjust your bid amounts below" : "Review and confirm your bid, or make adjustments"}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {!adjustingBid ? (
          <>
            {/* Current bid display */}
            <div className="p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                Your Bid Amount
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ${contractorPhase1Bid?.amount?.toLocaleString()}
              </p>
            </div>

            {/* Cost breakdown */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">
                Cost Breakdown
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500">Materials</p>
                  <p className="font-medium text-gray-900">
                    ${contractorPhase1Bid?.budgetTotal.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500">Labor</p>
                  <p className="font-medium text-gray-900">
                    ${contractorPhase1Bid?.laborCosts.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500">Subcontractors</p>
                  <p className="font-medium text-gray-900">
                    ${contractorPhase1Bid?.subContractorExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500">Overhead</p>
                  <p className="font-medium text-gray-900">
                    ${contractorPhase1Bid?.overhead.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500">Profit</p>
                  <p className="font-medium text-gray-900">
                    ${contractorPhase1Bid?.profit.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500">Allowance</p>
                  <p className="font-medium text-gray-900">
                    ${contractorPhase1Bid?.allowance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <Button
                disabled={disableConfirmBid}
                onClick={onConfirmBid}
                className="w-full h-9 bg-vendle-blue hover:bg-vendle-blue/90 text-white text-sm font-medium"
              >
                <Check className="w-4 h-4 mr-1.5" />
                Confirm Phase 1 Bid
              </Button>

              <Button
                disabled={disableAdjustBid}
                onClick={onAdjustBid}
                variant="outline"
                className="w-full h-9 border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                <Pencil className="w-4 h-4 mr-1.5" />
                Adjust Bid
              </Button>

              <Button
                disabled={disableWithdrawBid}
                onClick={onWithdraw}
                variant="outline"
                className="w-full h-9 border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium"
              >
                <X className="w-4 h-4 mr-1.5" />
                Withdraw from Auction
              </Button>
            </div>
          </>
        ) : (
          // Adjust bid form
          <div className="space-y-4">
            {/* Adjusted total bid */}
            <div className="p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
              <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                New Total Bid Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-vendle-blue">
                  $
                </span>
                <Input
                  type="number"
                  value={adjustedBidData.amount}
                  onChange={(e) =>
                    setAdjustedBidData({ ...adjustedBidData, amount: Number(e.target.value) })
                  }
                  className="h-12 pl-8 text-lg font-semibold border-gray-200 rounded"
                />
              </div>
            </div>

            {/* Adjusted cost breakdown */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-gray-500">Materials</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    type="number"
                    value={adjustedBidData.budgetTotal}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        budgetTotal: Number(e.target.value),
                      })
                    }
                    className="h-9 pl-7 text-sm rounded border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-gray-500">Labor</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    type="number"
                    value={adjustedBidData.laborCosts}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        laborCosts: Number(e.target.value),
                      })
                    }
                    className="h-9 pl-7 text-sm rounded border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-gray-500">Subcontractors</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    type="number"
                    value={adjustedBidData.subContractorExpenses}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        subContractorExpenses: Number(e.target.value),
                      })
                    }
                    className="h-9 pl-7 text-sm rounded border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-gray-500">Overhead</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    type="number"
                    value={adjustedBidData.overhead}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        overhead: Number(e.target.value),
                      })
                    }
                    className="h-9 pl-7 text-sm rounded border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-gray-500">Profit</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    type="number"
                    value={adjustedBidData.profit}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        profit: Number(e.target.value),
                      })
                    }
                    className="h-9 pl-7 text-sm rounded border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-gray-500">Allowance</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    type="number"
                    value={adjustedBidData.allowance}
                    onChange={(e) =>
                      setAdjustedBidData({
                        ...adjustedBidData,
                        allowance: Number(e.target.value),
                      })
                    }
                    className="h-9 pl-7 text-sm rounded border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={onSubmitAdjustedBid}
                className="flex-1 h-9 bg-vendle-blue hover:bg-vendle-blue/90 text-white text-sm font-medium"
              >
                <Check className="w-4 h-4 mr-1.5" />
                Submit Adjusted Bid
              </Button>
              <Button
                onClick={onCancelAdjust}
                variant="outline"
                className="h-9 border-gray-200 text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
