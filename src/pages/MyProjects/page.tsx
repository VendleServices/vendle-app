"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, MapPin, Calendar, FileText, Clock, LayoutIcon, Trash2, Filter, ArrowUpDown, DollarSign, Users, Folder, CheckCircle, Archive, Plus, Upload, Download, BarChart, HelpCircle, MessageCircle, Bell, Settings, Flag, LogOut, Star, Trophy, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Claim {
    id: string;
    status: string;
    date: string;
    address: string;
    provider?: string;
    policyNumber?: string;
    project_type?: string;
    design_plan?: string;
    needs_adjuster?: boolean;
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

export default function MyProjectsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [claimToDelete, setClaimToDelete] = useState<Claim | null>(null);
    const [filters, setFilters] = useState({
        status: [] as string[],
        projectType: [] as string[],
        dateRange: 'all',
        searchQuery: '',
    });
    const [sortBy, setSortBy] = useState('date-desc');
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [auctionLoading, setAuctionLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'auctions' | 'claims' | 'reviews' | 'closed-auctions'>('auctions');
    const [auctionToDelete, setAuctionToDelete] = useState<Auction | null>(null);
    const [showAuctionDeleteConfirmation, setShowAuctionDeleteConfirmation] = useState(false);
    const [closedAuctions, setClosedAuctions] = useState<Auction[]>([]);
    const [closedAuctionLoading, setClosedAuctionLoading] = useState(true);
    const [showClosedAuctionDeleteConfirmation, setShowClosedAuctionDeleteConfirmation] = useState(false);
    const [closedAuctionToDelete, setClosedAuctionToDelete] = useState<Auction | null>(null);

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

    useEffect(() => {
        console.log('Current user:', user);
        console.log('User type:', user?.user_type);
    }, [user]);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await fetch(`/api/claims?userId=${user?.user_id || 1}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch claims');
                }
                
                setClaims(data.claims);
            } catch (error) {
                console.error('Error fetching claims:', error);
                toast({
                    title: "Error",
                    description: "Failed to load your claims. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchClaims();
    }, [user?.user_id]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('/api/auctions');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Raw auction data:', data);
                
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received from server');
                }
                
                // Process auctions based on end date and status
                const now = new Date();
                console.log('Current time:', now);
                
                const processedAuctions = await Promise.all(data.map(async (auction: Auction) => {
                    try {
                        // Parse the end date from ISO format
                        const endDate = new Date(auction.end_date);
                        console.log('Processing auction:', {
                            auctionId: auction.auction_id,
                            currentStatus: auction.status,
                            endDate: endDate,
                            isPast: endDate < now
                        });
                        
                        // If the end date is in the past, mark it as closed
                        if (endDate < now) {
                            console.log('Attempting to close auction:', auction.auction_id);
                            
                            try {
                                const updateData = {
                                    status: 'closed',
                                    auction_id: auction.auction_id,
                                    claim_id: auction.claim_id
                                };
                                
                                console.log('Sending update request:', {
                                    url: `/api/auctions?id=${auction.auction_id}`,
                                    method: 'PATCH',
                                    data: updateData
                                });

                                const updateResponse = await fetch(`/api/auctions?id=${auction.auction_id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(updateData),
                                });

                                const responseText = await updateResponse.text();
                                console.log('Update response:', {
                                    status: updateResponse.status,
                                    statusText: updateResponse.statusText,
                                    response: responseText
                                });

                                if (!updateResponse.ok) {
                                    throw new Error(`Failed to update auction status: ${responseText}`);
                                }

                                // Return the auction with closed status
                                return { ...auction, status: 'closed' };
                            } catch (error) {
                                console.error('Error updating auction status:', error);
                                // Even if the update fails, we'll mark it as closed in the UI
                                return { ...auction, status: 'closed' };
                            }
                        }
                        
                        return auction;
                    } catch (error) {
                        console.error('Error processing auction:', error);
                        return auction;
                    }
                }));

                // Separate active and closed auctions
                const activeAuctions = processedAuctions.filter((auction: Auction) => auction.status === 'open');
                const closedAuctions = processedAuctions.filter((auction: Auction) => auction.status === 'closed');
                
                console.log('Final auction states:', {
                    active: activeAuctions,
                    closed: closedAuctions
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
        };

        fetchAuctions();
    }, []);

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

    const getStatusColor = (status: Claim["status"]) => {
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

    const getNextStep = (status: Claim["status"]) => {
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
        setClaimToDelete(claim);
        setShowDeleteConfirmation(true);
        setDeleteConfirmed(false);
    };

    const handleDeleteConfirm = async () => {
        if (!claimToDelete || !deleteConfirmed) return;

        try {
            const response = await fetch(`/api/claims?claimId=${claimToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete claim');
            }

            // Remove the deleted claim from the list
            setClaims(claims.filter(claim => claim.id !== claimToDelete.id));
            
            toast({
                title: "Claim Deleted",
                description: "The claim has been successfully deleted.",
            });
        } catch (error) {
            console.error('Error deleting claim:', error);
            toast({
                title: "Error",
                description: "Failed to delete the claim. Please try again.",
                variant: "destructive"
            });
        } finally {
            setShowDeleteConfirmation(false);
            setClaimToDelete(null);
            setDeleteConfirmed(false);
        }
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

            // Remove the deleted auction from the list
            setAuctions(auctions.filter(auction => auction.auction_id !== auctionToDelete.auction_id));
            
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

            // Remove the deleted auction from the list
            setClosedAuctions(closedAuctions.filter(auction => auction.auction_id !== closedAuctionToDelete.auction_id));
            
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-50"
        >
            <div className="flex">
                {/* Sidebar */}
                <div className="w-72 flex-shrink-0 bg-[#1a365d] min-h-screen">
                    <div className="sticky top-0 p-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-3xl font-semibold text-white mb-6 hover:bg-transparent hover:text-white"
                            onClick={() => navigate("/")}
                        >
                            Vendle
                        </Button>
                        
                        {/* Quick Stats */}
                        <div className="mb-6 p-4 bg-[#2c5282] rounded-lg">
                            <h3 className="text-white text-sm font-medium mb-2">Quick Stats</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-white text-sm">
                                    <span>Active Claims</span>
                                    <span>{claims.filter(c => c.status === 'in-progress').length}</span>
                                </div>
                                <div className="flex justify-between text-white text-sm">
                                    <span>Active Auctions</span>
                                    <span>{auctions.length}</span>
                                </div>
                                <div className="flex justify-between text-white text-sm">
                                    <span>Completed</span>
                                    <span>{claims.filter(c => c.status === 'completed').length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 mb-32">
                            {/* Main Navigation */}
                            <Button
                                variant="ghost"
                                className={`w-full justify-start h-12 text-base ${
                                    activeSection === 'auctions' 
                                        ? 'bg-[#2c5282] text-white hover:bg-[#2c5282]' 
                                        : 'text-gray-200 hover:bg-[#2c5282] hover:text-white'
                                }`}
                                onClick={() => setActiveSection('auctions')}
                            >
                                <Users className="w-5 h-5 mr-3" />
                                Active Auctions
                            </Button>

                            <Button
                                variant="ghost"
                                className={`w-full justify-start h-12 text-base ${
                                    activeSection === 'closed-auctions' 
                                        ? 'bg-[#2c5282] text-white hover:bg-[#2c5282]' 
                                        : 'text-gray-200 hover:bg-[#2c5282] hover:text-white'
                                }`}
                                onClick={() => setActiveSection('closed-auctions')}
                            >
                                <Archive className="w-5 h-5 mr-3" />
                                Closed Auctions
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
                                        className={`w-full justify-start h-12 text-base ${
                                            activeSection === 'reviews' 
                                                ? 'bg-[#2c5282] text-white hover:bg-[#2c5282]' 
                                                : 'text-gray-200 hover:bg-[#2c5282] hover:text-white'
                                        }`}
                                        onClick={() => setActiveSection('reviews')}
                                    >
                                        <Star className="w-5 h-5 mr-3" />
                                        My Reviews
                                    </Button>
                                );
                            })()}

                            <Button
                                variant="ghost"
                                className={`w-full justify-start h-12 text-base ${
                                    activeSection === 'claims' 
                                        ? 'bg-[#2c5282] text-white hover:bg-[#2c5282]' 
                                        : 'text-gray-200 hover:bg-[#2c5282] hover:text-white'
                                }`}
                                onClick={() => setActiveSection('claims')}
                            >
                                <FileText className="w-5 h-5 mr-3" />
                                Claims
                            </Button>

                            {/* Project Categories */}
                            <div className="pt-4">
                                <h4 className="text-gray-400 text-xs font-semibold px-4 mb-2">PROJECT CATEGORIES</h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Folder className="w-4 h-4 mr-3" />
                                    Active Projects
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-3" />
                                    Completed Projects
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Archive className="w-4 h-4 mr-3" />
                                    Archived Projects
                                </Button>
                            </div>

                            {/* Quick Actions */}
                            <div className="pt-4">
                                <h4 className="text-gray-400 text-xs font-semibold px-4 mb-2">QUICK ACTIONS</h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                    onClick={() => navigate("/start-claim")}
                                >
                                    <Plus className="w-4 h-4 mr-3" />
                                    Create New Claim
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Upload className="w-4 h-4 mr-3" />
                                    Import Projects
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Download className="w-4 h-4 mr-3" />
                                    Export Projects
                                </Button>
                            </div>

                            {/* Reports & Analytics */}
                            <div className="pt-4">
                                <h4 className="text-gray-400 text-xs font-semibold px-4 mb-2">REPORTS & ANALYTICS</h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <BarChart className="w-4 h-4 mr-3" />
                                    Project Statistics
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <DollarSign className="w-4 h-4 mr-3" />
                                    Financial Overview
                                </Button>
                            </div>

                            {/* Calendar & Timeline */}
                            <div className="pt-4">
                                <h4 className="text-gray-400 text-xs font-semibold px-4 mb-2">CALENDAR & TIMELINE</h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Calendar className="w-4 h-4 mr-3" />
                                    Project Timeline
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Flag className="w-4 h-4 mr-3" />
                                    Milestones
                                </Button>
                            </div>

                            {/* Help & Support */}
                            <div className="pt-4">
                                <h4 className="text-gray-400 text-xs font-semibold px-4 mb-2">HELP & SUPPORT</h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <HelpCircle className="w-4 h-4 mr-3" />
                                    Documentation
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <MessageCircle className="w-4 h-4 mr-3" />
                                    Contact Support
                                </Button>
                            </div>

                            {/* Settings */}
                            <div className="pt-4">
                                <h4 className="text-gray-400 text-xs font-semibold px-4 mb-2">SETTINGS</h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Bell className="w-4 h-4 mr-3" />
                                    Notifications
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-10 text-sm text-gray-200 hover:bg-[#2c5282] hover:text-white"
                                >
                                    <Settings className="w-4 h-4 mr-3" />
                                    Preferences
                                </Button>
                            </div>
                        </div>

                        {/* User Profile Section */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2c5282] bg-[#1a365d]">
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarImage src={user?.picture || ""} />
                                    <AvatarFallback>
                                        {(user?.name?.charAt(0) || "U").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {user?.name || user?.email || "User"}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {user?.email || ""}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white hover:bg-[#2c5282]"
                                    onClick={() => {
                                        // Clear user data and navigate to home
                                        localStorage.removeItem('user');
                                        localStorage.removeItem('isAuthenticated');
                                        navigate("/");
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {activeSection === 'auctions' ? 'Active Auctions' : activeSection === 'claims' ? 'My Claims' : activeSection === 'closed-auctions' ? 'Closed Auctions' : 'My Reviews'}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    {activeSection === 'auctions' ? 'Browse and manage your active auctions' : activeSection === 'claims' ? 'View and manage your insurance claims' : activeSection === 'closed-auctions' ? 'View and manage your closed auctions' : 'View and manage your reviews'}
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate("/start-claim")}
                                className="bg-[#1a365d] hover:bg-[#2c5282] text-white h-10 px-6"
                            >
                                Start New Claim
                            </Button>
                        </div>

                        {activeSection === 'auctions' ? (
                            <Card className="shadow-sm border-gray-200">
                                <CardContent className="p-6">
                                    {auctionLoading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a365d]"></div>
                                        </div>
                                    ) : auctions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Auctions</h3>
                                            <p className="text-gray-500 mb-4">There are currently no active auctions to display.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {auctions.map((auction) => (
                                                <Card key={auction.auction_id} className="hover:shadow-md transition-shadow border-gray-200">
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

                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center text-sm">
                                                                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                                                    <span className="text-gray-600">Starting Bid: <span className="font-medium">${auction.starting_bid.toFixed(2)}</span></span>
                                                                </div>
                                                                <div className="flex items-center text-sm">
                                                                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                                                    <span className="text-gray-600">Current Bid: <span className="font-medium">${auction.current_bid.toFixed(2)}</span></span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center text-sm">
                                                                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                                                                    <span className="text-gray-600">{auction.bid_count} bids</span>
                                                                </div>
                                                                <div className="flex items-center text-sm">
                                                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                                                    <span className="text-gray-600">Ends: {new Date(auction.end_date).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end space-x-3">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => navigate(`/auction/${auction.auction_id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : activeSection === 'closed-auctions' ? (
                            <Card className="shadow-sm border-gray-200">
                                <CardContent className="p-6">
                                    {closedAuctionLoading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a365d]"></div>
                                        </div>
                                    ) : closedAuctions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Archive className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Closed Auctions</h3>
                                            <p className="text-gray-500 mb-4">There are no closed auctions to display.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {closedAuctions.map((auction) => (
                                                <Card key={auction.auction_id} className="hover:shadow-md transition-shadow border-gray-200">
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
                                                                variant="outline"
                                                                onClick={() => navigate(`/auction/${auction.auction_id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => handleClosedAuctionDelete(auction)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : activeSection === 'claims' ? (
                            <Card className="shadow-sm border-gray-200">
                                <CardContent className="p-6">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a365d]"></div>
                                        </div>
                                    ) : claims.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Found</h3>
                                            <p className="text-gray-500 mb-4">You haven't filed any claims yet.</p>
                                            <Button
                                                onClick={() => navigate("/start-claim")}
                                                className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                                            >
                                                Start New Claim
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {claims.map((claim) => (
                                                <Card key={claim.id} className="hover:shadow-md transition-shadow border-gray-200">
                                                    <CardContent className="p-6">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">{claim.address}</h3>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {claim.provider === 'statefarm' ? 'State Farm' : claim.provider || 'No provider specified'}
                                                                </p>
                                                            </div>
                                                            <Badge variant="secondary" className={getStatusColor(claim.status)}>
                                                                {claim.status}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center text-sm">
                                                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                                                    <span className="text-gray-600">Filed: {new Date(claim.date).toLocaleDateString()}</span>
                                                                </div>
                                                                {claim.policyNumber && (
                                                                    <div className="flex items-center text-sm">
                                                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                                        <span className="text-gray-600">Policy: {claim.policyNumber}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {claim.project_type && (
                                                                    <div className="flex items-center text-sm">
                                                                        <LayoutIcon className="w-4 h-4 mr-2 text-gray-500" />
                                                                        <span className="text-gray-600">Type: {claim.project_type}</span>
                                                                    </div>
                                                                )}
                                                                {claim.design_plan && (
                                                                    <div className="flex items-center text-sm">
                                                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                                        <span className="text-gray-600">Design Plan: {claim.design_plan}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end space-x-3">
                                                            {claim.status === 'pending' && (
                                                                <Button
                                                                    variant="default"
                                                                    onClick={() => navigate(`/start-claim/create-restor?claimId=${parseInt(claim.id)}`)}
                                                                    className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                                                                >
                                                                    Create Restoration
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => navigate(`/claim/${claim.id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDeleteClick(claim)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-sm border-gray-200">
                                <CardContent className="p-6">
                                    <div className="grid gap-6">
                                        {reviews.map((review) => (
                                            <Card key={review.id} className="hover:shadow-md transition-shadow border-gray-200">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{review.project_type}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">{review.project_address}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
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
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

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
        </motion.div>
    );
}