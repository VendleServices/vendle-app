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
            <div className="min-h-screen bg-muted/30 lg:pl-32 flex items-center justify-center">
                <div className="animate-pulse w-full max-w-3xl space-y-4 p-6">
                    <div className="h-6 bg-vendle-gray/30 rounded w-1/3"></div>
                    <div className="h-48 bg-vendle-gray/30 rounded"></div>
                </div>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="min-h-screen bg-muted/30 lg:pl-32 p-6 sm:p-10">
                <h1 className="text-3xl font-bold text-foreground">Claim Not Found</h1>
                <p className="mt-2 text-muted-foreground">
                    The requested claim could not be found or you don't have access.
                </p>
                <Button onClick={() => router.push("/home")} className="mt-6">
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 lg:pl-32 py-8 sm:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8"
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/home")}
                            className="mb-4 gap-2 text-muted-foreground hover:text-vendle-blue"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Claim Details
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Review the details and uploaded documentation.
                        </p>
                    </div>
                </div>

                {/* Claim Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-sm border border-vendle-gray/30 hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-vendle-gray/20">
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-vendle-blue/10">
                                    <MapPin className="h-5 w-5 text-vendle-blue" />
                                </div>
                                Property Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-start gap-3 group">
                                <MapPin className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Property Address</p>
                                    <p className="text-sm text-foreground">
                                        {claim.street}, {claim.city}, {claim.state} {claim.zipCode}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldQuestionIcon className="h-5 w-5 mt-0.5 text-vendle-teal shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Functional Utilities</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {claim.hasFunctionalUtilities ? (
                                            <span className="text-vendle-teal">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldQuestionIcon className="h-5 w-5 mt-0.5 text-vendle-teal shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Dumpster</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {claim.hasDumpster ? (
                                            <span className="text-vendle-teal">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldQuestionIcon className="h-5 w-5 mt-0.5 text-vendle-teal shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Occupied</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {claim.isOccupied ? (
                                            <span className="text-vendle-teal">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-vendle-gray/30 hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-vendle-gray/20">
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-vendle-teal/10">
                                    <LayoutIcon className="h-5 w-5 text-vendle-teal" />
                                </div>
                                Project Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-start gap-3">
                                <LayoutIcon className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Project Type</p>
                                    <p className="text-sm text-foreground font-medium">{claim.projectType}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Design Plan</p>
                                    <p className="text-sm text-foreground font-medium">{claim.designPlan}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Created</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {new Date(claim.createdAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Last Updated</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {new Date(claim.updatedAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pdfs */}
                {claimPdfs?.length > 0 && (
                    <Card className="shadow-sm border border-vendle-gray/30 hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-vendle-gray/20">
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-vendle-sand/20">
                                    <FileText className="h-5 w-5 text-vendle-navy" />
                                </div>
                                Property Documentation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {claimPdfs.map((url: string, index: number) => (
                                    <div 
                                        key={index} 
                                        className="rounded-lg border border-vendle-gray/30 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <iframe
                                            src={url}
                                            className="w-full h-[500px] border-0"
                                            title={`Document ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Images */}
                <Card className="shadow-sm border border-vendle-gray/30 hover:shadow-md transition-shadow">
                    <CardHeader className="border-b border-vendle-gray/20">
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-vendle-blue/10">
                                <FileText className="h-5 w-5 text-vendle-blue" />
                            </div>
                            Property Images
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {images?.length ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((url: string, i: number) => (
                                    <motion.div 
                                        key={i} 
                                        className="relative w-full aspect-square rounded-lg overflow-hidden border border-vendle-gray/30 group cursor-pointer hover:border-vendle-blue transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Image
                                            src={url}
                                            alt={`Property image ${i + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                                                Image {i + 1}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vendle-gray/20 mb-4">
                                    <FileText className="h-8 w-8 text-vendle-gray" />
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    No images uploaded for this claim yet.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
