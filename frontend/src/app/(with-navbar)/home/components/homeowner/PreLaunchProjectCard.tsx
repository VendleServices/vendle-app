import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";

interface PreLaunchProjectCardProps {
  claim: any;
  onViewDetails: () => void;
  onInviteContractors: () => void;
  onLaunch: () => void;
}

export function PreLaunchProjectCard({
  claim,
  onViewDetails,
  onInviteContractors,
  onLaunch
}: PreLaunchProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">
              {claim.title || 'Untitled Project'}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{claim.street}, {claim.city}, {claim.state} {claim.zipCode}</span>
            </div>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pre-Launch
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Project Type:</span>
              <span className="font-medium">{claim.projectType || 'N/A'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 hover:text-white transition-colors"
                onClick={onViewDetails}
              >
                View Details
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-vendle-blue hover:bg-vendle-blue/90"
                onClick={onInviteContractors}
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Contractors
              </Button>
            </div>
            <Button
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={onLaunch}
            >
              Launch
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
