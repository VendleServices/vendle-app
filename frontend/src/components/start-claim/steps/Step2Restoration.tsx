"use client";

import { FileText, DollarSign, Wrench, ChevronDown } from "lucide-react";
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
        <div className="space-y-3">
            <Accordion type="single" collapsible defaultValue="estimate" className="space-y-2">
                {/* Section 1: Insurance Estimate Upload */}
                <AccordionItem value="estimate" className="border border-gray-200 rounded overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Insurance Estimate</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 border-t border-gray-100">
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
                <AccordionItem value="financial" className="border border-gray-200 rounded overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Financial Breakdown</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left column: Radio selections */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-600">Cost Basis</Label>
                                    <RadioGroup
                                        value={formData.costBasis}
                                        onValueChange={(v) => onFormChange("costBasis", v)}
                                        className="space-y-1"
                                    >
                                        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                                            <RadioGroupItem id="rcv" value="RCV" className="h-3.5 w-3.5" />
                                            <Label htmlFor="rcv" className="text-sm font-normal cursor-pointer">
                                                Replacement Cost Value (RCV)
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                                            <RadioGroupItem id="acv" value="ACV" className="h-3.5 w-3.5" />
                                            <Label htmlFor="acv" className="text-sm font-normal cursor-pointer">
                                                Actual Cash Value (ACV)
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-600">Deductible</Label>
                                    <RadioGroup
                                        value={formData.hasDeductibleFunds.toString()}
                                        onValueChange={(v) => onFormChange("hasDeductibleFunds", v === "true")}
                                        className="space-y-1"
                                    >
                                        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                                            <RadioGroupItem id="fund-yes" value="true" className="h-3.5 w-3.5" />
                                            <Label htmlFor="fund-yes" className="text-sm font-normal cursor-pointer">
                                                I have deductible funds
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                                            <RadioGroupItem id="fund-no" value="false" className="h-3.5 w-3.5" />
                                            <Label htmlFor="fund-no" className="text-sm font-normal cursor-pointer">
                                                Need additional funding
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {!formData.hasDeductibleFunds && (
                                        <div className="ml-4 mt-2 pl-3 border-l border-gray-200 space-y-1">
                                            <Label className="text-[10px] font-medium text-gray-500 uppercase">
                                                Funding Source
                                            </Label>
                                            <RadioGroup
                                                value={formData.fundingSource}
                                                onValueChange={(v) => onFormChange("fundingSource", v)}
                                                className="space-y-1"
                                            >
                                                {["FEMA", "Insurance", "SBA"].map((src) => (
                                                    <div key={src} className="flex items-center gap-2">
                                                        <RadioGroupItem id={`funding-${src}`} value={src} className="h-3 w-3" />
                                                        <Label htmlFor={`funding-${src}`} className="text-xs font-normal cursor-pointer">
                                                            {src}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right column: Input fields */}
                            <div className="space-y-3">
                                {[
                                    { key: "materials", label: "Materials" },
                                    { key: "overheadAndProfit", label: "Overhead & Profit" },
                                    { key: "salesTaxes", label: "Sales Taxes" },
                                    { key: "depreciation", label: "Depreciation" },
                                ].map(({ key, label }) => (
                                    <div key={key}>
                                        <Label className="text-xs font-medium text-gray-600 mb-1 block">{label}</Label>
                                        <div className="relative">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={(formData as any)[key]}
                                                onChange={(e) => onFormChange(key as any, e.target.value)}
                                                className="h-8 pl-6 text-sm rounded border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Section 3: Job Posting Details */}
                <AccordionItem value="posting" className="border border-gray-200 rounded overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Wrench className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Job Posting Details</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 border-t border-gray-100">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Job Title</Label>
                                <Input
                                    placeholder="Give your job a descriptive title..."
                                    value={formData.title}
                                    onChange={(e) => onFormChange("title", e.target.value)}
                                    className="h-9 text-sm rounded border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Total Job Value</Label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.totalJobValue}
                                            onChange={(e) => onFormChange("totalJobValue", e.target.value)}
                                            className="h-9 pl-6 text-sm rounded border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Reconstruction Type</Label>
                                    <Input
                                        placeholder="e.g., Fire damage restoration"
                                        value={formData.reconstructionType}
                                        onChange={(e) => onFormChange("reconstructionType", e.target.value)}
                                        className="h-9 text-sm rounded border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Additional Notes</Label>
                                <Textarea
                                    placeholder="Add any relevant details about the project..."
                                    value={formData.additionalNotes}
                                    onChange={(e) => onFormChange("additionalNotes", e.target.value)}
                                    className="min-h-[80px] text-sm rounded border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200 resize-none"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
