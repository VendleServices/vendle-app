"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    FileText, 
    Eye, 
    Download, 
    Shield, 
    UserCheck, 
    Calendar,
    Building2
} from "lucide-react";
import { motion } from "framer-motion";

export default function NDAPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        contractorName: "",
        companyName: "",
        licenseNumber: "",
        email: "",
        phone: "",
        signature: "",
        date: new Date().toISOString().split('T')[0]
    });
    const [agreedToNDA, setAgreedToNDA] = useState(false);
    const [hasThirdPartyAdjuster, setHasThirdPartyAdjuster] = useState(true); // This would come from previous page

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContinue = () => {
        if (!agreedToNDA) {
            alert("You must agree to the NDA to continue.");
            return;
        }
        // Here you would typically save the NDA data and navigate to the next step
        router.push("/dashboard");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start justify-center p-4 mt-16"
        >
            <Card className="w-[85vw] min-w-[55rem] max-w-[75rem] bg-white">
                <div className="p-12">
                    <CardHeader className="pb-8">
                        <CardTitle className="text-4xl font-bold text-center text-vendle-navy">
                            Non-Disclosure Agreement
                        </CardTitle>
                        <p className="text-center text-lg text-gray-600 mt-4">
                            Sign a NDA for every job as form on the website for all verified contractors
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-8">
                        {/* PDF Viewing Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Insurance Estimate PDF */}
                            <div className="space-y-4">
                                <Label className="text-xl font-semibold text-vendle-navy flex items-center gap-2">
                                    <FileText className="h-6 w-6" />
                                    Insurance Estimate PDF
                                </Label>
                                <div className="border-2 border-vendle-blue/30 rounded-lg p-6 bg-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-8 w-8 text-vendle-blue" />
                                            <span className="font-medium">insurance_estimate.pdf</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <Download className="h-4 w-4" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Uploaded insurance estimate document for review
                                    </p>
                                </div>
                            </div>

                            {/* 3rd Party Adjuster PDF (Conditional) */}
                            {hasThirdPartyAdjuster && (
                                <div className="space-y-4">
                                    <Label className="text-xl font-semibold text-vendle-navy flex items-center gap-2">
                                        <FileText className="h-6 w-6" />
                                        3rd Party Adjuster PDF
                                    </Label>
                                    <div className="border-2 border-vendle-blue/30 rounded-lg p-6 bg-gray-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-8 w-8 text-vendle-blue" />
                                                <span className="font-medium">third_party_adjuster.pdf</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Third-party adjuster documentation
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NDA Content */}
                        <div className="space-y-4">
                            <Label className="text-xl font-semibold text-vendle-navy flex items-center gap-2">
                                <Shield className="h-6 w-6" />
                                Non-Disclosure Agreement
                            </Label>
                            <div className="border-2 border-vendle-blue/20 rounded-lg p-6 bg-vendle-blue/5 max-h-64 overflow-y-auto">
                                <div className="space-y-4 text-sm text-vendle-navy">
                                    <p className="font-semibold">CONFIDENTIALITY AGREEMENT</p>
                                    
                                    <p>This Non-Disclosure Agreement ("Agreement") is entered into as of {formData.date} by and between:</p>
                                    
                                    <p><strong>Vendle Recovery Hub</strong> ("Disclosing Party") and the undersigned contractor ("Receiving Party").</p>
                                    
                                    <p><strong>1. CONFIDENTIAL INFORMATION</strong></p>
                                    <p>The Receiving Party acknowledges that they may receive confidential information including but not limited to:</p>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li>Insurance claim details and estimates</li>
                                        <li>Property damage assessments</li>
                                        <li>Customer personal information</li>
                                        <li>Project specifications and requirements</li>
                                        <li>Financial and pricing information</li>
                                    </ul>
                                    
                                    <p><strong>2. NON-DISCLOSURE OBLIGATIONS</strong></p>
                                    <p>The Receiving Party agrees to:</p>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li>Maintain strict confidentiality of all information received</li>
                                        <li>Use the information solely for the purpose of providing restoration services</li>
                                        <li>Not disclose information to any third party without written consent</li>
                                        <li>Return or destroy all confidential materials upon project completion</li>
                                    </ul>
                                    
                                    <p><strong>3. TERM</strong></p>
                                    <p>This Agreement shall remain in effect for a period of 5 years from the date of execution.</p>
                                    
                                    <p><strong>4. REMEDIES</strong></p>
                                    <p>Violation of this Agreement may result in legal action and damages.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contractor Information Form */}
                        <div className="space-y-6">
                            <Label className="text-xl font-semibold text-vendle-navy flex items-center gap-2">
                                <UserCheck className="h-6 w-6" />
                                Contractor Information
                            </Label>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="contractorName">
                                        Contractor Name
                                    </Label>
                                    <Input
                                        id="contractorName"
                                        value={formData.contractorName}
                                        onChange={(e) => handleInputChange("contractorName", e.target.value)}
                                        className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="companyName">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                        className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                        placeholder="Enter your company name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="licenseNumber">
                                        License Number
                                    </Label>
                                    <Input
                                        id="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                        className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                        placeholder="Enter your license number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="email">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="phone">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-lg flex items-center gap-2" htmlFor="date">
                                        <Calendar className="h-5 w-5" />
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleInputChange("date", e.target.value)}
                                        className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                    />
                                </div>
                            </div>

                            {/* Digital Signature */}
                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="signature">
                                    Digital Signature
                                </Label>
                                <Input
                                    id="signature"
                                    value={formData.signature}
                                    onChange={(e) => handleInputChange("signature", e.target.value)}
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                    placeholder="Type your full name as digital signature"
                                />
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="flex items-center space-x-3 p-4 bg-vendle-blue/5 rounded-lg">
                            <Checkbox
                                id="nda-agreement"
                                checked={agreedToNDA}
                                onCheckedChange={(checked) => setAgreedToNDA(checked as boolean)}
                            />
                            <Label htmlFor="nda-agreement" className="text-lg">
                                I have read, understood, and agree to the terms of this Non-Disclosure Agreement. 
                                I acknowledge that I am legally bound by these terms and conditions.
                            </Label>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center space-x-6 pt-8">
                            <Button
                                onClick={() => router.back()}
                                className="px-12 py-6 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xl"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={!agreedToNDA}
                                className="px-12 py-6 bg-vendle-navy text-white hover:bg-vendle-navy/90 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sign & Continue
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
} 