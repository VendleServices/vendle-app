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
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Inter } from "next/font/google";
import { useApiService } from "@/services/api";
import { AuctionCard } from "@/components/AuctionCard";
import { ClaimCard } from "@/components/ClaimCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { formatCurrency, formatDate } from "@/lib/formatting";
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
import vendleLogo from "../../../assets/vendle_logo.jpeg";

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
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [auctionLoading, setAuctionLoading] = useState(false);
    
    const [activeSection, setActiveSection] = useState<'auctions' | 'claims' | 'reviews' | 'closed-auctions'>('claims');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [closedAuctions, setClosedAuctions] = useState<Auction[]>([]);
    const [closedAuctionLoading, setClosedAuctionLoading] = useState(false);
    const [showClosedAuctionDeleteConfirmation, setShowClosedAuctionDeleteConfirmation] = useState(false);
    const [closedAuctionToDelete, setClosedAuctionToDelete] = useState<Auction | null>(null);

    const fetchClaims = async () => {
        try {
            console.log('Fetching claims for user:', user?.id);
            const response: any = await apiService.get(`/api/claim`);
            console.log('Claims API response:', response);
            return response?.claims;
        } catch (error) {
            console.log('Error fetching claims:', error);
            throw error;
        }
    }

    // Mock data for testing the UI
    const getMockClaims = () => {
        return [
            {
                id: "mock-claim-1",
                street: "123 Oak Street",
                city: "Austin",
                state: "TX",
                zipCode: "78701",
                projectType: "water damage",
                designPlan: "Full restoration",
                needsAdjuster: true,
                insuranceProvider: "State Farm",
                insuranceEstimateFilePath: "/uploads/estimate-1.pdf",
                createdAt: new Date("2025-01-15"),
                updatedAt: new Date("2025-01-20"),
            },
            {
                id: "mock-claim-2", 
                street: "456 Pine Avenue",
                city: "Houston",
                state: "TX",
                zipCode: "77001",
                projectType: "fire damage",
                designPlan: "Partial restoration",
                needsAdjuster: false,
                insuranceProvider: "Allstate",
                insuranceEstimateFilePath: "/uploads/estimate-2.pdf",
                createdAt: new Date("2025-01-10"),
                updatedAt: new Date("2025-01-18"),
            },
            {
                id: "mock-claim-3",
                street: "789 Elm Drive",
                city: "Dallas", 
                state: "TX",
                zipCode: "75201",
                projectType: "storm damage",
                designPlan: "Roof repair",
                needsAdjuster: true,
                insuranceProvider: "Farmers",
                insuranceEstimateFilePath: "/uploads/estimate-3.pdf",
                createdAt: new Date("2025-01-05"),
                updatedAt: new Date("2025-01-12"),
            },
            {
                id: "mock-claim-4",
                street: "321 Maple Lane",
                city: "San Antonio",
                state: "TX", 
                zipCode: "78201",
                projectType: "mold remediation",
                designPlan: "Basement cleanup",
                needsAdjuster: false,
                insuranceProvider: "Progressive",
                insuranceEstimateFilePath: "/uploads/estimate-4.pdf",
                createdAt: new Date("2025-01-01"),
                updatedAt: new Date("2025-01-08"),
            },
            {
                id: "mock-claim-5",
                street: "654 Cedar Court",
                city: "Fort Worth",
                state: "TX",
                zipCode: "76101", 
                projectType: "full",
                designPlan: "Complete renovation",
                needsAdjuster: true,
                insuranceProvider: "Liberty Mutual",
                insuranceEstimateFilePath: "/uploads/estimate-5.pdf",
                createdAt: new Date("2024-12-28"),
                updatedAt: new Date("2025-01-05"),
            }
        ];
    }

    const deleteClaim = async (claim: Claim) => {
        try {
            const response = await apiService.delete(`/api/claim/${claim.id}`);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Mock auction data for testing
    const getMockAuctions = () => {
        return [
            {
                auction_id: "mock-auction-1",
                claim_id: "mock-claim-1",
                title: "Restoration Job - Water Damage",
                project_type: "water damage",
                starting_bid: 5000,
                current_bid: 8500,
                bid_count: 3,
                end_date: "2025-02-15",
                status: "open",
                property_address: "123 Oak Street, Austin, TX",
                design_plan: "Full restoration"
            },
            {
                auction_id: "mock-auction-2", 
                claim_id: "mock-claim-2",
                title: "Fire Damage Restoration",
                project_type: "fire damage",
                starting_bid: 8000,
                current_bid: 12500,
                bid_count: 0,
                end_date: "2025-02-20",
                status: "open",
                property_address: "456 Pine Avenue, Houston, TX",
                design_plan: "Partial restoration"
            },
            {
                auction_id: "mock-auction-3",
                claim_id: "mock-claim-3",
                title: "Storm Damage Repair",
                project_type: "storm damage",
                starting_bid: 4000,
                current_bid: 6200,
                bid_count: 2,
                end_date: "2025-02-10",
                status: "open",
                property_address: "789 Elm Drive, Dallas, TX",
                design_plan: "Roof repair"
            }
        ];
    }

    const getMockClosedAuctions = () => {
        return [
            {
                auction_id: "mock-closed-1",
                claim_id: "mock-claim-4",
                title: "Mold Remediation Project",
                project_type: "mold remediation",
                starting_bid: 3000,
                current_bid: 4800,
                bid_count: 1,
                end_date: "2025-01-15",
                status: "closed",
                property_address: "321 Maple Lane, San Antonio, TX",
                design_plan: "Basement cleanup"
            },
            {
                auction_id: "mock-closed-2",
                claim_id: "mock-claim-5",
                title: "Full Home Restoration",
                project_type: "full",
                starting_bid: 15000,
                current_bid: 25000,
                bid_count: 4,
                end_date: "2025-01-10",
                status: "closed",
                property_address: "654 Cedar Court, Fort Worth, TX",
                design_plan: "Complete renovation"
            }
        ];
    }

    const fetchAuctions = async () => {
        setAuctionLoading(true);
        try {
            // Use mock data instead of API call for testing
            const activeAuctions = getMockAuctions();
            const closedAuctions = getMockClosedAuctions();
            
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
        queryFn: () => Promise.resolve(getMockClaims()), // Use mock data instead of API call
        enabled: !!user?.id,
        retry: 1,
    });

    console.log('Claims query state:', { 
        claims: claims?.length || 0, 
        isLoading, 
        isError, 
        error, 
        userId: user?.id,
        isLoggedIn,
        authLoading
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
                                            src={vendleLogo}
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

                                {/* CONTRACTOR-ONLY SECTION: My Reviews */}
                                {user?.user_type === "contractor" && (
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
                                )}

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

                                {/* 
                                    TEMPLATE FOR FUTURE USER-TYPE SPECIFIC SECTIONS:
                                    
                                    Copy this pattern to add new contractor-only or client-only sections:
                                    
                                    // FOR CONTRACTOR-ONLY FEATURES:
                                    {user?.user_type === "contractor" && (
                                        <Button variant="ghost" onClick={() => setActiveSection('new-contractor-section')}>
                                            <Icon className="w-3 h-3" />
                                            {sidebarExpanded && "Contractor Feature"}
                                        </Button>
                                    )}
                                    
                                    // FOR CLIENT-ONLY FEATURES:
                                    {user?.user_type === "homeowner" && (
                                        <Button variant="ghost" onClick={() => setActiveSection('new-client-section')}>
                                            <Icon className="w-3 h-3" />
                                            {sidebarExpanded && "Client Feature"}
                                        </Button>
                                    )}
                                */}

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
                                            {activeSection === 'auctions' ? 'Active Auctions' : activeSection === 'claims' ? 'My Claims' : activeSection === 'closed-auctions' ? 'Closed Auctions' : 'My Reviews'}
                                        </h1>
                                        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                                            {activeSection === 'auctions' ? 'Browse and manage your active auctions' : activeSection === 'claims' ? 'View and manage your insurance claims' : activeSection === 'closed-auctions' ? 'View and manage your closed auctions' : 'View and manage your reviews'}
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
                                    
                                    {activeSection === 'auctions' ? (
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
                                                                insuranceProvider={claim.insuranceProvider === 'statefarm' ? 'State Farm' : claim.insuranceProvider}
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

