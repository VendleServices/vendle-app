"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import {
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Home,
    Shield,
    User,
    FileText,
    Users,
    DollarSign,
    ArrowRight,
    ChevronRight,
    Sparkles, Upload, X, Droplets, Flame, AlertTriangle, Hammer, Zap, Trash2, Calendar, ExternalLink, Wrench, CheckCircle, Image
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiService } from "@/services/api";
import { toast } from "sonner";
import { createClient } from "@/auth/client";
import { StepIndicator } from "@/components/start-claim/StepIndicator";
import { NavigationButtons } from "@/components/start-claim/NavigationButtons";
import { Step1Location } from "@/components/start-claim/steps/Step1Location";
import { Step2Restoration } from "@/components/start-claim/steps/Step2Restoration";
import { Step3DamageTypes } from "@/components/start-claim/steps/Step3DamageTypes";
import { Step4Property } from "@/components/start-claim/steps/Step4Property";
import { Step5Timeline } from "@/components/start-claim/steps/Step5Timeline";
import { Step6ProjectType } from "@/components/start-claim/steps/Step6ProjectType";
import { Step7DesignPlan } from "@/components/start-claim/steps/Step7DesignPlan";
import { Step8ClaimAssistance } from "@/components/start-claim/steps/Step8ClaimAssistance";

interface ClaimData {
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  projectType: string;
  designPlan: string;
  needsAdjuster: boolean | null;
  imageUrls: string[];
  pdfUrls: string[];
  damageTypes: string;
  hasFunctionalUtilities: boolean;
  hasDumpster: boolean;
  isOccupied: boolean;
  phase1Start: string;
  phase1End: string;
  phase2Start: string;
  phase2End: string;
  title: string;
  totalJobValue: number;
  overheadAndProfit: number;
  costBasis: string;
  materials: number;
  salesTaxes: number;
  depreciation: number;
  reconstructionType: string;
  hasDeductibleFunds: boolean;
  fundingSource: string;
  additionalNotes: string;
}

