'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin, Calendar, Clock, MessageSquare, CheckCircle, XCircle, Settings } from "lucide-react";
import { useGetAvailability } from "@/hooks/useBooking";
import AvailabilityManager from "@/components/AvailabilityManager";

interface PreLaunchDetailPanelProps {
  claim: any | null;
  approvedContractors: any[];
  pendingContractors: any[];
  onClose: () => void;
  onAcceptContractor: (participantId: string) => void;
}

export function PreLaunchDetailPanel({
  claim,
  approvedContractors,
  pendingContractors,
  onClose,
  onAcceptContractor,
}: PreLaunchDetailPanelProps) {
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
  const { data: availability } = useGetAvailability();

  const hasAvailability = availability && availability.length > 0;

  if (!claim) return null;

  return (
    <>
    <AvailabilityManager
      isOpen={showAvailabilityManager}
      onClose={() => setShowAvailabilityManager(false)}
    />
    <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Pre-Launch Project Details</h2>
          <button
            onClick={onClose}
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
              {claim.title || 'Untitled Project'}
            </h3>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {claim.projectType || 'N/A'}
            </Badge>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <p className="text-base font-medium text-gray-900">
                {claim.street}, {claim.city}, {claim.state} {claim.zipCode}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Project Timeline</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Phase 1 Timeline</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-500">Start: {claim.phase1Start}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-500">End: {claim.phase1End}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Phase 2 Timeline</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-500">Start: {claim.phase2Start}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-500">End: {claim.phase2End}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Management */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Your Availability</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAvailabilityManager(true)}
                className="text-vendle-blue hover:text-vendle-blue/80"
              >
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </Button>
            </div>
            {hasAvailability ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {availability.length} time slot{availability.length !== 1 ? 's' : ''} configured
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Contractors can schedule site visits during your available times
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">No availability set</span>
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Set your availability so contractors can schedule site visits
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => setShowAvailabilityManager(true)}
                >
                  Set Availability
                </Button>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Project Chat</p>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Chat functionality coming soon</p>
              </div>
            </div>
          </div>

          {/* Accepted Contractors */}
          {approvedContractors.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900">Accepted Contractors</p>
              <div className="space-y-2">
                {approvedContractors.map((contractor: any) => (
                  <div key={contractor.id} className="flex items-center gap-3 p-3 bg-vendle-teal/5 rounded-lg border border-vendle-teal/20">
                    <CheckCircle className="h-5 w-5 text-vendle-teal" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{contractor?.user?.companyName}</p>
                      <p className="text-xs text-gray-500">Accepted</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Contractors */}
          {pendingContractors.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900">Pending NDA Signatures</p>
              <div className="space-y-2">
                {pendingContractors.map((contractor: any) => (
                  <div key={contractor.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <XCircle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{contractor.user.companyName}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onAcceptContractor(contractor.id)}
                    >
                      Accept
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
