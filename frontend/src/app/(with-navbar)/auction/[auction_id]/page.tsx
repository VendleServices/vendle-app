"use client"
import React, { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Auction {
    id: string;
    title: string;
    description: string;
    starting_bid: number;
    current_bid: number;
    bid_count: number;
    end_date: string;
    status: string;
    property_address?: string;
    project_type?: string;
    design_plan?: string;
}

interface Bid {
    id: string;
    amount: number;
    contractor_name?: string;
    createdAt: string;
    bidder_rating?: number;
    bidder_reviews?: number;
    bidder_company?: string;
    bidder_email?: string;
    bidder_phone?: string;
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
    const { toast } = useToast();
    const { user } = useAuth();

    const isContractor = user?.user_type === "contractor";

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            if (file?.type !== "application/pdf") {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a pdf",
                    variant: "destructive",
                });
                return;
            }

            if (file.size > 10*1024*1024) {
                toast({
                    title: "Maximum File Size Exceeded",
                    description: "Please upload a smaller file",
                    variant: "destructive",
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
            return response?.bids as unknown as Bid[];
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

    const handleSubmitBid = async (auctionId: string) => {
        try {
            if (!auctionId) return;
            if (!uploadedFile) {
                console.log('please upload a file');
                return;
            }

            const timestamp = Date.now();
            const { data, error } = await supabase.storage.from("vendle-estimates").upload(`public/bids/bid_${uploadedFile.name}_${timestamp}`, uploadedFile);

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
        },
        onError: () => {
            console.log("error");
        }
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-vendle-blue mx-auto" />
                    <p className="text-lg text-gray-600">Loading auction details...</p>
                </div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg">
                    <p className="text-xl text-gray-600">Auction not found.</p>
                    <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        className="mb-6 hover:bg-blue-100 transition-colors"
                        onClick={() => router.back()}
                    >
                        &larr; Back to Auctions
                    </Button>
                </div>

                {/* Main Content - Conditional Layout */}
                {isContractor ? (
                    // Contractor View: Auction Details + Submit Bid
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="shadow-xl border-0 bg-white h-full">
                                <CardHeader className="pb-4">
                                    <div className="space-y-4">
                                        <CardTitle className="text-3xl font-bold text-vendle-navy leading-tight">
                                            {auction?.title}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-3">
                                            <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium">
                                                <Users className="w-4 h-4 mr-1" />
                                                {auction?.bid_count} Bids
                                            </Badge>
                                            <Badge className="bg-vendle-navy text-white px-3 py-1 text-sm font-medium">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                ${auction?.current_bid?.toLocaleString()}
                                            </Badge>
                                            <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
                                                {auction?.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 text-lg leading-relaxed">{auction?.description}</p>
                                    </div>

                                    <div className="flex items-center gap-x-2">
                                        <div className="w-full">
                                            <h3 className="text-lg font-semibold text-vendle-navy border-b border-gray-200 pb-2">
                                                Auction Details
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                                                    <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Starting Bid</span>
                                                        <div className="font-semibold text-lg">${auction?.starting_bid?.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                                                    <Clock className="w-5 h-5 mr-3 text-red-600" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Auction Ends</span>
                                                        <div className="font-semibold">{new Date(auction?.end_date).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Bid Submission Form */}
                        <div>
                            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 h-full">
                                <CardHeader className="pb-4 bg-gradient-to-r from-vendle-navy to-blue-600 text-white rounded-t-lg">
                                    <CardTitle className="text-xl flex items-center">
                                        <DollarSign className="w-6 h-6 mr-2" />
                                        Submit Your Bid
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                                                Bid Amount *
                                            </Label>
                                            <Input
                                                id="amount"
                                                name="amount"
                                                placeholder="Enter your bid"
                                                className="h-12 text-lg font-semibold border-2 border-blue-200 focus:border-vendle-navy"
                                                value={bidData.amount}
                                                onChange={handleBidDataChange}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="budgetTotal" className="text-xs font-medium text-gray-600">
                                                    Materials
                                                </Label>
                                                <Input
                                                    id="budgetTotal"
                                                    name="budgetTotal"
                                                    className="h-10 text-sm"
                                                    value={bidData.budgetTotal}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="laborCosts" className="text-xs font-medium text-gray-600">
                                                    Labor Costs
                                                </Label>
                                                <Input
                                                    id="laborCosts"
                                                    name="laborCosts"
                                                    className="h-10 text-sm"
                                                    value={bidData.laborCosts}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="subContractorExpenses" className="text-xs font-medium text-gray-600">
                                                    Subcontractor Expenses
                                                </Label>
                                                <Input
                                                    id="subContractorExpenses"
                                                    name="subContractorExpenses"
                                                    className="h-10 text-sm"
                                                    value={bidData.subContractorExpenses}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="overhead" className="text-xs font-medium text-gray-600">
                                                    Overhead
                                                </Label>
                                                <Input
                                                    id="overhead"
                                                    name="overhead"
                                                    className="h-10 text-sm"
                                                    value={bidData.overhead}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="allowance" className="text-xs font-medium text-gray-600">
                                                    Allowance
                                                </Label>
                                                <Input
                                                    id="allowance"
                                                    name="allowance"
                                                    className="h-10 text-sm"
                                                    value={bidData.allowance}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="profit" className="text-xs font-medium text-gray-600">
                                                    Profit
                                                </Label>
                                                <Input
                                                    id="profit"
                                                    name="profit"
                                                    className="h-10 text-sm"
                                                    value={bidData.profit}
                                                    onChange={handleBidDataChange}
                                                />
                                            </div>
                                        </div>
                                        {!uploadedFile ? (
                                            <div className="w-full h-[60px] bg-gray-100 rounded-lg px-8 py-4 flex items-center justify-center">
                                                <div className="h-full flex flex-col items-center gap-y-8">
                                                    <span className="text-vendle-navy text-sm text-center flex items-center gap-x-2 justify-center cursor-pointer hover:text-blue-500"><Upload className="h-4 w-4" />Click here to upload a file.</span>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={handleFileUpload}
                                                        className="w-full opacity-0 cursor-pointer h-full"
                                                        hidden
                                                    />
                                                </div>
                                            </div>
                                        ): (
                                            <div className="w-full h-[60px] bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
                                                <div className="text-vendle-navy text-sm text-center flex items-center gap-x-2 justify-center">
                                                    <FileText className="h-4 w-4" />
                                                    <p className="text-vendle-navy text-sm text-center">{uploadedFile?.name}</p>
                                                    <X className="h-4 w-4" onClick={() => setUploadedFile(null)} />
                                                </div>
                                            </div>
                                        )}
                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg font-semibold bg-vendle-navy hover:bg-vendle-navy/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            onClick={() => submitBidDataMutation.mutate(auction_id)}
                                        >
                                            Submit Bid
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    // Homeowner/Other View: Auction Details (full width) + Current Bids
                    <div className="space-y-8">
                        {/* Full Width Auction Details */}
                        <Card className="shadow-xl border-0 bg-white">
                            <CardHeader className="pb-6 bg-gradient-to-r from-vendle-navy to-blue-600 text-white rounded-t-lg">
                                <div className="space-y-4">
                                    <CardTitle className="text-3xl font-bold leading-tight">
                                        {auction?.title}
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-3">
                                        <Badge className="bg-white/20 text-white px-3 py-1 text-sm font-medium">
                                            <Users className="w-4 h-4 mr-1" />
                                            {auction?.bid_count} Bids
                                        </Badge>
                                        <Badge className="bg-white text-vendle-navy px-3 py-1 text-sm font-medium">
                                            <DollarSign className="w-4 h-4 mr-1" />
                                            ${auction?.current_bid?.toLocaleString()}
                                        </Badge>
                                        <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-medium">
                                            {auction?.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-vendle-navy border-b border-gray-200 pb-2 mb-4">
                                                Project Description
                                            </h3>
                                            <div className="prose max-w-none">
                                                <p className="text-gray-700 text-lg leading-relaxed">{auction?.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-vendle-navy border-b border-gray-200 pb-2">
                                            Auction Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                                <DollarSign className="w-6 h-6 mr-4 text-green-600" />
                                                <div>
                                                    <span className="text-sm text-green-700 font-medium">Starting Bid</span>
                                                    <div className="font-bold text-xl text-green-800">${auction?.starting_bid?.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                                                <Clock className="w-6 h-6 mr-4 text-red-600" />
                                                <div>
                                                    <span className="text-sm text-red-700 font-medium">Auction Ends</span>
                                                    <div className="font-bold text-lg text-red-800">{new Date(auction?.end_date).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Bidders Section */}
                        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl text-vendle-navy flex items-center">
                                        <Users className="w-7 h-7 mr-3" />
                                        Current Bidders
                                        {bids?.length ? (
                                            <span className="ml-3 text-lg text-gray-500">({bids.length})</span>
                                        ) : null}
                                    </CardTitle>
                                    <div className="flex gap-3">
                                        <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option value="lowest_bid">Sort by Lowest Bid</option>
                                            <option value="highest_rating">Sort by Highest Rating</option>
                                            <option value="most_reviews">Sort by Most Reviews</option>
                                            <option value="company_name">Sort by Company Name</option>
                                        </select>
                                        <Button
                                            variant="outline"
                                            className="shadow-sm hover:shadow-md transition-all duration-200 border-gray-200 hover:border-blue-300"
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
                                            <Loader2 className="h-8 w-8 animate-spin text-vendle-blue mx-auto" />
                                            <p className="text-gray-600">Loading bids...</p>
                                        </div>
                                    </div>
                                ) : bids?.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-xl text-gray-500 mb-2">No bids yet</p>
                                        <p className="text-gray-400">Waiting for contractors to submit competitive bids!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {bids?.map((bid) => (
                                            <Card key={bid.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white shadow-lg hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
                                                <CardContent className="p-6">
                                                    <div className="space-y-5">
                                                        {/* Company Header */}
                                                        <div className="flex items-start gap-4">
                                                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-vendle-navy to-blue-600 flex items-center justify-center shadow-lg">
                                                                <span className="text-xl font-bold text-white">
                                                                    {bid?.bidder_company?.[0] || bid?.contractor_name?.[0]}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-bold text-lg text-gray-900 truncate">
                                                                    {bid?.bidder_company || 'Independent Contractor'}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 truncate">{bid?.contractor_name}</p>
                                                            </div>
                                                        </div>

                                                        {/* Rating */}
                                                        {bid?.bidder_rating && (
                                                            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                                                                <div className="flex items-center">
                                                                    {[...Array(5)]?.map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${
                                                                                i < (bid?.bidder_rating || 0)
                                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                                    : 'text-gray-300'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="font-semibold text-yellow-700">
                                                                    {bid?.bidder_rating?.toFixed(1)}
                                                                </span>
                                                                <span className="text-sm text-yellow-600">
                                                                    ({bid?.bidder_reviews} reviews)
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Contact Info */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                                                                <Mail className="h-4 w-4 text-blue-500" />
                                                                <span className="truncate">{bid?.bidder_email}</span>
                                                            </div>
                                                            {bid?.bidder_phone && (
                                                                <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                                                                    <Phone className="h-4 w-4 text-green-500" />
                                                                    <span>{bid?.bidder_phone}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Bid Amount & Actions */}
                                                        <div className="pt-4 border-t border-gray-100">
                                                            <div className="flex justify-between items-end">
                                                                <div>
                                                                    <p className="text-sm text-gray-500 mb-1">Bid Amount</p>
                                                                    <p className="text-3xl font-bold text-vendle-navy">
                                                                        ${bid?.amount?.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 mt-4">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex-1 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    View Profile
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1 bg-green-600 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
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
        </div>
    );
}