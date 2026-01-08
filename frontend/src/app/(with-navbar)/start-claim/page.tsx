"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
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
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 max-w-7xl">
                <AnimatePresence mode="wait">
                    {showInsuranceCompanies ? (
                        // Insurance Companies Page
                        <motion.div
                            key="insurance-companies"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                                >
                                    File Your Claim
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg text-slate-600 mb-8"
                                >
                                    Contact your insurance company to file a claim. If you have a broker or use another carrier, please call them to request to file a claim and come back.
                                </motion.p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {/* State Farm */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-red-600">State Farm</div>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-4">Claims Number:</div>
                                    <div className="text-xl font-semibold text-slate-900">1-800-SF-CLAIM</div>
                                    <div className="text-sm text-slate-500 mt-1">(1-800-732-5246)</div>
                                </motion.div>

                                {/* Berkshire Hathaway */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-blue-600">Berkshire Hathaway</div>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-4">Claims Number:</div>
                                    <div className="text-xl font-semibold text-slate-900">1-800-435-7764</div>
                                </motion.div>

                                {/* Progressive */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-blue-700">Progressive</div>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-4">Claims Number:</div>
                                    <div className="text-xl font-semibold text-slate-900">1-800-274-4499</div>
                                </motion.div>

                                {/* Allstate */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-red-700">Allstate</div>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-4">Claims Number:</div>
                                    <div className="text-xl font-semibold text-slate-900">1-800-54-CLAIM</div>
                                    <div className="text-sm text-slate-500 mt-1">(1-800-542-5246)</div>
                                </motion.div>

                                {/* Liberty Mutual */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-vendle-teal">Liberty Mutual</div>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-4">Claims Number:</div>
                                    <div className="text-xl font-semibold text-slate-900">1-800-225-2467</div>
                                </motion.div>
                            </div>

                            <div className="text-center">
                                <Button
                                    onClick={() => {
                                        setShowInsuranceCompanies(false);
                                        setShowContactForm(false);
                                        setSelectedType(null);
                                        setContactInfo({ firstName: '', lastName: '', email: '', phone: '' });
                                    }}
                                    variant="outline"
                                    className="px-8 py-6 border-slate-300"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Start
                                </Button>
                            </div>
                        </motion.div>
                    ) : showContactForm ? (
                        // Contact Form
                        <motion.div
                            key="contact-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                                >
                                    Let's get started
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg text-slate-600"
                                >
                                    Please provide your contact information
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                            >
                                <form onSubmit={handleContactSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                First Name
                                            </Label>
                                            <Input
                                                name="firstName"
                                                value={contactInfo.firstName}
                                                onChange={handleContactChange}
                                                required
                                                className="h-12 border-vendle-gray/40 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20 bg-background"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Last Name
                                            </Label>
                                            <Input
                                                name="lastName"
                                                value={contactInfo.lastName}
                                                onChange={handleContactChange}
                                                required
                                                className="h-12 border-vendle-gray/40 focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20 bg-background"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </Label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={contactInfo.email}
                                            onChange={handleContactChange}
                                            required
                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            name="phone"
                                            type="tel"
                                            value={contactInfo.phone}
                                            onChange={handleContactChange}
                                            required
                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    <div className="flex justify-between pt-6 border-t border-slate-200">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowContactForm(false);
                                                setContactInfo({ firstName: '', lastName: '', email: '', phone: '' });
                                            }}
                                            variant="outline"
                                            className="px-8 py-6 border-slate-300"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone}
                                            className="px-8 py-6 bg-vendle-blue text-white hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    ) : !selectedType ? (
                        // Modern Selection Screen
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-vendle-blue mb-6 shadow-lg"
                                >
                                    <Sparkles className="w-10 h-10 text-white" />
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight"
                                >
                                    Let's rebuild!
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl text-slate-600 mb-12"
                                >
                                    Have you filed a claim?
                                </motion.p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <button
                                        onClick={() => handleSelection(true)}
                                        className="w-full group relative overflow-hidden bg-card rounded-2xl p-8 shadow-md hover:shadow-xl border-2 border-vendle-gray/30 hover:border-vendle-blue transition-all duration-300 text-left"
                                    >
                                        <div className="absolute inset-0 bg-vendle-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-vendle-teal/20 flex items-center justify-center group-hover:bg-vendle-teal/30 transition-colors">
                                                    <CheckCircle2 className="w-7 h-7 text-vendle-teal" />
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-vendle-blue group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <h3 className="text-2xl font-semibold text-foreground mb-2">Yes, I have, let's start recovering</h3>
                                            <p className="text-muted-foreground">Start your insurance claim process</p>
                                        </div>
                                    </button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <button
                                        onClick={() => handleSelection(false)}
                                        className="w-full group relative overflow-hidden bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border-2 border-slate-200 hover:border-vendle-blue transition-all duration-300 text-left"
                                    >
                                        <div className="absolute inset-0 bg-vendle-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-vendle-sand/30 flex items-center justify-center group-hover:bg-vendle-sand/40 transition-colors">
                                                    <XCircle className="w-7 h-7 text-vendle-navy" />
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-vendle-blue group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Not yet, where do I start?</h3>
                                            <p className="text-slate-600">Get assistance through FEMA programs</p>
                                        </div>
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : selectedType === 'insurance' ? (
                        // Modern Insurance Onboarding
                        <motion.div
                            key="insurance"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-5xl mx-auto"
                        >
                            {/* Header */}
                            <div className="mb-8">
                                <button
                                    onClick={handleBackToSelection}
                                    className="flex items-center gap-2 text-muted-foreground hover:text-vendle-blue transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-medium">Back</span>
                                </button>
                            </div>

                            {/* Step Indicator */}
                            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                            {/* Step Content */}
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2-restoration"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3-damage"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div
                                        key="step4-property"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}

                                {currentStep === 5 && (
                                    <motion.div
                                        key="step5-timeline"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}

                                {currentStep === 6 && (
                                    <motion.div
                                        key="step6-project"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}

                                {currentStep === 7 && (
                                    <motion.div
                                        key="step7-design"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}

                                {currentStep === 8 && (
                                    <motion.div
                                        key="step8-claim"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : selectedType === 'fema' ? (
                        // Modern FEMA Form
                        <motion.div
                            key="fema"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl mx-auto"
                        >
                            <button
                                onClick={handleBackToSelection}
                                className="flex items-center gap-2 text-[#4A637D] hover:text-[#2C3E50] transition-colors group mb-6"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">Back to Selection</span>
                            </button>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-xl border-2 border-[#D9D9D9]/30 overflow-hidden"
                            >
                                {/* Header with gradient accent */}
                                <div className="h-2 bg-[#4A637D]" />

                                <div className="p-6 sm:p-8 lg:p-10">
                                    <div className="mb-8">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-2">FEMA Assistance Application</h1>
                                        <p className="text-[#2C3E50]/70">Complete the form below to apply for federal disaster assistance</p>
                                    </div>

                                    <form onSubmit={handleFemaSubmit} className="space-y-8">
                                        {/* Personal Information Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2 pb-3 border-b-2 border-[#D9D9D9]">
                                                <User className="w-5 h-5 text-[#4A637D]" />
                                                Personal Information
                                            </h3>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
                                                        First Name
                                                    </Label>
                                                    <Input
                                                        name="firstName"
                                                        value={femaFormData.firstName}
                                                        onChange={handleFemaChange}
                                                        required
                                                        className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                        placeholder="John"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
                                                        Last Name
                                                    </Label>
                                                    <Input
                                                        name="lastName"
                                                        value={femaFormData.lastName}
                                                        onChange={handleFemaChange}
                                                        required
                                                        className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                        placeholder="Doe"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2 pb-3 border-b-2 border-[#D9D9D9]">
                                                <Mail className="w-5 h-5 text-[#4A637D]" />
                                                Contact Information
                                            </h3>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
                                                        Email Address
                                                    </Label>
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        value={femaFormData.email}
                                                        onChange={handleFemaChange}
                                                        required
                                                        className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                        placeholder="john.doe@email.com"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
                                                        Phone Number
                                                    </Label>
                                                    <Input
                                                        name="phone"
                                                        type="tel"
                                                        value={femaFormData.phone}
                                                        onChange={handleFemaChange}
                                                        required
                                                        className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                        placeholder="(555) 123-4567"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Address Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2 pb-3 border-b-2 border-[#D9D9D9]">
                                                <MapPin className="w-5 h-5 text-[#4A637D]" />
                                                Property Address
                                            </h3>

                                            <div>
                                                <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
                                                    Street Address
                                                </Label>
                                                <Input
                                                    name="address"
                                                    value={femaFormData.address}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                    placeholder="123 Main Street"
                                                />
                                            </div>

                                            <div className="grid sm:grid-cols-3 gap-6">
                                                <div>
                                                    <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">City</Label>
                                                    <Input
                                                        name="city"
                                                        value={femaFormData.city}
                                                        onChange={handleFemaChange}
                                                        required
                                                        className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                        placeholder="San Francisco"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">State</Label>
                                                    <select
                                                        name="state"
                                                        value={femaFormData.state}
                                                        onChange={handleFemaChange}
                                                        required
                                                        className="w-full h-12 px-4 border-2 border-[#D9D9D9] rounded-xl focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 transition-all bg-white"
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
                                                    <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">ZIP Code</Label>
                                                    <Input
                                                        name="zipCode"
                                                        value={femaFormData.zipCode}
                                                        onChange={handleFemaChange}
                                                        required
                                                        className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                        placeholder="94102"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Damage Section */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2 pb-3 border-b-2 border-[#D9D9D9]">
                                                <Building2 className="w-5 h-5 text-[#4A637D]" />
                                                Property Damage Details
                                            </h3>

                                            <div>
                                                <Label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
                                                    Describe the damage to your property
                                                </Label>
                                                <Input
                                                    name="propertyDamage"
                                                    value={femaFormData.propertyDamage}
                                                    onChange={handleFemaChange}
                                                    required
                                                    className="h-12 border-2 border-[#D9D9D9] focus:border-[#4A637D] focus:ring-2 focus:ring-[#4A637D]/20 rounded-xl transition-all"
                                                    placeholder="Brief description of damage"
                                                />
                                            </div>
                                        </div>

                                        {/* Eligibility Requirements */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2 pb-3 border-b-2 border-[#D9D9D9]">
                                                <CheckCircle2 className="w-5 h-5 text-[#4A637D]" />
                                                Eligibility Requirements
                                            </h3>

                                            <div className="space-y-4">
                                                {[
                                                    { name: 'isPrimaryResidence', label: 'This is my primary residence', icon: Home },
                                                    { name: 'hasInsurance', label: 'I have property insurance', icon: Shield },
                                                    { name: 'isUsCitizen', label: 'I am a U.S. citizen or qualified alien', icon: User }
                                                ].map(({ name, label, icon: Icon }) => (
                                                    <div key={name} className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#D9D9D9] hover:border-[#4A637D]/50 transition-colors">
                                                        <Checkbox
                                                            id={name}
                                                            checked={femaFormData[name as keyof typeof femaFormData] as boolean}
                                                            onCheckedChange={(checked) =>
                                                                setFemaFormData(prev => ({ ...prev, [name]: checked as boolean }))
                                                            }
                                                            className="border-2 border-[#D9D9D9] data-[state=checked]:bg-[#4A637D] data-[state=checked]:border-[#4A637D] h-5 w-5"
                                                        />
                                                        <Label htmlFor={name} className="text-sm font-medium text-[#2C3E50] flex items-center gap-2 cursor-pointer flex-1">
                                                            <Icon className="w-4 h-4 text-[#4A637D]" />
                                                            {label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                                            <Button
                                                type="button"
                                                onClick={handleBackToSelection}
                                                variant="outline"
                                                className="px-8 py-3 border-2 border-[#D9D9D9] hover:border-[#4A637D] hover:bg-[#4A637D]/5 transition-all font-semibold"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={disableFemaSubmit || femaMutation.isPending}
                                                className="px-8 py-3 bg-[#4A637D] hover:bg-[#4A637D]/90 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                            >
                                                {femaMutation.isPending ? "Submitting..." : "Submit Application"}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
}
