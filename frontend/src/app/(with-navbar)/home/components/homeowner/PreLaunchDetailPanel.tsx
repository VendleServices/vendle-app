'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MapPin, Calendar, Clock, MessageSquare, CheckCircle, Settings, Users } from "lucide-react";
import { useGetAvailability } from "@/hooks/useBooking";
import AvailabilityManager from "@/components/AvailabilityManager";
import MessagingDrawer from "@/components/MessagingDrawer";

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
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedContractorForChat, setSelectedContractorForChat] = useState<any>(null);
  const { data: availability } = useGetAvailability();

  const hasAvailability = availability && availability.length > 0;

  const handleOpenChat = (contractor: any) => {
    setSelectedContractorForChat(contractor);
    setShowMessaging(true);
  };

  const handleCloseMessaging = () => {
    setShowMessaging(false);
    setSelectedContractorForChat(null);
  };

  if (!claim) return null;

  return (
    <>
    <AvailabilityManager
      isOpen={showAvailabilityManager}
      onClose={() => setShowAvailabilityManager(false)}
    />
    <MessagingDrawer
      isOpen={showMessaging}
      onClose={handleCloseMessaging}
      initialUserId={selectedContractorForChat?.user?.id || selectedContractorForChat?.userId}
      initialUserName={selectedContractorForChat?.user?.companyName || selectedContractorForChat?.user?.email}
    />
    <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Pre-Launch Details</h2>
            <p className="text-xs text-gray-500">Review project information and manage contractors</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Project Title Card */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-medium text-gray-900">
                  {claim.title || 'Untitled Project'}
                </h3>
                <span className="flex-shrink-0 px-2 py-0.5 rounded bg-amber-50 text-[10px] font-medium text-amber-700 border border-amber-200">
                  {claim.projectType || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{claim.street}, {claim.city}, {claim.state} {claim.zipCode}</span>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-vendle-blue" />
                <h4 className="text-sm font-medium text-gray-900">Project Timeline</h4>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 bg-gray-50 rounded border border-gray-100">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Phase 1</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Start:</span>
                    <span className="font-medium text-gray-900">{claim.phase1Start}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">End:</span>
                    <span className="font-medium text-gray-900">{claim.phase1End}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-100">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">Phase 2</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Start:</span>
                    <span className="font-medium text-gray-900">{claim.phase2Start}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">End:</span>
                    <span className="font-medium text-gray-900">{claim.phase2End}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-vendle-blue" />
                  <h4 className="text-sm font-medium text-gray-900">Your Availability</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAvailabilityManager(true)}
                  className="h-7 px-2 text-xs text-vendle-blue hover:text-vendle-blue/80 hover:bg-vendle-blue/5"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Manage
                </Button>
              </div>
            </div>
            <div className="p-4">
              {hasAvailability ? (
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {availability.length} time slot{availability.length !== 1 ? 's' : ''} configured
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">
                    Contractors can schedule site visits during your available times
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">No availability set</span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Set your availability so contractors can schedule site visits
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => setShowAvailabilityManager(true)}
                  >
                    Set Availability
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Messaging Info */}
          <div className="bg-white border border-gray-200 rounded">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-vendle-blue" />
                <h4 className="text-sm font-medium text-gray-900">Messaging</h4>
              </div>
            </div>
            <div className="p-4">
              {approvedContractors.length > 0 ? (
                <div className="p-3 bg-vendle-blue/5 rounded border border-vendle-blue/10">
                  <div className="flex items-center gap-2 text-vendle-blue">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {approvedContractors.length} contractor{approvedContractors.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Select a contractor below to start a conversation
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                  <p className="text-sm text-gray-500">No approved contractors to message yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Accept contractors from the pending list to start messaging
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Accepted Contractors */}
          {approvedContractors.length > 0 && (
            <div className="bg-white border border-gray-200 rounded">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-vendle-teal" />
                  <h4 className="text-sm font-medium text-gray-900">Accepted Contractors</h4>
                  <span className="ml-auto px-1.5 py-0.5 rounded bg-vendle-teal/10 text-[10px] font-medium text-vendle-teal">
                    {approvedContractors.length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {approvedContractors.map((contractor: any) => (
                  <div key={contractor.id} className="flex items-center gap-3 p-3 bg-vendle-teal/5 rounded border border-vendle-teal/10">
                    <div className="w-8 h-8 rounded bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-vendle-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contractor?.user?.companyName || contractor?.user?.email}
                      </p>
                      <p className="text-[10px] text-gray-500">Accepted</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs flex-shrink-0 border-vendle-blue text-vendle-blue hover:bg-vendle-blue/5"
                      onClick={() => handleOpenChat(contractor)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Contractors */}
          {pendingContractors.length > 0 && (
            <div className="bg-white border border-gray-200 rounded">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-medium text-gray-900">Pending NDA Signatures</h4>
                  <span className="ml-auto px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-medium text-amber-700 border border-amber-200">
                    {pendingContractors.length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {pendingContractors.map((contractor: any) => (
                  <div key={contractor.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded border border-amber-200">
                    <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contractor.user.companyName}
                      </p>
                      <p className="text-[10px] text-amber-600">Pending approval</p>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 text-xs flex-shrink-0 bg-vendle-blue hover:bg-vendle-blue/90"
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