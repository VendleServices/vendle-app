"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, MapPin, Calendar, FileText, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Claim {
    id: string;
    type: "insurance" | "fema";
    status: "pending" | "in-progress" | "completed" | "cleanup-in-progress";
    date: string;
    address: string;
    provider?: string;
    policyNumber?: string;
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

    useEffect(() => {
        // TODO: Replace with actual API call to fetch user's claims
        // For now, using mock data
        const mockClaims: Claim[] = [
            {
                id: "1",
                type: "insurance",
                status: "cleanup-in-progress",
                date: "2024-04-10",
                address: "123 Main Street, Anytown, CA",
                provider: "State Farm",
                policyNumber: "SF123456789"
            },
            {
                id: "2",
                type: "fema",
                status: "pending",
                date: "2024-03-10",
                address: "456 Oak Ave, Somewhere, USA"
            }
        ];
        
        setClaims(mockClaims);
        setLoading(false);
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
                return "Upload Documents";
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-8"
        >
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
                        <CardTitle className="text-xl">Active Auction</CardTitle>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                className="text-[#1a365d] border-[#1a365d] hover:bg-[#1a365d] hover:text-white"
                                onClick={() => navigate("/start-claim/schedule-cleanup")}
                            >
                                Schedule Cleanup Service
                            </Button>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                <Clock className="w-4 h-4 mr-2" />
                                Ends in 2 days
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Building2 className="w-6 h-6 text-[#1a365d]" />
                            <div>
                                <h3 className="font-semibold">123 Main Street, Anytown, CA</h3>
                                <p className="text-sm text-gray-500">Water damage restoration</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {mockContractors.map((contractor) => (
                                <Card key={contractor.id} className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={contractor.avatar} />
                                                <AvatarFallback>{contractor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold">{contractor.name}</h4>
                                                <p className="text-sm text-gray-500">{contractor.company}</p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="text-sm ml-1">{contractor.rating} ({contractor.reviews} reviews)</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {contractor.specialties.map((specialty, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {specialty}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-[#1a365d]">
                                                ${contractor.bidAmount.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">{contractor.bidTime}</p>
                                            <Button
                                                variant="outline"
                                                className="mt-2 text-[#1a365d] border-[#1a365d] hover:bg-[#1a365d] hover:text-white"
                                                onClick={() => navigate(`/contractor/${contractor.id}`)}
                                            >
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Existing Claims Section */}
            <Card>
                <CardHeader>
                    <CardTitle>My Claims</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a365d]"></div>
                        </div>
                    ) : claims.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No claims found</p>
                            <div className="flex flex-col items-center space-y-4">
                                <Button
                                    onClick={() => navigate("/start-claim")}
                                    className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                                >
                                    Start New Claim
                                </Button>
                                <p className="text-gray-500">or</p>
                                <Button
                                    onClick={() => navigate("/create-restoration")}
                                    className="bg-[#1a365d] hover:bg-[#2c5282] text-white"
                                >
                                    Create Restoration Job
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {claims.map((claim) => (
                                <Card key={claim.id} className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-semibold">
                                                    {claim.type === "insurance" ? "Insurance Claim" : "FEMA Claim"}
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
                                                    {claim.date}
                                                </div>
                                                {claim.provider && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        {claim.provider} - {claim.policyNumber}
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
                                                            navigate("/start-claim/create-restor");
                                                            break;
                                                        case "in-progress":
                                                            navigate("/start-claim/create-restor");
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
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

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
        </motion.div>
    );
} 