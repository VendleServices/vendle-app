"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingCard from '@/components/OnboardingCard';
import ProgressBar from '@/components/ProgressBar';
import { useToast } from '@/hooks/use-toast';
import { FadeTransition, SlideUpTransition } from '@/lib/transitions';
import { CheckCircle, Upload, Home, LayoutIcon, Users, FileText, AlertCircle, ArrowRight } from 'lucide-react';

const Onboarding = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  // Onboarding state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Form state for each step
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  
  const [projectType, setProjectType] = useState('');
  const [designPlan, setDesignPlan] = useState('');
  const [hasUploaded, setHasUploaded] = useState(false);
  const [skipUpload, setSkipUpload] = useState(false);
  const [needsAdjuster, setNeedsAdjuster] = useState<boolean | null>(null);
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Validate current step
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: // Address
        return address.street && address.city && address.state && address.zip;
      case 2: // Project Type
        return !!projectType;
      case 3: // Design Plan
        return !!designPlan;
      case 4: // File Upload
        return hasUploaded || skipUpload;
      case 5: // Adjuster Need
        return needsAdjuster !== null;
      default:
        return true;
    }
  };
  
  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const completeOnboarding = async () => {
    try {
      // Prepare claim data
      const claimData = {
        user_id: 1, // Using sample user ID 1
        property_address_street: address.street,
        property_address_city: address.city,
        property_address_state: address.state,
        property_address_zip: address.zip,
        project_type: projectType,
        design_plan: designPlan,
        insurance_estimate_file_path: hasUploaded ? localStorage.getItem("uploadedFileName") : null,
        needs_adjuster: needsAdjuster,
        insurance_provider: insuranceProvider
      };

      console.log('Sending claim data:', JSON.stringify(claimData, null, 2));

      // Save to database
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to save claim');
      }

      const result = await response.json();
      console.log('Claim saved successfully:', result);
      
      // Show success message
    toast({
        title: "Claim Created Successfully",
        description: "Your claim has been saved and is ready for processing.",
        duration: 5000,
    });
    
      // Redirect to the insurance provider page
      router.push('/start-claim/insurance');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save your claim. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Basic validation
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
      
      // For demonstration purposes, we'll create a simulated PDF content
      // In a real implementation, you would use a PDF parsing library like pdf.js
      const simulatedPdfContent = `
        Insurance Estimate
        Property Address: 123 Main St, Anytown, USA
        Claim Number: CLM-2023-78945
        Date of Loss: 10/15/2023
        
        Coverage Summary:
        Dwelling: $450,000
        Other Structures: $45,000
        Personal Property: $225,000
        Loss of Use: $90,000
        
        Estimated Damages:
        Roof Replacement: $28,500
        Structural Repairs: $65,000
        Interior Repairs: $42,000
        Electrical System: $12,500
        Plumbing System: $8,750
        HVAC System: $9,200
        
        Total Estimated Cost: $165,950
        Depreciation: $22,450
        Deductible: $2,500
        
        Net Claim Payment: $141,000
      `;
      
      // Store the extracted text in localStorage for our chatbot to use
      localStorage.setItem("uploadedPdfContent", simulatedPdfContent);
      localStorage.setItem("uploadedFileName", file.name);
      
      // Show success toast
      setTimeout(() => {
        toast({
          title: "File Uploaded",
          description: "Your insurance estimate has been uploaded and processed.",
        });
        setHasUploaded(true);
        setSkipUpload(false);
      }, 1500);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 md:px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-vendle-navy">Vendle</h1>
          <button 
            onClick={() => router.push('/')}
            className="text-sm text-vendle-blue font-medium hover:text-vendle-blue/80 transition-colors"
          >
            Exit Setup
          </button>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 flex justify-center mt-8">
        {/* Step 1: Address Information */}
        <OnboardingCard
          title="Where is your property located?"
          subtitle="Enter the address of the property you're rebuilding"
          isActive={currentStep === 1}
          onNext={nextStep}
          onBack={() => router.push('/auth')}
          isNextDisabled={!isCurrentStepValid()}
          backButtonLabel="Back to Login"
        >
          <FadeTransition>
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-vendle-navy mb-1">
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                  placeholder="123 Main St"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-vendle-navy mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                    placeholder="San Francisco"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-vendle-navy mb-1">
                    State
                  </label>
                  <select
                    id="state"
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                  >
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="CO">Colorado</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-vendle-navy mb-1">
                  ZIP Code
                </label>
                <input
                  id="zip"
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({...address, zip: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                  placeholder="94105"
                  maxLength={5}
                />
              </div>
            </div>
          </FadeTransition>
        </OnboardingCard>
        
        {/* Step 2: Project Type */}
        <OnboardingCard
          title="What type of rebuild do you need?"
          subtitle="Select the option that best describes your project"
          isActive={currentStep === 2}
          onNext={nextStep}
          onBack={prevStep}
          isNextDisabled={!isCurrentStepValid()}
        >
          <FadeTransition>
            <div className="space-y-4">
              <div 
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  projectType === 'full' 
                    ? 'border-vendle-blue bg-vendle-blue/5' 
                    : 'border-gray-200 hover:border-vendle-blue/50'
                }`}
                onClick={() => setProjectType('full')}
              >
                <div className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                    projectType === 'full' ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                  }`}>
                    {projectType === 'full' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-vendle-navy">Full Reconstruction</h3>
                    <p className="text-sm text-vendle-navy/70 mt-1">
                      Complete rebuild of a structure that was severely damaged or destroyed
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  projectType === 'partial' 
                    ? 'border-vendle-blue bg-vendle-blue/5' 
                    : 'border-gray-200 hover:border-vendle-blue/50'
                }`}
                onClick={() => setProjectType('partial')}
              >
                <div className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                    projectType === 'partial' ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                  }`}>
                    {projectType === 'partial' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-vendle-navy">Partial Rebuild</h3>
                    <p className="text-sm text-vendle-navy/70 mt-1">
                      Repair and reconstruction of specific damaged areas of your home
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  projectType === 'new' 
                    ? 'border-vendle-blue bg-vendle-blue/5' 
                    : 'border-gray-200 hover:border-vendle-blue/50'
                }`}
                onClick={() => setProjectType('new')}
              >
                <div className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                    projectType === 'new' ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                  }`}>
                    {projectType === 'new' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-vendle-navy">New Construction</h3>
                    <p className="text-sm text-vendle-navy/70 mt-1">
                      Building a new home on your property, not related to disaster recovery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeTransition>
        </OnboardingCard>
        
        {/* Step 3: Design Plan */}
        <OnboardingCard
          title="How would you like to approach the design?"
          subtitle="Tell us about your design preferences"
          isActive={currentStep === 3}
          onNext={nextStep}
          onBack={prevStep}
          isNextDisabled={!isCurrentStepValid()}
        >
          <FadeTransition>
            <div className="space-y-4">
              <div 
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  designPlan === 'existing' 
                    ? 'border-vendle-blue bg-vendle-blue/5' 
                    : 'border-gray-200 hover:border-vendle-blue/50'
                }`}
                onClick={() => setDesignPlan('existing')}
              >
                <div className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                    designPlan === 'existing' ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                  }`}>
                    {designPlan === 'existing' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-vendle-navy">Use Existing Plan</h3>
                    <p className="text-sm text-vendle-navy/70 mt-1">
                      Rebuild using plans of the original structure
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  designPlan === 'modify' 
                    ? 'border-vendle-blue bg-vendle-blue/5' 
                    : 'border-gray-200 hover:border-vendle-blue/50'
                }`}
                onClick={() => setDesignPlan('modify')}
              >
                <div className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                    designPlan === 'modify' ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                  }`}>
                    {designPlan === 'modify' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-vendle-navy">Modify Existing Plan</h3>
                    <p className="text-sm text-vendle-navy/70 mt-1">
                      Make changes to the original design while rebuilding
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  designPlan === 'custom' 
                    ? 'border-vendle-blue bg-vendle-blue/5' 
                    : 'border-gray-200 hover:border-vendle-blue/50'
                }`}
                onClick={() => setDesignPlan('custom')}
              >
                <div className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                    designPlan === 'custom' ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                  }`}>
                    {designPlan === 'custom' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-vendle-navy">Create New Custom Design</h3>
                    <p className="text-sm text-vendle-navy/70 mt-1">
                      Work with architects to create a completely new design
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeTransition>
        </OnboardingCard>
        
        {/* Step 4: File Upload */}
        <OnboardingCard
          title="Upload your insurance estimate"
          subtitle="This helps contractors provide accurate bids"
          isActive={currentStep === 4}
          onNext={nextStep}
          onBack={prevStep}
          isNextDisabled={!isCurrentStepValid()}
        >
          <FadeTransition>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {hasUploaded ? (
                  <div className="flex flex-col items-center text-vendle-teal">
                    <CheckCircle className="h-12 w-12 mb-3" />
                    <p className="font-medium">File uploaded successfully</p>
                    <p className="text-sm text-vendle-navy/70 mt-1">
                      {localStorage.getItem("uploadedFileName") || "Insurance_Estimate.pdf"}
                    </p>
                    <button 
                      className="mt-4 text-sm text-vendle-blue"
                      onClick={() => setHasUploaded(false)}
                    >
                      Replace file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-vendle-navy/50 mb-3" />
                    <p className="font-medium text-vendle-navy">Drag your file here or click to browse</p>
                    <p className="text-sm text-vendle-navy/70 mt-1">Accepts PDF files up to 10MB</p>
                    
                    <div className="mt-4 flex flex-col items-center">
                      <input
                        type="file"
                        id="insurance-estimate"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label 
                        htmlFor="insurance-estimate" 
                        className="cursor-pointer bg-vendle-blue text-white font-medium px-6 py-2.5 rounded-lg shadow-subtle hover:bg-vendle-blue/90 hover:shadow-medium transition-colors"
                      >
                        Select File
                      </label>
                      
                      <button
                        type="button"
                        className="mt-4 text-sm text-vendle-blue hover:text-vendle-blue/80 transition-colors"
                        onClick={() => {
                          setSkipUpload(true);
                          toast({
                            title: "Upload Skipped",
                            description: "You can upload a file later from your dashboard."
                          });
                        }}
                      >
                        I don't have a file right now
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {skipUpload && !hasUploaded && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    You've chosen to skip the file upload. You can always upload your insurance estimate later from your dashboard.
                  </p>
                </div>
              )}
              
              <div className="bg-vendle-blue/10 rounded-lg p-4 flex items-start">
                <div className="flex-shrink-0 p-1">
                  <AlertCircle className="h-5 w-5 text-vendle-blue" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-vendle-navy">Why is this important?</h4>
                  <p className="text-sm text-vendle-navy/70 mt-1">
                    Your insurance estimate helps contractors understand the scope and value of your project. 
                    It ensures their bids align with your coverage.
                  </p>
                  <p className="text-sm font-medium text-vendle-blue mt-2">
                    We'll also use this document to power an AI assistant that can answer your questions about the estimate.
                  </p>
                </div>
              </div>
            </div>
          </FadeTransition>
        </OnboardingCard>
        
        {/* Step 5: Adjuster Need */}
        <OnboardingCard
          title="Would you like assistance with your claim?"
          subtitle="Our certified adjusters can review your insurance estimate"
          isActive={currentStep === 5}
          onNext={nextStep}
          onBack={prevStep}
          isNextDisabled={!isCurrentStepValid()}
          nextButtonLabel="Complete Setup"
        >
          <FadeTransition>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div 
                  className={`p-5 rounded-lg border-2 transition-all cursor-pointer ${
                    needsAdjuster === true
                      ? 'border-vendle-blue bg-vendle-blue/5' 
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setNeedsAdjuster(true)}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                      needsAdjuster === true ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                    }`}>
                      {needsAdjuster === true ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">Yes, I'd like adjuster assistance</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        Our certified adjusters will review your claim, identify missed items, and negotiate with your insurance company on your behalf.
                      </p>
                      <div className="mt-2 text-vendle-teal text-sm font-medium flex items-center">
                        <span>Learn more</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-5 rounded-lg border-2 transition-all cursor-pointer ${
                    needsAdjuster === false
                      ? 'border-vendle-blue bg-vendle-blue/5' 
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setNeedsAdjuster(false)}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${
                      needsAdjuster === false ? 'bg-vendle-blue text-white' : 'bg-gray-200'
                    }`}>
                      {needsAdjuster === false ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">No, I'll proceed without an adjuster</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        I'm satisfied with my current insurance estimate and would like to proceed directly to contractor selection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {needsAdjuster === false && (
                <SlideUpTransition>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label htmlFor="insurance" className="block text-sm font-medium text-vendle-navy mb-1">
                        Insurance Provider
                      </label>
                      <select
                        id="insurance"
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                      >
                        <option value="">Select Provider</option>
                        <option value="allstate">Allstate</option>
                        <option value="statefarm">State Farm</option>
                        <option value="geico">GEICO</option>
                        <option value="progressive">Progressive</option>
                        <option value="usaa">USAA</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="payment" className="block text-sm font-medium text-vendle-navy mb-1">
                        How will you finance this project?
                      </label>
                      <select
                        id="payment"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-colors"
                      >
                        <option value="">Select Payment Method</option>
                        <option value="insurance">Insurance Claim</option>
                        <option value="cash">Cash/Savings</option>
                        <option value="loan">Home Reconstruction Loan</option>
                        <option value="mixed">Mixed Funding Sources</option>
                      </select>
                    </div>
                  </div>
                </SlideUpTransition>
              )}
            </div>
          </FadeTransition>
        </OnboardingCard>
      </div>
    </div>
  );
};

export default Onboarding;
