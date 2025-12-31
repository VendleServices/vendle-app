import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { User } from "../types";

interface DashboardHeaderProps {
  user: User;
  isContractor: boolean;
  contractorInvitationCount?: number;
  onShowMailbox?: () => void;
}

export function DashboardHeader({
  user,
  isContractor,
  contractorInvitationCount = 0,
  onShowMailbox
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email || 'User'}!
          </h1>
          {user?.user_metadata?.userType && (
            <Badge
              variant={user?.user_metadata?.userType === 'contractor' ? 'default' : 'secondary'}
              className={
                user?.user_metadata?.userType === 'contractor'
                  ? 'bg-vendle-blue/90 text-white hover:bg-blue-800'
                  : 'bg-gray-700 text-white hover:bg-gray-800'
              }
            >
              {user?.user_metadata?.userType === 'contractor' ? 'Contractor' : 'Homeowner'}
            </Badge>
          )}
        </div>
        {/* Mailbox Button - Only for Contractors */}
        {isContractor && onShowMailbox && (
          <Button
            variant="outline"
            size="lg"
            onClick={onShowMailbox}
            className="relative"
          >
            <Mail className="h-5 w-5 mr-2" />
            Mailbox
            {contractorInvitationCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {contractorInvitationCount}
              </Badge>
            )}
          </Button>
        )}
      </div>
      <p className="text-gray-600 mt-2">
        {isContractor
          ? "Here's what's happening with your projects and opportunities"
          : "Manage your projects and track their progress"}
      </p>
    </div>
  );
}
