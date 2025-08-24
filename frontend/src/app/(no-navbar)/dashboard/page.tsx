"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, FileText, Clock, LayoutIcon, Trash2, DollarSign, Users, Folder, CheckCircle, Archive, Plus, Upload, Download, BarChart, HelpCircle, MessageCircle, Bell, Settings, Flag, LogOut, Star, Trophy, AlertCircle, Menu, ChevronLeft, Wrench } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Inter } from "next/font/google";
import { useApiService } from "@/services/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const inter = Inter({ subsets: ["latin"] });

interface Claim {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    projectType: string;
    designPlan: string;
    insuranceEstimateFilePath: string;
    needsAdjuster: boolean;
    insuranceProvider: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Auction {
    auction_id: string;
    claim_id: string;
    status: string;
    starting_bid: number;
    current_bid: number;
    bid_count: number;
    end_date: string;
    property_address: string;
    project_type: string;
    design_plan: string;
    title: string;
    winning_bidder?: string;
    total_job_value?: number;
    overhead_and_profit?: number;
    cost_basis?: string;
    materials?: number;
    sales_taxes?: number;
    depreciation?: number;
    reconstruction_type?: string;
    needs_3rd_party_adjuster?: boolean;
    has_deductible_funds?: boolean;
    funding_source?: string;
    description?: string;
}

interface UserProfile {
    user_id: number;
    email: string;
    user_type: string;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    username?: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    reviewer_name: string;
    reviewer_role: string;
    date: string;
    project_type: string;
    project_address: string;
}

export default function DashboardPage() {
    const apiService = useApiService();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
    const { toast } = useToast();

    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [auctionLoading, setAuctionLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'auctions' | 'claims' | 'reviews' | 'closed-auctions'>('claims');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [auctionToDelete, setAuctionToDelete] = useState<Auction | null>(null);
    const [showAuctionDeleteConfirmation, setShowAuctionDeleteConfirmation] = useState(false);
    const [closedAuctions, setClosedAuctions] = useState<Auction[]>([]);
    const [closedAuctionLoading, setClosedAuctionLoading] = useState(false);
    const [showClosedAuctionDeleteConfirmation, setShowClosedAuctionDeleteConfirmation] = useState(false);
    const [closedAuctionToDelete, setClosedAuctionToDelete] = useState<Auction | null>(null);

    const fetchClaims = async () => {
        try {
            const response: any = await apiService.get(`/api/claim`);
            return response?.claims;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const deleteClaim = async (claim: Claim) => {
        try {
            const response = await apiService.delete(`/api/claim/${claim.id}`);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    const fetchAuctions = async () => {
        setAuctionLoading(true);
        try {
            const response:any = await apiService.get(`/api/auctions`);
            const data = response?.data;
            console.log('Fetched auctions:', data);
            
            const activeAuctions = data?.filter((auction: Auction) => {
                const endDate = new Date(auction.end_date);
                return auction.status === 'open' && endDate > new Date();
            });
            
            const closedAuctions = data?.filter((auction: Auction) => {
                const endDate = new Date(auction.end_date);
                return auction.status === 'closed' || endDate <= new Date();
            });
            
            setAuctions(activeAuctions);
            setClosedAuctions(closedAuctions);
        } catch (error) {
            console.error('Error fetching auctions:', error);
            toast({
                title: "Error",
                description: "Failed to load auctions. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setAuctionLoading(false);
            setClosedAuctionLoading(false);
        }
    }

    const { data: claims = [], isLoading, isError, error } = useQuery({
        queryKey: ["getClaims"],
        queryFn: fetchClaims,
        enabled: !!user?.id,
        retry: 1,
    });

    console.log('Claims query state:', { claims, isLoading, isError, error, userId: user?.id });

    const deleteClaimMutation = useMutation({
        mutationFn: deleteClaim,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getClaims"]
            });
        },
        onError: error => { console.log(error); }
    });

    // Hardcoded reviews data
    const reviews: Review[] = [
        {
            id: "1",
            rating: 5,
            comment: "Excellent work on the water damage restoration. The team was professional, thorough, and completed the job ahead of schedule. Would highly recommend!",
            reviewer_name: "Sarah Johnson",
            reviewer_role: "Homeowner",
            date: "2024-03-15",
            project_type: "Water Damage Restoration",
            project_address: "123 Oak Street, Portland, OR"
        },
        {
            id: "2",
            rating: 4,
            comment: "Good work on the fire damage cleanup. The team was responsive and professional. The only reason for 4 stars instead of 5 is that the timeline was slightly longer than initially estimated.",
            reviewer_name: "Michael Chen",
            reviewer_role: "Property Manager",
            date: "2024-03-10",
            project_type: "Fire Damage Restoration",
            project_address: "456 Pine Avenue, Seattle, WA"
        },
        {
            id: "3",
            rating: 5,
            comment: "Outstanding service! The team handled our mold remediation project with expertise and care. They were very thorough in explaining the process and kept us updated throughout.",
            reviewer_name: "Emily Rodriguez",
            reviewer_role: "Homeowner",
            date: "2024-03-05",
            project_type: "Mold Remediation",
            project_address: "789 Maple Drive, San Francisco, CA"
        },
        {
            id: "4",
            rating: 5,
            comment: "The team did an amazing job with our storm damage repairs. They were quick to respond, professional, and completed the work to the highest standard. Very impressed!",
            reviewer_name: "David Thompson",
            reviewer_role: "Business Owner",
            date: "2024-02-28",
            project_type: "Storm Damage Repair",
            project_address: "321 Cedar Lane, Denver, CO"
        }
    ];

    const getTimeRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
        return 'Less than an hour remaining';
    };

    const getStatusColor = (status: Claim["id"]) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500";
            case "in-progress":
                return "bg-blue-500";
            case "completed":
                return "bg-green-500";
            case "cleanup-in-progress":
                return "bg-purple-500";
            default:
                return "bg-gray-500";
        }
    };

    const getNextStep = (status: Claim["id"]) => {
        switch (status) {
            case "pending":
                return "Create Restoration Job";
            case "in-progress":
                return "Upload Documents";
            case "cleanup-in-progress":
                return "Confirm Cleanup";
            case "completed":
                return "Review Estimate";
            default:
                return "View Details";
        }
    };

    const handleDeleteClick = (claim: Claim) => {
        deleteClaimMutation.mutate(claim);
    };

    const handleAuctionDeleteClick = (auction: Auction) => {
        setAuctionToDelete(auction);
        setShowAuctionDeleteConfirmation(true);
        setDeleteConfirmed(false);
    };

    const handleAuctionDeleteConfirm = async () => {
        if (!auctionToDelete || !deleteConfirmed) return;

        try {
            const response = await fetch(`/api/auctions/${auctionToDelete.auction_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete auction');
            }

            setAuctions(auctions?.filter(auction => auction.auction_id !== auctionToDelete.auction_id));
            
            toast({
                title: "Auction Deleted",
                description: "The auction has been successfully deleted.",
            });
        } catch (error) {
            console.error('Error deleting auction:', error);
            toast({
                title: "Error",
                description: "Failed to delete the auction. Please try again.",
                variant: "destructive"
            });
        } finally {
            setShowAuctionDeleteConfirmation(false);
            setAuctionToDelete(null);
            setDeleteConfirmed(false);
        }
    };

    const handleClosedAuctionDelete = (auction: Auction) => {
        setClosedAuctionToDelete(auction);
        setShowClosedAuctionDeleteConfirmation(true);
    };

    const handleClosedAuctionDeleteConfirm = async () => {
        if (!closedAuctionToDelete) return;

        try {
            const response = await fetch(`/api/auctions?id=${closedAuctionToDelete.auction_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete auction');
            }

            setClosedAuctions(closedAuctions?.filter(auction => auction.auction_id !== closedAuctionToDelete.auction_id));
            
            toast({
                title: "Auction Deleted",
                description: "The closed auction has been successfully deleted.",
            });
        } catch (error) {
            console.error('Error deleting closed auction:', error);
            toast({
                title: "Error",
                description: "Failed to delete the closed auction. Please try again.",
                variant: "destructive"
            });
        } finally {
            setShowClosedAuctionDeleteConfirmation(false);
            setClosedAuctionToDelete(null);
        }
    };

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['auctions', 'claims', 'reviews', 'closed-auctions'].includes(tab)) {
            setActiveSection(tab as 'auctions' | 'claims' | 'reviews' | 'closed-auctions');
        }
    }, [searchParams]);

