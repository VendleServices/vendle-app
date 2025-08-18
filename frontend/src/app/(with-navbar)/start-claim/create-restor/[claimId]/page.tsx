"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, FileText, Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Building, MapPin, Wrench } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/auth/client";

interface RestoreFormData {
  // Step 1: Insurance Estimate
  insuranceEstimatePdf: File | null;
  
  // Step 2: Insurance Claim Verification
  needs3rdPartyAdjuster: boolean;
  
  // Step 3: Cost Basis
  costBasis: 'RCV' | 'ACV' | '';
  
  // Step 4: Financial Details
  overheadAndProfit: string;
  salesTaxes: string;
  materials: string;
  depreciation: string;
  
  // Step 5: Deductible Coverage
  hasDeductibleFunds: boolean;
  fundingSource: 'FEMA' | 'Insurance' | 'SBA' | '';
  
  // Step 6: Job Details
  totalJobValue: string;
  reconstructionType: string;
  additionalNotes: string;
}

export default function CreateRestorPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [claimId, setClaimId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState<RestoreFormData>({
    insuranceEstimatePdf: null,
    needs3rdPartyAdjuster: false,
    costBasis: '',
    overheadAndProfit: '',
    salesTaxes: '',
    materials: '',
    depreciation: '',
    hasDeductibleFunds: false,
    fundingSource: '',
    totalJobValue: '',
    reconstructionType: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const id = params.claimId as string;
    if (!id) {
      toast({
        title: "Error",
        description: "No claim ID provided",
        variant: "destructive",
        duration: 5000,
      });
      router.push('/my-projects');
      return;
    }
    setClaimId(id);
  }, [params.claimId, router, toast]);

  const getProjectsPath = () => {
    if (!user) return '/my-projects';
    return user.user_type === 'contractor' ? '/contractor-projects' : '/my-projects';
  };

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        insuranceEstimatePdf: e.target.files![0]
      }));

      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB max
        toast({
          title: "File Too Large",
          description: "File size should be less than 10MB.",
          variant: "destructive"
        });
        return;
      }

      try {
        const timestamp = Date.now();
        const { data, error } = await supabase.storage.from("vendle-estimates").upload(`public/${timestamp}-${file.name}`, file);

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload Failed",
            description: error.message || "There was an error uploading your file.",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleInputChange = (field: keyof RestoreFormData, value: never) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!claimId) {
      toast({
        title: "Error",
        description: "No claim ID available",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate total value if not provided
      const calculatedTotal = formData.totalJobValue || 
        (parseFloat(formData.materials || '0') + 
         parseFloat(formData.overheadAndProfit || '0') + 
         parseFloat(formData.salesTaxes || '0') - 
         parseFloat(formData.depreciation || '0')).toString();

              const response = await fetch('http://localhost:3001/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim_id: claimId,
          title: `Restoration Job - ${formData.reconstructionType}`,
          description: formData.additionalNotes,
          starting_bid: parseFloat(calculatedTotal),
          total_job_value: parseFloat(calculatedTotal),
          overhead_and_profit: parseFloat(formData.overheadAndProfit || '0'),
          cost_basis: formData.costBasis,
          materials: parseFloat(formData.materials || '0'),
          sales_taxes: parseFloat(formData.salesTaxes || '0'),
          depreciation: parseFloat(formData.depreciation || '0'),
          reconstruction_type: formData.reconstructionType,
          needs_3rd_party_adjuster: formData.needs3rdPartyAdjuster,
          has_deductible_funds: formData.hasDeductibleFunds,
          funding_source: formData.fundingSource,
          auction_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          userId: user?.id, // <-- add userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create restoration job');
      }

      toast({
        title: "Success",
        description: "Restoration job created successfully! Contractors in your area will be notified.",
        duration: 5000,
      });
      
      // Trigger refresh of auctions when returning to my-projects
      localStorage.setItem('refreshAuctions', Date.now().toString());
      
      router.push(getProjectsPath() + '?tab=auctions');
    } catch (error) {
      console.error('Error creating restoration job:', error);
      toast({
        title: "Error",
        description: "Failed to create restoration job",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.insuranceEstimatePdf !== null;
      case 2:
        return true; // Always can proceed from adjuster question
      case 3:
        return formData.costBasis !== '';
      case 4:
        return formData.overheadAndProfit && formData.materials;
      case 5:
        return formData.hasDeductibleFunds || formData.fundingSource !== '';
      case 6:
        return formData.reconstructionType && formData.totalJobValue;
      default:
        return false;
    }
  };

  if (!claimId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f172a]"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto text-vendle-navy mb-4" />
              <h2 className="text-2xl font-bold text-vendle-navy mb-2">Insurance Estimate</h2>
              <p className="text-gray-600">Upload your insurance estimate PDF document</p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="insuranceEstimate" className="text-lg">Insurance Estimate PDF</Label>
              <div className="relative">
                <Input
                  id="insuranceEstimate"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-vendle-navy/20 rounded-lg hover:border-vendle-navy/40 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-vendle-navy/70 mb-2" />
                    <p className="text-vendle-navy/70">Click to upload PDF</p>
                    <p className="text-sm text-vendle-navy/50">or drag and drop</p>
                  </div>
                </div>
              </div>
              {formData.insuranceEstimatePdf && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>{formData.insuranceEstimatePdf.name}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="w-16 h-16 mx-auto text-vendle-navy mb-4" />
              <h2 className="text-2xl font-bold text-vendle-navy mb-2">Insurance Claim Verification</h2>
              <p className="text-gray-600">Let's verify your insurance claim details</p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg">Do you need a 3rd Party Adjuster?</Label>
              <RadioGroup
                value={formData.needs3rdPartyAdjuster.toString()}
                onValueChange={(value) => handleInputChange('needs3rdPartyAdjuster', value === 'true')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="adjuster-yes" />
                  <Label htmlFor="adjuster-yes">Yes, I need a 3rd party adjuster</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="adjuster-no" />
                  <Label htmlFor="adjuster-no">No, I'll work directly with my insurance</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="w-16 h-16 mx-auto text-vendle-navy mb-4" />
              <h2 className="text-2xl font-bold text-vendle-navy mb-2">Cost Basis</h2>
              <p className="text-gray-600">What is your insurance claim based on?</p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg">Cost Basis Type</Label>
              <RadioGroup
                value={formData.costBasis}
                onValueChange={(value) => handleInputChange('costBasis', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="RCV" id="rcv" />
                  <Label htmlFor="rcv">
                    <div>
                      <p className="font-medium">Replacement Cost Value (RCV)</p>
                      <p className="text-sm text-gray-500">Full cost to replace damaged property</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ACV" id="acv" />
                  <Label htmlFor="acv">
                    <div>
                      <p className="font-medium">Actual Cash Value (ACV)</p>
                      <p className="text-sm text-gray-500">Replacement cost minus depreciation</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto text-vendle-navy mb-4" />
              <h2 className="text-2xl font-bold text-vendle-navy mb-2">Financial Details</h2>
              <p className="text-gray-600">Provide the financial breakdown of your claim</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="op">Overhead & Profit (O&P)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="op"
                    type="number"
                    placeholder="0.00"
                    value={formData.overheadAndProfit}
                    onChange={(e) => handleInputChange('overheadAndProfit', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salesTax">Sales Taxes (Materials)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="salesTax"
                    type="number"
                    placeholder="0.00"
                    value={formData.salesTaxes}
                    onChange={(e) => handleInputChange('salesTaxes', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="materials">Materials</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="materials"
                    type="number"
                    placeholder="0.00"
                    value={formData.materials}
                    onChange={(e) => handleInputChange('materials', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="depreciation">Depreciation</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="depreciation"
                    type="number"
                    placeholder="0.00"
                    value={formData.depreciation}
                    onChange={(e) => handleInputChange('depreciation', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="w-16 h-16 mx-auto text-vendle-navy mb-4" />
              <h2 className="text-2xl font-bold text-vendle-navy mb-2">Deductible Coverage</h2>
              <p className="text-gray-600">Do you have funds to cover the deductible?</p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg">Deductible Funding</Label>
              <RadioGroup
                value={formData.hasDeductibleFunds.toString()}
                onValueChange={(value) => handleInputChange('hasDeductibleFunds', value === 'true')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="funds-yes" />
                  <Label htmlFor="funds-yes">Yes, I have funds to cover the deductible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="funds-no" />
                  <Label htmlFor="funds-no">No, I need alternative funding</Label>
                </div>
              </RadioGroup>
              
              {!formData.hasDeductibleFunds && (
                <div className="space-y-4 mt-4 p-4 bg-yellow-50 rounded-lg">
                  <Label className="text-base font-medium">Alternative Funding Source</Label>
                  <RadioGroup
                    value={formData.fundingSource}
                    onValueChange={(value) => handleInputChange('fundingSource', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FEMA" id="fema" />
                      <Label htmlFor="fema">FEMA Assistance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Insurance" id="insurance" />
                      <Label htmlFor="insurance">Insurance Advance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SBA" id="sba" />
                      <Label htmlFor="sba">SBA Loan</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-yellow-700">
                    We'll hold the job posting until funds are secured or in process.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Wrench className="w-16 h-16 mx-auto text-vendle-navy mb-4" />
              <h2 className="text-2xl font-bold text-vendle-navy mb-2">Job Posting Details</h2>
              <p className="text-gray-600">Information that contractors will see</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalValue">Total Value of the Job</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="totalValue"
                    type="number"
                    placeholder="0.00"
                    value={formData.totalJobValue}
                    onChange={(e) => handleInputChange('totalJobValue', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reconstructionType">Type of Reconstruction</Label>
                <Input
                  id="reconstructionType"
                  placeholder="e.g., Water damage restoration, Fire damage repair, Storm damage"
                  value={formData.reconstructionType}
                  onChange={(e) => handleInputChange('reconstructionType', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional information for contractors..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Contractors in your state will be notified via email</li>
                <li>• They'll see the job value, O&P, location, and reconstruction type</li>
                <li>• Qualified contractors can submit bids</li>
                <li>• You'll receive notifications about new bids</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 p-4 pt-24"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-3xl font-bold text-vendle-navy">
                Create Restoration Job
              </CardTitle>
              <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-8">
            {renderStep()}
            
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? () => router.push(getProjectsPath()) : handleBack}
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>
              
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceedToNext() || isSubmitting}
                  className="bg-vendle-navy text-white hover:bg-vendle-navy/90"
                >
                  {isSubmitting ? 'Creating Job...' : 'Create Job & Notify Contractors'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className="bg-vendle-navy text-white hover:bg-vendle-navy/90"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
} 