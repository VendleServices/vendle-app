"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InsuranceProviderPage() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center p-4">
            <Card className="w-[70vw] min-w-[40rem] max-w-[60rem] bg-white">
                <div className="p-12">
                    <CardHeader className="pb-8">
                        <CardTitle className="text-4xl font-bold text-center text-vendle-navy">
                            Insurance Provider Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="providerName">
                                    Insurance Provider Name
                                </Label>
                                <Input
                                    id="providerName"
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                    placeholder="Enter your insurance provider name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="policyNumber">
                                    Policy Number
                                </Label>
                                <Input
                                    id="policyNumber"
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                    placeholder="Enter your policy number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="claimNumber">
                                    Claim Number (if available)
                                </Label>
                                <Input
                                    id="claimNumber"
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                    placeholder="Enter your claim number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="phoneNumber">
                                    Provider Phone Number
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                    placeholder="Enter provider phone number"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center space-x-6 pt-8">
                            <Button
                                onClick={() => navigate(-1)}
                                className="px-12 py-6 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xl"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => navigate("/start-claim/inspection")}
                                className="px-12 py-6 bg-vendle-navy text-white hover:bg-vendle-navy/90 text-xl"
                            >
                                Continue
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
} 