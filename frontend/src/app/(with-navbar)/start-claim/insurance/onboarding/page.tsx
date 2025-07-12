"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingCard from '@/components/OnboardingCard';
import ProgressBar from '@/components/ProgressBar';
import { useToast } from '@/hooks/use-toast';
import { FadeTransition, SlideUpTransition } from '@/lib/transitions';
import { CheckCircle, Upload, AlertCircle, ArrowRight, Building2, MapPin, FileText, Users, DollarSign } from 'lucide-react';
import { createClient } from "@/auth/client";
import { useMutation } from "@tanstack/react-query";
import { motion } from 'framer-motion';

const supabase = createClient();

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
  const [uploadedFileName, setUploadedFileName] = useState('');
  
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

  const submitClaimData = async (claimData: any) => {
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      });
    } catch (error) {
      console.log(error);
    }
  }

  const submitClaimMutation = useMutation({
    mutationFn: submitClaimData,
    onSuccess: () => {
      toast({
        title: "Claim Created Successfully",
        description: "Your claim has been saved and is ready for processing.",
        duration: 5000,
      });

      router.push('/start-claim/insurance');
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const completeOnboarding = () => {
    try {
      // Prepare claim data
      const claimData = {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zip,
        projectType,
        designPlan,
        insuranceEstimateFilePath: uploadedFileName,
        needsAdjuster,
        insuranceProvider
      };

      submitClaimMutation.mutate(claimData);
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
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setUploadedFileName(data?.path)
        setHasUploaded(true);
        setSkipUpload(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-20 flex items-center mt-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="h-screen pb-4 w-full flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-b border-gray-200 py-6 px-4 md:px-6 shadow-sm"
        >
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-vendle-navy">Vendle</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="text-sm text-vendle-blue font-medium hover:text-vendle-blue/80 transition-colors"
            >
              Exit Setup
            </motion.button>
          </div>
        </motion.header>

        {/* Progress Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="container mx-auto px-4 md:px-6 py-4"
        >
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </motion.div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 flex-1 flex items-start justify-center pt-4">
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="street" className="block text-sm font-medium text-vendle-navy mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-all hover:border-vendle-blue/50"
                    placeholder="123 Main St"
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="city" className="block text-sm font-medium text-vendle-navy mb-1 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-all hover:border-vendle-blue/50"
                      placeholder="San Francisco"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label htmlFor="state" className="block text-sm font-medium text-vendle-navy mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({...address, state: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-all hover:border-vendle-blue/50"
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="NY">New York</option>
                      <option value="CO">Colorado</option>
                      {/* Add more states as needed */}
                    </select>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="zip" className="block text-sm font-medium text-vendle-navy mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({...address, zip: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-all hover:border-vendle-blue/50"
                    placeholder="94105"
                  />
                </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    projectType === 'full'
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setProjectType('full')}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      projectType === 'full' ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">Full Reconstruction</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        Complete rebuild of a structure that was severely damaged or destroyed
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    projectType === 'partial'
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setProjectType('partial')}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      projectType === 'partial' ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">Partial Rebuild</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        Repair and reconstruction of specific damaged areas of your home
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    projectType === 'new'
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setProjectType('new')}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      projectType === 'new' ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">New Construction</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        Building a new home on your property, not related to disaster recovery
                      </p>
                    </div>
                  </div>
                </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    designPlan === 'existing'
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setDesignPlan('existing')}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      designPlan === 'existing' ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">Use Existing Plan</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        Rebuild using plans of the original structure
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    designPlan === 'modify'
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setDesignPlan('modify')}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      designPlan === 'modify' ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">Modify Existing Plan</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        Make changes to the original design while rebuilding
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    designPlan === 'custom'
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setDesignPlan('custom')}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      designPlan === 'custom' ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">Create New Custom Design</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        Work with architects to create a completely new design
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </FadeTransition>
          </OnboardingCard>

          {/* Step 4: File Upload */}
          <OnboardingCard
            title="Upload Insurance Estimate"
            subtitle="Upload your insurance estimate document (PDF only)"
            isActive={currentStep === 4}
            onNext={nextStep}
            onBack={prevStep}
            isNextDisabled={!isCurrentStepValid()}
          >
            <FadeTransition>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-vendle-blue/50 transition-colors"
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-vendle-blue/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-vendle-blue" />
                      </div>
                      <div>
                        <p className="text-vendle-navy font-medium">
                          {hasUploaded ? 'File Uploaded Successfully!' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-vendle-navy/70 mt-1">
                          PDF files only, up to 10MB
                        </p>
                      </div>
                    </div>
                  </label>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setSkipUpload(true)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    skipUpload
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-medium text-vendle-navy">Skip Upload</span>
                  </div>
                </motion.button>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    needsAdjuster === true
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setNeedsAdjuster(true)}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      needsAdjuster === true ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Users className="w-5 h-5" />
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    needsAdjuster === false
                      ? 'border-vendle-blue bg-vendle-blue/5'
                      : 'border-gray-200 hover:border-vendle-blue/50'
                  }`}
                  onClick={() => setNeedsAdjuster(false)}
                >
                  <div className="flex items-start">
                    <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                      needsAdjuster === false ? 'bg-vendle-blue text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-vendle-navy">No, I'll proceed without an adjuster</h3>
                      <p className="text-sm text-vendle-navy/70 mt-1">
                        I'm satisfied with my current insurance estimate and would like to proceed directly to contractor selection.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {needsAdjuster === false && (
                  <SlideUpTransition>
                    <div className="space-y-4 pt-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label htmlFor="insurance" className="block text-sm font-medium text-vendle-navy mb-1">
                          Insurance Provider
                        </label>
                        <select
                          id="insurance"
                          value={insuranceProvider}
                          onChange={(e) => setInsuranceProvider(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-all hover:border-vendle-blue/50"
                        >
                          <option value="">Select Provider</option>
                          <option value="allstate">Allstate</option>
                          <option value="statefarm">State Farm</option>
                          <option value="geico">GEICO</option>
                          <option value="progressive">Progressive</option>
                          <option value="usaa">USAA</option>
                          <option value="other">Other</option>
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label htmlFor="payment" className="block text-sm font-medium text-vendle-navy mb-1">
                          How will you finance this project?
                        </label>
                        <select
                          id="payment"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue transition-all hover:border-vendle-blue/50"
                        >
                          <option value="">Select Payment Method</option>
                          <option value="insurance">Insurance Claim</option>
                          <option value="cash">Cash/Savings</option>
                          <option value="loan">Home Reconstruction Loan</option>
                          <option value="mixed">Mixed Funding Sources</option>
                        </select>
                      </motion.div>
                    </div>
                  </SlideUpTransition>
                )}
              </div>
            </FadeTransition>
          </OnboardingCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Onboarding;
