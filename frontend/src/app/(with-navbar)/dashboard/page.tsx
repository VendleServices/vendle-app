"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    FileText,
    AlertCircle,
    Users,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Inter } from "next/font/google";
import { useApiService } from "@/services/api";
import { AuctionCard } from "@/components/AuctionCard";
import { ClaimCard } from "@/components/ClaimCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import SplashScreen from "@/components/SplashScreen";
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

const inter = Inter({ subsets: ["latin"] });

interface Claim {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    projectType: string;
    designPlan: string;
    needsAdjuster: boolean;
    insuranceProvider?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface Auction {
    auction_id: string;
    claim_id: string;
    status: string;
    starting_bid: number;
    current_bid: number;
    bid_count: number;
    end_date: string;
    title: string;
    project_type: string;
    property_address: string;
}

export default function DashboardPage() {
    const apiService = useApiService();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isLoggedIn, loading: authLoading } = useAuth();

    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [closedAuctions, setClosedAuctions] = useState<Auction[]>([]);
    const [auctionLoading, setAuctionLoading] = useState(false);
    const [showClosedAuctionDeleteConfirmation, setShowClosedAuctionDeleteConfirmation] =
        useState(false);

    const [activeSection, setActiveSection] = useState<
        "home" | "schedule" | "analytics" | "reviews" | "auctions" | "closed-auctions" | "claims" | "explore"
    >("claims");

    const fetchClaims = async () => {
        const response: any = await apiService.get(`/api/claim`);
        return response?.claims || [];
    };

    const deleteClaim = async (claim: Claim) => {
        const response = await apiService.delete(`/api/claim/${claim.id}`);
        return response;
    };

    const deleteClaimMutation = useMutation({
        mutationFn: deleteClaim,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getClaims"] });
            toast("Success", { description: "Successfully deleted claim" });
        },
    });

    const fetchAuctions = async () => {
        setAuctionLoading(true);
        try {
            const res: any = await apiService.get(`/api/auctions`);
            const data = res?.data;

            const active = data?.filter((a: Auction) => new Date(a.end_date) > new Date());
            const closed = data?.filter((a: Auction) => new Date(a.end_date) <= new Date());

            setAuctions(active);
            setClosedAuctions(closed);
        } finally {
            setAuctionLoading(false);
        }
    };

    const { data: claims = [], isLoading, isError, error } = useQuery({
        queryKey: ["getClaims"],
        queryFn: fetchClaims,
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (!authLoading && !isLoggedIn) router.push("/");
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        if (isLoggedIn && (activeSection === "auctions" || activeSection === "closed-auctions")) {
            fetchAuctions();
        }
    }, [activeSection, isLoggedIn]);

    if (authLoading) return <SplashScreen />;

    return (
        <div className={`min-h-screen bg-white flex ${inter.className}`}>
            <motion.div
                className="flex-1 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="pl-32 flex-1 bg-gray-50">
                    <div className="p-6 sm:p-8 lg:p-12 h-full">
                        <div className="w-full max-w-[1200px] mx-auto">

                            {/* Header Title */}
                            <div className="mb-12 flex justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {activeSection === "claims" ? "My Claims" : "Active Auctions"}
                                    </h1>
                                </div>
                                {user?.user_metadata?.userType === "contractor" ? (
                                    <Button onClick={() => router.push("/contractor-projects")}>Browse Projects</Button>
                                ) : (
                                    <Button onClick={() => router.push("/start-claim")}>Start New Claim</Button>
                                )}
                            </div>

                            {/* Claims View */}
                            {activeSection === "claims" && (
                                <>
                                    {isLoading ? (
                                        <LoadingSkeleton />
                                    ) : isError ? (
                                        <div className="text-center py-10">
                                            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                                            <p className="text-sm text-gray-500 mt-4">
                                                {error instanceof Error ? error.message : "Error loading claims"}
                                            </p>
                                            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["getClaims"] })}>
                                                Try again
                                            </Button>
                                        </div>
                                    ) : claims.length === 0 ? (
                                        <EmptyState
                                            icon={FileText}
                                            title="No Claims Found"
                                            description="Start a claim to begin restoration."
                                            actionLabel="Start New Claim"
                                            onAction={() => router.push("/start-claim")}
                                        />
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {claims.map((claim: Claim) => (
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
                                                    insuranceProvider={claim.insuranceProvider}
                                                    createdAt={claim.createdAt}
                                                    updatedAt={claim.updatedAt}
                                                    onViewDetails={() => router.push(`/claim/${claim.id}`)}
                                                    onDelete={() => deleteClaimMutation.mutate(claim)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Auctions View */}
                            {activeSection === "auctions" && (
                                <>
                                    {auctionLoading ? (
                                        <LoadingSkeleton />
                                    ) : auctions.length === 0 ? (
                                        <EmptyState
                                            icon={Users}
                                            title="No Active Auctions"
                                            description="Start a claim to create an auction."
                                            actionLabel="Start New Claim"
                                            onAction={() => router.push("/start-claim")}
                                        />
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {auctions.map((a) => (
                                                <AuctionCard
                                                    key={a.auction_id}
                                                    title={a.title}
                                                    scope={a.project_type}
                                                    finalBid={a.current_bid}
                                                    totalBids={a.bid_count}
                                                    endedAt={a.end_date}
                                                    status="open"
                                                    onViewDetails={() => router.push(`/auction/${a.auction_id}`)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Delete closed auction dialog */}
            <AlertDialog open={showClosedAuctionDeleteConfirmation} onOpenChange={setShowClosedAuctionDeleteConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Closed Auction</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


