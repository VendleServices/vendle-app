import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  MapPin,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  File,
  FileText,
  ChevronDown,
  Download,
  Image as ImageIcon
} from "lucide-react";
import { Job } from "../types";

interface JobDetailPanelProps {
  job: Job | null;
  onClose: () => void;
  getMapUrl: (address: string, city: string, state: string) => string;
  onFileClick: (file: any) => void;
}

export function JobDetailPanel({
  job,
  onClose,
  getMapUrl,
  onFileClick
}: JobDetailPanelProps) {
  const [showFilesDropdown, setShowFilesDropdown] = useState(false);

  if (!job) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-1/2 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
          <button
            onClick={() => {
              setShowFilesDropdown(false);
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {job.title}
            </h3>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {job.projectType}
            </Badge>
          </div>

          {/* Contract Value */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Contract Value</p>
            <p className="text-3xl font-bold text-vendle-blue">
              ${job.contractValue.toLocaleString()}
            </p>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <p className="text-base font-medium text-gray-900">
                {job.address}, {job.city}, {job.state}
              </p>
            </div>
          </div>

          {/* Job Image */}
          {job.imageUrl && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Job Photos</p>
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={job.imageUrl}
                  alt={job.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}

          {/* Map */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Location Map</p>
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={getMapUrl(job.address, job.city, job.state)}
                alt="Location map"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Contact Homeowner</p>

            {/* Phone Number */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                <p className="text-base font-medium text-gray-900">
                  {job.homeownerPhone || '(555) ***-****'}
                </p>
              </div>
            </div>

            {/* Chat */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Chat</p>
                <Button variant="outline" size="sm" className="w-full">
                  Open Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {/* Project Info */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Project Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-vendle-blue h-2.5 rounded-full transition-all"
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-gray-600">Milestones:</span>
                <span className="font-medium">
                  {job.milestonesCompleted} / {job.totalMilestones} completed
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                <Calendar className="h-4 w-4" />
                <span>Started: {new Date(job.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Expected Completion: {new Date(job.expectedCompletion).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Related Files Dropdown */}
          {job.files && job.files.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowFilesDropdown(!showFilesDropdown)}
                >
                  <span className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    Related Files ({job.files.length})
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilesDropdown ? 'rotate-180' : ''}`} />
                </Button>
                {showFilesDropdown && (
                  <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg">
                    <div className="max-h-64 overflow-y-auto">
                      {job.files.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => onFileClick(file)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          {file.type === 'pdf' ? (
                            <File className="h-5 w-5 text-red-600" />
                          ) : file.type === 'image' ? (
                            <ImageIcon className="h-5 w-5 text-vendle-blue" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-600" />
                          )}
                          <span className="flex-1 text-left text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </span>
                          {file.type === 'pdf' ? (
                            <span className="text-xs text-gray-500">View</span>
                          ) : (
                            <Download className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
