"use client";

import { motion } from "framer-motion";
import { Droplets, Flame, AlertTriangle, Hammer, Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DamageOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface Step3DamageTypesProps {
  damageTypes: string[];
  onToggleDamageType: (type: string) => void;
}

const damageOptions: DamageOption[] = [
  {
    value: "Water Damage",
    label: "Water Damage",
    description: "Flooding, leaks, or water intrusion causing structural or cosmetic damage",
    icon: Droplets
  },
  {
    value: "Fire Damage",
    label: "Fire/Smoke Damage",
    description: "Fire, smoke, or soot damage to the property structure or contents",
    icon: Flame
  },
  {
    value: "Mold Remediation",
    label: "Mold Remediation",
    description: "Mold growth requiring professional removal and treatment",
    icon: AlertTriangle
  },
  {
    value: "Storm Damage",
    label: "Storm/Wind Damage",
    description: "Hurricane, tornado, or wind damage to roof, siding, or structure",
    icon: Hammer
  }
];

export function Step3DamageTypes({ damageTypes, onToggleDamageType }: Step3DamageTypesProps) {
  return (
    <div className="space-y-6">
      {/* Selection count badge */}
      {damageTypes.length > 0 && (
        <div className="flex items-center justify-center">
          <div className="px-4 py-2 rounded-full bg-vendle-blue/10 border border-vendle-blue/30 text-sm font-semibold text-vendle-blue">
            {damageTypes.length} type{damageTypes.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      )}

      {/* Selection cards grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {damageOptions.map((option) => {
          const isSelected = damageTypes.includes(option.value);
          const Icon = option.icon;

          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleDamageType(option.value)}
              className={cn(
                "relative p-8 rounded-2xl border-2 text-left transition-all overflow-hidden",
                isSelected
                  ? "border-vendle-blue bg-gradient-to-br from-vendle-blue/10 via-vendle-teal/5 to-transparent shadow-xl shadow-vendle-blue/20"
                  : "border-vendle-gray/30 bg-white hover:border-vendle-blue/50 hover:shadow-lg"
              )}
            >
              {/* Selection indicator beam */}
              {isSelected && (
                <motion.div
                  layoutId="damage-selection"
                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-vendle-blue to-vendle-teal"
                />
              )}

              <div className="flex items-start gap-4">
                {/* Icon with animation */}
                <motion.div
                  animate={{
                    scale: isSelected ? 1 : 0.9,
                    rotate: isSelected ? 0 : -5
                  }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all flex-shrink-0",
                    isSelected
                      ? "bg-gradient-to-br from-vendle-blue to-vendle-teal shadow-lg"
                      : "bg-vendle-gray/20"
                  )}
                >
                  <Icon className={cn(
                    "w-8 h-8",
                    isSelected ? "text-white" : "text-vendle-blue/70"
                  )} />
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
    </div>
  );
}
