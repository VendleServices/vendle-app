import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, User, Calendar, AlertCircle, ArrowRight } from "lucide-react";
import { PendingNDA } from "../types";

interface PendingNDACardProps {
  nda: PendingNDA;
  onReviewNDA?: () => void;
}

export function PendingNDACard({ nda }: PendingNDACardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {nda.projectTitle}
          </h3>
          <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-[10px] font-medium text-amber-700 border border-amber-200">
            <AlertCircle className="h-3 w-3" />
            Action Required
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="line-clamp-1">{nda.address}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>Homeowner</span>
            </div>
            <span className="text-xs font-medium text-gray-900">{nda.homeownerName}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Requested</span>
            </div>
            <span className="text-xs font-medium text-gray-900">
              {new Date(nda.requestedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action button */}
        <Link href={`/claim/${nda.id}`}>
          <Button
            className="w-full h-8 text-xs bg-vendle-blue hover:bg-vendle-blue/90"
          >
            View Details
            <ArrowRight className="h-3 w-3 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
