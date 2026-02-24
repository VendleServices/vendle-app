"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, FileText, Clock, Layout, ShieldQuestion, Loader2, CalendarCheck, Mail, Info, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useApiService } from "@/services/api";
import { createClient } from "@/auth/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ClaimHeader } from "./shared/ClaimHeader";
import { RAGChatbot } from "@/components/RAGChatbot";
import { useGetHomeownerAvailability, useStartBooking } from "@/hooks/useBooking";

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

    const isContractor = user?.user_metadata?.userType === "contractor";

    // Fetch homeowner availability for contractors
    const { data: homeownerAvailability, isLoading: availabilityLoading } = useGetHomeownerAvailability(
        isContractor ? claim?.userId : null
    );

    // Booking mutation for contractors
    const startBookingMutation = useStartBooking();

    const handleScheduleSiteVisit = () => {
        if (!claim?.userId || !user?.id) return;
        startBookingMutation.mutate({
            contractorId: user.id,
            homeownerId: claim.userId,
        });
    };

    // Get homeowner email from claim
    const homeownerEmail = claim?.user?.email;

    // Helper to format day
    const getDayLabel = (dayOfWeek: number): string => {
        const days: Record<number, string> = {
            1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday',
            5: 'Friday', 6: 'Saturday', 7: 'Sunday',
        };
        return days[dayOfWeek] || 'Unknown';
    };

    // Helper to format time
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 lg:pl-32">
                <div className="space-y-4 text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#4A637D]" />
                    <p className="text-lg text-foreground">Loading project details...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (!claim) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 lg:pl-32">
                <Card className="border-border bg-card p-6 sm:p-8 text-center shadow-md">
                    <p className="mb-4 text-xl font-semibold text-foreground">Project not found.</p>
                    <Button
                        className="mt-2 bg-[#4A637D] text-white hover:bg-[#4A637D]/90"
                        onClick={() => router.push("/home")}
                    >
                        Go to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 lg:pl-32">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Claim Header */}
                <ClaimHeader
                    claim={claim}
                    onBack={() => router.push("/home")}
                />

                {/* Schedule Site Visit - Contractors Only */}
                {isContractor && (
                    <Card className="shadow-lg border-2 border-vendle-teal/30 hover:shadow-xl hover:border-vendle-teal/50 transition-all duration-300 bg-gradient-to-r from-vendle-teal/5 to-vendle-blue/5 mb-6">
                        <CardHeader className="border-b border-vendle-teal/20 pb-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-vendle-teal/15 shadow-sm">
                                        <CalendarCheck className="h-6 w-6 text-vendle-teal" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Schedule a Site Visit</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Visit the property to provide an accurate estimate for this project
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleScheduleSiteVisit}
                                    disabled={startBookingMutation.isPending || !homeownerAvailability?.length}
                                    className="bg-vendle-teal hover:bg-vendle-teal/90 text-white font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {startBookingMutation.isPending ? 'Opening Calendly...' : 'Schedule Visit'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {/* Important Notice */}
                            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-800">Important: Add Homeowner as Guest</p>
                                    <p className="text-amber-700 mt-1">
                                        When scheduling, please add the homeowner&apos;s email as a guest so they receive the calendar invite.
                                    </p>
                                </div>
                            </div>

                            {/* Homeowner Email */}
                            {homeownerEmail && (
                                <div className="flex items-center gap-3 p-3 bg-white border border-vendle-gray/20 rounded-lg">
                                    <Mail className="h-5 w-5 text-vendle-blue shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Homeowner Email</p>
                                        <p className="text-sm font-semibold text-foreground">{homeownerEmail}</p>
                                    </div>
                                </div>
                            )}

                            {/* Homeowner Availability */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-vendle-teal" />
                                    Homeowner&apos;s Available Times
                                </p>
                                {availabilityLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-5 w-5 animate-spin text-vendle-teal" />
                                    </div>
                                ) : homeownerAvailability && homeownerAvailability.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {homeownerAvailability.map((slot: any) => (
                                            <div
                                                key={slot.id}
                                                className="flex items-center gap-2 p-2 bg-white border border-vendle-gray/20 rounded-lg text-sm"
                                            >
                                                <Calendar className="h-4 w-4 text-vendle-teal shrink-0" />
                                                <span className="font-medium">{getDayLabel(slot.dayOfWeek)}:</span>
                                                <span className="text-muted-foreground">
                                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground">
                                            The homeowner has not set their availability yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Claim Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card className="shadow-lg border-2 border-vendle-gray/20 hover:shadow-xl hover:border-vendle-blue/30 transition-all duration-300 bg-white">
                        <CardHeader className="border-b-2 border-vendle-gray/10 bg-vendle-blue/5">
                            <CardTitle className="text-foreground flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-vendle-blue/15 shadow-sm">
                                    <MapPin className="h-5 w-5 text-vendle-blue" />
                                </div>
                                <span className="text-xl">Property Info</span>
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
                                <ShieldQuestion className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Functional Utilities</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {claim.hasFunctionalUtilities ? (
                                            <span className="text-vendle-blue">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldQuestion className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Dumpster</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {claim.hasDumpster ? (
                                            <span className="text-vendle-blue">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldQuestion className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Occupied</p>
                                    <p className="text-sm text-foreground font-medium">
                                        {claim.isOccupied ? (
                                            <span className="text-vendle-blue">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground">No</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-2 border-vendle-gray/20 hover:shadow-xl hover:border-vendle-blue/30 transition-all duration-300 bg-white">
                        <CardHeader className="border-b-2 border-vendle-gray/10 bg-vendle-blue/5">
                            <CardTitle className="text-foreground flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-vendle-blue/15 shadow-sm">
                                    <Layout className="h-5 w-5 text-vendle-blue" />
                                </div>
                                <span className="text-xl">Project Specifications</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-start gap-3">
                                <Layout className="h-5 w-5 mt-0.5 text-vendle-blue shrink-0" />
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
                    <Card className="shadow-lg border-2 border-vendle-gray/20 hover:shadow-xl hover:border-vendle-blue/30 transition-all duration-300 bg-white mb-6">
                        <CardHeader className="border-b-2 border-vendle-gray/10 bg-[#4A637D]/5">
                            <CardTitle className="text-foreground flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#4A637D]/15 shadow-sm">
                                    <FileText className="h-5 w-5 text-[#4A637D]" />
                                </div>
                                <span className="text-xl">Property Documentation</span>
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
                <Card className="shadow-lg border-2 border-vendle-gray/20 hover:shadow-xl hover:border-vendle-blue/30 transition-all duration-300 bg-white">
                    <CardHeader className="border-b-2 border-vendle-gray/10 bg-vendle-blue/5">
                        <CardTitle className="text-foreground flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-vendle-blue/15 shadow-sm">
                                <FileText className="h-5 w-5 text-vendle-blue" />
                            </div>
                            <span className="text-xl">Property Images</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {images?.length ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((url: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-vendle-gray/20 group cursor-pointer hover:border-vendle-blue shadow-md hover:shadow-xl transition-all duration-300"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Image
                                            src={url}
                                            alt={`Property image ${i + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-3 left-3 text-white">
                                                <p className="text-xs font-semibold tracking-wide">Image {i + 1}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-vendle-gray/10 mb-4 shadow-inner">
                                    <FileText className="h-10 w-10 text-vendle-gray/50" />
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">
                                    No images uploaded for this project yet.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

            {/* RAG Chatbot - Only for Contractors */}
            {isContractor && <RAGChatbot claimId={claimId} />}
        </div>
    );
}
