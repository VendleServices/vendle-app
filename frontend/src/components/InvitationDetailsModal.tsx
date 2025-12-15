'use client';

import { MapPin, DollarSign, User, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { useApiService } from '@/services/api';
import { createClient } from '@/auth/client';
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

interface InvitationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: ClaimInvitation;
}

export default function InvitationDetailsModal({
  isOpen,
  onClose,
  invitation,
}: InvitationDetailsModalProps) {
  const apiService = useApiService();
  const supabase = createClient();

  // Fetch full claim details
  const { data: claim, isLoading } = useQuery({
    queryKey: ['getClaim', invitation.claimId],
    queryFn: async () => {
      const response: any = await apiService.get(`/api/claim/${invitation.claimId}`);
      return response?.claim;
    },
    enabled: isOpen && !!invitation.claimId,
  });

  // Fetch claim images
  const { data: images } = useQuery({
    queryKey: ['getClaimImages', invitation.claimId],
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
    enabled: isOpen && !!invitation.claimId,
  });

  // Fetch claim PDFs
  const { data: claimPdfs } = useQuery({
    queryKey: ['getClaimPdfs', invitation.claimId],
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
    enabled: isOpen && !!invitation.claimId,
  });

  const displayClaim = claim || invitation.claim;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Invitation Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)]">
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

                {/* Created Date */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Invitation Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-base font-medium text-gray-900">
                      {new Date(invitation.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
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
      </DialogContent>
    </Dialog>
  );
}

