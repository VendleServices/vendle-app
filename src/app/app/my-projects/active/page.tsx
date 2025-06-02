"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ActiveAuctionsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        className="mr-4"
                        onClick={() => router.push("/app/my-projects")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Active Auctions</h1>
                </div>
                
                {/* Add your active auctions content here */}
            </div>
        </div>
    );
} 