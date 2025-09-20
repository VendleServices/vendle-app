import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Coins, Users, Clock } from "lucide-react";

interface InfoItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  className?: string;
}

interface InfoBarProps {
  items: InfoItem[];
  className?: string;
}

export function InfoBar({ items, className = "" }: InfoBarProps) {
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-center ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="flex items-center gap-3">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{item.label}:</span>
            <span className={`text-sm font-medium ${item.className || ""}`}>
              {item.value}
            </span>
            {index < items.length - 1 && (
              <Separator 
                orientation="vertical" 
                className="hidden h-4 md:block" 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Helper component for zero bids state
export function ZeroBidsBadge() {
  return (
    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
      No bids received
    </Badge>
  );
}

// Helper component for bid count
export function BidCount({ count }: { count: number }) {
  if (count === 0) {
    return <ZeroBidsBadge />;
  }
  
  return (
    <span className="text-sm font-medium">
      {count} {count === 1 ? "bid" : "bids"}
    </span>
  );
}
