"use client";
import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Users, DollarSign, Clock, Mail, Phone, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useApiService } from "@/services/api";
import { createClient } from "@/auth/client";
import { useAuth } from "@/contexts/AuthContext";

interface Auction {
    id: string;
    title: string;
    additionalNotes: string;
    totalJobValue: number;
    bids: any[];
    endDate: string;
    status: string;
    property_address?: string;
    project_type?: string;
    design_plan?: string;
    reconstructionType?: string;
    aiSummary?: string;
}

interface Bid {
    contractor_id: string;
    contractor_name: string;
    bid_amount: number;
    bid_description?: string;
    phone_number?: string;
    email?: string;
    company_name?: string;
    company_website?: string;
    license_number?: string;
    years_experience?: number;
}

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

    const isContractor = user?.user_metadata?.userType === "contractor";

    const handleCloseDialog = () => {
        setAiRecommendation("");
        setOpenAiDialog(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
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

    const fetchAuction = async (auctionId: string) => {
        try {
            const response: any = await apiService.get(`/api/auction/${auctionId}`);
            return response?.auction as unknown as Auction;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBids = async (auctionId: string) => {
        try {
            const response: any = await apiService.get(`/api/bids/${auctionId}`);
            return (response?.expandedBidInfo as unknown as Bid[]) || [];
        } catch (error) {
            console.log(error);
        }
    };

    const { data: auction, isLoading: loading } = useQuery({
        queryKey: ["getAuction", auction_id],
        queryFn: () => fetchAuction(auction_id),
        enabled: !!auction_id,
    });

    const { data: bids, isLoading: bidsLoading } = useQuery({
        queryKey: ["getBids"],
        queryFn: () => fetchBids(auction_id),
        enabled: !!auction_id,
    });

    const handleAskVendleAI = async () => {
        try {
            const project_details = {
                project_type: auction?.reconstructionType,
                project_description: auction?.aiSummary || auction?.totalJobValue,
                location: "Miami, Florida",
            };

            const analysisRequest = {
                project_details,
                contractor_bids: bids,
            };

            setOpenAiDialog(true);

            const response: any = await fetch(
                "http://localhost:8001/api/analyze_contractors",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(analysisRequest),
                }
            );

            const data = await response.json();
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
                queryKey: ["getBids"],
            });
            setBidData(initialBidDefaults);
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

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 pl-32">
                <div className="space-y-4 text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-[hsl(217,64%,23%)]" />
                    <p className="text-lg text-foreground">Loading auction details...</p>
                </div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 pl-32">
                <Card className="border-border bg-card p-8 text-center shadow-md">
                    <p className="mb-4 text-xl font-semibold text-foreground">
                        Auction not found.
                    </p>
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

    // Derived summary for sticky ribbon
    const bidAmount = Number(bidData.amount || 0);
    const materials = Number(bidData.budgetTotal || 0);
    const labor = Number(bidData.laborCosts || 0);
    const subs = Number(bidData.subContractorExpenses || 0);
    const overhead = Number(bidData.overhead || 0);
    const profit = Number(bidData.profit || 0);
    const allowance = Number(bidData.allowance || 0);

    return (
        <div className="min-h-screen bg-muted/30 pl-32">
            <main className="mx-auto max-w-7xl px-8 py-10">
                {/* Top back + title row */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    <Button
                        variant="ghost"
                        className="h-9 rounded-full px-3 text-sm text-muted-foreground hover:bg-muted"
                        onClick={() => router.back()}
                    >
                        ← Back to Auctions
                    </Button>
                </div>

                {/* Main header card */}
                <Card className="mb-8 border-border bg-card shadow-md">
                    <CardHeader className="space-y-4 pb-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                    Restoration Auction
                                </p>
                                <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
                                    {auction?.title}
                                </CardTitle>
                                {auction?.reconstructionType && (
                                    <p className="text-sm text-muted-foreground">
                                        Scope:{" "}
                                        <span className="font-medium text-foreground">
                      {auction?.reconstructionType}
                    </span>
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1 rounded-full border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                                >
                                    <Users className="h-3.5 w-3.5" />
                                    {auction?.bids?.length} bids
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1 rounded-full border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                                >
                                    <DollarSign className="h-3.5 w-3.5" />
                                    Current ${auction?.bids?.[0]?.amount}
                                </Badge>
                                <Badge
                                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                                >
                                    {auction?.status}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {isContractor ? (
                    // CONTRACTOR VIEW — SIDE-BY-SIDE
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)]">
                        {/* LEFT: Project details */}
                        <Card className="border-border bg-card shadow-md">
                            <CardHeader className="border-b border-border pb-5">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Project Overview
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-6">
                                <section className="space-y-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        Description
                                    </h3>
                                    <p className="text-base leading-relaxed text-foreground">
                                        {auction?.aiSummary || auction?.additionalNotes}
                                    </p>
                                </section>

                                <section className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-3 rounded-xl bg-muted p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Starting Bid
                                        </p>
                                        <p className="text-2xl font-semibold text-foreground">
                                            ${auction?.totalJobValue?.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Minimum opening bid set by homeowner
                                        </p>
                                    </div>

                                    <div className="space-y-3 rounded-xl bg-muted p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Auction Ends
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {new Date(auction?.endDate).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Bids after this time will not be accepted
                                        </p>
                                    </div>
                                </section>

                                {auction?.reconstructionType && (
                                    <section className="space-y-3">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                            Scope of Work
                                        </h3>
                                        <div className="rounded-xl border border-dashed border-border bg-background/60 p-4">
                                            <p className="text-sm text-foreground">
                                                {auction?.reconstructionType}
                                            </p>
                                        </div>
                                    </section>
                                )}
                            </CardContent>
                        </Card>

                        {/* RIGHT: Bid form with sticky summary */}
                        <Card className="relative flex h-full flex-col border-border bg-card shadow-md">
                            <CardHeader className="rounded-t-xl bg-[hsl(217,64%,23%)] pb-5 text-white">
                                <CardTitle className="text-xl font-semibold">
                                    Submit Your Bid
                                </CardTitle>
                                <p className="mt-1 text-xs text-white/80">
                                    Provide your full job pricing breakdown and upload your estimate.
                                </p>
                            </CardHeader>

                            <CardContent className="flex-1 space-y-5 pt-6">
                                <form className="space-y-5" onSubmit={onSubmit}>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="amount"
                                            className="text-sm font-medium text-foreground"
                                        >
                                            Bid Amount *
                                        </Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            placeholder="Enter your total bid"
                                            className="h-11 border-border text-base font-semibold text-foreground focus-visible:ring-[hsl(217,64%,23%)]"
                                            value={bidData.amount}
                                            onChange={handleBidDataChange}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This is the total amount you are bidding for the full scope
                                            of work.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="budgetTotal"
                                                className="text-xs font-medium text-muted-foreground"
                                            >
                                                Materials
                                            </Label>
                                            <Input
                                                id="budgetTotal"
                                                name="budgetTotal"
                                                className="h-10 border-border text-sm text-foreground focus-visible:ring-[hsl(217,64%,23%)]"
                                                value={bidData.budgetTotal}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="laborCosts"
                                                className="text-xs font-medium text-muted-foreground"
                                            >
                                                Labor Costs
                                            </Label>
                                            <Input
                                                id="laborCosts"
                                                name="laborCosts"
                                                className="h-10 border-border text-sm text-foreground focus-visible:ring-[hsl(217,64%,23%)]"
                                                value={bidData.laborCosts}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="subContractorExpenses"
                                                className="text-xs font-medium text-muted-foreground"
                                            >
                                                Subcontractor Expenses
                                            </Label>
                                            <Input
                                                id="subContractorExpenses"
                                                name="subContractorExpenses"
                                                className="h-10 border-border text-sm text-foreground focus-visible:ring-[hsl(217,64%,23%)]"
                                                value={bidData.subContractorExpenses}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="overhead"
                                                className="text-xs font-medium text-muted-foreground"
                                            >
                                                Overhead
                                            </Label>
                                            <Input
                                                id="overhead"
                                                name="overhead"
                                                className="h-10 border-border text-sm text-foreground focus-visible:ring-[hsl(217,64%,23%)]"
                                                value={bidData.overhead}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="allowance"
                                                className="text-xs font-medium text-muted-foreground"
                                            >
                                                Allowance
                                            </Label>
                                            <Input
                                                id="allowance"
                                                name="allowance"
                                                className="h-10 border-border text-sm text-foreground focus-visible:ring-[hsl(217,64%,23%)]"
                                                value={bidData.allowance}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="profit"
                                                className="text-xs font-medium text-muted-foreground"
                                            >
                                                Profit
                                            </Label>
                                            <Input
                                                id="profit"
                                                name="profit"
                                                className="h-10 border-border text-sm text-foreground focus-visible:ring-[hsl(217,64%,23%)]"
                                                value={bidData.profit}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Upload area */}
                                    {!uploadedFile ? (
                                        <div className="flex h-20 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/60 px-4 py-3 text-center transition-colors hover:border-[hsl(217,64%,23%)] hover:bg-muted">
                                            <div className="flex flex-col items-center gap-1">
                        <span
                            className="flex items-center gap-2 text-xs font-medium text-[hsl(217,64%,23%)]"
                            onClick={handleClick}
                        >
                          <Upload className="h-4 w-4" />
                          Click to upload your PDF estimate
                        </span>
                                                <p className="text-[10px] text-muted-foreground">
                                                    PDF only, max 10 MB
                                                </p>
                                                <Input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-16 w-full items-center justify-between rounded-xl border border-border bg-muted px-4">
                                            <div className="flex items-center gap-2 text-sm text-foreground">
                                                <FileText className="h-4 w-4 text-[hsl(217,64%,23%)]" />
                                                <span className="truncate">{uploadedFile?.name}</span>
                                            </div>
                                            <X
                                                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                                                onClick={() => setUploadedFile(null)}
                                            />
                                        </div>
                                    )}

                                    {/* Sticky summary + submit */}
                                    <div className="sticky bottom-0 mt-6 space-y-3 border-t border-border bg-card pt-4">
                                        <div className="flex items-center justify-between gap-4 text-sm">
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Bid Summary
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Materials ${materials.toLocaleString()} • Labor $
                                                    {labor.toLocaleString()} • Subs ${subs.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Overhead ${overhead.toLocaleString()} • Profit $
                                                    {profit.toLocaleString()} • Allowance $
                                                    {allowance.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Your Bid</p>
                                                <p className="text-xl font-semibold text-foreground">
                                                    ${bidAmount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-1 h-11 w-full rounded-full bg-[hsl(217,64%,23%)] text-sm font-semibold text-white hover:bg-[hsl(217,64%,18%)]"
                                        >
                                            Submit Bid
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    // HOMEOWNER VIEW
                    <div className="space-y-8">
                        {/* Project + auction details */}
                        <Card className="border-border bg-card shadow-md">
                            <CardHeader className="border-b border-border pb-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="space-y-3">
                                        <CardTitle className="text-2xl font-semibold text-foreground">
                                            {auction?.title}
                                        </CardTitle>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="flex items-center gap-1 rounded-full border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                                            >
                                                <Users className="h-3.5 w-3.5" />
                                                {auction?.bids?.length} bids
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="flex items-center gap-1 rounded-full border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                                            >
                                                <DollarSign className="h-3.5 w-3.5" />
                                                Current ${auction?.bids?.[0]?.amount}
                                            </Badge>
                                            <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {auction?.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    {!isContractor && (
                                        <Button
                                            onClick={() => askVendleAIMutation.mutate()}
                                            className="rounded-full bg-[hsl(217,64%,23%)] px-5 text-sm font-medium text-white hover:bg-[hsl(217,64%,18%)]"
                                        >
                                            Ask Vendle
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-5">
                                        <h3 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                            Project Description
                                        </h3>
                                        <div className="space-y-4 rounded-xl bg-muted p-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    Description
                                                </p>
                                                <p className="text-sm leading-relaxed text-foreground">
                                                    {auction?.aiSummary || auction?.additionalNotes || "N/A"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    Project Type
                                                </p>
                                                <p className="text-sm text-foreground">
                                                    {auction?.reconstructionType || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <h3 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                            Auction Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center rounded-xl border border-border bg-background p-4">
                                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(217,64%,23%)]/10">
                                                    <DollarSign className="h-5 w-5 text-[hsl(217,64%,23%)]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground">
                                                        Starting Bid
                                                    </p>
                                                    <p className="text-xl font-semibold text-foreground">
                                                        ${auction?.totalJobValue?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center rounded-xl border border-border bg-background p-4">
                                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                                    <Clock className="h-5 w-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground">
                                                        Auction Ends
                                                    </p>
                                                    <p className="text-base font-semibold text-foreground">
                                                        {new Date(auction?.endDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bidders */}
                        <Card className="border-border bg-card shadow-md">
                            <CardHeader className="border-b border-border pb-5">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3">
                                        <Users className="h-6 w-6 text-[hsl(217,64%,23%)]" />
                                        <CardTitle className="text-xl font-semibold text-foreground">
                                            Current Bidders
                                            {bids?.length ? (
                                                <span className="ml-2 text-base font-normal text-muted-foreground">
                          ({bids.length})
                        </span>
                                            ) : null}
                                        </CardTitle>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Select defaultValue="lowest_bid">
                                            <SelectTrigger className="h-9 w-[200px] rounded-full border-border bg-background text-xs text-muted-foreground focus:ring-0">
                                                <SelectValue placeholder="Sort bidders" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lowest_bid">
                                                    Sort by Lowest Bid
                                                </SelectItem>
                                                <SelectItem value="highest_rating">
                                                    Sort by Highest Rating
                                                </SelectItem>
                                                <SelectItem value="most_reviews">
                                                    Sort by Most Reviews
                                                </SelectItem>
                                                <SelectItem value="company_name">
                                                    Sort by Company Name
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            className="h-9 rounded-full border-border text-xs text-muted-foreground hover:bg-muted"
                                        >
                                            Add Test Bids
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {bidsLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="space-y-4 text-center">
                                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[hsl(217,64%,23%)]" />
                                            <p className="text-sm text-foreground">Loading bids...</p>
                                        </div>
                                    </div>
                                ) : bids?.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                                        <p className="mb-1 text-lg font-semibold text-foreground">
                                            No bids yet
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Waiting for contractors to submit competitive bids.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        {bids?.map((bid) => (
                                            <Card
                                                key={bid.contractor_id}
                                                className="border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                                            >
                                                <CardContent className="space-y-4 p-5">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(217,64%,23%)]">
                              <span className="text-lg font-semibold text-white">
                                {(bid.company_name || bid.contractor_name)?.charAt(0)}
                              </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-foreground">
                                                                {bid.company_name || "Independent Contractor"}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                {bid.contractor_name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Mail className="h-4 w-4 text-[hsl(217,64%,23%)]" />
                                                            <span className="truncate">{bid.email}</span>
                                                        </div>
                                                        {bid.phone_number && (
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Phone className="h-4 w-4 text-[hsl(217,64%,23%)]" />
                                                                <span>{bid.phone_number}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3 border-t border-border pt-4">
                                                        <div className="flex items-end justify-between">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Bid Amount
                                                                </p>
                                                                <p className="text-2xl font-semibold text-foreground">
                                                                    ${bid.bid_amount.toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 rounded-full border-border text-xs text-muted-foreground hover:bg-muted"
                                                            >
                                                                View Profile
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="flex-1 rounded-full bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                                                            >
                                                                Accept Bid
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* AI Suggestion Dialog */}
                <Dialog open={openAiDialog} onOpenChange={setOpenAiDialog}>
                    <DialogContent className="flex flex-col items-center gap-4 border-border bg-card">
                        <DialogHeader className="w-full text-center">
                            <DialogTitle className="text-base font-semibold text-foreground">
                                AI Suggestion
                            </DialogTitle>
                        </DialogHeader>
                        {!aiRecommendation ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-4">
                                <Loader2 className="h-8 w-8 animate-spin text-[hsl(217,64%,23%)]" />
                                <p className="text-sm text-foreground">
                                    Loading AI recommendation...
                                </p>
                            </div>
                        ) : (
                            <div className="max-h-80 w-full overflow-y-auto rounded-md bg-muted p-4 text-sm leading-relaxed text-foreground">
                                {aiRecommendation}
                            </div>
                        )}
                        <DialogFooter className="w-full">
                            <Button
                                variant="outline"
                                onClick={handleCloseDialog}
                                className="ml-auto rounded-full border-border text-sm text-muted-foreground hover:bg-muted"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}