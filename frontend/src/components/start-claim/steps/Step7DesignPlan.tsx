"use client";

import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DesignOption {
    value: string;
    label: string;
    description: string;
}

interface Step7DesignPlanProps {
    selectedPlan: string;
    onPlanChange: (plan: string) => void;
}

const designOptions: DesignOption[] = [
    {
        value: "existing",
        label: "Use Existing Plan",
        description: "Rebuild using plans of the original structure"
    },
    {
        value: "modify",
        label: "Modify Existing Plan",
        description: "Make changes to the original design while rebuilding"
    },
    {
        value: "custom",
        label: "Create New Custom Design",
        description: "Work with architects to create a completely new design"
    }
];

export function Step7DesignPlan({
    selectedPlan,
    onPlanChange
}: Step7DesignPlanProps) {
    return (
        <div className="space-y-4">
            {designOptions.map((option, index) => {
                const isSelected = selectedPlan === option.value;

                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onPlanChange(option.value)}
                        className={cn(
                            "w-full p-6 rounded-2xl border-2 text-left transition-all",
                            isSelected
                                ? "border-vendle-blue bg-gradient-to-br from-vendle-blue/10 via-vendle-teal/5 to-transparent shadow-xl shadow-vendle-blue/20"
                                : "border-vendle-gray/30 bg-white hover:border-vendle-blue/50 hover:shadow-lg"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <motion.div
                                animate={{
                                    scale: isSelected ? 1 : 0.9,
                                    rotate: isSelected ? 0 : -5
                                }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                                    isSelected
                                        ? "bg-gradient-to-br from-vendle-blue to-vendle-teal text-white shadow-lg"
                                        : "bg-vendle-gray/20 text-vendle-blue/70"
                                )}
                            >
                                <Sparkles className="w-6 h-6" />
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                    {option.label}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-6 h-6 rounded-full bg-vendle-teal flex items-center justify-center flex-shrink-0"
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
