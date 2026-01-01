"use client";

import { Wrench, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProjectTypeOption {
    value: string;
    label: string;
    description: string;
}

interface Step6ProjectTypeProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
}

const projectTypes: ProjectTypeOption[] = [
    {
        value: "full",
        label: "Full Reconstruction",
        description: "Complete rebuild of a severely damaged structure"
    },
    {
        value: "partial",
        label: "Partial Rebuild",
        description: "Repair and reconstruction of specific damaged areas"
    },
    {
        value: "new",
        label: "New Construction",
        description: "Building a new home, not related to disaster recovery"
    }
];

export function Step6ProjectType({
    selectedType,
    onTypeChange
}: Step6ProjectTypeProps) {
    return (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projectTypes.map((option, index) => {
                const isSelected = selectedType === option.value;

                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onTypeChange(option.value)}
                        className={cn(
                            "w-full p-6 rounded-2xl border-2 text-left transition-all",
                            isSelected
                                ? "border-vendle-blue bg-vendle-blue/10 shadow-xl shadow-vendle-blue/20"
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
                                        ? "bg-vendle-blue text-white shadow-lg"
                                        : "bg-vendle-gray/20 text-vendle-blue/70"
                                )}
                            >
                                <Wrench className="w-6 h-6" />
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