    useEffect(() => {
        if (isLoggedIn && !authLoading && (activeSection === 'auctions' || activeSection === 'closed-auctions')) {
            fetchAuctions();
        }
    }, [isLoggedIn, authLoading, activeSection]);

    useEffect(() => {
        const handleStorageChange = () => {
            if (activeSection === 'auctions' || activeSection === 'closed-auctions') {
                fetchAuctions();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
        };
    }, [activeSection]);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white ${inter.className}`}>
            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex">
                    {/* Sidebar */}
                    <div className={`${sidebarExpanded ? 'w-64' : 'w-16'} bg-[#0f172a] min-h-screen transition-all duration-300 ease-in-out flex flex-col`}>
                        <div className={`flex-1 ${sidebarExpanded ? 'p-4' : 'p-2'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="ghost"
                                    className={`${sidebarExpanded ? 'justify-start' : 'justify-center'} hover:bg-transparent hover:text-white transition-all duration-200 p-2 flex-shrink-0`}
                                    onClick={() => router.push("/home")}
                                >
                                    <div className={`${sidebarExpanded ? 'w-auto' : 'w-8'} flex justify-center`}>
                                        <Image
                                            src="/vendle_logo.jpg"
                                            alt="Logo"
                                            width={sidebarExpanded ? 120 : 32}
                                            height={sidebarExpanded ? 40 : 32}
                                            className={`${sidebarExpanded ? 'h-8 w-auto' : 'h-8 w-8 object-contain'}`}
                                            priority
                                        />
                                    </div>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-[#1e293b] hover:text-white flex-shrink-0"
                                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                                >
                                    {sidebarExpanded ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </Button>
                            </div>
                            
                            {/* Quick Stats */}
                            {sidebarExpanded && (
                                <div className="mb-4 p-3 bg-[#1e293b] rounded-lg">
                                    <h3 className="text-white text-xs font-medium mb-2">Quick Stats</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-white text-xs">
                                            <span>Active Claims</span>
                                            <span>{claims?.filter((c: Claim) => c.id === 'in-progress')?.length}</span>
                                        </div>
                                        <div className="flex justify-between text-white text-xs">
                                            <span>Active Auctions</span>
                                            <span>{auctions?.length}</span>
                                        </div>
                                        <div className="flex justify-between text-white text-xs">
                                            <span>Completed</span>
                                            <span>{claims?.filter((c: Claim)=> c.id === 'completed')?.length}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1 mb-8">
                                {/* Main Navigation */}
                                <Button
                                    variant="ghost"
                                    className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                                        activeSection === 'auctions' 
                                            ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                                            : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                                    }`}
                                    onClick={() => setActiveSection('auctions')}
                                >
                                    <Users className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                    {sidebarExpanded && "Active Auctions"}
                                </Button>

                                <Button
                                    variant="ghost"
                                    className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                                        activeSection === 'closed-auctions' 
                                            ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                                            : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                                    }`}
                                    onClick={() => setActiveSection('closed-auctions')}
                                >
                                    <Archive className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                    {sidebarExpanded && "Closed Auctions"}
                                </Button>

                                {(() => {
                                    console.log('User type check:', {
                                        user,
                                        userType: user?.user_type,
                                        isContractor: user?.user_type === "contractor"
                                    });
                                    return user?.user_type === "contractor" && (
                                        <Button
                                            variant="ghost"
                                            className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                                                activeSection === 'reviews' 
                                                    ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                                                    : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                                            }`}
                                            onClick={() => setActiveSection('reviews')}
                                        >
                                            <Star className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                            {sidebarExpanded && "My Reviews"}
                                        </Button>
                                    );
                                })()}

                                <Button
                                    variant="ghost"
                                    className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-9 text-xs ${
                                        activeSection === 'claims' 
                                            ? 'bg-[#1e293b] text-white hover:bg-[#1e293b]' 
                                            : 'text-gray-200 hover:bg-[#1e293b] hover:text-white'
                                    }`}
                                    onClick={() => setActiveSection('claims')}
                                >
                                    <FileText className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                    {sidebarExpanded && "Claims"}
                                </Button>

                                {/* Project Categories */}
                                <div className="pt-2">
                                    {sidebarExpanded && <h4 className="text-gray-400 text-xs font-semibold px-4 mb-1">PROJECT CATEGORIES</h4>}
                                    <Button
                                        variant="ghost"
                                        className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-8 text-xs text-gray-200 hover:bg-[#1e293b] hover:text-white`}
                                    >
                                        <Folder className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                        {sidebarExpanded && "Active Projects"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-8 text-xs text-gray-200 hover:bg-[#1e293b] hover:text-white`}
                                    >
                                        <CheckCircle className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                        {sidebarExpanded && "Completed Projects"}
                                    </Button>
                                </div>

                                {/* Quick Actions */}
                                <div className="pt-2">
                                    {sidebarExpanded && <h4 className="text-gray-400 text-xs font-semibold px-4 mb-1">QUICK ACTIONS</h4>}
                                    <Button
                                        variant="ghost"
                                        className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-8 text-xs text-gray-200 hover:bg-[#1e293b] hover:text-white`}
                                        onClick={() => router.push("/start-claim")}
                                    >
                                        <Plus className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                        {sidebarExpanded && "Create New Claim"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-8 text-xs text-gray-200 hover:bg-[#1e293b] hover:text-white`}
                                    >
                                        <BarChart className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                        {sidebarExpanded && "Project Statistics"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full ${sidebarExpanded ? 'justify-start' : 'justify-center'} h-8 text-xs text-gray-200 hover:bg-[#1e293b] hover:text-white`}
                                    >
                                        <Settings className={`w-3 h-3 ${sidebarExpanded ? 'mr-2' : ''}`} />
                                        {sidebarExpanded && "Settings"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 border-t border-[#1e293b] bg-[#0f172a]">
                            <div className={`flex items-center ${sidebarExpanded ? 'space-x-2' : 'justify-center'}`}>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.picture || ""} />
                                    <AvatarFallback>
                                        {(user?.name?.charAt(0) || "U").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {sidebarExpanded && (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-white truncate">
                                                {user?.name || user?.email || "User"}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-white hover:bg-[#1e293b] w-6 h-6"
                                            onClick={async () => {
                                                await logout();
                                            }}
                                        >
                                            <LogOut className="w-3 h-3" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-gray-50 border-l border-gray-200">
                        <div className="p-8">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h1 className="text-2xl font-semibold text-gray-900">
                                            {activeSection === 'auctions' ? 'Active Auctions' : activeSection === 'claims' ? 'My Claims' : activeSection === 'closed-auctions' ? 'Closed Auctions' : 'My Reviews'}
                                        </h1>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {activeSection === 'auctions' ? 'Browse and manage your active auctions' : activeSection === 'claims' ? 'View and manage your insurance claims' : activeSection === 'closed-auctions' ? 'View and manage your closed auctions' : 'View and manage your reviews'}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => router.push("/start-claim")}
                                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white h-9 px-4 text-sm font-medium rounded-lg shadow-sm"
                                    >
                                        Start New Claim
                                    </Button>
                                </div>

                                <Card className="shadow-sm border-gray-200 bg-white rounded-lg">
                                    <CardContent className="p-6">
                                        {activeSection === 'auctions' ? (
                                            <>
                                                {auctionLoading ? (
                                                    <div className="flex justify-center items-center h-64">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f172a]"></div>
                                                    </div>
                                                ) : auctions?.length === 0 ? (
                                                    <div className="text-center py-12">
                                                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Auctions</h3>
                                                        <p className="text-gray-500 mb-4">There are currently no active auctions to display.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid gap-4">
                                                        {auctions?.map((auction) => (
                                                            <Card key={auction.auction_id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white rounded-lg">
                                                                <CardContent className="p-6">
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div>
                                                                            <h3 className="text-lg font-semibold text-gray-900">{auction.title}</h3>
                                                                            <p className="text-sm text-gray-500 mt-1">{auction.property_address}</p>
                                                                        </div>
                                                                        <Badge variant={auction.status === 'open' ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
                                                                            {auction.status}
                                                                        </Badge>
                                                                    </div>

                                                                    {/* Teaser Information for Contractors */}
                                                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                                                        <h4 className="font-medium text-blue-900 mb-3">Job Details for Contractors</h4>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center text-sm">
                                                                                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                                                                                    <span className="text-blue-800">Total Job Value: <span className="font-semibold">${auction.total_job_value?.toFixed(2) || auction.starting_bid.toFixed(2)}</span></span>
                                                                                </div>
                                                                                <div className="flex items-center text-sm">
                                                                                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                                                                                    <span className="text-blue-800">O&P: <span className="font-semibold">${auction.overhead_and_profit?.toFixed(2) || 'N/A'}</span></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center text-sm">
                                                                                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                                                                    <span className="text-blue-800">Area: <span className="font-semibold">{auction.property_address || 'Address not specified'}</span></span>
                                                                                </div>
                                                                                <div className="flex items-center text-sm">
                                                                                    <Wrench className="w-4 h-4 mr-2 text-blue-600" />
                                                                                    <span className="text-blue-800">Type: <span className="font-semibold">{auction.reconstruction_type || auction.project_type || 'General Restoration'}</span></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Additional Information */}
                                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center text-sm">
                                                                                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                                                                <span className="text-gray-600">Current Bid: <span className="font-medium">${auction.current_bid.toFixed(2)}</span></span>
                                                                            </div>
                                                                            <div className="flex items-center text-sm">
                                                                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                                                                <span className="text-gray-600">{auction.bid_count} bids</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center text-sm">
                                                                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                                                                <span className="text-gray-600">Ends: {new Date(auction.end_date).toLocaleDateString()}</span>
                                                                            </div>
                                                                            {auction.cost_basis && (
                                                                                <div className="flex items-center text-sm">
                                                                                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                                                    <span className="text-gray-600">Basis: <span className="font-medium">{auction.cost_basis}</span></span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Description if available */}
                                                                    {auction.description && (
                                                                        <div className="mb-4">
                                                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                                                {auction.description}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <div className="flex justify-end space-x-3">
                                                                        <Button
                                                                            onClick={() => router.push(`/auction/${auction.auction_id}`)}
                                                                            className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b] transition-colors duration-200 rounded-lg"
                                                                        >
                                                                            View Details
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : activeSection === 'closed-auctions' ? (
                                            <>
                                                {closedAuctionLoading ? (
                                                    <div className="flex justify-center items-center h-64">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f172a]"></div>
                                                    </div>
                                                ) : closedAuctions?.length === 0 ? (
                                                    <div className="text-center py-12">
                                                        <Archive className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Closed Auctions</h3>
                                                        <p className="text-gray-500 mb-4">There are no closed auctions to display.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {closedAuctions?.map((auction) => (
                                                            <Card key={auction.auction_id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white rounded-lg">
                                                                <CardContent className="p-6">
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div>
                                                                            <h3 className="text-lg font-semibold text-gray-900">{auction.title}</h3>
                                                                            <p className="text-sm text-gray-500">{auction.project_type}</p>
                                                                        </div>
                                                                        <Badge variant="secondary">Closed</Badge>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center text-sm">
                                                                                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                                                                <span className="text-gray-600">Final Bid: <span className="font-medium">${auction.current_bid.toFixed(2)}</span></span>
                                                                            </div>
                                                                            <div className="flex items-center text-sm">
                                                                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                                                                <span className="text-gray-600">{auction.bid_count} total bids</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center text-sm">
                                                                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                                                                <span className="text-gray-600">Ended: {new Date(auction.end_date).toLocaleDateString()}</span>
                                                                            </div>
                                                                            {auction.bid_count > 0 ? (
                                                                                <div className="flex items-center text-sm">
                                                                                    <Trophy className="w-4 h-4 mr-2 text-gray-500" />
                                                                                    <span className="text-gray-600">Winning Bidder: {auction.winning_bidder || 'Processing...'}</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center text-sm text-red-600">
                                                                                    <AlertCircle className="w-4 h-4 mr-2" />
                                                                                    <span>No bids received</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex justify-end space-x-3">
                                                                        <Button
                                                                            onClick={() => router.push(`/auction/${auction.auction_id}`)}
                                                                            className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b] transition-colors duration-200 rounded-lg"
                                                                        >
                                                                            View Details
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => handleClosedAuctionDelete(auction)}
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-full"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : activeSection === 'claims' ? (
                                            <>
                                                {isLoading ? (
                                                    <div className="flex justify-center items-center h-64">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f172a]"></div>
                                                    </div>
                                                ) : claims?.length === 0 ? (
                                                    <div className="text-center py-12">
                                                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Found</h3>
                                                        <p className="text-gray-500 mb-4">You haven't filed any claims yet.</p>
                                                        <Button
                                                            onClick={() => router.push("/start-claim")}
                                                            className="bg-[#0f172a] hover:bg-[#1e293b] text-white"
                                                        >
                                                            Start New Claim
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="grid gap-4">
                                                        {claims?.map((claim: Claim) => (
                                                            <Card key={claim.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white rounded-lg">
                                                                <CardContent className="p-6">
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div>
                                                                            <h3 className="text-lg font-semibold text-gray-900">{claim.street}</h3>
                                                                            <p className="text-sm text-gray-500 mt-1">
                                                                                {claim.insuranceProvider === 'statefarm' ? 'State Farm' : claim.insuranceProvider || 'No provider specified'}
                                                                            </p>
                                                                        </div>
                                                                        <Badge variant="secondary" className={getStatusColor(claim.projectType)}>
                                                                            {claim.projectType}
                                                                        </Badge>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center text-sm">
                                                                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                                                                <span className="text-gray-600">Filed: {new Date(claim.createdAt).toLocaleDateString()}</span>
                                                                            </div>
                                                                            {claim.updatedAt && (
                                                                                <div className="flex items-center text-sm">
                                                                                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                                                    <span className="text-gray-600">Last Updated: {new Date(claim.updatedAt).toLocaleDateString()}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {claim.needsAdjuster && (
                                                                                <div className="flex items-center text-sm">
                                                                                    <LayoutIcon className="w-4 h-4 mr-2 text-gray-500" />
                                                                                    <span className="text-gray-600">Needs Adjuster: {claim.needsAdjuster}</span>
                                                                                </div>
                                                                            )}
                                                                            {claim.designPlan && (
                                                                                <div className="flex items-center text-sm">
                                                                                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                                                    <span className="text-gray-600">Design Plan: {claim.designPlan}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex justify-end space-x-3">
                                                                        {claim.id && (
                                                                            <Button
                                                                                variant="default"
                                                                                onClick={() => router.push(`/start-claim/create-restor/${claim.id}`)}
                                                                                className="bg-[#0f172a] hover:bg-[#1e293b] text-white"
                                                                            >
                                                                                Create Restoration
                                                                            </Button>
                                                                        )}
                                                                        <Button
                                                                            onClick={() => router.push(`/claim/${claim.id}`)}
                                                                            className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b] transition-colors duration-200 rounded-lg"
                                                                        >
                                                                            View Details
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => handleDeleteClick(claim)}
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-full"
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="grid gap-4">
                                                    {reviews?.map((review) => (
                                                        <Card key={review.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white rounded-lg">
                                                            <CardContent className="p-6">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold text-gray-900">{review.project_type}</h3>
                                                                        <p className="text-sm text-gray-500 mt-1">{review.project_address}</p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        {[...Array(5)]?.map((_, i) => (
                                                                            <Star
                                                                                key={i}
                                                                                className={`w-5 h-5 ${
                                                                                    i < review.rating
                                                                                        ? "text-yellow-400 fill-yellow-400"
                                                                                        : "text-gray-300"
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="mb-4">
                                                                    <p className="text-gray-700">{review.comment}</p>
                                                                </div>

                                                                <div className="flex justify-between items-center text-sm text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <Avatar className="w-8 h-8 mr-2">
                                                                            <AvatarFallback>
                                                                                {review.reviewer_name.charAt(0)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                                                                            <p className="text-xs">{review.reviewer_role}</p>
                                                                        </div>
                                                                    </div>
                                                                    <p>{new Date(review.date).toLocaleDateString()}</p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Add the delete confirmation dialog */}
            <AlertDialog open={showClosedAuctionDeleteConfirmation} onOpenChange={setShowClosedAuctionDeleteConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Closed Auction</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this closed auction? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClosedAuctionDeleteConfirm}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

