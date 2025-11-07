"use client"
import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, DollarSign, Clock, Star, Mail, Phone, MapPin, Building, FileText, Upload, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiService } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/auth/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Auction {
    id: string;
    title: string;
    description: string;
    startingBid: number;
    currentBid: number;
    bid_count: number;
    auctionEndDate: string;
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
    allowance: 0
};

export default function AuctionDetailsPage() {
    const params = useParams();
    const auction_id = params.auction_id as string;
    const router = useRouter();
    const apiService = useApiService();
    const queryClient = useQueryClient();
    const supabase = createClient();
    const [bidData, setBidData] = useState(initialBidDefaults);
    const [uploadedFile, setUploadedFile] = useState<File | null>();
    const [aiRecommendation, setAiRecommendation] = useState<string>('');
    const [openAiDialog, setOpenAiDialog] = useState(false);
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCloseDialog = () => {
        setAiRecommendation('');
        setOpenAiDialog(false);
    }

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const isContractor = user?.user_type === "contractor";

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            if (file?.type !== "application/pdf") {
                toast("Invalid file type", {
                    description: "Only PDF files can be uploaded",
                });
                return;
            }

            if (file.size > 10*1024*1024) {
                toast("Maximum File Size Exceeded", {
                    description: "Please upload a smaller file",
                });
                return;
            }

            setUploadedFile(event.target.files[0]);
        }
    }

    const handleBidDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBidData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const fetchAuction = async (auctionId: string) => {
        try {
            const response: any = await apiService.get(`/api/auctions/${auctionId}`);
            return response?.auction as unknown as Auction;
        } catch (error) {
            console.log(error);
        }
    }

    const fetchBids = async (auctionId: string) => {
        try {
            const response: any = await apiService.get(`/api/bids/${auctionId}`);
            return response?.expandedBidInfo as unknown as Bid[] || [];
        } catch (error) {
            console.log(error);
        }
    }

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
                project_description: auction?.aiSummary || auction?.description,
                location: "Miami, Florida",
            }

            const analysisRequest = {
                project_details,
                contractor_bids: bids,
            }

            setOpenAiDialog(true);

            const response: any = await fetch('http://localhost:8001/api/analyze_contractors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(analysisRequest)
            });

            const data = await response.json();
            setAiRecommendation(data?.recommendation);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    const askVendleAIMutation = useMutation({
        mutationFn: handleAskVendleAI,
        onSuccess: () => {
            console.log("Successfully asked ai");
        },
        onError: () => {
            console.log("error asking ai");
        }
    });

    const handleSubmitBid = async (auctionId: string) => {
        try {
            if (!auctionId) return;
            if (!uploadedFile) {
                console.log('please upload a file');
                return;
            }

            const timestamp = Date.now();
            const { data, error } = await supabase.storage.from("vendle-estimates").upload(`public/bid_${uploadedFile.name}_${timestamp}`, uploadedFile);

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
    }

    const submitBidDataMutation = useMutation({
        mutationFn: handleSubmitBid,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getBids"]
            });
            setBidData(initialBidDefaults);
            toast("Successfully submitted bid", {
                description: "Your bid has been sent to the homeowner. You shall be contacted if your bid is accepted"
            });
        },
        onError: () => {
            console.log("error");
        }
    });

    const onSubmit = (event: any) => {
        event.preventDefault();
        submitBidDataMutation.mutate(auction_id);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-[hsl(217,64%,23%)] mx-auto" />
                    <p className="text-lg text-gray-900">Loading auction details...</p>
                </div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-4 p-8 bg-white rounded-lg border border-gray-200">
                    <p className="text-xl text-gray-900">Auction not found.</p>
                    <Button className="mt-4 bg-[hsl(217,64%,23%)] hover:bg-[hsl(217,64%,18%)] text-white" onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        className="mb-6 hover:bg-gray-100 text-gray-900"
                        onClick={() => router.back()}
                    >
                        &larr; Back to Auctions
                    </Button>
                </div>

                {isContractor ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="border border-gray-200 bg-white h-full">
                                <CardHeader className="pb-4 border-b border-gray-200">
                                    <div className="space-y-4">
                                        <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">
                                            {auction?.title}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-3">
                                            <Badge className="bg-white border border-gray-300 text-gray-900 px-3 py-1 text-sm font-medium">
                                                <Users className="w-4 h-4 mr-1" />
                                                {auction?.bid_count} Bids
                                            </Badge>
                                            <Badge className="bg-white border border-gray-300 text-gray-900 px-3 py-1 text-sm font-medium">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                ${auction?.currentBid}
                                            </Badge>
                                            <Badge className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 text-sm font-medium">
                                                {auction?.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    <div className="prose max-w-none">
                                        <p className="text-gray-900 text-lg leading-relaxed">{auction?.aiSummary || auction?.description}</p>
                                    </div>

                                    <div className="flex items-center gap-x-2">
                                        <div className="w-full">
                                            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                                Auction Details
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
                                                    <DollarSign className="w-5 h-5 mr-3 text-[hsl(217,64%,23%)]" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Starting Bid</span>
                                                        <div className="font-semibold text-lg text-gray-900">${auction?.startingBid}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
                                                    <Clock className="w-5 h-5 mr-3 text-red-600" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Auction Ends</span>
                                                        <div className="font-semibold text-gray-900">{new Date(auction?.auctionEndDate).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card className="border border-gray-200 bg-white h-full">
                                <CardHeader className="pb-4 bg-[hsl(217,64%,23%)] text-white rounded-t-lg">
                                    <CardTitle className="text-xl flex items-center">
                                        <DollarSign className="w-6 h-6 mr-2" />
                                        Submit Your Bid
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form className="space-y-4" onSubmit={onSubmit}>
                                        <div className="space-y-2">
                                            <Label htmlFor="amount" className="text-sm font-medium text-gray-900">
                                                Bid Amount *
                                            </Label>
                                            <Input
                                                id="amount"
                                                name="amount"
                                                placeholder="Enter your bid"
                                                className="h-12 text-lg font-semibold border-gray-300 focus:border-[hsl(217,64%,23%)] focus:ring-[hsl(217,64%,23%)]"
                                                value={bidData.amount}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="budgetTotal" className="text-xs font-medium text-gray-700">
                                                    Materials
                                                </Label>
                                                <Input
                                                    id="budgetTotal"
                                                    name="budgetTotal"
                                                    className="h-10 text-sm border-gray-300 focus:border-[hsl(217,64%,23%)] focus:ring-[hsl(217,64%,23%)]"
                                                    value={bidData.budgetTotal}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="laborCosts" className="text-xs font-medium text-gray-700">
                                                    Labor Costs
                                                </Label>
                                                <Input
                                                    id="laborCosts"
                                                    name="laborCosts"
                                                    className="h-10 text-sm border-gray-300 focus:border-[hsl(217,64%,23%)] focus:ring-[hsl(217,64%,23%)]"
                                                    value={bidData.laborCosts}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="subContractorExpenses" className="text-xs font-medium text-gray-700">
                                                    Subcontractor Expenses
                                                </Label>
                                                <Input
                                                    id="subContractorExpenses"
                                                    name="subContractorExpenses"
                                                    className="h-10 text-sm border-gray-300 focus:border-[hsl(217,64%,23%)] focus:ring-[hsl(217,64%,23%)]"
                                                    value={bidData.subContractorExpenses}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="overhead" className="text-xs font-medium text-gray-700">
                                                    Overhead
                                                </Label>
                                                <Input
                                                    id="overhead"
                                                    name="overhead"
                                                    className="h-10 text-sm border-gray-300 focus:border-[hsl(217,64%,23%)] focus:ring-[hsl(217,64%,23%)]"
                                                    value={bidData.overhead}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="allowance" className="text-xs font-medium text-gray-700">
                                                    Allowance
                                                </Label>
                                                <Input
                                                    id="allowance"
                                                    name="allowance"
                                                    className="h-10 text-sm border-gray-300 focus:border-[hsl(217,64%,23%)] focus:ring-[hsl(217,64%,23%)]"
                                                    value={bidData.allowance}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="profit" className="text-xs font-medium text-gray-700">
                                                    Profit
                                                </Label>
                                                <Input
                                                    id="profit"
                                                    name="profit"
                                                    className="h-10 text-sm border-gray-300 focus:border-[hsl(217,64%,23%)] focus:ring-[hsl(217,64%,23%)]"
                                                    value={bidData.profit}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                        </div>
                                        {!uploadedFile ? (
                                            <div className="w-full h-[60px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg px-8 py-4 flex items-center justify-center hover:border-[hsl(217,64%,23%)] transition-colors">
                                                <div className="h-full flex flex-col items-center gap-y-8">
                                                    <span className="text-[hsl(217,64%,23%)] text-sm text-center flex items-center gap-x-2 justify-center cursor-pointer hover:text-[hsl(217,64%,18%)]" onClick={handleClick}>
                                                        <Upload className="h-4 w-4" />Click here to upload a file.
                                                    </span>
                                                    <Input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={handleFileUpload}
                                                        className="w-full opacity-0 cursor-pointer h-full"
                                                        hidden
                                                    />
                                                </div>
                                            </div>
                                        ): (
                                            <div className="w-full h-[60px] bg-gray-50 border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                                                <div className="text-[hsl(217,64%,23%)] text-sm text-center flex items-center gap-x-2 justify-center">
                                                    <FileText className="h-4 w-4" />
                                                    <p className="text-[hsl(217,64%,23%)] text-sm text-center">{uploadedFile?.name}</p>
                                                    <X className="h-4 w-4 cursor-pointer hover:text-[hsl(217,64%,18%)]" onClick={() => setUploadedFile(null)} />
                                                </div>
                                            </div>
                                        )}
                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg font-semibold bg-[hsl(217,64%,23%)] hover:bg-[hsl(217,64%,18%)] text-white"
                                        >
                                            Submit Bid
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <Card className="border border-gray-200 bg-white">
                            <CardHeader className="pb-6 border-b border-gray-200">
                                <div className="space-y-4">
                                    <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">
                                        {auction?.title}
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-3">
                                        <Button onClick={() => askVendleAIMutation.mutate()} className="bg-[hsl(217,64%,23%)] hover:bg-[hsl(217,64%,18%)] text-white">
                                            Ask Vendle!
                                        </Button>
                                        <Badge className="bg-white border border-gray-300 text-gray-900 px-3 py-1 text-sm font-medium">
                                            <Users className="w-4 h-4 mr-1" />
                                            {auction?.bid_count} Bids
                                        </Badge>
                                        <Badge className="bg-white border border-gray-300 text-gray-900 px-3 py-1 text-sm font-medium">
                                            <DollarSign className="w-4 h-4 mr-1" />
                                            ${auction?.currentBid}
                                        </Badge>
                                        <Badge className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 text-sm font-medium">
                                            {auction?.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                            Project Description
                                        </h3>
                                        <div className="flex flex-col items-start justify-center bg-gray-50 border border-gray-200 rounded-lg p-4 gap-y-3">
                                            <div className="space-y-1">
                                                <span className="font-semibold text-sm text-gray-600">Project Description</span>
                                                <p className="text-gray-900">{auction?.aiSummary || auction?.description || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="font-semibold text-sm text-gray-600">Project Type</span>
                                                <p className="text-gray-900">{auction?.reconstructionType || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            Auction Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
                                                <DollarSign className="w-6 h-6 mr-4 text-[hsl(217,64%,23%)]" />
                                                <div>
                                                    <span className="text-sm text-gray-600 font-medium">Starting Bid</span>
                                                    <div className="font-bold text-xl text-gray-900">${auction?.startingBid}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
                                                <Clock className="w-6 h-6 mr-4 text-red-600" />
                                                <div>
                                                    <span className="text-sm text-gray-600 font-medium">Auction Ends</span>
                                                    <div className="font-bold text-lg text-gray-900">{new Date(auction?.auctionEndDate).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 bg-white">
                            <CardHeader className="border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                                        <Users className="w-7 h-7 mr-3" />
                                        Current Bidders
                                        {bids?.length ? (
                                            <span className="ml-3 text-lg text-gray-500">({bids.length})</span>
                                        ) : null}
                                    </CardTitle>
                                    <div className="flex gap-3">
                                        <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[hsl(217,64%,23%)] focus:border-transparent text-gray-900">
                                            <option value="lowest_bid">Sort by Lowest Bid</option>
                                            <option value="highest_rating">Sort by Highest Rating</option>
                                            <option value="most_reviews">Sort by Most Reviews</option>
                                            <option value="company_name">Sort by Company Name</option>
                                        </select>
                                        <Button
                                            variant="outline"
                                            className="border-gray-300 hover:bg-gray-50 text-gray-900"
                                        >
                                            Add Test Bids
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {bidsLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="text-center space-y-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-[hsl(217,64%,23%)] mx-auto" />
                                            <p className="text-gray-900">Loading bids...</p>
                                        </div>
                                    </div>
                                ) : bids?.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-xl text-gray-900 mb-2">No bids yet</p>
                                        <p className="text-gray-600">Waiting for contractors to submit competitive bids!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {bids?.map((bid) => (
                                            <Card key={bid.contractor_id} className="border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="space-y-5">
                                                        <div className="flex items-start gap-4">
                                                            <div className="h-14 w-14 rounded-lg bg-[hsl(217,64%,23%)] flex items-center justify-center">
                                                                <span className="text-xl font-bold text-white">
                                                                    {(bid?.company_name || bid?.contractor_name)?.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-bold text-lg text-gray-900 truncate">
                                                                    {bid?.company_name || 'Independent Contractor'}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 truncate">{bid?.contractor_name}</p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                                <Mail className="h-4 w-4 text-[hsl(217,64%,23%)]" />
                                                                <span className="truncate">{bid?.email}</span>
                                                            </div>
                                                            {bid?.phone_number && (
                                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                                    <Phone className="h-4 w-4 text-[hsl(217,64%,23%)]" />
                                                                    <span>{bid?.phone_number}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="pt-4 border-t border-gray-200">
                                                            <div className="flex justify-between items-end">
                                                                <div>
                                                                    <p className="text-sm text-gray-600 mb-1">Bid Amount</p>
                                                                    <p className="text-3xl font-bold text-gray-900">
                                                                        ${bid?.bid_amount?.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 mt-4">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-900"
                                                                >
                                                                    View Profile
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                                >
                                                                    Accept Bid
                                                                </Button>
                                                            </div>
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
            </div>
            <Dialog open={openAiDialog} onOpenChange={setOpenAiDialog}>
                <DialogContent className="flex flex-col gap-x-4 items-center bg-white border border-gray-200">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">
                            AI Suggestion
                        </DialogTitle>
                    </DialogHeader>
                    {!aiRecommendation ? (
                        <div className="flex flex-col items-center gap-y-4 justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-[hsl(217,64%,23%)] mx-auto" />
                            <p className="text-lg text-gray-900">Loading AI recommendation...</p>
                        </div>
                    ) : (
                        <div className="text-gray-900">{aiRecommendation}</div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog} className="border-gray-300 hover:bg-gray-50 text-gray-900">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}