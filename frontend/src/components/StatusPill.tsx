import { Badge } from "@/components/ui/badge";
import { Archive, XCircle, Clock, Users } from "lucide-react";

interface StatusPillProps {
  status: "closed" | "cancelled" | "expired" | "open";
}

const statusConfig = {
  closed: {
    icon: Archive,
    label: "Closed",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-700 hover:bg-red-200",
  },
  expired: {
    icon: Clock,
    label: "Expired",
    variant: "outline" as const,
    className: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
  },
  open: {
    icon: Users,
    label: "Active",
    variant: "default" as const,
    className: "bg-vendle-teal/10 text-vendle-teal hover:bg-vendle-teal/15",
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${config.className}`}
      aria-label={`Status: ${config.label}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

