import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Calendar, Clock, Activity } from "lucide-react";
import { HomeownerProject } from "../types";

interface ActiveRebuildProjectCardProps {
  project: HomeownerProject;
  onViewDetails: () => void;
  onManageProject: () => void;
}

export function ActiveRebuildProjectCard({
  project,
  onViewDetails,
  onManageProject
}: ActiveRebuildProjectCardProps) {
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
            project.status === 'active'
              ? 'bg-vendle-teal/10 text-vendle-teal border-vendle-teal/20'
              : project.status === 'completed'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }`}>
            {project.status === 'active' ? 'Active' : project.status === 'completed' ? 'Completed' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Project Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Project Type:</span>
              <span className="font-medium">{project.projectType}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Contract Value:</span>
              <span className="font-semibold text-vendle-blue">${project.contractValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Contractor:</span>
              <span className="font-medium">{project.contractorName}</span>
            </div>
            {project.contractorCompany && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium text-xs">{project.contractorCompany}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-vendle-blue h-2.5 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Milestones */}
          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-vendle-teal" />
              <span className="text-gray-600">Milestones:</span>
            </div>
            <span className="font-medium">
              {project.milestonesCompleted} / {project.totalMilestones} completed
            </span>
          </div>

          {/* Dates */}
          <div className="space-y-1 text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Expected Completion: {new Date(project.expectedCompletion).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-vendle-blue hover:bg-vendle-blue/90"
              onClick={onManageProject}
            >
              <Activity className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
