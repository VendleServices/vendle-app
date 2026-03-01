import { useState } from "react";
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
  Image as ImageIcon,
  DollarSign,
  CheckCircle
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
    <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Job Details</h2>
            <p className="text-xs text-gray-500">View project information</p>
          </div>
          <button
            onClick={() => {
              setShowFilesDropdown(false);
              onClose();
            }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title Card */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-medium text-gray-900">
                  {job.title}
                </h3>
                <span className="flex-shrink-0 px-2 py-0.5 rounded bg-vendle-blue/10 text-[10px] font-medium text-vendle-blue">
                  {job.projectType}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{job.address}, {job.city}, {job.state}</span>
              </div>
            </div>
          </div>

          {/* Contract Value */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="p-4">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Contract Value</p>
              <p className="text-xl font-semibold text-gray-900">
                ${job.contractValue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Job Image */}
          {job.imageUrl && (
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Job Photos</p>
              </div>
              <img
                src={job.imageUrl}
                alt={job.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Map */}
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Location</p>
            </div>
            <img
              src={getMapUrl(job.address, job.city, job.state)}
              alt="Location map"
              className="w-full h-40 object-cover"
            />
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-vendle-blue" />
                <h4 className="text-sm font-medium text-gray-900">Contact Homeowner</h4>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-500 mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {job.homeownerPhone || '(555) ***-****'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 mb-1">Message</p>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-gray-200">
                    Open Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="bg-white border border-gray-200 rounded">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Description</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {/* Project Progress */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-vendle-teal" />
                <h4 className="text-sm font-medium text-gray-900">Project Progress</h4>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-medium text-gray-900">{job.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-vendle-teal h-1.5 rounded-full transition-all"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-0.5">Milestones</p>
                  <p className="text-xs font-medium text-gray-900">
                    {job.milestonesCompleted} / {job.totalMilestones}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-0.5">Started</p>
                  <p className="text-xs font-medium text-gray-900">
                    {new Date(job.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-2 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <p className="text-[10px] text-gray-500">Expected Completion</p>
                </div>
                <p className="text-xs font-medium text-gray-900 mt-0.5">
                  {new Date(job.expectedCompletion).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Related Files */}
          {job.files && job.files.length > 0 && (
            <div className="bg-white border border-gray-200 rounded">
              <button
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setShowFilesDropdown(!showFilesDropdown)}
              >
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-vendle-blue" />
                  <span className="text-sm font-medium text-gray-900">
                    Related Files
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-600">
                    {job.files.length}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showFilesDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showFilesDropdown && (
                <div className="border-t border-gray-100">
                  {job.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => onFileClick(file)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      {file.type === 'pdf' ? (
                        <File className="h-4 w-4 text-red-500" />
                      ) : file.type === 'image' ? (
                        <ImageIcon className="h-4 w-4 text-vendle-blue" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="flex-1 text-left text-sm text-gray-900 truncate">
                        {file.name}
                      </span>
                      {file.type === 'pdf' ? (
                        <span className="text-[10px] text-vendle-blue font-medium">View</span>
                      ) : (
                        <Download className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
