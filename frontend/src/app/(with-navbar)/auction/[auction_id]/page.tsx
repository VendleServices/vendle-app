"use client";
import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Users, DollarSign, Clock, Mail, Phone, FileText, Upload, X, Gavel, Wrench, Info, ArrowRight, Eye, Trash2, Check, Star, ArrowDown, SortDesc, Calculator, Sparkles } from "lucide-react";
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { useApiService } from "@/services/api";
import { createClient } from "@/auth/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

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
            return response?.totalAuction as unknown as Auction;
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
        queryKey: ["getBids", auction_id],
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

            const response: any = await apiService.post('/api/analyzeContractors', analysisRequest);

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
                queryKey: ["getBids", auction_id],
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
            <div className="flex min-h-screen items-center justify-center bg-muted/30 lg:pl-32">
                <div className="space-y-4 text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-[hsl(217,64%,23%)]" />
                    <p className="text-lg text-foreground">Loading auction details...</p>
                </div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 lg:pl-32">
                <Card className="border-border bg-card p-6 sm:p-8 text-center shadow-md">
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
        <div className="min-h-screen bg-muted/30 lg:pl-32">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
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

                {/* Enhanced header with gradient background */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-vendle-blue/5 to-vendle-teal/5 border-2 border-vendle-gray/20 shadow-xl mb-8">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A637D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />

                    <div className="relative p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Left: Title & metadata */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="uppercase tracking-wider text-xs font-bold text-vendle-blue border-vendle-blue/30 bg-vendle-blue/5">
                                        <Gavel className="w-3 h-3 mr-1" />
                                        Live Auction
                                    </Badge>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                    {auction.title}
                                </h1>

                                {auction.reconstructionType && (
                                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                                        <Wrench className="w-5 h-5 text-vendle-blue" />
                                        <span>{auction.reconstructionType}</span>
                                    </div>
                                )}
                            </div>

                            {/* Right: Stats cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Bid count */}
                                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-vendle-gray/30 shadow-md">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                        <Users className="w-3.5 h-3.5" />
                                        <span className="uppercase tracking-wide font-medium">Bids</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{bids?.length || 0}</p>
                                </div>

                                {/* Lowest bid */}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-vendle-blue/10 to-vendle-teal/10 border border-vendle-blue/20 shadow-md">
                                    <div className="flex items-center gap-2 text-vendle-blue text-xs mb-1">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        <span className="uppercase tracking-wide font-medium">Lowest Bid</span>
                                    </div>
                                    <p className="text-2xl font-bold text-vendle-blue">
                                        {bids?.[0] ? `$${bids[0].bid_amount.toLocaleString()}` : 'N/A'}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-md col-span-2 lg:col-span-1">
                                    <div className="flex items-center gap-2 text-emerald-700 text-xs mb-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="uppercase tracking-wide font-medium">Status</span>
                                    </div>
                                    <p className="text-lg font-bold text-emerald-700 capitalize">{auction.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

                        {/* RIGHT: Enhanced bid submission form */}
                        <div className="sticky top-6 h-fit">
                            {/* Header with gradient */}
                            <div className="rounded-t-2xl bg-gradient-to-r from-vendle-blue to-vendle-teal p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold">Submit Your Bid</h2>
                                    <Badge className="bg-white/20 text-white border-white/30">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Live
                                    </Badge>
                                </div>
                                <p className="text-white/90 text-sm">
                                    Complete all fields and upload your detailed estimate
                                </p>
                            </div>

                            {/* Form body */}
                            <form onSubmit={onSubmit} className="bg-white rounded-b-2xl border-2 border-t-0 border-vendle-gray/20 p-6 space-y-6 shadow-xl">
                                {/* Main bid amount - hero input */}
                                <div className="p-6 rounded-xl bg-gradient-to-br from-vendle-blue/5 to-vendle-teal/5 border-2 border-vendle-blue/20">
                                    <Label className="text-base font-bold text-foreground mb-3 block flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-vendle-blue" />
                                        Total Bid Amount
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-vendle-blue">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            name="amount"
                                            value={bidData.amount}
                                            onChange={handleBidDataChange}
                                            className="h-16 pl-12 text-3xl font-bold border-2 border-vendle-blue/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 bg-white rounded-xl"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        This is your total project cost
                                    </p>
                                </div>

                                {/* Cost breakdown - collapsible */}
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="breakdown" className="border-none">
                                        <AccordionTrigger className="py-3 px-4 hover:bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <Calculator className="w-4 h-4 text-vendle-blue" />
                                                Cost Breakdown (Optional)
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Materials
                                                    </Label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            name="budgetTotal"
                                                            value={bidData.budgetTotal}
                                                            onChange={handleBidDataChange}
                                                            className="h-11 pl-9 text-sm rounded-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Labor Costs
                                                    </Label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            name="laborCosts"
                                                            value={bidData.laborCosts}
                                                            onChange={handleBidDataChange}
                                                            className="h-11 pl-9 text-sm rounded-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Subcontractor Expenses
                                                    </Label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            name="subContractorExpenses"
                                                            value={bidData.subContractorExpenses}
                                                            onChange={handleBidDataChange}
                                                            className="h-11 pl-9 text-sm rounded-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Overhead
                                                    </Label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            name="overhead"
                                                            value={bidData.overhead}
                                                            onChange={handleBidDataChange}
                                                            className="h-11 pl-9 text-sm rounded-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Profit
                                                    </Label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            name="profit"
                                                            value={bidData.profit}
                                                            onChange={handleBidDataChange}
                                                            className="h-11 pl-9 text-sm rounded-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Allowance
                                                    </Label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            name="allowance"
                                                            value={bidData.allowance}
                                                            onChange={handleBidDataChange}
                                                            className="h-11 pl-9 text-sm rounded-lg"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                {/* File upload - enhanced */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-vendle-blue" />
                                        Detailed Estimate (PDF Required)
                                    </Label>

                                    {!uploadedFile ? (
                                        <div
                                            onClick={handleClick}
                                            className="relative group cursor-pointer"
                                        >
                                            <div className="rounded-xl border-2 border-dashed border-vendle-gray/50 hover:border-vendle-blue p-8 transition-all bg-gradient-to-br from-vendle-blue/5 to-transparent group-hover:from-vendle-blue/10">
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-14 h-14 rounded-xl bg-vendle-blue/10 group-hover:bg-vendle-blue/20 flex items-center justify-center mb-3 transition-colors">
                                                        <Upload className="w-7 h-7 text-vendle-blue" />
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground mb-1">
                                                        Click to upload or drag & drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PDF only, max 10 MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Input
                                                ref={fileInputRef}
                                                type="file"
                                                onChange={handleFileUpload}
                                                accept=".pdf"
                                                className="hidden"
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-vendle-teal/10 border-2 border-vendle-teal/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-vendle-teal/20 flex items-center justify-center flex-shrink-0">
                                                    <FileText className="w-6 h-6 text-vendle-teal" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {uploadedFile.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadedFile(null)}
                                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors group/remove"
                                                >
                                                    <X className="w-5 h-5 text-muted-foreground group-hover/remove:text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit button with shimmer */}
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={submitBidDataMutation.isPending}
                                    className="w-full h-14 rounded-xl bg-gradient-to-r from-vendle-blue to-vendle-teal hover:shadow-2xl hover:shadow-vendle-blue/30 text-white font-bold text-lg transition-all group relative overflow-hidden"
                                >
                                    <span className="relative z-10">
                                        {submitBidDataMutation.isPending ? 'Submitting...' : 'Submit Bid'}
                                    </span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />

                                    {/* Shimmer effect */}
                                    {!submitBidDataMutation.isPending && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    )}
                                </Button>
                            </form>
                        </div>
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

                        {/* Enhanced Bidders Section */}
                        <div className="space-y-6">
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Users className="w-6 h-6 text-vendle-blue" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">
                                            Current Bidders
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {bids?.length || 0} contractors competing for your project
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Sort dropdown */}
                                    <Select defaultValue="lowest_bid">
                                        <SelectTrigger className="w-[220px] h-11 border-2 border-vendle-gray/30 hover:border-vendle-blue/50 bg-white shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <SortDesc className="w-4 h-4 text-vendle-blue" />
                                                <SelectValue placeholder="Sort by..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lowest_bid">
                                                <div className="flex items-center gap-2">
                                                    <ArrowDown className="w-4 h-4 text-vendle-teal" />
                                                    <span>Lowest Bid First</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="highest_rating">
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span>Highest Rating</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* AI Recommendation button */}
                                    <Button
                                        onClick={() => askVendleAIMutation.mutate()}
                                        disabled={askVendleAIMutation.isPending}
                                        className="bg-gradient-to-r from-vendle-blue to-vendle-teal shadow-lg hover:shadow-xl"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        {askVendleAIMutation.isPending ? 'Analyzing...' : 'Ask Vendle AI'}
                                    </Button>
                                </div>
                            </div>

                            {/* Bid cards grid */}
                            {bidsLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="space-y-4 text-center">
                                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-vendle-blue" />
                                        <p className="text-lg text-foreground">Loading bids...</p>
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
                                    {bids?.map((bid, index) => (
                                        <motion.div
                                            key={bid.contractor_id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group relative"
                                        >
                                            {/* Ranking badge for top 3 */}
                                            {index < 3 && (
                                                <div className="absolute -top-3 -right-3 z-10">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-bold text-white text-sm",
                                                        index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                                                        index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                                        "bg-gradient-to-br from-orange-400 to-orange-600"
                                                    )}>
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                            )}

                                            <Card className="border-2 border-vendle-gray/30 hover:border-vendle-blue/50 hover:shadow-2xl transition-all overflow-hidden group-hover:-translate-y-1 duration-300 h-full">
                                                {/* Header with contractor info */}
                                                <div className="p-6 bg-gradient-to-br from-vendle-blue/5 to-vendle-teal/5 border-b-2 border-vendle-gray/20">
                                                    <div className="flex items-start gap-4">
                                                        {/* Avatar */}
                                                        <div className="relative flex-shrink-0">
                                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-vendle-blue to-vendle-teal flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                                                {(bid.company_name || bid.contractor_name).charAt(0)}
                                                            </div>
                                                            {/* Verified badge */}
                                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-vendle-teal border-2 border-white flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-bold text-foreground truncate mb-1">
                                                                {bid.company_name || "Independent Contractor"}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {bid.contractor_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="p-6 space-y-4">
                                                    {/* Contact info */}
                                                    <div className="space-y-3">
                                                        <a
                                                            href={`mailto:${bid.email}`}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/contact"
                                                        >
                                                            <div className="w-9 h-9 rounded-lg bg-vendle-blue/10 flex items-center justify-center flex-shrink-0">
                                                                <Mail className="w-4 h-4 text-vendle-blue" />
                                                            </div>
                                                            <span className="text-sm text-muted-foreground truncate group-hover/contact:text-vendle-blue">
                                                                {bid.email}
                                                            </span>
                                                        </a>

                                                        {bid.phone_number && (
                                                            <a
                                                                href={`tel:${bid.phone_number}`}
                                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/contact"
                                                            >
                                                                <div className="w-9 h-9 rounded-lg bg-vendle-teal/10 flex items-center justify-center flex-shrink-0">
                                                                    <Phone className="w-4 h-4 text-vendle-teal" />
                                                                </div>
                                                                <span className="text-sm text-muted-foreground group-hover/contact:text-vendle-teal">
                                                                    {bid.phone_number}
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Bid amount - hero section */}
                                                    <div className="p-5 rounded-xl bg-gradient-to-br from-vendle-blue/10 via-vendle-teal/5 to-transparent border-2 border-vendle-blue/20">
                                                        <div className="flex items-end justify-between mb-2">
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                                                    Bid Amount
                                                                </p>
                                                                <p className="text-3xl font-bold text-foreground">
                                                                    ${bid.bid_amount.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            {index === 0 && (
                                                                <Badge className="bg-vendle-teal text-white">
                                                                    Lowest Bid
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-2 border-vendle-gray/30 hover:border-vendle-blue hover:bg-vendle-blue/5 font-medium"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Details
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl font-bold"
                                                        >
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Accept
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Enhanced AI Recommendation Dialog */}
                <Dialog open={openAiDialog} onOpenChange={setOpenAiDialog}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden p-0 gap-0 border-2 border-vendle-blue/20 shadow-2xl">
                        {/* Header with gradient */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-vendle-blue to-vendle-teal p-6 text-white">
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                            }} />

                            <div className="relative flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Sparkles className="w-7 h-7 text-white animate-pulse" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-white mb-1">
                                        Vendle AI Recommendation
                                    </DialogTitle>
                                    <p className="text-white/90 text-sm">
                                        Analyzing bids to find the best match for your project
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {!aiRecommendation ? (
                                /* Loading state */
                                <div className="flex flex-col items-center justify-center py-12">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 rounded-full border-4 border-vendle-gray/20 border-t-vendle-blue mb-6"
                                    />

                                    <div className="space-y-3 text-center">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Analyzing contractor bids...
                                        </h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <p className="flex items-center justify-center gap-2">
                                                <Check className="w-4 h-4 text-vendle-teal" />
                                                Comparing pricing structures
                                            </p>
                                            <p className="flex items-center justify-center gap-2">
                                                <Check className="w-4 h-4 text-vendle-teal" />
                                                Evaluating contractor experience
                                            </p>
                                            <p className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-vendle-blue" />
                                                Generating personalized recommendation
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Recommendation content */
                                <div className="space-y-6">
                                    <div className="prose prose-sm max-w-none">
                                        <div className="text-foreground leading-relaxed p-6 rounded-xl bg-muted/30 border border-vendle-gray/30">
                                            {aiRecommendation}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-vendle-gray/20 bg-muted/20 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                AI recommendation based on {bids?.length || 0} bids
                            </p>
                            <Button
                                onClick={() => setOpenAiDialog(false)}
                                variant="outline"
                                className="border-2 border-vendle-gray/30 hover:border-vendle-blue hover:bg-vendle-blue/5"
                            >
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}