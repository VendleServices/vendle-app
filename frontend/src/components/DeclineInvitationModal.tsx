'use client';

import { XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

interface DeclineInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectTitle: string;
    isLoading?: boolean;
}

export default function DeclineInvitationModal({
   isOpen,
   onClose,
   onConfirm,
   projectTitle,
   isLoading = false,
}: DeclineInvitationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Decline Invitation?
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-gray-600 pt-2">
                        Are you sure you want to decline the invitation for{' '}
                        <span className="font-semibold text-gray-900">{projectTitle}</span>?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Once declined, you won't be able to accept this invitation later.
                            The homeowner will be notified of your decision.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 sm:flex-initial"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Declining...
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Decline Invitation
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
