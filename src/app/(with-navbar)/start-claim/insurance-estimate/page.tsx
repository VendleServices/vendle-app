"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, DollarSign, Calculator, Package, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function InsuranceEstimatePage() {
    const router = useRouter();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [claimType, setClaimType] = useState<string>("");
    const [adjusterType, setAdjusterType] = useState<string>("");
    const [formData, setFormData] = useState({
        rcv: "",
        acv: "",
        op: "",
        salesTaxes: "",
        materials: "",
        depreciation: ""
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setUploadedFile(file);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContinue = () => {
        router.push("/start-claim/due-diligence");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start justify-center p-4 mt-8"
        >
            <Card className="w-[80vw] min-w-[50rem] max-w-[70rem] bg-white">
                <div className="p-12">
                    <CardHeader className="pb-8">
                        <CardTitle className="text-4xl font-bold text-center text-vendle-navy">
                            Insurance Estimate Verification
                        </CardTitle>
                        <p className="text-center text-lg text-gray-600 mt-4">
                            Let's verify your insurance claim details
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-8">
                        {/* PDF Upload Section */}
                        <div className="space-y-4">
                            <Label className="text-xl font-semibold text-vendle-navy flex items-center gap-2">
                                <Upload className="h-6 w-6" />
                                Upload Insurance Estimate PDF
                            </Label>
                            <div className="border-2 border-dashed border-vendle-blue/30 rounded-lg p-8 text-center hover:border-vendle-blue/50 transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    <FileText className="h-12 w-12 text-vendle-blue mx-auto mb-4" />
                                    <p className="text-lg text-vendle-navy mb-2">
                                        {uploadedFile ? uploadedFile.name : "Click to upload PDF estimate"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {uploadedFile ? "File uploaded successfully" : "Drag and drop or click to browse"}
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* 3rd Party Adjuster Section */}
                        <div className="space-y-4">
                            <Label className="text-xl font-semibold text-vendle-navy">
                                Is this a 3rd Party Adjuster?
                            </Label>
                            <RadioGroup value={adjusterType} onValueChange={setAdjusterType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="adjuster-yes" />
                                    <Label htmlFor="adjuster-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="adjuster-no" />
                                    <Label htmlFor="adjuster-no">No</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Claim Type Section */}
                        <div className="space-y-4">
                            <Label className="text-xl font-semibold text-vendle-navy">
                                What type of claim is this?
                            </Label>
                            <RadioGroup value={claimType} onValueChange={setClaimType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="rcv" id="rcv" />
                                    <Label htmlFor="rcv">Replacement Cost Value (RCV)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="acv" id="acv" />
                                    <Label htmlFor="acv">Actual Cash Value (ACV)</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Financial Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* RCV */}
                            <div className="space-y-2">
                                <Label className="text-lg flex items-center gap-2" htmlFor="rcv">
                                    <DollarSign className="h-5 w-5" />
                                    Replacement Cost Value (RCV)
                                </Label>
                                <Input
                                    id="rcv"
                                    type="number"
                                    placeholder="$0.00"
                                    value={formData.rcv}
                                    onChange={(e) => handleInputChange("rcv", e.target.value)}
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                />
                            </div>

                            {/* ACV */}
                            <div className="space-y-2">
                                <Label className="text-lg flex items-center gap-2" htmlFor="acv">
                                    <DollarSign className="h-5 w-5" />
                                    Actual Cash Value (ACV)
                                </Label>
                                <Input
                                    id="acv"
                                    type="number"
                                    placeholder="$0.00"
                                    value={formData.acv}
                                    onChange={(e) => handleInputChange("acv", e.target.value)}
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                />
                            </div>

                            {/* O&P */}
                            <div className="space-y-2">
                                <Label className="text-lg flex items-center gap-2" htmlFor="op">
                                    <Calculator className="h-5 w-5" />
                                    Overhead & Profit (O&P)
                                </Label>
                                <Input
                                    id="op"
                                    type="number"
                                    placeholder="$0.00"
                                    value={formData.op}
                                    onChange={(e) => handleInputChange("op", e.target.value)}
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                />
                            </div>

                            {/* Sales Taxes */}
                            <div className="space-y-2">
                                <Label className="text-lg flex items-center gap-2" htmlFor="salesTaxes">
                                    <Calculator className="h-5 w-5" />
                                    Sales Taxes (Materials)
                                </Label>
                                <Input
                                    id="salesTaxes"
                                    type="number"
                                    placeholder="$0.00"
                                    value={formData.salesTaxes}
                                    onChange={(e) => handleInputChange("salesTaxes", e.target.value)}
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                />
                            </div>

                            {/* Materials */}
                            <div className="space-y-2">
                                <Label className="text-lg flex items-center gap-2" htmlFor="materials">
                                    <Package className="h-5 w-5" />
                                    Materials
                                </Label>
                                <Input
                                    id="materials"
                                    type="number"
                                    placeholder="$0.00"
                                    value={formData.materials}
                                    onChange={(e) => handleInputChange("materials", e.target.value)}
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                />
                            </div>

                            {/* Depreciation */}
                            <div className="space-y-2">
                                <Label className="text-lg flex items-center gap-2" htmlFor="depreciation">
                                    <TrendingDown className="h-5 w-5" />
                                    Depreciation
                                </Label>
                                <Input
                                    id="depreciation"
                                    type="number"
                                    placeholder="$0.00"
                                    value={formData.depreciation}
                                    onChange={(e) => handleInputChange("depreciation", e.target.value)}
                                    className="h-12 text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                />
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2">
                            <Label className="text-lg" htmlFor="notes">
                                Additional Notes or Comments
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Any additional information about your insurance estimate..."
                                className="min-h-[100px] text-lg border-2 border-vendle-blue/20 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                            />
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
                                className="px-12 py-6 bg-vendle-navy text-white hover:bg-vendle-navy/90 text-xl"
                            >
                                Continue
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
} 