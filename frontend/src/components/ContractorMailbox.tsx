'use client';

import { useState } from 'react';
import { Bell, Mail, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, MapPin, User, FileText } from 'lucide-react';
import { toast } from 'sonner';
import InvitationDetailsModal from './InvitationDetailsModal';
import AcceptInvitationModal from './AcceptInvitationModal';
import ContractSigningModal from './ContractSigningModal';
import DeclineInvitationModal from './DeclineInvitationModal';

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

interface ContractorMailboxProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContractorMailbox({ isOpen, onClose }: ContractorMailboxProps) {
    const { user } = useAuth();
    const apiService = useApiService();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'notifications' | 'invites'>('invites');
    const [selectedInvitation, setSelectedInvitation] = useState<ClaimInvitation | null>(null);
    const [showInvitationDetails, setShowInvitationDetails] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showNDAModal, setShowNDAModal] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [invitationToDecline, setInvitationToDecline] = useState<ClaimInvitation | null>(null);

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

    // Fetch invitations
    const { data: invitations, isLoading: invitationsLoading } = useQuery({
        queryKey: ['getContractorInvitations'],
        queryFn: async () => {
            if (!user?.id) return [];
            const response: any = await apiService.get('/api/claimInvitations');
            const invitations: ClaimInvitation[] = response?.claimInvitations || [];

            return invitations;
        },
        enabled: !!user?.id && isOpen,
    });

    const pendingInvitations = invitations || [];
    const invitationCount = pendingInvitations.length;

    const handleViewDetails = (invitation: ClaimInvitation) => {
        setSelectedInvitation(invitation);
        setShowInvitationDetails(true);
    };

    const handleAccept = (invitation: ClaimInvitation) => {
        setSelectedInvitation(invitation);
        // Check if NDA is signed first
        if (!contractorNdaSigned) {
            setShowNDAModal(true);
            setShowAcceptModal(false);
        } else {
            setShowNDAModal(false);
            setShowAcceptModal(true);
        }
    };

    const handleCloseDetails = () => {
        setShowInvitationDetails(false);
        setSelectedInvitation(null);
    };

    const handleCloseAccept = () => {
        setShowAcceptModal(false);
        setSelectedInvitation(null);
    };

    // Decline invitation mutation
    const declineInvitationMutation = useMutation({
        mutationFn: async (invitationId: string) => {
            const response: any = await apiService.put(`/api/claimInvitations/${invitationId}`, { invitationAccepted: false });
            return response;
        },
        onSuccess: () => {
            toast.success('Invitation Declined', {
                description: 'You have declined this invitation.',
            });
            queryClient.invalidateQueries({ queryKey: ['getContractorInvitations'] });
        },
        onError: (error: any) => {
            toast.error('Error Declining Invitation', {
                description: error?.message || 'Failed to decline invitation. Please try again.',
            });
        },
    });

    const handleDecline = (invitation: ClaimInvitation) => {
        setInvitationToDecline(invitation);
        setShowDeclineModal(true);
    };

    const handleConfirmDecline = () => {
        if (invitationToDecline) {
            declineInvitationMutation.mutate(invitationToDecline.id);
            setShowDeclineModal(false);
            setInvitationToDecline(null);
        }
    };

    const handleCloseDeclineModal = () => {
        setShowDeclineModal(false);
        setInvitationToDecline(null);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[80vh] p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <DialogTitle className="text-2xl font-bold">Mailbox</DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'notifications' | 'invites')} className="w-full">
                        <TabsList className="w-full rounded-none border-b">
                            <TabsTrigger value="notifications" className="flex-1">
                                <Bell className="h-4 w-4 mr-2" />
                                Notifications
                                {invitationCount > 0 && (
                                    <Badge className="ml-2 bg-blue-500">{invitationCount}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="invites" className="flex-1">
                                <Mail className="h-4 w-4 mr-2" />
                                Invites
                                {invitationCount > 0 && (
                                    <Badge className="ml-2 bg-blue-500">{invitationCount}</Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="notifications" className="m-0">
                            <div className="p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Bell className="h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Feature in Development
                                    </h3>
                                    <p className="text-sm text-gray-600 max-w-md">
                                        General notifications are coming soon. Check back later for updates on your projects and opportunities.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="invites" className="m-0">
                            <ScrollArea className="h-[60vh]">
                                <div className="p-6 space-y-4">
                                    {invitationsLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : pendingInvitations.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Mail className="h-16 w-16 text-gray-400 mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No Invitations
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                You don't have any pending invitations at this time.
                                            </p>
                                        </div>
                                    ) : (
                                        pendingInvitations.map((invitation) => (
                                            <Card key={invitation.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="space-y-3">
                                                        {/* Header */}
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                                    {invitation.claim?.title || 'Untitled Project'}
                                                                </h4>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span>
                                    {invitation.claim?.street}, {invitation.claim?.city}, {invitation.claim?.state}
                                  </span>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Pending
                                                            </Badge>
                                                        </div>

                                                        {/* Details */}
                                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-gray-500" />
                                                                <div>
                                                                    <p className="text-xs text-gray-500">RCV / Contract Value</p>
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        ${invitation.claim?.totalJobValue?.toLocaleString() || 'N/A'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-gray-500" />
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Invited By</p>
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {invitation.claim?.user?.email || 'Unknown'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={() => handleViewDetails(invitation)}
                                                            >
                                                                <FileText className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                                                onClick={() => handleDecline(invitation)}
                                                                disabled={declineInvitationMutation.isPending}
                                                            >
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Decline
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                                onClick={() => handleAccept(invitation)}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Accept
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {selectedInvitation && (
                <>
                    <InvitationDetailsModal
                        isOpen={showInvitationDetails}
                        onClose={handleCloseDetails}
                        invitation={selectedInvitation}
                    />
                    {/* Show NDA modal first if not signed */}
                    {showNDAModal && selectedInvitation && (
                        <ContractSigningModal
                            onClose={() => {
                                setShowNDAModal(false);
                                setSelectedInvitation(null);
                            }}
                            jobId={selectedInvitation.claimId}
                            jobTitle={selectedInvitation.claim?.title || 'Project'}
                            isSigned={false}
                            onContractSigned={() => {
                                queryClient.invalidateQueries({ queryKey: ['getContractorNDA', user?.id] });
                                setShowNDAModal(false);
                                // After NDA is signed, show the accept modal with phase 1 details
                                setTimeout(() => {
                                    setShowAcceptModal(true);
                                }, 500);
                            }}
                        />
                    )}
                    {/* Show accept modal with phase 1 details after NDA is signed */}
                    {showAcceptModal && selectedInvitation && contractorNdaSigned && (
                        <AcceptInvitationModal
                            isOpen={showAcceptModal}
                            onClose={handleCloseAccept}
                            invitation={selectedInvitation}
                            onSuccess={() => {
                                handleCloseAccept();
                                queryClient.invalidateQueries({ queryKey: ['getContractorInvitations'] });
                            }}
                        />
                    )}
                </>
            )}

            {/* Decline Invitation Modal */}
            {invitationToDecline && (
                <DeclineInvitationModal
                    isOpen={showDeclineModal}
                    onClose={handleCloseDeclineModal}
                    onConfirm={handleConfirmDecline}
                    projectTitle={invitationToDecline.claim?.title || 'Untitled Project'}
                    isLoading={declineInvitationMutation.isPending}
                />
            )}
        </>
    );
}
