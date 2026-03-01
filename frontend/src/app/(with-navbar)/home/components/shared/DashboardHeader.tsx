import { Badge } from "@/components/ui/badge";
import { User } from "../types";

interface DashboardHeaderProps {
  user: User;
  isContractor: boolean;
  contractorInvitationCount?: number;
  onShowMailbox?: () => void;
  onShowMessages?: () => void;
}

export function DashboardHeader({
  user,
  isContractor,
}: DashboardHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        {user?.user_metadata?.userType && (
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-100"
          >
            {user?.user_metadata?.userType === 'contractor' ? 'Contractor' : 'Homeowner'}
          </Badge>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {isContractor
          ? "Manage your projects and explore opportunities"
          : "Track your claims and project progress"}
      </p>
    </div>
  );
}
