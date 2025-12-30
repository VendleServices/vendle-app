import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Calendar, Clock, MessageSquare, Activity } from "lucide-react";
import { Job } from "../types";

interface MyJobCardProps {
  job: Job;
  onManageJob: () => void;
  onOpenChat: () => void;
}

export function MyJobCard({ job, onManageJob, onOpenChat }: MyJobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{job.address}, {job.city}, {job.state}</span>
            </div>
          </div>
          <Badge className={`${
            job.status === 'active'
              ? 'bg-green-100 text-green-800 border-green-200'
              : job.status === 'completed'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
            {job.status === 'active' ? 'Active' : job.status === 'completed' ? 'Completed' : 'On Hold'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Project Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Project Type:</span>
              <span className="font-medium">{job.projectType}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Contract Value:</span>
              <span className="font-semibold text-vendle-blue">${job.contractValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Homeowner:</span>
              <span className="font-medium">{job.homeownerName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{job.homeownerPhone || 'N/A'}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{job.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-vendle-blue h-2.5 rounded-full transition-all"
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Milestones */}
          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Milestones:</span>
            </div>
            <span className="font-medium">
              {job.milestonesCompleted} / {job.totalMilestones} completed
            </span>
          </div>

          {/* Dates */}
          <div className="space-y-1 text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Started: {new Date(job.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Expected Completion: {new Date(job.expectedCompletion).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <Button
              variant="outline"
              className="w-full border-vendle-blue text-vendle-blue hover:bg-vendle-blue hover:text-white"
              onClick={onOpenChat}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button
              variant="default"
              className="w-full bg-vendle-blue hover:bg-vendle-blue/90"
              onClick={onManageJob}
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
