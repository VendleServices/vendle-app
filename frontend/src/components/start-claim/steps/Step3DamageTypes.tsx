"use client";

import { Droplets, Flame, AlertTriangle, Hammer, Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DamageOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface Step3DamageTypesProps {
  damageTypes: string[];
  onToggleDamageType: (type: string) => void;
}

const damageOptions: DamageOption[] = [
  { value: "Water Damage", label: "Water Damage", icon: Droplets },
  { value: "Fire Damage", label: "Fire/Smoke", icon: Flame },
  { value: "Mold Remediation", label: "Mold", icon: AlertTriangle },
  { value: "Storm Damage", label: "Storm/Wind", icon: Hammer }
];

export function Step3DamageTypes({ damageTypes, onToggleDamageType }: Step3DamageTypesProps) {
  return (
    <div className="space-y-4">
      {damageTypes.length > 0 && (
        <p className="text-xs text-gray-500">
          {damageTypes.length} selected
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {damageOptions.map((option) => {
          const isSelected = damageTypes.includes(option.value);
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggleDamageType(option.value)}
              className={cn(
                "relative p-3 rounded border text-left transition-colors",
                isSelected
                  ? "border-vendle-blue bg-vendle-blue/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={cn(
                  "w-10 h-10 rounded flex items-center justify-center",
                  isSelected ? "bg-vendle-blue text-white" : "bg-gray-100 text-gray-500"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {option.label}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-vendle-blue flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
