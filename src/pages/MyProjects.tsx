"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, MapPin, Calendar, FileText, Clock, LayoutIcon, Trash2, Filter, ArrowUpDown, DollarSign, Users } from "lucide-react";
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

interface Contractor {
    id: string;
    name: string;
    company: string;
    rating: number;
    reviews: number;
    avatar: string;
    bidAmount: number;
    bidTime: string;
    specialties: string[];
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
}

const mockContractors: Contractor[] = [
    {
        id: "1",
        name: "John Smith",
        company: "Elite Restoration",
        rating: 4.8,
        reviews: 127,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        bidAmount: 12500,
        bidTime: "2 hours ago",
        specialties: ["Water Damage", "Fire Restoration", "Mold Remediation"]
    },
    {
        id: "2",
        name: "Sarah Johnson",
        company: "Premier Builders",
        rating: 4.9,
        reviews: 89,
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        bidAmount: 11800,
        bidTime: "1 hour ago",
        specialties: ["Structural Repair", "Water Damage", "Emergency Services"]
    },
    {
        id: "3",
        name: "Michael Chen",
        company: "QuickFix Restoration",
        rating: 4.7,
        reviews: 203,
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        bidAmount: 13200,
        bidTime: "30 minutes ago",
        specialties: ["Fire Damage", "Smoke Cleanup", "Content Restoration"]
    }
];

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
            
            // Filter for active auctions (status is 'open' and end date is in the future)
            const activeAuctions = data.filter((auction: Auction) => {
                const endDate = new Date(auction.end_date);
                const isActive = auction.status === 'open' && endDate > new Date();
                console.log('Auction:', auction, 'Is active:', isActive, 'End date:', endDate, 'Current date:', new Date());
                return isActive;
            });
            
            console.log('Filtered active auctions:', activeAuctions);
            setAuctions(activeAuctions);
        } catch (error) {
            console.error('Error fetching auctions:', error);
            toast({
                title: "Error",
                description: "Failed to load auctions. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setAuctionLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

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

    const handleConfirmCleanup = () => {
        if (selectedClaim) {
            // TODO: Implement actual confirmation logic
            console.log("Cleanup confirmed for claim:", selectedClaim.id);
            setShowConfirmation(false);
            toast({
                title: "Cleanup Confirmed",
                description: "Please remember to also confirm the completion with your local county.",
                duration: 5000,
            });
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

    const filteredClaims = claims.filter(claim => {
        if (filters.status.length > 0 && !filters.status.includes(claim.status)) {
            return false;
        }
        if (filters.projectType.length > 0 && claim.project_type && !filters.projectType.includes(claim.project_type)) {
            return false;
        }
        if (filters.searchQuery && !claim.address.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'date-asc':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="flex gap-8">
                {/* Side Panel */}
                <div className="w-64 flex-shrink-0">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Search */}
                            <div className="space-y-2">
                                <Label>Search</Label>
                                <Input
                                    placeholder="Search by address..."
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="space-y-2">
                                    {['pending', 'in-progress', 'completed', 'cleanup-in-progress'].map((status) => (
                                        <div key={status} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`status-${status}`}
                                                checked={filters.status.includes(status)}
                                                onCheckedChange={(checked) => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        status: checked
                                                            ? [...prev.status, status]
                                                            : prev.status.filter(s => s !== status)
                                                    }));
                                                }}
                                            />
                                            <Label htmlFor={`status-${status}`} className="capitalize">
                                                {status.replace(/-/g, ' ')}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Project Type Filter */}
                            <div className="space-y-2">
                                <Label>Project Type</Label>
                                <div className="space-y-2">
                                    {['residential', 'commercial', 'industrial'].map((type) => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`type-${type}`}
                                                checked={filters.projectType.includes(type)}
                                                onCheckedChange={(checked) => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        projectType: checked
                                                            ? [...prev.projectType, type]
                                                            : prev.projectType.filter(t => t !== type)
                                                    }));
                                                }}
                                            />
                                            <Label htmlFor={`type-${type}`} className="capitalize">
                                                {type}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <Label>Sort By</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sort option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date-desc">Newest First</SelectItem>
                                        <SelectItem value="date-asc">Oldest First</SelectItem>
                                        <SelectItem value="status">Status</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setFilters({
                                        status: [],
                                        projectType: [],
                                        dateRange: 'all',
                                        searchQuery: '',
                                    });
                                    setSortBy('date-desc');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1a365d]">My Projects</h1>
                        <Button
                            onClick={() => navigate("/start-claim")}
                            className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                        >
                            Start New Claim
                        </Button>
                    </div>

                    {/* Active Auction Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl">Active Auctions</CardTitle>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        className="text-[#1a365d] border-[#1a365d] hover:bg-[#1a365d] hover:text-white"
                                        onClick={() => navigate("/start-claim/schedule-cleanup")}
                                    >
                                        Schedule Cleanup Service
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {auctionLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a365d]"></div>
                                </div>
                            ) : auctions.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No active auctions found</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {auctions.map((auction) => (
                                        <Card key={auction.auction_id} className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{auction.property_address}</h3>
                                                    <p className="text-sm text-gray-500">{auction.project_type}</p>
                                                </div>
                                                <Badge variant={auction.status === 'open' ? 'default' : 'secondary'}>
                                                    {auction.status}
                                                </Badge>
                                            </div>
                                            
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    <span>Starting Bid: ${auction.starting_bid.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    <span>Current Bid: ${auction.current_bid.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    <span>{auction.bid_count} bids</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span>Ends: {new Date(auction.end_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => navigate(`/auction/${auction.auction_id}`)}
                                                >
                                                    View Details
                                                </Button>
                                                {user?.user_type === 'contractor' ? (
                                                    <Button onClick={() => navigate(`/auction/${auction.auction_id}/bid`)}>
                                                        Place Bid
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => navigate(`/auction/${auction.auction_id}/bids`)}
                                                    >
                                                        View Bids
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    onClick={() => navigate(`/auction/${auction.auction_id}/edit`)}
                                                >
                                                    Edit Auction
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Claims Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>My Claims</CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {filteredClaims.length} {filteredClaims.length === 1 ? 'claim' : 'claims'} found
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a365d]"></div>
                                </div>
                            ) : filteredClaims.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No claims found</p>
                                    <Button
                                        onClick={() => navigate("/start-claim")}
                                        className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                                    >
                                        Start New Claim
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {filteredClaims.map((claim) => (
                                        <Card key={claim.id} className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold">
                                                            Insurance Claim
                                                        </h3>
                                                        <Badge className={getStatusColor(claim.status)}>
                                                            {claim.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            {claim.address}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {new Date(claim.date).toLocaleDateString()}
                                                        </div>
                                                        {claim.provider && (
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <FileText className="w-4 h-4 mr-2" />
                                                                {claim.provider === 'statefarm' ? 'State Farm' : claim.provider} {claim.policyNumber && `- ${claim.policyNumber}`}
                                                            </div>
                                                        )}
                                                        {claim.project_type && (
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Building2 className="w-4 h-4 mr-2" />
                                                                Project Type: {claim.project_type.charAt(0).toUpperCase() + claim.project_type.slice(1)}
                                                            </div>
                                                        )}
                                                        {claim.design_plan && (
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <LayoutIcon className="w-4 h-4 mr-2" />
                                                                Design Plan: {claim.design_plan.charAt(0).toUpperCase() + claim.design_plan.slice(1)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <Button
                                                        variant="outline"
                                                        className="text-[#1a365d] border-[#1a365d] hover:bg-[#1a365d] hover:text-white"
                                                        onClick={() => navigate(`/claim/${claim.id}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                                                        onClick={() => {
                                                            switch (claim.status) {
                                                                case "pending":
                                                                    navigate(`/start-claim/create-restor?claimId=${claim.id}`);
                                                                    break;
                                                                case "in-progress":
                                                                    navigate(`/start-claim/create-restor?claimId=${claim.id}`);
                                                                    break;
                                                                case "cleanup-in-progress":
                                                                    setSelectedClaim(claim);
                                                                    setShowConfirmation(true);
                                                                    break;
                                                                case "completed":
                                                                    navigate("/dashboard/estimate");
                                                                    break;
                                                                default:
                                                                    navigate(`/claim/${claim.id}`);
                                                            }
                                                        }}
                                                    >
                                                        {getNextStep(claim.status)}
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="text-black border-red-600 hover:bg-red-600 hover:text-white"
                                                        onClick={() => handleDeleteClick(claim)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Claim
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Delete Claim</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this claim? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 py-4">
                                <Checkbox
                                    id="confirm-delete"
                                    checked={deleteConfirmed}
                                    onCheckedChange={(checked) => setDeleteConfirmed(checked as boolean)}
                                />
                                <label
                                    htmlFor="confirm-delete"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I understand this action cannot be undone
                                </label>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteConfirmation(false);
                                        setDeleteConfirmed(false);
                                        setClaimToDelete(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteConfirm}
                                    disabled={!deleteConfirmed}
                                >
                                    Delete Claim
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Confirmation Dialog */}
                    <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Cleanup Completion</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to confirm that the cleanup is complete? You will also need to confirm this with your local county.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowConfirmation(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                                    onClick={handleConfirmCleanup}
                                >
                                    Confirm Cleanup
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </motion.div>
    );
} 