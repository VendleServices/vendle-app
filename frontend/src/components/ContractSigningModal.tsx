'use client';

import { useState } from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ContractSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  onContractSigned: () => void;
}

export default function ContractSigningModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  onContractSigned
}: ContractSigningModalProps) {
  const { user } = useAuth();
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  if (!isOpen) return null;

  const handleSignContract = async () => {
    setIsSigning(true);

    try {
      // TODO: Integrate with DocuSign API
      // For now, we'll simulate the signing process

      // Call backend endpoint to initiate DocuSign signing
      // const response = await fetch('/api/docusign/initiate-signing', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     jobId,
      //     userEmail: user?.email,
      //     userName: user?.name || user?.email,
      //     contractUrl: '/vendle-contract.pdf'
      //   })
      // });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful signing
      setIsSigned(true);
      toast.success('Contract Signed Successfully', {
        description: 'You can now view the full job details'
      });

      // Wait a moment before closing and showing job details
      setTimeout(() => {
        onContractSigned();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Signing Failed', {
        description: 'There was an error signing the contract. Please try again.'
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Non-Disclosure Agreement
              </h2>
              <p className="text-sm text-gray-600">
                Review and sign to view job details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Job Info Banner */}
        <div className="bg-primary/10 px-6 py-3 border-b border-primary/20">
          <p className="text-sm text-primary">
            <span className="font-semibold">Job:</span> {jobTitle}
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* PDF Viewer */}
          <div className="px-6 py-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <iframe
                src="/vendle-contract.pdf"
                className="w-full h-[500px]"
                title="Vendle NDA Contract"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          {!isSigned ? (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSignContract}
                disabled={isSigning}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
              >
                {isSigning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Signature...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Sign with DocuSign
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSigning}
                className="px-6 h-12"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600 py-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">Contract Signed Successfully!</span>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-3">
            By signing, you agree to the terms and conditions outlined in the NDA
          </p>
        </div>
      </div>
    </div>
  );
}
