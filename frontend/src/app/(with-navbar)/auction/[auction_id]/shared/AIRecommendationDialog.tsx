import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Loader2, Info } from "lucide-react";
import { AIRecommendationDialogProps } from "../types";

export function AIRecommendationDialog({
  open,
  onClose,
  recommendation,
  isLoading,
  bidCount
}: AIRecommendationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0 gap-0 border border-gray-200">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-vendle-blue/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-vendle-blue" />
            </div>
            <div>
              <DialogTitle className="text-sm font-medium text-gray-900">
                AI Recommendation
              </DialogTitle>
              <p className="text-xs text-gray-500">
                Analysis based on {bidCount || 0} contractor bids
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-vendle-blue mb-4" />

              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-gray-900">
                  Analyzing contractor bids...
                </p>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p className="flex items-center justify-center gap-1.5">
                    <Check className="w-3 h-3 text-vendle-teal" />
                    Comparing pricing structures
                  </p>
                  <p className="flex items-center justify-center gap-1.5">
                    <Check className="w-3 h-3 text-vendle-teal" />
                    Evaluating contractor experience
                  </p>
                  <p className="flex items-center justify-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-vendle-blue" />
                    Generating recommendation
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Recommendation content */
            <div className="text-sm text-gray-700 leading-relaxed p-4 rounded bg-gray-50 border border-gray-100 whitespace-pre-wrap">
              {recommendation}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-[10px] text-gray-500 flex items-center gap-1">
            <Info className="w-3 h-3" />
            AI-generated recommendation
          </p>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs border-gray-200"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
