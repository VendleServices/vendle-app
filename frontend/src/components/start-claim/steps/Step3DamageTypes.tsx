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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                "relative p-6 rounded-2xl border-2 text-center transition-all overflow-hidden h-full",
                isSelected
                  ? "border-vendle-blue bg-vendle-blue/10 shadow-xl shadow-vendle-blue/20"
                  : "border-vendle-gray/30 bg-white hover:border-vendle-blue/50 hover:shadow-lg"
              )}
            >
              {/* Selection indicator top beam */}
              {isSelected && (
                <motion.div
                  layoutId="damage-selection"
                  className="absolute left-0 top-0 right-0 h-1.5 bg-vendle-blue"
                />
              )}

              {/* Vertical layout */}
              <div className="flex flex-col items-center gap-4">
                {/* Icon with animation */}
                <motion.div
                  animate={{
                    scale: isSelected ? 1 : 0.9,
                    rotate: isSelected ? 0 : -5
                  }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center transition-all relative",
                    isSelected
                      ? "bg-vendle-blue shadow-lg"
                      : "bg-vendle-gray/20"
                  )}
                >
                  <Icon className={cn(
                    "w-10 h-10",
                    isSelected ? "text-white" : "text-vendle-blue/70"
                  )} />

                  {/* Check mark indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-vendle-teal flex items-center justify-center shadow-lg border-2 border-white"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {option.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
