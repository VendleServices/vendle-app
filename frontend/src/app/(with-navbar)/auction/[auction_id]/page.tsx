"use client";
import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useApiService } from "@/services/api";
import { createClient } from "@/auth/client";
import { useAuth } from "@/contexts/AuthContext";

import { AuctionHeader } from "./shared/AuctionHeader";
import { AIRecommendationDialog } from "./shared/AIRecommendationDialog";
import { ContractorView } from "./contractor/ContractorView";
import { HomeownerView } from "./homeowner/HomeownerView";
import { Auction } from "./types";

const initialBidDefaults = {
  amount: 0,
  budgetTotal: 0,
  subContractorExpenses: 0,
  overhead: 0,
  laborCosts: 0,
  profit: 0,
  allowance: 0,
};

export default function AuctionDetailsPage() {
  const params = useParams();
  const auction_id = params.auction_id as string;
  const router = useRouter();
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useAuth();

  const [bidData, setBidData] = useState(initialBidDefaults);
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [openAiDialog, setOpenAiDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedForPhase2, setSelectedForPhase2] = useState<Set<string>>(new Set());
  const [adjustingBid, setAdjustingBid] = useState(false);
  const [adjustedBidData, setAdjustedBidData] = useState(initialBidDefaults);

  const isContractor = user?.user_metadata?.userType === "contractor";

  // Data fetching
  const fetchAuction = async (auctionId: string) => {
    try {
      const response: any = await apiService.get(`/api/auction/${auctionId}`);
      return response?.totalAuction as unknown as Auction;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: auction, isLoading: loading } = useQuery({
    queryKey: ["getAuction", auction_id],
    queryFn: () => fetchAuction(auction_id),
    enabled: !!auction_id,
  });

  const allPhaseOneBids = auction?.phase1Bids || [];
  const contractorPhase1Bid = allPhaseOneBids?.find((bid: any) => bid?.userId === user?.id);
  const disableConfirmContractor = auction?.bids?.find((bid: any) => bid?.userId === user?.id && bid?.amount === contractorPhase1Bid?.amount);
  const disableAdjustContractor = auction?.bids?.find((bid: any) => bid?.userId === user?.id);
  const claimId = auction?.claimId;

  // Event handlers
  const handleCloseDialog = () => {
    setAiRecommendation("");
    setOpenAiDialog(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file?.type !== "application/pdf") {
        toast("Invalid file type", {
          description: "Only PDF files can be uploaded",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast("Maximum File Size Exceeded", {
          description: "Please upload a smaller file",
        });
        return;
      }

      setUploadedFile(event.target.files[0]);
    }
  };

  const handleBidDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBidData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePhase2Selection = (contractorId: string) => {
    setSelectedForPhase2((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contractorId)) {
        newSet.delete(contractorId);
        toast.success("Contractor removed from Phase 2 selection");
      } else {
        newSet.add(contractorId);
        toast.success("Contractor selected for Phase 2");
      }
      return newSet;
    });
  };

  const handleConfirmPhase1Bid = async () => {
    try {
      const response = await apiService.post(`/api/bids/${auction_id}`, { ...contractorPhase1Bid });
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const confirmPhase1BidMutation = useMutation({
    mutationFn: handleConfirmPhase1Bid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAuction", auction_id] });
      toast.success("Bid Confirmed", {
        description: "Your Phase 1 bid has been confirmed for Phase 2",
      });
    }
  })

  const handleAdjustBid = () => {
    setAdjustingBid(true);
    setAdjustedBidData({
      amount: contractorPhase1Bid?.amount,
      budgetTotal: contractorPhase1Bid?.budgetTotal,
      laborCosts: contractorPhase1Bid?.laborCosts,
      subContractorExpenses: contractorPhase1Bid?.subContractorExpenses,
      overhead: contractorPhase1Bid?.overhead,
      profit: contractorPhase1Bid?.profit,
      allowance: contractorPhase1Bid?.allowance,
    });
  };

  const handleSubmitAdjustedBid = async () => {
    try {
      const body = {
        ...adjustedBidData,
        bidPdfPath: contractorPhase1Bid?.bidPdfPath,
      };

      const response = await apiService.post(`/api/bids/${auction_id}`, body);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const adjustBidMutation = useMutation({
    mutationFn: handleSubmitAdjustedBid,
    onSuccess: () => {
      setAdjustingBid(false);
      queryClient.invalidateQueries({ queryKey: ["getAuction", auction_id] });
      toast.success("Bid Adjusted", {
        description: "Your adjusted bid has been submitted for Phase 2",
      });
    }
  })

  const handleWithdraw = async () => {
    const claimParticipantId = auction?.participants?.find((participant: any) => participant?.id === user?.id);

    if (claimParticipantId) {
      const response = await apiService.put(`/api/claimParticipants/${auction_id}/withdraw/${claimParticipantId}`, {});
      return response;
    }

    return null;
  };

  const withdrawMutation = useMutation({
    mutationFn: handleWithdraw,
    onSuccess: () => {
      toast.info("Withdrawn from Auction", {
        description: "You have withdrawn from this Phase 2 auction",
      });
      queryClient.invalidateQueries({ queryKey: ["getAuctions"] });
      queryClient.invalidateQueries({ queryKey: ["getAuction", auction_id] });
      router.push("/home");
    }
  });

  const handleAcceptBid = (contractorId: string, bidAmount: number) => {
    toast.success("Bid Accepted", {
      description: `Accepted contractor bid of $${bidAmount.toLocaleString()}`,
    });
    console.log("Accepted contractor:", contractorId);
  };

  // Mutations
  const handleAskVendleAI = async () => {
    try {
      const project_details = {
        project_type: auction?.reconstructionType,
        project_description: auction?.aiSummary || auction?.totalJobValue,
        location: "Miami, Florida",
      };

      const analysisRequest = {
        project_details,
        contractor_bids: auction?.expandedBidInfo,
      };

      setOpenAiDialog(true);

      const response: any = await apiService.post("/api/analyzeContractors", analysisRequest);

      const data = response?.data;
      setAiRecommendation(data?.recommendation);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const askVendleAIMutation = useMutation({
    mutationFn: handleAskVendleAI,
    onSuccess: () => {
      console.log("Successfully asked ai");
    },
    onError: () => {
      console.log("error asking ai");
    },
  });

  const handleSubmitBid = async (auctionId: string) => {
    try {
      if (!auctionId) return;
      if (!uploadedFile) {
        console.log("please upload a file");
        return;
      }

      const timestamp = Date.now();
      const { data, error } = await supabase.storage
        .from("vendle-estimates")
        .upload(`public/bid_${uploadedFile.name}_${timestamp}`, uploadedFile);

      if (error) {
        console.log("error uploading file");
        return;
      }

      const bidPdfPath = data?.fullPath;
      if (!bidPdfPath) {
        console.log("no pdf path");
        return;
      }

      const body = {
        ...bidData,
        bidPdfPath,
      };
      const response: any = await apiService.post(`/api/bids/${auctionId}`, body);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const submitBidDataMutation = useMutation({
    mutationFn: handleSubmitBid,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAuction", auction_id],
      });
      setBidData(initialBidDefaults);
      setUploadedFile(null);
      toast("Successfully submitted bid", {
        description:
          "Your bid has been sent to the homeowner. You shall be contacted if your bid is accepted",
      });
    },
    onError: () => {
      console.log("error");
    },
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitBidDataMutation.mutate(auction_id);
  };

  const handleCreatePhase2Auction = async () => {
    const selectedParticipants = Array.from(selectedForPhase2);

    try {
      const response: any = await apiService.put(`/api/auction/${auction_id}`, {
        selectedParticipants,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const createPhaseTwoAuctionMutation = useMutation({
    mutationFn: handleCreatePhase2Auction,
    onSuccess: () => {
      toast.success("Successfully created Phase 2 Auction");
      router.push("/home");
    },
  });

  // Derived state
  const isPhase2 = auction?.number === 2;
  const isPhase1 = auction?.number === 1;
  const expandedBidInfo = auction?.expandedBidInfo || [];
  expandedBidInfo?.sort((a: any, b: any) => a?.bid_amount - b?.bid_amount);
  const lowestBid = expandedBidInfo?.[0]?.bid_amount;

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 lg:pl-32">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[hsl(217,64%,23%)]" />
          <p className="text-lg text-foreground">Loading auction details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!auction) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 lg:pl-32">
        <Card className="border-border bg-card p-6 sm:p-8 text-center shadow-md">
          <p className="mb-4 text-xl font-semibold text-foreground">Auction not found.</p>
          <Button
            className="mt-2 bg-[hsl(217,64%,23%)] text-white hover:bg-[hsl(217,64%,18%)]"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 lg:pl-32">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Auction Header */}
        <AuctionHeader
          auction={auction}
          bidsCount={auction?.bids?.length || 0}
          lowestBid={lowestBid}
          isPhase1={isPhase1}
          isPhase2={isPhase2}
          onBack={() => router.back()}
        />

        {/* View Claim Button */}
        {claimId && (
          <div className="mb-6">
            <Button
              onClick={() => router.push(`/claim/${claimId}`)}
              variant="outline"
              className="border-2 border-[#4A637D] text-[#4A637D] hover:bg-[#4A637D] hover:text-white font-semibold shadow-sm"
            >
              View Project Details
            </Button>
          </div>
        )}

        {/* Conditional View: Contractor or Homeowner */}
        {isContractor ? (
          <ContractorView
            auction={auction}
            isPhase1={isPhase1}
            isPhase2={isPhase2}
            bidData={bidData}
            uploadedFile={uploadedFile || null}
            onBidDataChange={handleBidDataChange}
            onFileUpload={handleFileUpload}
            onSubmitBid={onSubmit}
            isSubmitting={submitBidDataMutation.isPending}
            disableSubmit={disableAdjustContractor}
            fileInputRef={fileInputRef}
            contractorPhase1Bid={contractorPhase1Bid}
            adjustingBid={adjustingBid}
            adjustedBidData={adjustedBidData}
            phase1Bids={allPhaseOneBids}
            onConfirmBid={() => confirmPhase1BidMutation.mutate()}
            disableConfirmBid={confirmPhase1BidMutation.isPending || disableConfirmContractor || disableAdjustContractor}
            onAdjustBid={handleAdjustBid}
            disableAdjustBid={disableAdjustContractor || adjustBidMutation.isPending || disableConfirmContractor}
            onSubmitAdjustedBid={() => adjustBidMutation.mutate()}
            onWithdraw={() => withdrawMutation.mutate()}
            disableWithdrawBid={withdrawMutation.isPending}
            onCancelAdjust={() => setAdjustingBid(false)}
            setAdjustedBidData={setAdjustedBidData}
          />
        ) : (
          <HomeownerView
            auction={auction}
            bids={auction?.expandedBidInfo || []}
            bidsLoading={loading}
            isPhase1={isPhase1}
            selectedForPhase2={selectedForPhase2}
            onTogglePhase2Selection={handleTogglePhase2Selection}
            onAcceptBid={handleAcceptBid}
            onAskAI={() => askVendleAIMutation.mutate()}
            onCreatePhase2={() => createPhaseTwoAuctionMutation.mutate()}
            isAskingAI={askVendleAIMutation.isPending}
            isCreatingPhase2={createPhaseTwoAuctionMutation.isPending}
          />
        )}

        {/* AI Recommendation Dialog */}
        <AIRecommendationDialog
          open={openAiDialog}
          onClose={handleCloseDialog}
          recommendation={aiRecommendation}
          isLoading={askVendleAIMutation.isPending}
          bidCount={auction?.bids?.length || 0}
        />
      </main>
    </div>
  );
}
