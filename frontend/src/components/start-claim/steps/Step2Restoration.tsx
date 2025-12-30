"use client";

import { FileText, DollarSign, Wrench } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FileUpload } from "../uploads/FileUpload";

interface RestorationFormData {
    title: string;
    totalJobValue: string;
    overheadAndProfit: string;
    costBasis: string;
    materials: string;
    salesTaxes: string;
    depreciation: string;
    reconstructionType: string;
    hasDeductibleFunds: boolean;
    fundingSource: string;
    additionalNotes: string;
}

interface Step2RestorationProps {
    formData: RestorationFormData;
    onFormChange: (field: keyof RestorationFormData, value: any) => void;
    uploadedFile: File | null;
    onFileUpload: (file: File) => void;
    onFileRemove: () => void;
}

export function Step2Restoration({
    formData,
    onFormChange,
    uploadedFile,
    onFileUpload,
    onFileRemove
}: Step2RestorationProps) {
    return (
        <div className="space-y-6">
            <Accordion type="single" collapsible defaultValue="estimate" className="space-y-4">
                {/* Section 1: Insurance Estimate Upload */}
                <AccordionItem value="estimate" className="border-2 border-vendle-gray/30 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 lg:px-8 py-6 hover:bg-vendle-blue/5 [&[data-state=open]]:bg-vendle-blue/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-vendle-blue/10 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-vendle-blue" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg lg:text-xl font-bold text-foreground">Insurance Estimate</h3>
                                <p className="text-sm text-muted-foreground">Upload your PDF estimate</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 lg:px-8 pt-6 pb-8">
                        <FileUpload
                            file={uploadedFile}
                            onUpload={onFileUpload}
                            onRemove={onFileRemove}
                            accept=".pdf"
                            maxSize={10}
                        />
                    </AccordionContent>
                </AccordionItem>

                {/* Section 2: Financial Breakdown */}
                <AccordionItem value="financial" className="border-2 border-vendle-gray/30 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 lg:px-8 py-6 hover:bg-vendle-blue/5 [&[data-state=open]]:bg-vendle-blue/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-vendle-teal/10 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-vendle-teal" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg lg:text-xl font-bold text-foreground">Financial Breakdown</h3>
                                <p className="text-sm text-muted-foreground">Cost details and funding information</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 lg:px-8 pt-6 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left column: Radio selections */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">Cost Basis</Label>
                                    <RadioGroup
                                        value={formData.costBasis}
                                        onValueChange={(v) => onFormChange("costBasis", v)}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem id="rcv" value="RCV" />
                                            <Label htmlFor="rcv" className="font-normal cursor-pointer flex-1">
                                                Replacement Cost Value (RCV)
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem id="acv" value="ACV" />
                                            <Label htmlFor="acv" className="font-normal cursor-pointer flex-1">
                                                Actual Cash Value (ACV)
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">Deductible</Label>
                                    <RadioGroup
                                        value={formData.hasDeductibleFunds.toString()}
                                        onValueChange={(v) => onFormChange("hasDeductibleFunds", v === "true")}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem id="fund-yes" value="true" />
                                            <Label htmlFor="fund-yes" className="font-normal cursor-pointer flex-1">
                                                I have deductible funds
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem id="fund-no" value="false" />
                                            <Label htmlFor="fund-no" className="font-normal cursor-pointer flex-1">
                                                Need additional funding
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {!formData.hasDeductibleFunds && (
                                        <div className="ml-6 mt-3 pl-4 border-l-2 border-vendle-blue/30 space-y-2">
                                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Funding Source
                                            </Label>
                                            <RadioGroup
                                                value={formData.fundingSource}
                                                onValueChange={(v) => onFormChange("fundingSource", v)}
                                                className="space-y-2"
                                            >
                                                {["FEMA", "Insurance", "SBA"].map((src) => (
                                                    <div key={src} className="flex items-center gap-2">
                                                        <RadioGroupItem id={`funding-${src}`} value={src} />
                                                        <Label htmlFor={`funding-${src}`} className="font-normal cursor-pointer text-sm">
                                                            {src} Assistance
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right column: Input fields */}
                            <div className="space-y-4">
                                {[
                                    { key: "materials", label: "Materials Cost" },
                                    { key: "overheadAndProfit", label: "Overhead & Profit" },
                                    { key: "salesTaxes", label: "Sales Taxes" },
                                    { key: "depreciation", label: "Depreciation" },
                                ].map(({ key, label }) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground">{label}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={(formData as any)[key]}
                                                onChange={(e) => onFormChange(key as any, e.target.value)}
                                                className="h-12 pl-7 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Section 3: Job Posting Details */}
                <AccordionItem value="posting" className="border-2 border-vendle-gray/30 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 lg:px-8 py-6 hover:bg-vendle-blue/5 [&[data-state=open]]:bg-vendle-blue/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-vendle-sand/20 flex items-center justify-center">
                                <Wrench className="w-6 h-6 text-vendle-navy" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg lg:text-xl font-bold text-foreground">Job Posting Details</h3>
                                <p className="text-sm text-muted-foreground">Project information for contractors</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 lg:px-8 pt-6 pb-8">
                        <div className="space-y-6">
                            {/* Title - full width */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Job Title</Label>
                                <Input
                                    placeholder="Give your job a descriptive title..."
                                    value={formData.title}
                                    onChange={(e) => onFormChange("title", e.target.value)}
                                    className="h-12 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                                />
                            </div>

                            {/* Two column grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">Total Job Value</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.totalJobValue}
                                            onChange={(e) => onFormChange("totalJobValue", e.target.value)}
                                            className="h-12 pl-7 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">Reconstruction Type</Label>
                                    <Input
                                        placeholder="e.g., Fire damage restoration"
                                        value={formData.reconstructionType}
                                        onChange={(e) => onFormChange("reconstructionType", e.target.value)}
                                        className="h-12 border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Additional Notes - full width */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Additional Notes</Label>
                                <Textarea
                                    placeholder="Add any relevant details about the project..."
                                    value={formData.additionalNotes}
                                    onChange={(e) => onFormChange("additionalNotes", e.target.value)}
                                    className="min-h-[120px] border-2 border-vendle-gray/30 focus:border-vendle-blue focus:ring-4 focus:ring-vendle-blue/20 rounded-xl resize-none"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
