import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getContractorInitials } from "@/utils/helpers";

interface RecommendedContractorsPanelProps {
  claim: any | null;
  contractors: any[];
  existingInvitedContractorIds: string[];
  onClose: () => void;
  onInviteContractor: (contractorId: string) => void;
}

export function RecommendedContractorsPanel({
  claim,
  contractors,
  existingInvitedContractorIds,
  onClose,
  onInviteContractor
}: RecommendedContractorsPanelProps) {
  if (!claim) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Recommended Contractors</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-sm text-gray-600 mb-6">
            Select contractors to invite for bidding on your project
          </p>

          <div className="space-y-4">
            {contractors.map((contractor: any) => (
              <Card key={contractor.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-vendle-blue flex items-center justify-center text-white font-semibold text-lg">
                        {getContractorInitials(contractor?.companyName)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{contractor?.companyName}</p>
                        <p className="text-xs text-gray-500">Specializes in {claim.projectType || 'restoration'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-yellow-600">★★★★★</span>
                          <span className="text-xs text-gray-500">(24 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-vendle-blue hover:bg-vendle-blue/90"
                      disabled={existingInvitedContractorIds.includes(contractor.id)}
                      onClick={() => onInviteContractor(contractor.id)}
                    >
                      Invite to Bid
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
