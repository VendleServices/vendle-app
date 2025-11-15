"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, FileText, Clock, LayoutIcon, Trash2, DollarSign, Users, Folder, CheckCircle, Archive, Plus, Upload, Download, BarChart, HelpCircle, MessageCircle, Bell, Settings, Flag, LogOut, Star, Trophy, AlertCircle, Wrench, Home, CalendarCheck, TrendingUp, List, Grid, BarChart3, Compass } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Inter } from "next/font/google";
import { useApiService } from "@/services/api";
import { AuctionCard } from "@/components/AuctionCard";
import { ClaimCard } from "@/components/ClaimCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import SplashScreen from "@/components/SplashScreen";
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
    needsAdjuster: boolean;
    insuranceEstimateFilePath?: string;
    insuranceProvider?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
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
    const isContractor = user?.user_type === 'contractor';
    const isHomeowner = user?.user_type === 'homeowner' || !isContractor;
    
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [auctionLoading, setAuctionLoading] = useState(false);
    
    // Default to 'auctions' for contractors, 'claims' for homeowners
    const [activeSection, setActiveSection] = useState<'home' | 'schedule' | 'analytics' | 'reviews' | 'auctions' | 'closed-auctions' | 'claims' | 'explore'>('claims');
    const [scheduleTab, setScheduleTab] = useState<'upcoming' | 'deadlines' | 'visits' | 'milestones'>('upcoming');
    const [closedAuctions, setClosedAuctions] = useState<Auction[]>([]);
    const [closedAuctionLoading, setClosedAuctionLoading] = useState(false);
    const [showClosedAuctionDeleteConfirmation, setShowClosedAuctionDeleteConfirmation] = useState(false);
    const [closedAuctionToDelete, setClosedAuctionToDelete] = useState<Auction | null>(null);

    const fetchClaims = async () => {
        try {
            console.log('Fetching claims for user:', user?.id);
            const response: any = await apiService.get(`/api/claim`);
            console.log('Claims API response:', response);
            console.log('Claims array:', response?.claims);
            console.log('Number of claims:', response?.claims?.length || 0);
            return response?.claims || [];
        } catch (error) {
            console.error('Error fetching claims:', error);
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
            toast("Error", {
                description: "Failed to load auctions. Please try again later.",
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
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        staleTime: 0, // Always consider data stale to refetch
    });

    const deleteClaimMutation = useMutation({
        mutationFn: deleteClaim,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getClaims"]
            });
            toast("Success", {
                description: "Successfully deleted claim",
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

    const handleDeleteClick = (claim: Claim) => {
        deleteClaimMutation.mutate(claim);
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
            toast("Auction Deleted", {
                description: "The closed auction has been deleted successfully.",
            });
        } catch (error) {
            console.error('Error deleting closed auction:', error);
            toast("Error", {
                description: "Failed to delete closed auction. Please try again",
            });
        } finally {
            setShowClosedAuctionDeleteConfirmation(false);
            setClosedAuctionToDelete(null);
        }
    };

    // Refetch claims when user loads or navigates to dashboard
    useEffect(() => {
        if (user?.id && !authLoading) {
            queryClient.invalidateQueries({ queryKey: ["getClaims"] });
        }
    }, [user?.id, authLoading, queryClient]);

    // Set default section based on user type when user loads
    useEffect(() => {
        if (!authLoading && user && !searchParams.get('tab')) {
            if (isContractor) {
                setActiveSection('auctions');
            } else {
                setActiveSection('claims');
            }
        }
    }, [authLoading, user, isContractor, searchParams]);

    // Redirect contractors away from claims section
    useEffect(() => {
        if (!authLoading && isContractor && activeSection === 'claims') {
            setActiveSection('auctions');
        }
    }, [authLoading, isContractor, activeSection]);

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
        return <SplashScreen />;
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
                <div className="pl-32">
                    {/* Main Content */}
                    <div className="flex-1 bg-gray-50">
                        <div className="p-6 sm:p-8 lg:p-12">
                            <div className="mx-auto w-full max-w-[1200px]">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                            {activeSection === 'home' ? 'Dashboard Home' :
                                             activeSection === 'schedule' ? 'Schedule' :
                                             activeSection === 'analytics' ? 'Analytics' :
                                             activeSection === 'reviews' ? 'My Reviews' :
                                             activeSection === 'explore' ? 'Explore Opportunities' :
                                             activeSection === 'auctions' ? 'Active Auctions' :
                                             activeSection === 'claims' ? 'My Claims' :
                                             activeSection === 'closed-auctions' ? 'Closed Auctions' : 'Dashboard'}
                                        </h1>
                                        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                                            {activeSection === 'home' ? 'Overview of your contractor dashboard and recent activity' :
                                             activeSection === 'schedule' ? 'Manage your project schedule and appointments' :
                                             activeSection === 'analytics' ? 'View performance metrics and insights' :
                                             activeSection === 'reviews' ? 'View and manage your reviews' :
                                             activeSection === 'explore' ? 'Discover new project opportunities and contracts' :
                                             activeSection === 'auctions' ? 'Browse and manage your active auctions' :
                                             activeSection === 'claims' ? 'View and manage your insurance claims' :
                                             activeSection === 'closed-auctions' ? 'View and manage your closed auctions' : 'Dashboard overview'}
                                        </p>
                                    </div>
                                    {/* CONDITIONAL BUTTON BASED ON USER TYPE */}
                                    {user?.user_type === 'contractor' ? (
                                        <Button
                                            onClick={() => router.push("/contractor-projects")}
                                            className="gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Browse Projects
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => router.push("/start-claim")}
                                            className="gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Start New Claim
                                        </Button>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    {/* 
                                        CONDITIONAL CONTENT SECTIONS BASED ON USER TYPE
                                        
                                        Easy to modify for contractors vs clients:
                                        - user?.user_type === 'contractor' : Show contractor-specific content
                                        - user?.user_type === 'homeowner' : Show client-specific content
                                        
                                        Examples:
                                        - Contractors: Available projects, bid history, reviews received
                                        - Clients: Claims, auctions for their projects, contractor browsing
                                    */}
                                    
                                    {/* NEW CONTRACTOR SECTIONS */}
                                    {activeSection === 'home' ? (
                                        <div className="space-y-8">
                                            {/* Contract Metrics */}
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contract Metrics</h2>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {/* Available to Bid */}
                                                    <Card className="p-6 bg-white border border-gray-200">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                                <FileText className="h-6 w-6 text-gray-600" />
                                                            </div>
                                                            <span className="text-2xl font-bold text-gray-900">0</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm text-gray-600 mb-1">Contracts</p>
                                                            <p className="text-sm font-medium text-gray-900">Available to Bid</p>
                                                            <p className="text-lg font-bold text-blue-600">$0</p>
                                                        </div>
                                                    </Card>

                                                    {/* IOI Phase */}
                                                    <Card className="p-6 bg-white border border-gray-200">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                                <FileText className="h-6 w-6 text-orange-600" />
                                                            </div>
                                                            <span className="text-2xl font-bold text-gray-900">1</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm text-gray-600 mb-1">Contracts</p>
                                                            <p className="text-sm font-medium text-gray-900">IOI Phase</p>
                                                            <p className="text-lg font-bold text-blue-600">$18,000</p>
                                                        </div>
                                                    </Card>

                                                    {/* LOI Phase */}
                                                    <Card className="p-6 bg-white border border-gray-200">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                <CheckCircle className="h-6 w-6 text-green-600" />
                                                            </div>
                                                            <span className="text-2xl font-bold text-gray-900">1</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm text-gray-600 mb-1">Contracts</p>
                                                            <p className="text-sm font-medium text-gray-900">LOI Phase</p>
                                                            <p className="text-lg font-bold text-blue-600">$28,000</p>
                                                        </div>
                                                    </Card>

                                                    {/* Active Work */}
                                                    <Card className="p-6 bg-white border border-blue-200 border-2">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <Wrench className="h-6 w-6 text-blue-600" />
                                                            </div>
                                                            <span className="text-2xl font-bold text-gray-900">2</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm text-gray-600 mb-1">Contracts</p>
                                                            <p className="text-sm font-medium text-gray-900">Active Work</p>
                                                            <p className="text-lg font-bold text-blue-600">$77,000</p>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </div>

                                            {/* Active Contracts */}
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Contracts(2)</h2>
                                                
                                                {/* Check if we have actual auction/contract data */}
                                                {auctions?.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {auctions.slice(0, 5).map((auction: any, index: number) => (
                                                            <Card key={auction.auction_id || index} className="p-6 bg-white border border-gray-200">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                            {auction.title || `Contract ${index + 1}`}
                                                                        </h3>
                                                                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                                            <div className="flex items-center">
                                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                                <span>{auction.property_address || 'Project Location'}</span>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <Clock className="h-4 w-4 mr-1" />
                                                                                <span>End Date: {new Date(auction.end_date || Date.now()).toLocaleDateString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="flex items-center mb-2">
                                                                            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                                                                {auction.status || 'Active'}
                                                                            </Badge>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-lg font-bold text-blue-600">${auction.current_bid?.toLocaleString() || auction.starting_bid?.toLocaleString() || '0'}</p>
                                                                            <p className="text-sm text-gray-600">{auction.bid_count || 0} bids</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    /* Hardcoded sample data when no API data */
                                                    <div className="space-y-4">
                                                        <Card className="p-6 bg-white border border-gray-200">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                        Roof Repair - Storm Damage
                                                                    </h3>
                                                                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                                        <div className="flex items-center">
                                                                            <MapPin className="h-4 w-4 mr-1" />
                                                                            <span>123 Oak Street, Austin, TX 78701</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <Clock className="h-4 w-4 mr-1" />
                                                                            <span>Started 2 weeks ago, 75% complete</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="flex items-center mb-2">
                                                                        <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                                                            Active Work
                                                                        </Badge>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-lg font-bold text-blue-600">$45,000</p>
                                                                        <p className="text-sm text-gray-600">75% Complete</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card>

                                                        <Card className="p-6 bg-white border border-gray-200">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                                        Kitchen Renovation - Water Damage
                                                                    </h3>
                                                                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                                        <div className="flex items-center">
                                                                            <MapPin className="h-4 w-4 mr-1" />
                                                                            <span>456 Pine Avenue, Austin, TX 78702</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <Clock className="h-4 w-4 mr-1" />
                                                                            <span>Started 1 week ago, 45% complete</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="flex items-center mb-2">
                                                                        <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                                                            Active Work
                                                                        </Badge>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-lg font-bold text-blue-600">$32,000</p>
                                                                        <p className="text-sm text-gray-600">45% Complete</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : activeSection === 'schedule' ? (
                                        <div className="space-y-6">
                                            {/* Schedule Header with View Toggle */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h1 className="text-2xl font-bold text-gray-900">Schedule & Calendar</h1>
                                                    <p className="text-gray-600 mt-1">Manage all deadlines, visits, and milestones</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                        <List className="h-4 w-4 mr-2" />
                                                        List
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Calendar
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <BarChart3 className="h-4 w-4 mr-2" />
                                                        Gantt
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Critical Deadlines Alert */}
                                            <Card className="bg-red-50 border-red-200">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-red-800">Critical Deadlines</h3>
                                                            <p className="text-sm text-red-700 mt-1">
                                                                IOI deadline for Bathroom Remodel project due tomorrow at 5:00 PM
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Tab Navigation */}
                                            <div className="border-b border-gray-200">
                                                <nav className="-mb-px flex space-x-8">
                                                    <button 
                                                        onClick={() => setScheduleTab('upcoming')}
                                                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                                            scheduleTab === 'upcoming' 
                                                                ? 'border-blue-500 text-blue-600' 
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        Upcoming Events
                                                    </button>
                                                    <button 
                                                        onClick={() => setScheduleTab('deadlines')}
                                                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                                            scheduleTab === 'deadlines' 
                                                                ? 'border-blue-500 text-blue-600' 
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        Deadlines
                                                    </button>
                                                    <button 
                                                        onClick={() => setScheduleTab('visits')}
                                                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                                            scheduleTab === 'visits' 
                                                                ? 'border-blue-500 text-blue-600' 
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        Site Visits
                                                    </button>
                                                    <button 
                                                        onClick={() => setScheduleTab('milestones')}
                                                        className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                                            scheduleTab === 'milestones' 
                                                                ? 'border-blue-500 text-blue-600' 
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        Milestones
                                                    </button>
                                                </nav>
                                            </div>

                                            {/* Tab Content */}
                                            <div>
                                                {scheduleTab === 'upcoming' && (
                                                    <>
                                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Next 7 Days</h2>
                                                        {/* Upcoming Events Content */}
                                                        <div className="space-y-4">
                                                            <Card className="p-4 bg-white border border-gray-200">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                                        <div>
                                                                            <h3 className="text-sm font-medium text-gray-900">IOI Deadline - Bathroom Remodel</h3>
                                                                            <p className="text-xs text-gray-500 mt-1">Tomorrow at 5:00 PM</p>
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 text-xs">Critical</Badge>
                                                                </div>
                                                            </Card>
                                                            <Card className="p-4 bg-white border border-gray-200">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                        <div>
                                                                            <h3 className="text-sm font-medium text-gray-900">Site Visit - Kitchen Renovation</h3>
                                                                            <p className="text-xs text-gray-500 mt-1">Friday at 10:00 AM</p>
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">Scheduled</Badge>
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    </>
                                                )}

                                                {scheduleTab === 'deadlines' && (
                                                    <>
                                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Critical Deadlines</h2>
                                                        {/* Deadlines Content */}
                                                        <div className="space-y-6">
                                                            {/* IOI Submission Deadline */}
                                                            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <h3 className="text-lg font-semibold text-gray-900">IOI Submission Deadline</h3>
                                                                            <div className="text-right">
                                                                                <p className="text-sm font-medium text-gray-900">2/19/2024</p>
                                                                                <p className="text-sm text-gray-500">5:00 PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-gray-600 mb-3">Bathroom Remodel - Flood Damage</p>
                                                                        <div className="flex items-center space-x-3 mb-4">
                                                                            <Badge className="bg-red-100 text-red-800 border-red-200">HIGH</Badge>
                                                                            <span className="text-sm text-gray-600">IOI Deadline</span>
                                                                        </div>
                                                                        <p className="text-gray-700 mb-4">Submit Intent of Interest for bathroom renovation project</p>
                                                                        <div className="flex space-x-3">
                                                                            <Button variant="outline" size="sm">View Details</Button>
                                                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Reschedule</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card>

                                                            {/* LOI Response Due */}
                                                            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <h3 className="text-lg font-semibold text-gray-900">LOI Response Due</h3>
                                                                            <div className="text-right">
                                                                                <p className="text-sm font-medium text-gray-900">2/27/2024</p>
                                                                                <p className="text-sm text-gray-500">11:59 PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-gray-600 mb-3">Siding Replacement - Wind Damage</p>
                                                                        <div className="flex items-center space-x-3 mb-4">
                                                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">MEDIUM</Badge>
                                                                            <span className="text-sm text-gray-600">LOI Deadline</span>
                                                                        </div>
                                                                        <p className="text-gray-700 mb-4">Letter of Intent response deadline</p>
                                                                        <div className="flex space-x-3">
                                                                            <Button variant="outline" size="sm">View Details</Button>
                                                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Reschedule</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    </>
                                                )}

                                                {scheduleTab === 'visits' && (
                                                    <>
                                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Site Visits</h2>
                                                        <div className="text-center py-8">
                                                            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-500">No site visits scheduled</p>
                                                        </div>
                                                    </>
                                                )}

                                                {scheduleTab === 'milestones' && (
                                                    <>
                                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Milestones</h2>
                                                        <div className="text-center py-8">
                                                            <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-500">No milestones scheduled</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : activeSection === 'analytics' ? (
                                        <div className="space-y-6">
                                            <div className="text-center py-12">
                                                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics & Insights</h3>
                                                <p className="text-gray-500">Performance metrics, earnings reports, and business insights will be displayed here.</p>
                                            </div>
                                        </div>
                                    ) : activeSection === 'explore' ? (
                                        <div className="space-y-6">
                                            <div className="min-h-screen bg-gray-50 p-8">
                                                {/* Explore page content placeholder */}
                                                <div className="max-w-7xl mx-auto">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Type to search"
                                                                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm">
                                                                <Users className="h-4 w-4 mr-2" />
                                                                Job fit
                                                            </Button>
                                                            <Button variant="outline" size="sm">
                                                                <TrendingUp className="h-4 w-4 mr-2" />
                                                                Trending
                                                            </Button>
                                                            <Button variant="outline" size="sm">
                                                                <Clock className="h-4 w-4 mr-2" />
                                                                Newest
                                                            </Button>
                                                            <Button variant="outline" size="sm">
                                                                <DollarSign className="h-4 w-4 mr-2" />
                                                                Most pay
                                                            </Button>
                                                            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                                <Star className="h-4 w-4 mr-2" />
                                                                Refer & earn
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Empty state */}
                                                    <div className="text-center py-16">
                                                        <Compass className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                                                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Explore Opportunities</h3>
                                                        <p className="text-gray-500 text-lg">New project listings will appear here</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : activeSection === 'auctions' ? (
                                            <>
                                                {auctionLoading ? (
                                                    <LoadingSkeleton />
                                                ) : auctions?.length === 0 ? (
                                                    <EmptyState
                                                        icon={Users}
                                                        title="No Active Auctions"
                                                        description="There are currently no active auctions to display. Start a new claim to create an auction."
                                                        actionLabel="Start New Claim"
                                                        onAction={() => router.push("/start-claim")}
                                                    />
                                                ) : (
                                                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                                        {auctions?.map((auction) => (
                                                            <AuctionCard
                                                                key={auction.auction_id}
                                                                title={auction.title}
                                                                scope={auction.project_type}
                                                                finalBid={auction.current_bid}
                                                                totalBids={auction.bid_count}
                                                                endedAt={auction.end_date}
                                                                status="open"
                                                                onViewDetails={() => router.push(`/auction/${auction.auction_id}`)}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : activeSection === 'closed-auctions' ? (
                                            <>
                                                {closedAuctionLoading ? (
                                                    <LoadingSkeleton />
                                                ) : closedAuctions?.length === 0 ? (
                                                    <EmptyState
                                                        icon={Archive}
                                                        title="No Closed Auctions"
                                                        description="There are no closed auctions to display."
                                                        actionLabel="Start New Claim"
                                                        onAction={() => router.push("/start-claim")}
                                                    />
                                                ) : (
                                                    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                                        {closedAuctions?.map((auction) => (
                                                            <AuctionCard
                                                                key={auction.auction_id}
                                                                title={auction.title}
                                                                scope={auction.project_type}
                                                                finalBid={auction.current_bid}
                                                                totalBids={auction.bid_count}
                                                                endedAt={auction.end_date}
                                                                status="closed"
                                                                onViewDetails={() => router.push(`/auction/${auction.auction_id}`)}
                                                                onDelete={() => handleClosedAuctionDelete(auction)}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : activeSection === 'claims' ? (
                                            <>
                                                {isLoading ? (
                                                    <LoadingSkeleton />
                                                ) : isError ? (
                                                    <div className="text-center py-12">
                                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Claims</h3>
                                                        <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'Failed to load claims'}</p>
                                                        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["getClaims"] })}>
                                                            Try Again
                                                        </Button>
                                                    </div>
                                                ) : claims?.length === 0 ? (
                                                    <EmptyState
                                                        icon={FileText}
                                                        title="No Claims Found"
                                                        description="You haven't filed any claims yet. Start a new claim to get started with your recovery process."
                                                        actionLabel="Start New Claim"
                                                        onAction={() => router.push("/start-claim")}
                                                    />
                                                ) : (
                                                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                                        {claims?.map((claim: Claim) => (
                                                            <ClaimCard
                                                                key={claim.id}
                                                                id={claim.id}
                                                                street={claim.street}
                                                                city={claim.city}
                                                                state={claim.state}
                                                                zipCode={claim.zipCode}
                                                                projectType={claim.projectType}
                                                                designPlan={claim.designPlan}
                                                                needsAdjuster={claim.needsAdjuster}
                                                                insuranceProvider={claim.insuranceProvider ? (claim.insuranceProvider === 'statefarm' ? 'State Farm' : claim.insuranceProvider) : 'Not specified'}
                                                                createdAt={claim.createdAt}
                                                                updatedAt={claim.updatedAt}
                                                                onViewDetails={() => router.push(`/claim/${claim.id}`)}
                                                                onCreateRestoration={() => router.push(`/start-claim/create-restor/${claim.id}`)}
                                                                onDelete={() => handleDeleteClick(claim)}
                                                            />
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
                                </motion.div>
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

