"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, FileText, Clock, LayoutIcon, ArrowLeft, ShieldQuestionIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useApiService } from "@/services/api";
import { createClient } from "@/auth/client";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageProps {
    params: Promise<{
        claimId: string;
    }>;
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
        return response?.claim ?? null;
    };

    const { data: claim, isLoading } = useQuery({
        queryKey: ["getIndividualClaim"],
        queryFn: fetchClaim,
    });

    const fetchClaimImages = async () => {
        const response: any = await apiService.get(`/api/images/${claimId}`);
        const images = response?.images ?? [];
        return images.map((img: any) => {
            const { data } = supabase.storage
                .from("images")
                .getPublicUrl(img?.supabase_url?.slice(7));
            return data?.publicUrl;
        });
    };

    const { data: images } = useQuery({
        queryKey: ["getClaimImages"],
        queryFn: fetchClaimImages,
        enabled: !!claimId,
    });

    const fetchClaimPdfs = async () => {
        const response: any = await apiService.get(`/api/pdfs/${claimId}`);
        const pdfs = response?.pdfs ?? [];

        return pdfs.map((pdf: any) => {
            const { data } = supabase.storage
                .from("vendle-claims")
                .getPublicUrl(pdf?.supabase_url?.slice(14));
            return data?.publicUrl;
        });
    }

    const { data: claimPdfs } = useQuery({
        queryKey: ["getClaimPdfs"],
        queryFn: fetchClaimPdfs,
        enabled: !!claimId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pl-32 flex items-center justify-center">
                <div className="animate-pulse w-full max-w-3xl space-y-4 p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="min-h-screen bg-gray-50 pl-32 p-10">
                <h1 className="text-3xl font-bold">Claim Not Found</h1>
                <p className="mt-2 text-gray-600">
                    The requested claim could not be found or you don’t have access.
                </p>
                <Button onClick={() => router.push("/home")} className="mt-6 hover:text-white">
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pl-32 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto space-y-10"
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/home")}
                            className="mb-3 gap-2 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Claim Details
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Review the details and uploaded documentation.
                        </p>
                    </div>
                </div>

                {/* Claim Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Property Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-700">
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                                Property Address: {claim.street}, {claim.city}, {claim.state} {claim.zipCode}
                            </div>
                            <div className="flex items-center">
                                <ShieldQuestionIcon className="h-4 w-4 mr-3 text-gray-500" />
                                Functional Utilities: {claim.hasFunctionalUtilities ? "Yes" : "No"}
                            </div>
                            <div className="flex items-center">
                                <ShieldQuestionIcon className="h-4 w-4 mr-3 text-gray-500" />
                                Dumpster: {claim.hasDumpster ? "Yes" : "No"}
                            </div>
                            <div className="flex items-center">
                                <ShieldQuestionIcon className="h-4 w-4 mr-3 text-gray-500" />
                                Occupied: {claim.isOccupied ? "Yes" : "No"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Project Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-700">
                            <div className="flex items-center">
                                <LayoutIcon className="h-4 w-4 mr-3 text-gray-500" />
                                Project Type: {claim.projectType}
                            </div>
                            <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-3 text-gray-500" />
                                Design Plan: {claim.designPlan}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                                Created: {new Date(claim.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-3 text-gray-500" />
                                Updated: {new Date(claim.updatedAt).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pdfs */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Property Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {claimPdfs?.length ? (
                            <div className="grid grid-cols-2 gap-4">
                                {claimPdfs.map((url: string, index: number) => (
                                    <iframe
                                        key={index}
                                        src={url}
                                        style={{ width: "100%", height: "400px" }}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                {/* Images */}
                <Card className="shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Property Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {images?.length ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {images.map((url: string, i: number) => (
                                    <div key={i} className="relative w-full h-48 rounded-lg overflow-hidden border">
                                        <Image
                                            src={url}
                                            alt="Claim"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No images uploaded for this claim yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
