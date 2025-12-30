import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { PhaseProject } from "../types";

interface Phase2ProjectCardProps {
  project: PhaseProject;
  onViewDetails: () => void;
}

export function Phase2ProjectCard({ project, onViewDetails }: Phase2ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{project.address}, {project.city}, {project.state}</span>
            </div>
          </div>
          <Badge className={`${
            project.status === 'Active'
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Project Type:</span>
              <span className="font-medium">{project.projectType}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Contract Value:</span>
              <span className="font-semibold text-vendle-blue">${project.contractValue?.toLocaleString() || '0'}</span>
            </div>
            {project.phase2StartDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{new Date(project.phase2StartDate).toLocaleDateString()}</span>
              </div>
            )}
            {project.phase2EndDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">{new Date(project.phase2EndDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