export default function StartClaimPage() {
    const router = useRouter();
    const { user } = useAuth();
    const apiService = useApiService();
    const queryClient = useQueryClient();
    const [selectedType, setSelectedType] = useState<'insurance' | 'fema' | null>(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showInsuranceCompanies, setShowInsuranceCompanies] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const supabase = createClient();
    
    // Insurance onboarding state
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 8; // Reduced from 9 since we're combining steps 2 and 3
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
    });
    const [damageTypes, setDamageTypes] = useState<string[]>([]);
    const [propertyQuestions, setPropertyQuestions] = useState({
        hasFunctionalUtilities: null as boolean | null,
        hasDumpster: null as boolean | null,
        isOccupied: null as boolean | null,
    });
    const [timeline, setTimeline] = useState({
        phase1Start: '',
        phase1End: '',
        phase2Start: '',
        phase2End: '',
        contractorVisitDays: [] as string[],
    });

    const [projectType, setProjectType] = useState('');
    const [designPlan, setDesignPlan] = useState('');
    const [needsAdjuster, setNeedsAdjuster] = useState<boolean | null>(null);
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    
    // Restoration form state (replaces steps 2 and 3)
    const [restorationFormData, setRestorationFormData] = useState({
        insuranceEstimatePdf: "",
        needs3rdPartyAdjuster: false,
        costBasis: "" as "RCV" | "ACV" | "",
        overheadAndProfit: "",
        salesTaxes: "",
        materials: "",
        depreciation: "",
        hasDeductibleFunds: false,
        fundingSource: "" as "FEMA" | "Insurance" | "SBA" | "",
        totalJobValue: "",
        reconstructionType: "",
        additionalNotes: "",
        title: "",
    });

    const [uploadedInsuranceEstimatePdf, setUploadedInsuranceEstimatePdf] = useState<File | null>(null);

    const fileInputRef = useRef<any>(null);
    const insuranceEstimateInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: any) => {
        const files: File[] = Array.from(e.target.files);
        const mapped = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setUploadedImages(prev => [...prev, ...mapped]);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();

        const dt = e.dataTransfer;
        if (!dt) return;

        const files: File[] = Array.from(dt.files)

        const mapped = files?.map((file: File) => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setUploadedImages(prev => [...prev, ...mapped]);
    };

    const handlePdfSelect = (e: any) => {
        const files: File[] = Array.from(e.target.files);
        const file = files?.[0];

        if (file) {
            setUploadedInsuranceEstimatePdf(file);
        }
    };

    const handlePdfDrop = (e: any) => {
        e.preventDefault();
        const dt = e.dataTransfer;
        if (!dt) return;
        const files: File[] = Array.from(dt.files);
        const file = files?.[0];

        if (file) {
            setUploadedInsuranceEstimatePdf(file);
        }
    };

    const removePdf = (e: any) => {
        e.stopPropagation();
        setUploadedInsuranceEstimatePdf(null);
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRestorationInputChange = (field: keyof typeof restorationFormData, value: any) => {
        setRestorationFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    
    // FEMA form state
    const [femaFormData, setFemaFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        propertyDamage: "",
        isPrimaryResidence: false,
        hasInsurance: false,
        isUsCitizen: false,
    });

    const handleSelection = (hasInsurance: boolean) => {
        if (hasInsurance) {
            setSelectedType('insurance');
        } else {
            setShowContactForm(true);
        }
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.phone) {
            setShowContactForm(false);
            setShowInsuranceCompanies(true);
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleBackToSelection = () => {
        setSelectedType(null);
        setShowContactForm(false);
        setShowInsuranceCompanies(false);
        setCurrentStep(1);
        setAddress({ street: '', city: '', state: '', zip: '' });
        setProjectType('');
        setDesignPlan('');
        setNeedsAdjuster(null);
        setContactInfo({ firstName: '', lastName: '', email: '', phone: '' });
        setFemaFormData({
            firstName: "", lastName: "", email: "", phone: "",
            address: "", city: "", state: "", zipCode: "",
            propertyDamage: "", isPrimaryResidence: false,
            hasInsurance: false, isUsCitizen: false,
        });
    };

    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 1: return address.street && address.city && address.state && address.zip;
            case 2: return true; // Restoration form - all fields optional for now
            case 3: return damageTypes.length > 0;
            case 4: return propertyQuestions.hasFunctionalUtilities !== null && 
                       propertyQuestions.hasDumpster !== null && 
                       propertyQuestions.isOccupied !== null;
            case 5: return timeline.phase1Start && timeline.phase1End && 
                       timeline.phase2Start && timeline.phase2End;
            case 6: return !!projectType;
            case 7: return !!designPlan;
            case 8: return needsAdjuster !== null;
            default: return true;
        }
    };

    const toggleDamageType = (type: string) => {
        setDamageTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            completeOnboarding();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const submitClaimData = async (claimData: ClaimData) => {
        try {
            const response = await apiService.postWithFile('/api/claim', claimData, uploadedInsuranceEstimatePdf);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const submitClaimMutation = useMutation({
        mutationFn: submitClaimData,
        onSuccess: (data: any) => {
            console.log('Claim created successfully:', data);
            // Invalidate queries to refresh the claims list
            queryClient.invalidateQueries({ queryKey: ["getClaims"] });
            toast("Successfully created claim", {
                description: "Your claim has been saved and is ready for processing.",
            });
            router.push('/home');
        },
        onError: (error: any) => {
            console.error('Error creating claim:', error);
            toast("Error", {
                description: error?.message || "Failed to create claim. Please try again.",
            });
        }
    });

    const completeOnboarding = async () => {
        try {
            if (!user?.id) {
                toast("Error", {
                    description: "You must be logged in to create a claim.",
                });
                return;
            }

            const imagePaths: string[] = [];

            for (const fileObj of uploadedImages) {
                const timestamp = Date.now();
                const fileNameCleaned = fileObj.file.name.replace(/[^\w.-]+/g, "_");
                const { data, error } = await supabase.storage
                    .from("images")
                    .upload(`public/${fileNameCleaned}_${timestamp}`, fileObj.file);

                if (!error && data) {
                    imagePaths.push(data.fullPath);
                } else if (error) {
                    console.log(error);
                }
            }

            const pdfPaths: string[] = [];

            if (uploadedInsuranceEstimatePdf) {
                const timestamp = Date.now();
                const fileNameCleaned = uploadedInsuranceEstimatePdf.name.replace(/[^\w.-]+/g, "_");
                const { data, error } = await supabase.storage
                    .from("vendle-claims")
                    .upload(`public/${fileNameCleaned}_${timestamp}`, uploadedInsuranceEstimatePdf);

                if (!error && data) {
                    pdfPaths.push(data.fullPath);
                } else if (error) {
                    console.log(error);
                }
            }

            const claimData = {
                userId: user.id,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zip,
                projectType,
                designPlan,
                needsAdjuster,
                imageUrls: imagePaths,
                pdfUrls: pdfPaths,
                damageTypes: JSON.stringify(damageTypes),
                hasFunctionalUtilities: !!propertyQuestions.hasFunctionalUtilities,
                hasDumpster: !!propertyQuestions.hasDumpster,
                isOccupied: !!propertyQuestions.isOccupied,
                phase1Start: timeline.phase1Start,
                phase1End: timeline.phase1End,
                phase2Start: timeline.phase2Start,
                phase2End: timeline.phase2End,
                title: restorationFormData.title,
                totalJobValue: Number(restorationFormData.totalJobValue),
                overheadAndProfit: Number(restorationFormData.overheadAndProfit),
                costBasis: restorationFormData.costBasis,
                materials: Number(restorationFormData.materials),
                salesTaxes: Number(restorationFormData.salesTaxes),
                depreciation: Number(restorationFormData.depreciation),
                reconstructionType: restorationFormData.reconstructionType,
                hasDeductibleFunds: restorationFormData.hasDeductibleFunds,
                fundingSource: restorationFormData.fundingSource,
                additionalNotes: restorationFormData.additionalNotes,
            };

            submitClaimMutation.mutate(claimData);
        } catch (error) {
            console.error('Error completing onboarding:', error);
            toast("Error", {
                description: "Failed to save your claim. Please try again."
            });
        }
    };

    const handleFemaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
        const type = 'type' in target ? (target as HTMLInputElement).type : undefined;
        const checked = 'checked' in target ? (target as HTMLInputElement).checked : false;
        setFemaFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const submitFemaForm = async () => {
        try {
            const response = await apiService.post("/api/fema", femaFormData);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const femaMutation = useMutation({
        mutationFn: submitFemaForm,
        onSuccess: () => {
            router.push("/home");
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const handleFemaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            femaMutation.mutate();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const disableFemaSubmit = !femaFormData.firstName || !femaFormData.lastName || !femaFormData.email || !femaFormData.phone
        || !femaFormData.address || !femaFormData.city || !femaFormData.state || !femaFormData.zipCode;

    return (
        <div className="min-h-screen bg-white">
            <div className="w-[55vw] min-w-[320px] mx-auto px-4 py-6">
                {showInsuranceCompanies ? (
                        // Insurance Companies Page
                        <div key="insurance-companies">
                            <div className="mb-4">
                                <button
                                    onClick={() => {
                                        setShowInsuranceCompanies(false);
                                        setShowContactForm(false);
                                        setSelectedType(null);
                                        setContactInfo({ firstName: '', lastName: '', email: '', phone: '' });
                                    }}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back</span>
                                </button>
                            </div>

                            <div className="mb-4">
                                <h1 className="text-lg font-semibold text-gray-900 mb-1">File Your Claim</h1>
                                <p className="text-sm text-gray-500">
                                    Contact your insurance company to file a claim. If you have a broker, call them first.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {/* State Farm */}
                                <div className="bg-white rounded border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-red-600">State Farm</div>
                                            <div className="text-sm text-gray-900">1-800-SF-CLAIM</div>
                                            <div className="text-xs text-gray-500">(1-800-732-5246)</div>
                                        </div>
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Berkshire Hathaway */}
                                <div className="bg-white rounded border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-blue-600">Berkshire Hathaway</div>
                                            <div className="text-sm text-gray-900">1-800-435-7764</div>
                                        </div>
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Progressive */}
                                <div className="bg-white rounded border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-blue-700">Progressive</div>
                                            <div className="text-sm text-gray-900">1-800-274-4499</div>
                                        </div>
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Allstate */}
                                <div className="bg-white rounded border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-red-700">Allstate</div>
                                            <div className="text-sm text-gray-900">1-800-54-CLAIM</div>
                                            <div className="text-xs text-gray-500">(1-800-542-5246)</div>
                                        </div>
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Liberty Mutual */}
                                <div className="bg-white rounded border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-vendle-teal">Liberty Mutual</div>
                                            <div className="text-sm text-gray-900">1-800-225-2467</div>
                                        </div>
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : showContactForm ? (
                        // Contact Form
                        <div key="contact-form">
                            <div className="mb-4">
                                <button
                                    onClick={() => {
                                        setShowContactForm(false);
                                        setContactInfo({ firstName: '', lastName: '', email: '', phone: '' });
                                    }}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back</span>
                                </button>
                            </div>

                            <div className="mb-4">
                                <h1 className="text-lg font-semibold text-gray-900 mb-1">Contact Information</h1>
                                <p className="text-sm text-gray-500">Please provide your details to continue</p>
                            </div>

                            <div className="bg-white rounded border border-gray-200 p-4">
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                First Name
                                            </Label>
                                            <Input
                                                name="firstName"
                                                value={contactInfo.firstName}
                                                onChange={handleContactChange}
                                                required
                                                className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                Last Name
                                            </Label>
                                            <Input
                                                name="lastName"
                                                value={contactInfo.lastName}
                                                onChange={handleContactChange}
                                                required
                                                className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                            Email
                                        </Label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={contactInfo.email}
                                            onChange={handleContactChange}
                                            required
                                            className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                            Phone Number
                                        </Label>
                                        <Input
                                            name="phone"
                                            type="tel"
                                            value={contactInfo.phone}
                                            onChange={handleContactChange}
                                            required
                                            className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-3 border-t border-gray-100">
                                        <Button
                                            type="submit"
                                            disabled={!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone}
                                            className="h-9 px-4 text-sm bg-vendle-blue text-white hover:bg-vendle-blue/90 disabled:opacity-50"
                                        >
                                            Continue
                                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : !selectedType ? (
                        // Selection Screen
                        <div key="selection">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-vendle-blue mb-4">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                                    Let's rebuild
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Have you filed a claim?
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleSelection(true)}
                                    className="w-full group p-4 rounded border border-gray-200 bg-white hover:border-gray-300 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900">Yes, let's start recovering</h3>
                                            <p className="text-xs text-gray-500">Start your insurance claim process</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleSelection(false)}
                                    className="w-full group p-4 rounded border border-gray-200 bg-white hover:border-gray-300 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <XCircle className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900">Not yet, where do I start?</h3>
                                            <p className="text-xs text-gray-500">Get assistance through FEMA programs</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : selectedType === 'insurance' ? (
                        // Insurance Onboarding
                        <div key="insurance">
                            {/* Header */}
                            <div className="mb-4">
                                <button
                                    onClick={handleBackToSelection}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back</span>
                                </button>
                            </div>

                            {/* Step Indicator */}
                            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                            {/* Step Content */}
                            {currentStep === 1 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step1Location
                                        address={address}
                                        onAddressChange={setAddress}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={nextStep}
                                        isValid={!!isCurrentStepValid()}
                                    />
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step2Restoration
                                        formData={restorationFormData}
                                        onFormChange={handleRestorationInputChange}
                                        uploadedFile={uploadedInsuranceEstimatePdf}
                                        onFileUpload={(file) => setUploadedInsuranceEstimatePdf(file)}
                                        onFileRemove={() => setUploadedInsuranceEstimatePdf(null)}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={nextStep}
                                        isValid={!!isCurrentStepValid()}
                                    />
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step3DamageTypes
                                        damageTypes={damageTypes}
                                        onToggleDamageType={toggleDamageType}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={nextStep}
                                        isValid={!!isCurrentStepValid()}
                                    />
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step4Property
                                        questions={propertyQuestions}
                                        onQuestionChange={(field, value) =>
                                            setPropertyQuestions({...propertyQuestions, [field]: value})
                                        }
                                        images={uploadedImages}
                                        onImageUpload={(files) => {
                                            const mapped = files.map(file => ({
                                                file,
                                                preview: URL.createObjectURL(file)
                                            }));
                                            setUploadedImages(prev => [...prev, ...mapped]);
                                        }}
                                        onImageRemove={(index) => {
                                            setUploadedImages(prev => prev.filter((_, i) => i !== index));
                                        }}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={nextStep}
                                        isValid={!!isCurrentStepValid()}
                                    />
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step5Timeline
                                        timeline={timeline}
                                        onTimelineChange={(field, value) =>
                                            setTimeline({...timeline, [field]: value})
                                        }
                                        propertyAddress={address.street}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={nextStep}
                                        isValid={!!isCurrentStepValid()}
                                    />
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step6ProjectType
                                        selectedType={projectType}
                                        onTypeChange={setProjectType}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={nextStep}
                                        isValid={!!isCurrentStepValid()}
                                    />
                                </div>
                            )}

                            {currentStep === 7 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step7DesignPlan
                                        selectedPlan={designPlan}
                                        onPlanChange={setDesignPlan}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={nextStep}
                                        isValid={!!isCurrentStepValid()}
                                    />
                                </div>
                            )}

                            {currentStep === 8 && (
                                <div className="bg-white border border-gray-200 rounded p-4">
                                    <Step8ClaimAssistance
                                        needsAdjuster={needsAdjuster}
                                        onAdjusterChange={setNeedsAdjuster}
                                    />

                                    <NavigationButtons
                                        currentStep={currentStep}
                                        totalSteps={totalSteps}
                                        onBack={prevStep}
                                        onNext={completeOnboarding}
                                        isValid={!!isCurrentStepValid()}
                                        isSubmitting={submitClaimMutation.isPending}
                                    />
                                </div>
                            )}
                        </div>
                    ) : selectedType === 'fema' ? (
                        // FEMA Form
                        <div key="fema">
                            <div className="mb-4">
                                <button
                                    onClick={handleBackToSelection}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back</span>
                                </button>
                            </div>

                            <div className="mb-4">
                                <h1 className="text-lg font-semibold text-gray-900 mb-1">FEMA Assistance</h1>
                                <p className="text-sm text-gray-500">Apply for federal disaster assistance</p>
                            </div>

                            <div className="bg-white rounded border border-gray-200 p-4">
                                <form onSubmit={handleFemaSubmit} className="space-y-4">
                                    {/* Personal Information Section */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Personal Information
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                    First Name
                                                </Label>
                                                <Input
                                                    name="firstName"
                                                    value={femaFormData.firstName}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                    Last Name
                                                </Label>
                                                <Input
                                                    name="lastName"
                                                    value={femaFormData.lastName}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information Section */}
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Contact Information
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    value={femaFormData.email}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                    placeholder="john.doe@email.com"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    name="phone"
                                                    type="tel"
                                                    value={femaFormData.phone}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                    placeholder="(555) 123-4567"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Address Section */}
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Property Address
                                        </h3>

                                        <div>
                                            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                Street Address
                                            </Label>
                                            <Input
                                                name="address"
                                                value={femaFormData.address}
                                                onChange={handleFemaChange}
                                                required
                                                className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                placeholder="123 Main Street"
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">City</Label>
                                                <Input
                                                    name="city"
                                                    value={femaFormData.city}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                    placeholder="San Francisco"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">State</Label>
                                                <select
                                                    name="state"
                                                    value={femaFormData.state}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="w-full h-9 px-3 text-sm border border-gray-200 rounded focus:border-gray-400 focus:outline-none bg-white"
                                                >
                                                <option value="">Select State</option>
                                                <option value="AL">Alabama</option>
                                                <option value="AK">Alaska</option>
                                                <option value="AZ">Arizona</option>
                                                <option value="AR">Arkansas</option>
                                                <option value="CA">California</option>
                                                <option value="CO">Colorado</option>
                                                <option value="CT">Connecticut</option>
                                                <option value="DE">Delaware</option>
                                                <option value="FL">Florida</option>
                                                <option value="GA">Georgia</option>
                                                <option value="HI">Hawaii</option>
                                                <option value="ID">Idaho</option>
                                                <option value="IL">Illinois</option>
                                                <option value="IN">Indiana</option>
                                                <option value="IA">Iowa</option>
                                                <option value="KS">Kansas</option>
                                                <option value="KY">Kentucky</option>
                                                <option value="LA">Louisiana</option>
                                                <option value="ME">Maine</option>
                                                <option value="MD">Maryland</option>
                                                <option value="MA">Massachusetts</option>
                                                <option value="MI">Michigan</option>
                                                <option value="MN">Minnesota</option>
                                                <option value="MS">Mississippi</option>
                                                <option value="MO">Missouri</option>
                                                <option value="MT">Montana</option>
                                                <option value="NE">Nebraska</option>
                                                <option value="NV">Nevada</option>
                                                <option value="NH">New Hampshire</option>
                                                <option value="NJ">New Jersey</option>
                                                <option value="NM">New Mexico</option>
                                                <option value="NY">New York</option>
                                                <option value="NC">North Carolina</option>
                                                <option value="ND">North Dakota</option>
                                                <option value="OH">Ohio</option>
                                                <option value="OK">Oklahoma</option>
                                                <option value="OR">Oregon</option>
                                                <option value="PA">Pennsylvania</option>
                                                <option value="RI">Rhode Island</option>
                                                <option value="SC">South Carolina</option>
                                                <option value="SD">South Dakota</option>
                                                <option value="TN">Tennessee</option>
                                                <option value="TX">Texas</option>
                                                <option value="UT">Utah</option>
                                                <option value="VT">Vermont</option>
                                                <option value="VA">Virginia</option>
                                                <option value="WA">Washington</option>
                                                <option value="WV">West Virginia</option>
                                                <option value="WI">Wisconsin</option>
                                                <option value="WY">Wyoming</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">ZIP Code</Label>
                                                <Input
                                                    name="zipCode"
                                                    value={femaFormData.zipCode}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                    placeholder="94102"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Damage Section */}
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Property Damage
                                        </h3>

                                        <div>
                                            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                                                Describe the damage
                                            </Label>
                                            <Input
                                                name="propertyDamage"
                                                value={femaFormData.propertyDamage}
                                                onChange={handleFemaChange}
                                                required
                                                className="h-9 text-sm rounded border-gray-200 focus:border-gray-400 focus:outline-none"
                                                placeholder="Brief description of damage"
                                            />
                                        </div>
                                    </div>

                                    {/* Eligibility Requirements */}
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Eligibility
                                        </h3>

                                        <div className="space-y-2">
                                            {[
                                                { name: 'isPrimaryResidence', label: 'This is my primary residence' },
                                                { name: 'hasInsurance', label: 'I have property insurance' },
                                                { name: 'isUsCitizen', label: 'I am a U.S. citizen or qualified alien' }
                                            ].map(({ name, label }) => (
                                                <div key={name} className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:border-gray-300 transition-colors">
                                                    <Checkbox
                                                        id={name}
                                                        checked={femaFormData[name as keyof typeof femaFormData] as boolean}
                                                        onCheckedChange={(checked) =>
                                                            setFemaFormData(prev => ({ ...prev, [name]: checked as boolean }))
                                                        }
                                                        className="border-gray-300 data-[state=checked]:bg-vendle-blue data-[state=checked]:border-vendle-blue h-4 w-4"
                                                    />
                                                    <Label htmlFor={name} className="text-sm text-gray-700 cursor-pointer flex-1">
                                                        {label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end pt-3 border-t border-gray-100">
                                        <Button
                                            type="submit"
                                            disabled={disableFemaSubmit || femaMutation.isPending}
                                            className="h-9 px-4 text-sm bg-vendle-blue text-white hover:bg-vendle-blue/90 disabled:opacity-50"
                                        >
                                            {femaMutation.isPending ? "Submitting..." : "Submit Application"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                ) : null}
            </div>
        </div>
    );
}
