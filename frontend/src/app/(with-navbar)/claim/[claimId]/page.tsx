"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, FileText, Clock, Layout, Loader2, CalendarCheck, Mail, Info, MessageSquare, Zap, Trash2, Home, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useApiService } from "@/services/api";
import { createClient } from "@/auth/client";
import Image from "next/image";
import { ClaimHeader } from "./shared/ClaimHeader";
import { RAGChatbot } from "@/components/RAGChatbot";
import { useGetHomeownerAvailability, useStartBooking } from "@/hooks/useBooking";
import MessagingDrawer from "@/components/MessagingDrawer";

interface PageProps {
    params: Promise<{
        claimId: string;
    }>;
}

export default function ClaimPage({ params }: PageProps) {
    const { claimId } = use(params);
    const apiService = useApiService();
    const router = useRouter();
    const { user, isLoggedIn, loading: authLoading } = useAuth();
    const supabase = createClient();

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, authLoading, router]);

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
    const [showMessaging, setShowMessaging] = useState(false);

    const { data: homeownerAvailability, isLoading: availabilityLoading } = useGetHomeownerAvailability(
        isContractor ? claim?.userId : null
    );

    const startBookingMutation = useStartBooking();

    const handleScheduleSiteVisit = () => {
        if (!claim?.userId || !user?.id) return;
        startBookingMutation.mutate({
            contractorId: user.id,
            homeownerId: claim.userId,
        });
    };

    const homeownerEmail = claim?.user?.email;

    const getDayLabel = (dayOfWeek: number): string => {
        const days: Record<number, string> = {
            1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday',
            5: 'Friday', 6: 'Saturday', 7: 'Sunday',
        };
        return days[dayOfWeek] || 'Unknown';
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white">
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 mb-3">Project not found</p>
                    <Button
                        onClick={() => router.push("/home")}
                        className="h-9 px-4 text-sm bg-vendle-blue text-white hover:bg-vendle-blue/90"
                    >
                        Go to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <main className="max-w-5xl mx-auto px-4 py-6">
                <ClaimHeader
                    claim={claim}
                    onBack={() => router.push("/home")}
                />

                {/* Message Homeowner - Contractors Only */}
                {isContractor && claim?.userId && (
                    <div className="bg-white border border-gray-200 rounded p-4 mb-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-vendle-blue/10 flex items-center justify-center">
                                    <MessageSquare className="h-4 w-4 text-vendle-blue" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Message Homeowner</h3>
                                    <p className="text-xs text-gray-500">Send a direct message</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setShowMessaging(true)}
                                className="h-8 px-3 text-xs bg-vendle-blue hover:bg-vendle-blue/90 text-white"
                            >
                                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                Message
                            </Button>
                        </div>
                    </div>
                )}

                {/* Schedule Site Visit - Contractors Only */}
                {isContractor && (
                    <div className="bg-white border border-gray-200 rounded p-4 mb-4">
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-vendle-teal/10 flex items-center justify-center">
                                    <CalendarCheck className="h-4 w-4 text-vendle-teal" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Schedule Site Visit</h3>
                                    <p className="text-xs text-gray-500">Visit the property for an accurate estimate</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleScheduleSiteVisit}
                                disabled={startBookingMutation.isPending || !homeownerAvailability?.length}
                                className="h-8 px-3 text-xs bg-vendle-teal hover:bg-vendle-teal/90 text-white disabled:opacity-50"
                            >
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                {startBookingMutation.isPending ? 'Opening...' : 'Schedule'}
                            </Button>
                        </div>

                        {/* Notice */}
                        <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs mb-3">
                            <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-amber-700">
                                Add the homeowner&apos;s email as a guest when scheduling.
                            </p>
                        </div>

                        {/* Homeowner Email */}
                        {homeownerEmail && (
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100 mb-3">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                <div>
                                    <p className="text-[10px] text-gray-500">Homeowner Email</p>
                                    <p className="text-xs font-medium text-gray-900">{homeownerEmail}</p>
                                </div>
                            </div>
                        )}

                        {/* Availability */}
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-vendle-teal" />
                                Available Times
                            </p>
                            {availabilityLoading ? (
                                <div className="flex items-center justify-center py-3">
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                </div>
                            ) : homeownerAvailability && homeownerAvailability.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {homeownerAvailability.map((slot: any) => (
                                        <div
                                            key={slot.id}
                                            className="flex items-center gap-1.5 p-2 bg-gray-50 border border-gray-100 rounded text-xs"
                                        >
                                            <Calendar className="h-3 w-3 text-vendle-teal shrink-0" />
                                            <span className="font-medium">{getDayLabel(slot.dayOfWeek)}:</span>
                                            <span className="text-gray-500">
                                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 p-2 bg-gray-50 rounded text-center">
                                    No availability set yet.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Property Info */}
                    <div className="bg-white border border-gray-200 rounded">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-vendle-blue" />
                                Property Info
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Address</p>
                                    <p className="text-sm text-gray-900">
                                        {claim.street}, {claim.city}, {claim.state} {claim.zipCode}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Zap className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Utilities</p>
                                    <p className="text-sm text-gray-900">
                                        {claim.hasFunctionalUtilities ? "Functional" : "Not functional"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Trash2 className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Dumpster</p>
                                    <p className="text-sm text-gray-900">
                                        {claim.hasDumpster ? "Available" : "Not available"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Home className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Occupied</p>
                                    <p className="text-sm text-gray-900">
                                        {claim.isOccupied ? "Yes" : "No"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Specs */}
                    <div className="bg-white border border-gray-200 rounded">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <Layout className="h-4 w-4 text-vendle-blue" />
                                Project Specifications
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <Layout className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Project Type</p>
                                    <p className="text-sm text-gray-900">{claim.projectType}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Design Plan</p>
                                    <p className="text-sm text-gray-900">{claim.designPlan}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Created</p>
                                    <p className="text-sm text-gray-900">
                                        {new Date(claim.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Updated</p>
                                    <p className="text-sm text-gray-900">
                                        {new Date(claim.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PDFs */}
                {claimPdfs?.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded mb-4">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-vendle-blue" />
                                Documentation
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {claimPdfs.map((url: string, index: number) => (
                                    <div
                                        key={index}
                                        className="rounded border border-gray-200 overflow-hidden"
                                    >
                                        <iframe
                                            src={url}
                                            className="w-full h-[400px] border-0"
                                            title={`Document ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Images */}
                <div className="bg-white border border-gray-200 rounded">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-vendle-blue" />
                            Property Images
                        </h3>
                    </div>
                    <div className="p-4">
                        {images?.length ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {images.map((url: string, i: number) => (
                                    <div
                                        key={i}
                                        className="relative aspect-square rounded overflow-hidden border border-gray-200 group"
                                    >
                                        <Image
                                            src={url}
                                            alt={`Property image ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute bottom-2 left-2 text-white">
                                                <p className="text-[10px] font-medium">Image {i + 1}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center mx-auto mb-2">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">No images uploaded yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {isContractor && <RAGChatbot claimId={claimId} />}

            <MessagingDrawer
                isOpen={showMessaging}
                onClose={() => setShowMessaging(false)}
                initialUserId={claim?.userId}
                initialUserName={claim?.user?.email}
            />
        </div>
    );
}
