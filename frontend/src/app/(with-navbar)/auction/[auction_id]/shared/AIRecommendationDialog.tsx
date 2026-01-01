import { motion } from "framer-motion";
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden p-0 gap-0 border-2 border-vendle-blue/20 shadow-2xl">
        {/* Header with gradient */}
        <div className="relative overflow-hidden bg-vendle-blue p-6 text-white">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white mb-1">
                Vendle AI Recommendation
              </DialogTitle>
              <p className="text-white/90 text-sm">
                Analyzing bids to find the best match for your project
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-vendle-gray/20 border-t-vendle-blue mb-6"
              />

              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  Analyzing contractor bids...
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-vendle-teal" />
                    Comparing pricing structures
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-vendle-teal" />
                    Evaluating contractor experience
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-vendle-blue" />
                    Generating personalized recommendation
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Recommendation content */
            <div className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <div className="text-foreground leading-relaxed p-6 rounded-xl bg-muted/30 border border-vendle-gray/30">
                  {recommendation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-vendle-gray/20 bg-muted/20 flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            AI recommendation based on {bidCount || 0} bids
          </p>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-2 border-vendle-gray/30 hover:border-vendle-blue hover:bg-vendle-blue/5"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
