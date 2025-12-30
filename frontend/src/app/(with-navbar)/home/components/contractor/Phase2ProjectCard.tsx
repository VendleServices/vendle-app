import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Activity, File } from "lucide-react";
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
              <span>{project.address}</span>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Phase 2
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Contract Value:</span>
              <span className="font-semibold text-vendle-blue">${project.contractValue.toLocaleString()}</span>
            </div>
            {project.phase2StartDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Phase 2 Start:</span>
                <span className="font-medium">{new Date(project.phase2StartDate).toLocaleDateString()}</span>
              </div>
            )}
            {project.phase2EndDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Phase 2 End:</span>
                <span className="font-medium">{new Date(project.phase2EndDate).toLocaleDateString()}</span>
              </div>
            )}
            {project.adjustmentPdf && (
              <div className="flex items-center justify-between text-sm pt-1">
                <span className="text-gray-600">Adjustment PDF:</span>
                <a
                  href={project.adjustmentPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vendle-blue hover:underline flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <File className="h-3 w-3" />
                  View
                </a>
              </div>
            )}
          </div>
          <div className="pt-2">
            <Button
              variant="default"
              className="w-full bg-vendle-blue hover:bg-vendle-blue/90 hover:text-white transition-colors"
              onClick={onViewDetails}
            >
              <Activity className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
