'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, FileText, MapPin, DollarSign, User, Calendar, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/auth/client';
import { toast } from 'sonner';
import ContractSigningModal from './ContractSigningModal';
import Image from 'next/image';

interface ClaimInvitation {
  id: string;
  claimId: string;
  contractorId: string;
  invitedBy: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  claim?: {
    id: string;
    title: string;
    totalJobValue: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    projectType: string;
    additionalNotes?: string;
    aiSummary?: string;
    createdAt: string;
    user?: {
      email: string;
    };
  };
}

interface AcceptInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: ClaimInvitation;
  onSuccess: () => void;
}

export default function AcceptInvitationModal({
  isOpen,
  onClose,
  invitation,
  onSuccess,
}: AcceptInvitationModalProps) {
  const { user } = useAuth();
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [ndaSigned, setNdaSigned] = useState(false);
  const [showPhase1Details, setShowPhase1Details] = useState(false);

  // Check if contractor has signed NDA
  const { data: contractorData } = useQuery({
    queryKey: ['getContractorNDA', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response: any = await apiService.get(`/api/contractor/${user.id}`);
      return response;
    },
    enabled: !!user?.id && isOpen,
  });

  const contractorNdaSigned = contractorData?.ndaSigned || false;

  // Fetch full claim details
  const { data: claim, isLoading } = useQuery({
    queryKey: ['getClaimForAccept', invitation.claimId],
    queryFn: async () => {
      const response: any = await apiService.get(`/api/claim/${invitation.claimId}`);
      return response?.claim;
    },
    enabled: isOpen && !!invitation.claimId,
  });

  // Fetch claim images
  const { data: images } = useQuery({
    queryKey: ['getClaimImagesForAccept', invitation.claimId],
    queryFn: async () => {
      const response: any = await apiService.get(`/api/images/${invitation.claimId}`);
      const imageUrls = response?.images?.map((img: any) => {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(img?.supabase_url?.slice(7));
        return data?.publicUrl;
      }) || [];
      return imageUrls;
    },
    enabled: isOpen && !!invitation.claimId && showPhase1Details,
  });

  // Fetch claim PDFs
  const { data: claimPdfs } = useQuery({
    queryKey: ['getClaimPdfsForAccept', invitation.claimId],
    queryFn: async () => {
      const response: any = await apiService.get(`/api/pdfs/${invitation.claimId}`);
      const pdfUrls = response?.pdfs?.map((pdf: any) => {
        const { data } = supabase.storage
          .from('vendle-claims')
          .getPublicUrl(pdf?.supabase_url?.slice(14));
        return data?.publicUrl;
      }) || [];
      return pdfUrls;
    },
    enabled: isOpen && !!invitation.claimId && showPhase1Details,
  });

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: async () => {
      // Update invitation status to ACCEPTED and create participant
      const response: any = await apiService.put(
        `/api/claimInvitations/${invitation.id}/accept`,
        {}
      );
      
      return response;
    },
    onSuccess: () => {
      toast.success('Invitation Accepted', {
        description: 'You have successfully accepted the invitation and joined the project.',
      });
      queryClient.invalidateQueries({ queryKey: ['getContractorInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['getContractorClaims'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error('Error Accepting Invitation', {
        description: error?.message || 'Failed to accept invitation. Please try again.',
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Always check NDA status first when modal opens
      // Don't show phase 1 details until NDA is signed
      if (!contractorNdaSigned) {
        setShowNDAModal(true);
        setShowPhase1Details(false);
      } else {
        setShowNDAModal(false);
        setShowPhase1Details(true);
      }
    } else {
      // Reset state when modal closes
      setShowNDAModal(false);
      setShowPhase1Details(false);
      setNdaSigned(false);
    }
  }, [isOpen, contractorNdaSigned]);

  // Don't render the accept modal if NDA modal should be shown
  if (isOpen && showNDAModal && !contractorNdaSigned) {
    return null; // The NDA modal will be rendered separately
  }

  const handleNDASigned = () => {
    setNdaSigned(true);
    setShowNDAModal(false);
    // Wait a bit for the NDA status to update, then show phase 1 details
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['getContractorNDA', user?.id] });
      setShowPhase1Details(true);
    }, 500);
  };

  const handleAcceptInvitation = () => {
    acceptInvitationMutation.mutate();
  };

  const displayClaim = claim || invitation.claim;

  if (showNDAModal && !contractorNdaSigned) {
    return (
      <ContractSigningModal
        onClose={onClose}
        jobId={invitation.claimId}
        jobTitle={displayClaim?.title || 'Project'}
        isSigned={false}
        onContractSigned={handleNDASigned}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Accept Invitation</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Title and Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {displayClaim?.title || 'Untitled Project'}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {displayClaim?.projectType || 'N/A'}
                    </Badge>
                  </div>
                </div>

                {/* Contract Value */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">RCV / Estimated Contract Value</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${displayClaim?.totalJobValue?.toLocaleString() || 'N/A'}
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <p className="text-base font-medium text-gray-900">
                      {displayClaim?.street}, {displayClaim?.city}, {displayClaim?.state} {displayClaim?.zipCode}
                    </p>
                  </div>
                </div>

                {/* Invited By */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Invited By</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <p className="text-base font-medium text-gray-900">
                      {displayClaim?.user?.email || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {(displayClaim?.aiSummary || displayClaim?.additionalNotes) && (
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-900">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {displayClaim?.aiSummary || displayClaim?.additionalNotes}
                    </p>
                  </div>
                )}

                {/* NDA Document */}
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-900">Non-Disclosure Agreement</p>
                  <p className="text-xs text-gray-600 mb-3">
                    Please review the NDA document below. By accepting this invitation, you acknowledge that you have read and agree to the terms of the NDA.
                  </p>
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <iframe
                      src="/vendle_nda.pdf"
                      className="w-full h-[500px]"
                      title="Vendle NDA Contract"
                    />
                  </div>
                </div>

                {/* Images */}
                {images && images.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-900">Property Images</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((url: string, index: number) => (
                        <div
                          key={index}
                          className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={url}
                            alt={`Property image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDFs */}
                {claimPdfs && claimPdfs.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-900">Property Documentation</p>
                    <div className="space-y-2">
                      {claimPdfs.map((url: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">
                              Document {index + 1}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            View PDF
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={acceptInvitationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptInvitation}
              disabled={acceptInvitationMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {acceptInvitationMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

