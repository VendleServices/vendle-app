"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Upload,
  DollarSign,
  CheckCircle,
  Wrench,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/auth/client";
import { useApiService } from "@/services/api";

interface RestoreFormData {
  insuranceEstimatePdf: string | null | undefined;
  needs3rdPartyAdjuster: boolean;
  costBasis: "RCV" | "ACV" | "";
  overheadAndProfit: string;
  salesTaxes: string;
  materials: string;
  depreciation: string;
  hasDeductibleFunds: boolean;
  fundingSource: "FEMA" | "Insurance" | "SBA" | "";
  totalJobValue: string;
  reconstructionType: string;
  additionalNotes: string;
}

export default function CreateRestorPage() {
  const apiService = useApiService();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [claimId, setClaimId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RestoreFormData>({
    insuranceEstimatePdf: "",
    needs3rdPartyAdjuster: false,
    costBasis: "",
    overheadAndProfit: "",
    salesTaxes: "",
    materials: "",
    depreciation: "",
    hasDeductibleFunds: false,
    fundingSource: "",
    totalJobValue: "",
    reconstructionType: "",
    additionalNotes: "",
  });

  useEffect(() => {
    const id = params.claimId as string;
    if (!id) {
      toast("Error", {
        description: "No claim ID provided",
      });
      router.push("/home");
      return;
    }
    setClaimId(id);
  }, [params.claimId, router]);

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  const handleInputChange = (field: keyof RestoreFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    if (file.type !== "application/pdf") {
      toast("Invalid File Type", {
        description: "Please upload a PDF file",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast("File too large", {
        description: "Max size: 10MB",
      });
      return;
    }

    setUploadedFile(file);

    try {
      const timestamp = Date.now();
      const { data, error } = await supabase.storage
          .from("vendle-estimates")
          .upload(`public/${timestamp}-${file.name}`, file);

      if (error) throw error;

      setFormData((prev) => ({
        ...prev,
        insuranceEstimatePdf: data?.fullPath,
      }));
    } catch (error: any) {
      toast("Upload failed", { description: error.message });
    }
  };

  const handleSubmit = async () => {
    if (!claimId) return;

    setIsSubmitting(true);

    try {
      const calculatedTotal =
          formData.totalJobValue ||
          (
              parseFloat(formData.materials || "0") +
              parseFloat(formData.overheadAndProfit || "0") +
              parseFloat(formData.salesTaxes || "0") -
              parseFloat(formData.depreciation || "0")
          ).toString();

      const payload = {
        claim_id: claimId,
        title: `Restoration Job - ${formData.reconstructionType}`,
        description: formData.additionalNotes,
        starting_bid: parseFloat(calculatedTotal),
        total_job_value: parseFloat(calculatedTotal),
        overhead_and_profit: parseFloat(formData.overheadAndProfit || "0"),
        cost_basis: formData.costBasis,
        materials: parseFloat(formData.materials || "0"),
        sales_taxes: parseFloat(formData.salesTaxes || "0"),
        depreciation: parseFloat(formData.depreciation || "0"),
        reconstruction_type: formData.reconstructionType,
        needs_3rd_party_adjuster: formData.needs3rdPartyAdjuster,
        has_deductible_funds: formData.hasDeductibleFunds,
        funding_source: formData.fundingSource,
        insuranceEstimatePdf: formData.insuranceEstimatePdf,
        auction_end_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        userId: user?.id,
      };

      await apiService.postWithFile("/api/auctions", payload, uploadedFile);

      toast("Success!", {
        description: "Contractors will now be notified.",
      });

      router.push("/home");
    } catch (error) {
      console.error(error);
      toast("Error", { description: "Failed to create restoration job" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex min-h-screen w-full bg-muted/30"
      >
        <main className="flex-1 px-14 py-14">
          <div className="max-w-5xl mx-auto space-y-14">
            <div>
              <h1 className="text-4xl font-bold mb-1 tracking-tight text-foreground">
                Create Restoration Job
              </h1>
              <p className="text-muted-foreground text-lg">
                Help contractors understand your project clearly — fill out the details
                below.
              </p>
            </div>

            {/* Insurance Estimate */}
            <Card className="rounded-2xl border-border shadow-md bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl font-semibold">
                    Insurance Estimate
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your insurance estimate PDF.
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <Label className="font-medium">Estimate PDF</Label>

                <div className="relative flex items-center justify-center h-36 border-2 border-dashed rounded-xl border-muted-foreground/30 bg-muted/10" onClick={handleClick}>
                  <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={fileInputRef}
                  />
                  {!uploadedFile ? (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-1" />
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                      </div>
                  ) : (
                      <div className="text-green-600 flex items-center gap-2">
                        <CheckCircle />
                        {uploadedFile.name}
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Breakdown */}
            <Card className="rounded-2xl border-border shadow-md bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl font-semibold">
                    Financial Breakdown
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-medium">Cost Basis</Label>
                    <RadioGroup
                        value={formData.costBasis}
                        onValueChange={(v) => handleInputChange("costBasis", v)}
                        className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="rcv" value="RCV" />
                        <Label htmlFor="rcv">Replacement Cost Value (RCV)</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="acv" value="ACV" />
                        <Label htmlFor="acv">Actual Cash Value (ACV)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-medium">Deductible</Label>
                    <RadioGroup
                        value={formData.hasDeductibleFunds.toString()}
                        onValueChange={(v) =>
                            handleInputChange("hasDeductibleFunds", v === "true")
                        }
                        className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="fund-yes" value="true" />
                        <Label htmlFor="fund-yes">I have deductible funds</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="fund-no" value="false" />
                        <Label htmlFor="fund-no">Need additional funding</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {!formData.hasDeductibleFunds && (
                      <div className="ml-4 mt-2 border-l pl-4 space-y-2">
                        <RadioGroup
                            value={formData.fundingSource}
                            onValueChange={(v) => handleInputChange("fundingSource", v)}
                        >
                          {["FEMA", "Insurance", "SBA"].map((src) => (
                              <div key={src} className="flex items-center gap-2">
                                <RadioGroupItem id={src} value={src} />
                                <Label htmlFor={src}>{src} Assistance</Label>
                              </div>
                          ))}
                        </RadioGroup>
                      </div>
                  )}
                </div>

                <div className="space-y-4">
                  {[
                    ["materials", "Materials Cost ($)"],
                    ["overheadAndProfit", "Overhead & Profit ($)"],
                    ["salesTaxes", "Sales Taxes ($)"],
                    ["depreciation", "Depreciation ($)"],
                  ].map(([key, label]) => (
                      <div key={key} className="space-y-1.5">
                        <Label className="font-medium">{label}</Label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={(formData as any)[key]}
                            onChange={(e) =>
                                handleInputChange(key as any, e.target.value)
                            }
                        />
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="rounded-2xl border-border shadow-md bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl font-semibold">
                    Job Posting Details
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <Label className="font-medium">Total Job Value ($)</Label>
                  <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.totalJobValue}
                      onChange={(e) =>
                          handleInputChange("totalJobValue", e.target.value)
                      }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Reconstruction Type</Label>
                  <Input
                      placeholder="e.g. Fire damage restoration"
                      value={formData.reconstructionType}
                      onChange={(e) =>
                          handleInputChange("reconstructionType", e.target.value)
                      }
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="font-medium">Additional Notes</Label>
                  <Textarea
                      placeholder="Add any relevant details..."
                      className="min-h-[120px]"
                      value={formData.additionalNotes}
                      onChange={(e) =>
                          handleInputChange("additionalNotes", e.target.value)
                      }
                  />
                </div>
              </CardContent>

              <div className="p-6 flex justify-end">
                <Button
                    className="h-12 text-base font-semibold px-10"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting..." : "Create Job & Notify Contractors"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </motion.div>
  );
}