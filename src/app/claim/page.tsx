"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Building2, MapPin, Calendar, FileText, Clock, LayoutIcon, Trash2, ArrowLeft } from "lucide-react";

interface Claim {
    id: string;
    status: string;
    date: string;
    address: string;
    provider?: string;
    policyNumber?: string;
    projectType?: string;
    designPlan?: string;
    needsAdjuster?: boolean;
    dateOfLoss?: string;
    insuranceEstimateFilePath?: string;
}

export default function ClaimPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [claim, setClaim] = useState<Claim | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaim = async () => {
            try {
                const response = await fetch(`/api/claims/${id}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch claim');
                }
                
                setClaim(data.claim);
            } catch (error) {
                console.error('Error fetching claim:', error);
                toast({
                    title: "Error",
                    description: "Failed to load claim. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchClaim();
    }, [id]);

    const getStatusColor = (status: string) => {
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

    if (loading) {
        return (
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">Claim Not Found</h1>
                    <p className="mt-2 text-gray-600">The claim you're looking for doesn't exist or you don't have permission to view it.</p>
                    <Button
                        onClick={() => navigate("/my-projects")}
                        className="mt-4"
                    >
                        Back to My Projects
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/my-projects")}
                        className="mr-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to My Projects
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Claim Details</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Claim Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Badge className={`${getStatusColor(claim.status)} text-white mr-2`}>
                                        {claim.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        Created on {new Date(claim.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{claim.address}</span>
                                </div>
                                {claim.provider && (
                                    <div className="flex items-center">
                                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{claim.provider}</span>
                                    </div>
                                )}
                                {claim.policyNumber && (
                                    <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>Policy Number: {claim.policyNumber}</span>
                                    </div>
                                )}
                                {claim.dateOfLoss && (
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>Date of Loss: {new Date(claim.dateOfLoss).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {claim.projectType && (
                                    <div className="flex items-center">
                                        <LayoutIcon className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>Project Type: {claim.projectType}</span>
                                    </div>
                                )}
                                {claim.designPlan && (
                                    <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>Design Plan: {claim.designPlan}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>Last Updated: {new Date(claim.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 