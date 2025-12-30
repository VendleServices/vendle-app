"use client";

import { UserCheck, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Step8ClaimAssistanceProps {
    needsAdjuster: boolean | null;
    onAdjusterChange: (needs: boolean) => void;
}

export function Step8ClaimAssistance({
    needsAdjuster,
    onAdjusterChange
}: Step8ClaimAssistanceProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Yes - Premium option */}
            <motion.button
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cn(
                    "relative p-8 rounded-2xl border-2 transition-all",
                    needsAdjuster === true
                        ? "bg-gradient-to-br from-vendle-blue/10 to-vendle-teal/10 border-vendle-blue shadow-xl"
                        : "bg-white border-vendle-gray/30 hover:border-vendle-blue/50 shadow-md hover:shadow-lg"
                )}
                onClick={() => onAdjusterChange(true)}
            >
                {/* "Recommended" badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-vendle-blue to-vendle-teal text-white px-4 py-1 shadow-lg">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Recommended
                    </Badge>
                </div>

                {/* Icon and content */}
                <div className="flex flex-col items-center text-center pt-2">
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all",
                        needsAdjuster === true
                            ? "bg-gradient-to-br from-vendle-blue to-vendle-teal"
                            : "bg-vendle-gray/20"
                    )}>
                        <UserCheck className={cn(
                            "w-10 h-10",
                            needsAdjuster === true ? "text-white" : "text-vendle-blue/70"
                        )} />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        Yes, I need help
                        {needsAdjuster === true && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-vendle-teal flex items-center justify-center"
                            >
                                <Check className="w-4 h-4 text-white" />
                            </motion.div>
                        )}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Get assistance from a professional adjuster to maximize your claim and negotiate with your insurance company
                    </p>
                </div>
            </motion.button>

            {/* No - Standard option */}
            <motion.button
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                    "relative p-8 rounded-2xl border-2 transition-all",
                    needsAdjuster === false
                        ? "bg-gradient-to-br from-vendle-blue/10 to-vendle-teal/10 border-vendle-blue shadow-xl"
                        : "bg-white border-vendle-gray/30 hover:border-vendle-blue/50 shadow-md hover:shadow-lg"
                )}
                onClick={() => onAdjusterChange(false)}
            >
                {/* Icon and content */}
                <div className="flex flex-col items-center text-center">
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all",
                        needsAdjuster === false
                            ? "bg-gradient-to-br from-vendle-blue to-vendle-teal"
                            : "bg-vendle-gray/20"
                    )}>
                        <X className={cn(
                            "w-10 h-10",
                            needsAdjuster === false ? "text-white" : "text-vendle-blue/70"
                        )} />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        No, I'll handle it myself
                        {needsAdjuster === false && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-vendle-teal flex items-center justify-center"
                            >
                                <Check className="w-4 h-4 text-white" />
                            </motion.div>
                        )}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        I'm satisfied with my current insurance estimate and want to proceed without adjuster assistance
                    </p>
                </div>
            </motion.button>
        </div>
    );
}
