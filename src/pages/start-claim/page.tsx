"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function StartClaimPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSelection = (hasInsurance: boolean) => {
        if (user?.user_type === 'contractor') {
            toast({
                title: "Access Denied",
                description: "Contractors cannot start claims. Please use your regular user account.",
                variant: "destructive"
            });
            return;
        }

        if (hasInsurance) {
            navigate("/start-claim/insurance/onboarding");
        } else {
            navigate("/start-claim/fema");
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <Card className="w-[70vw] min-w-[80rem] bg-gradient-to-r from-vendle-blue to-vendle-navy text-white">
                <div className="flex">
                    <div className="relative w-2/5">
                        <img
                            src="/stock2.jpeg"
                            alt="Insurance claim illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-3/5 p-12">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-6xl font-bold text-center whitespace-nowrap">
                                Start Your Insurance or FEMA Claim
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-6xl font-bold text-center">
                                    Do you have property insurance?
                                </h2>
                                <p className="text-2xl text-center text-white">
                                    Select your answer to begin your claim process
                                </p>
                            </div>
                            
                            <div className="flex justify-center space-x-16">
                                <Button
                                    onClick={() => handleSelection(true)}
                                    className="px-20 py-10 bg-white text-vendle-navy rounded-2xl text-4xl font-semibold hover:bg-vendle-blue/10 transition-colors duration-300 shadow-xl hover:shadow-2xl"
                                >
                                    Yes
                                </Button>
                                <Button
                                    onClick={() => handleSelection(false)}
                                    className="px-20 py-10 bg-white text-vendle-navy rounded-2xl text-4xl font-semibold hover:bg-vendle-blue/10 transition-colors duration-300 shadow-xl hover:shadow-2xl"
                                >
                                    No
                                </Button>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
} 