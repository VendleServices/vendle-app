import { ArrowLeft, MapPin, FileText, Calendar } from "lucide-react";

interface ClaimHeaderProps {
  claim: any;
  onBack: () => void;
}

export function ClaimHeader({ claim, onBack }: ClaimHeaderProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left: Title & metadata */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                Project Details
              </span>
            </div>

            <h1 className="text-lg font-semibold text-gray-900">
              {claim.street}, {claim.city}
            </h1>

            {claim.projectType && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <FileText className="w-3.5 h-3.5" />
                <span>{claim.projectType}</span>
              </div>
            )}
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-0.5">
                <MapPin className="w-3 h-3" />
                <span className="uppercase tracking-wide">Location</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {claim.city}, {claim.state}
              </p>
            </div>

            <div className="px-3 py-2 rounded bg-vendle-blue/5 border border-vendle-blue/10">
              <div className="flex items-center gap-1.5 text-[10px] text-vendle-blue mb-0.5">
                <Calendar className="w-3 h-3" />
                <span className="uppercase tracking-wide">Created</span>
              </div>
              <p className="text-sm font-medium text-vendle-blue">
                {formatDate(claim.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
