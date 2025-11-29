"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, MapPin, Calendar, FileText, Clock, LayoutIcon, Trash2, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useApiService } from "@/services/api";
import { createClient } from "@/auth/client";
import Image from "next/image";

interface PageProps {
    params: Promise<{
        claimId: string;
    }>;
}

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

export default function ClaimPage({ params }: PageProps) {
    const { claimId } = use(params);
    const apiService = useApiService();
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();

    if (!user) {
        router.push("/login");
    }

    const fetchClaim = async () => {
        const response: any = await apiService.get(`/api/claim/${claimId}`);
        const claim  = response?.claim;
        return claim ? claim : null
    }

    const { data: claim, isLoading, isError, error } = useQuery({
        queryKey: ["getIndividualClaim"],
        queryFn: fetchClaim,
    });

    const fetchClaimImages = async () => {
        try {
            const response: any = await apiService.get(`/api/images/${claimId}`);

            const imageObjects = response?.images;
            const publicImageUrls: string[] = [];

            for (const image of imageObjects) {
                const { data: publicURL } = supabase.storage.from('images').getPublicUrl(image?.supabase_url?.slice(7));
                publicImageUrls.push(publicURL.publicUrl);
            }

            console.log(publicImageUrls);

            return publicImageUrls;
        } catch (error) {
            console.log(error);
        }
    }

    const { data: images, isLoading: loadingImages, error: errorImages } = useQuery({
        queryKey: ["getClaimImages"],
        queryFn: fetchClaimImages,
        enabled: !!claimId,
    });

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

    if (isLoading) {
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
                        onClick={() => router.push("/dashboard")}
                        className="mt-4"
                    >
                        Back to My Projects
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col justify-center mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className="mr-4 w-fit mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
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
                                    <Badge className={`${getStatusColor(claim.id)} text-white mr-2`}>
                                        {claim.id}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        Created on {new Date(claim.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{claim.street}</span>
                                </div>
                                {claim.city && (
                                    <div className="flex items-center">
                                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{claim.city}</span>
                                    </div>
                                )}
                                {claim.state && (
                                    <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>State: {claim.state}</span>
                                    </div>
                                )}
                                {claim.zipCode && (
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>ZipCode: {claim.zipCode}</span>
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
                                    <span>Last Updated: {new Date(claim.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {images?.map((url: string, index: number) => (
                        <Image src={url} alt="image" key={index} width={300} height={300} />
                    ))}
                </div>
            </div>
        </div>
    );
} 