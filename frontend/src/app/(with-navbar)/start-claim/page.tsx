"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    const [uploadedPdfs, setUploadedPdfs] = useState<any[]>([]);
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
    });
    const [uploadedInsuranceEstimate, setUploadedInsuranceEstimate] = useState<File | null>(null);

    const fileInputRef = useRef<any>(null);
    const pdfInputRef = useRef<any>(null);
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

        //.filter(
        //             (file): file is File => file.type.startsWith("image/")
        //         );

        const mapped = files?.map((file: File) => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setUploadedImages(prev => [...prev, ...mapped]);
    };

    const handlePdfSelect = (e: any) => {
        const files: File[] = Array.from(e.target.files);
        const mapped = files.map(file => ({
            file,
            name: file.name,
            size: file.size
        }));
        setUploadedPdfs(prev => [...prev, ...mapped]);
    };

    const handlePdfDrop = (e: any) => {
        e.preventDefault();
        const dt = e.dataTransfer;
        if (!dt) return;
        const files: File[] = Array.from(dt.files);
        const mapped = files?.map((file: File) => ({
            file,
            name: file.name,
            size: file.size
        }));
        setUploadedPdfs(prev => [...prev, ...mapped]);
    };

    const removePdf = (index: number) => {
        setUploadedPdfs(prev => prev.filter((_, i) => i !== index));
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

    const handleInsuranceEstimateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setUploadedInsuranceEstimate(file);

        try {
            const timestamp = Date.now();
            const { data, error } = await supabase.storage
                .from("vendle-estimates")
                .upload(`public/${timestamp}-${file.name}`, file);

            if (error) throw error;

            handleRestorationInputChange("insuranceEstimatePdf", data?.fullPath);
            toast.success("Insurance estimate uploaded successfully");
        } catch (error: any) {
            toast("Upload failed", { description: error.message });
        }
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
            const response = await apiService.post('/api/claim', claimData);
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

            for (const fileObj of uploadedPdfs) {
                const timestamp = Date.now();
                const fileNameCleaned = fileObj.file.name.replace(/[^\w.-]+/g, "_");
                const { data, error } = await supabase.storage
                    .from("vendle-claims")
                    .upload(`public/${fileNameCleaned}_${timestamp}`, fileObj.file);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <AnimatePresence mode="wait">
                    {showInsuranceCompanies ? (
                        // Insurance Companies Page
                        <motion.div
                            key="insurance-companies"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto"
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

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow md:col-span-2"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-green-600">Liberty Mutual</div>
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
                            className="max-w-2xl mx-auto"
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
                                                className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
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
                                                className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
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
                                            className="px-8 py-6 bg-gradient-to-r from-vendle-blue to-vendle-navy text-white hover:shadow-lg transition-all disabled:opacity-50"
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
                            className="max-w-4xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-vendle-blue to-vendle-navy mb-6 shadow-lg"
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

                            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <button
                                        onClick={() => handleSelection(true)}
                                        className="w-full group relative overflow-hidden bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border-2 border-slate-200 hover:border-vendle-blue transition-all duration-300 text-left"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-vendle-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-vendle-blue group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Yes, I have, let's start recovering</h3>
                                            <p className="text-slate-600">Start your insurance claim process</p>
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
                                        <div className="absolute inset-0 bg-gradient-to-br from-vendle-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                                    <XCircle className="w-7 h-7 text-orange-600" />
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
                            className="max-w-3xl mx-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <button
                                    onClick={handleBackToSelection}
                                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-medium">Back</span>
                                </button>
                                <div className="text-sm text-slate-500 font-medium">
                                    Step {currentStep} of {totalSteps}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-vendle-blue to-vendle-navy rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Step Content */}
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                                    >
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Property Location</h2>
                                        <p className="text-slate-600 mb-8">Where is your property located?</p>

                                        <div className="space-y-6">
                                            <AddressAutocomplete
                                                    value={address.street}
                                                onChange={(newAddress) => {
                                                    setAddress({
                                                        ...address,
                                                        street: newAddress.street
                                                    });
                                                }}
                                                    className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                                    placeholder="123 Main Street"
                                                label="Street Address"
                                                />

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                                        <Building2 className="w-4 h-4" />
                                                        City
                                                    </Label>
                                                    <Input
                                                        value={address.city}
                                                        onChange={(e) => setAddress({...address, city: e.target.value})}
                                                        className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                                        placeholder="San Francisco"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">State</Label>
                                                    <select
                                                        value={address.state}
                                                        onChange={(e) => setAddress({...address, state: e.target.value})}
                                                        className="w-full h-12 px-4 border border-slate-300 rounded-lg focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20 transition-colors"
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
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-slate-700 mb-2 block">ZIP Code</Label>
                                                <Input
                                                    value={address.zip}
                                                    onChange={(e) => setAddress({...address, zip: e.target.value})}
                                                    className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                                    placeholder="94105"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-8">
                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2-restoration"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Insurance Estimate */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-6 h-6 text-[#1a365d]" />
                                                <h2 className="text-3xl font-bold text-slate-900">Insurance Estimate</h2>
                                            </div>
                                            <p className="text-slate-600 mb-6">Upload your insurance estimate PDF.</p>

                                            <div className="relative flex items-center justify-center h-36 border-2 border-dashed rounded-xl border-slate-300 hover:border-[#1a365d] transition-all bg-slate-50/50 cursor-pointer" 
                                                 onClick={() => insuranceEstimateInputRef.current?.click()}>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleInsuranceEstimateUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    ref={insuranceEstimateInputRef}
                                                />
                                                {!uploadedInsuranceEstimate ? (
                                                    <div className="text-center">
                                                        <Upload className="h-8 w-8 mx-auto text-slate-600 mb-1" />
                                                        <p className="text-sm text-slate-600">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-green-600 flex items-center gap-2">
                                                        <CheckCircle />
                                                        {uploadedInsuranceEstimate.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Financial Breakdown */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                                            <div className="flex items-center gap-2 mb-6">
                                                <DollarSign className="w-6 h-6 text-[#1a365d]" />
                                                <h2 className="text-3xl font-bold text-slate-900">Financial Breakdown</h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="font-medium text-slate-900">Cost Basis</Label>
                                                        <RadioGroup
                                                            value={restorationFormData.costBasis}
                                                            onValueChange={(v) => handleRestorationInputChange("costBasis", v)}
                                                            className="space-y-2"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <RadioGroupItem id="rcv" value="RCV" />
                                                                <Label htmlFor="rcv" className="font-normal cursor-pointer">Replacement Cost Value (RCV)</Label>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <RadioGroupItem id="acv" value="ACV" />
                                                                <Label htmlFor="acv" className="font-normal cursor-pointer">Actual Cash Value (ACV)</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="font-medium text-slate-900">Deductible</Label>
                                                        <RadioGroup
                                                            value={restorationFormData.hasDeductibleFunds.toString()}
                                                            onValueChange={(v) =>
                                                                handleRestorationInputChange("hasDeductibleFunds", v === "true")
                                                            }
                                                            className="space-y-2"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <RadioGroupItem id="fund-yes" value="true" />
                                                                <Label htmlFor="fund-yes" className="font-normal cursor-pointer">I have deductible funds</Label>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <RadioGroupItem id="fund-no" value="false" />
                                                                <Label htmlFor="fund-no" className="font-normal cursor-pointer">Need additional funding</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>

                                                    {!restorationFormData.hasDeductibleFunds && (
                                                        <div className="ml-4 mt-2 border-l-2 border-slate-200 pl-4 space-y-2">
                                                            <RadioGroup
                                                                value={restorationFormData.fundingSource}
                                                                onValueChange={(v) => handleRestorationInputChange("fundingSource", v)}
                                                            >
                                                                {["FEMA", "Insurance", "SBA"].map((src) => (
                                                                    <div key={src} className="flex items-center gap-2">
                                                                        <RadioGroupItem id={src} value={src} />
                                                                        <Label htmlFor={src} className="font-normal cursor-pointer">{src} Assistance</Label>
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
                                                            <Label className="font-medium text-slate-900">{label}</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={(restorationFormData as any)[key]}
                                                                onChange={(e) =>
                                                                    handleRestorationInputChange(key as any, e.target.value)
                                                                }
                                                                className="border-slate-300"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Posting Details */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Wrench className="w-6 h-6 text-[#1a365d]" />
                                                <h2 className="text-3xl font-bold text-slate-900">Job Posting Details</h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-2">
                                                    <Label className="font-medium text-slate-900">Total Job Value ($)</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={restorationFormData.totalJobValue}
                                                        onChange={(e) =>
                                                            handleRestorationInputChange("totalJobValue", e.target.value)
                                                        }
                                                        className="border-slate-300"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="font-medium text-slate-900">Reconstruction Type</Label>
                                                    <Input
                                                        placeholder="e.g. Fire damage restoration"
                                                        value={restorationFormData.reconstructionType}
                                                        onChange={(e) =>
                                                            handleRestorationInputChange("reconstructionType", e.target.value)
                                                        }
                                                        className="border-slate-300"
                                                    />
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <Label className="font-medium text-slate-900">Additional Notes</Label>
                                                    <Textarea
                                                        placeholder="Add any relevant details..."
                                                        className="min-h-[120px] border-slate-300"
                                                        value={restorationFormData.additionalNotes}
                                                        onChange={(e) =>
                                                            handleRestorationInputChange("additionalNotes", e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex justify-between mt-8">
                                            <Button
                                                onClick={prevStep}
                                                variant="outline"
                                                className="px-8 py-6 border-slate-300"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>

                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3-damage"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                                    >
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Damage Types</h2>
                                        <p className="text-slate-600 mb-8">Select all types of damage that apply to your property</p>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                { value: 'water', label: 'Water Damage', icon: Droplets },
                                                { value: 'fire-smoke', label: 'Fire/Smoke Damage', icon: Flame },
                                                { value: 'mold', label: 'Mold', icon: AlertTriangle },
                                                { value: 'impact-structural', label: 'Impact/Structural', icon: Hammer },
                                            ].map((type) => {
                                                const isSelected = damageTypes.includes(type.value);
                                                return (
                                                    <button
                                                        key={type.value}
                                                        onClick={() => toggleDamageType(type.value)}
                                                        className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                                                            isSelected
                                                                ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                                isSelected
                                                                    ? 'bg-vendle-blue text-white'
                                                                    : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                                <type.icon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-base font-semibold text-slate-900 leading-tight">{type.label}</h3>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <Button
                                                onClick={prevStep}
                                                variant="outline"
                                                className="px-8 py-6 border-slate-300"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div
                                        key="step4-property"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                                    >
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Property Information</h2>
                                        <p className="text-slate-600 mb-8">Please answer the following questions about your property</p>

                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-lg font-semibold text-slate-900 mb-4 block flex items-center gap-2">
                                                    <Zap className="w-5 h-5" />
                                                    Is there functional electricity and water?
                                                </Label>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => setPropertyQuestions({...propertyQuestions, hasFunctionalUtilities: true})}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                                            propertyQuestions.hasFunctionalUtilities === true
                                                                ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-slate-900">Yes</div>
                                                    </button>
                                                    <button
                                                        onClick={() => setPropertyQuestions({...propertyQuestions, hasFunctionalUtilities: false})}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                                            propertyQuestions.hasFunctionalUtilities === false
                                                                ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-slate-900">No</div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-lg font-semibold text-slate-900 mb-4 block flex items-center gap-2">
                                                    <Trash2 className="w-5 h-5" />
                                                    Is there a dumpster within the immediate area?
                                                </Label>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => setPropertyQuestions({...propertyQuestions, hasDumpster: true})}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                                            propertyQuestions.hasDumpster === true
                                                                ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-slate-900">Yes</div>
                                                    </button>
                                                    <button
                                                        onClick={() => setPropertyQuestions({...propertyQuestions, hasDumpster: false})}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                                            propertyQuestions.hasDumpster === false
                                                                ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-slate-900">No</div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-lg font-semibold text-slate-900 mb-4 block flex items-center gap-2">
                                                    <Home className="w-5 h-5" />
                                                    Is the property occupied?
                                                </Label>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => setPropertyQuestions({...propertyQuestions, isOccupied: true})}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                                            propertyQuestions.isOccupied === true
                                                                ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-slate-900">Yes</div>
                                                    </button>
                                                    <button
                                                        onClick={() => setPropertyQuestions({...propertyQuestions, isOccupied: false})}
                                                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                                            propertyQuestions.isOccupied === false
                                                                ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="font-medium text-slate-900">No</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 mt-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Image className="w-6 h-6 text-[#1a365d]" />
                                                <h3 className="text-2xl font-bold text-slate-900">Upload Images</h3>
                                            </div>
                                            <p className="text-slate-600 mb-6">Upload any images or plans you'd like us to reference (optional).</p>

                                            {/* Upload Area */}
                                            <div
                                                onDrop={handleDrop}
                                                onDragOver={(e) => e.preventDefault()}
                                                className="border-2 border-dashed border-slate-300 hover:border-[#1a365d] transition-all rounded-xl p-10 text-center cursor-pointer bg-slate-50/50"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={handleFileSelect}
                                                />

                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 rounded-xl bg-[#1a365d]/10 text-[#1a365d] flex items-center justify-center mb-4">
                                                        <Upload className="w-8 h-8" />
                                                    </div>

                                                    <p className="font-semibold text-slate-900">Click or drag files to upload</p>
                                                    <p className="text-sm text-slate-500 mt-1">You can upload multiple images</p>
                                                </div>
                                            </div>

                                            {/* Preview Grid */}
                                            {uploadedImages.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                                                    {uploadedImages.map((img, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm"
                                                        >
                                                            <img
                                                                src={img.preview}
                                                                alt="Upload preview"
                                                                className="w-full h-32 object-cover"
                                                            />

                                                            {/* Remove Button */}
                                                            <button
                                                                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <Button
                                                onClick={prevStep}
                                                variant="outline"
                                                className="px-8 py-6 border-slate-300"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 5 && (
                                    <motion.div
                                        key="step5-timeline"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                                    >
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Timeline & Scheduling</h2>
                                        <p className="text-slate-600 mb-8">Set your project timeline and schedule contractor visits</p>

                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                    <Calendar className="w-5 h-5" />
                                                    Phase 1 Timeline
                                                </h3>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Recommendation:</strong> 2 weeks for a competitive auction process
                                                    </p>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium text-slate-700 mb-2 block">Start Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={timeline.phase1Start}
                                                            onChange={(e) => setTimeline({...timeline, phase1Start: e.target.value})}
                                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium text-slate-700 mb-2 block">End Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={timeline.phase1End}
                                                            onChange={(e) => setTimeline({...timeline, phase1End: e.target.value})}
                                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                                            min={timeline.phase1Start}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                    <Calendar className="w-5 h-5" />
                                                    Phase 2 Timeline
                                                </h3>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Recommendation:</strong> 1 week for a competitive auction process
                                                    </p>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium text-slate-700 mb-2 block">Start Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={timeline.phase2Start}
                                                            onChange={(e) => setTimeline({...timeline, phase2Start: e.target.value})}
                                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                                            min={timeline.phase1End}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium text-slate-700 mb-2 block">End Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={timeline.phase2End}
                                                            onChange={(e) => setTimeline({...timeline, phase2End: e.target.value})}
                                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                                            min={timeline.phase2Start}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                    <Calendar className="w-5 h-5" />
                                                    Contractor Site Visits
                                                </h3>
                                                <p className="text-slate-600 mb-4">Schedule when contractors can visit your property</p>
                                                <Button
                                                    onClick={() => {
                                                        const calendlyUrl = `https://calendly.com/your-calendly-link?text=${encodeURIComponent(`Site Visit - ${address.street}`)}`;
                                                        window.open(calendlyUrl, '_blank');
                                                    }}
                                                    variant="outline"
                                                    className="w-full border-vendle-blue text-vendle-blue hover:bg-vendle-blue hover:text-white"
                                                >
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Open Calendly to Schedule Visits
                                                    <ExternalLink className="h-4 w-4 ml-2" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <Button
                                                onClick={prevStep}
                                                variant="outline"
                                                className="px-8 py-6 border-slate-300"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 6 && (
                                    <motion.div
                                        key="step6-project"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                                    >
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Project Type</h2>
                                        <p className="text-slate-600 mb-8">What type of rebuild do you need?</p>

                                        <div className="space-y-4">
                                            {[
                                                { value: 'full', label: 'Full Reconstruction', desc: 'Complete rebuild of a severely damaged structure' },
                                                { value: 'partial', label: 'Partial Rebuild', desc: 'Repair and reconstruction of specific damaged areas' },
                                                { value: 'new', label: 'New Construction', desc: 'Building a new home, not related to disaster recovery' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setProjectType(option.value)}
                                                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                                                        projectType === option.value
                                                            ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                            projectType === option.value
                                                                ? 'bg-vendle-blue text-white'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-slate-900 mb-1">{option.label}</h3>
                                                            <p className="text-sm text-slate-600">{option.desc}</p>
                                                        </div>
                                                        {projectType === option.value && (
                                                            <CheckCircle2 className="w-6 h-6 text-vendle-blue flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <Button
                                                onClick={prevStep}
                                                variant="outline"
                                                className="px-8 py-6 border-slate-300"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 7 && (
                                    <motion.div
                                        key="step7-design"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                                    >
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Design Approach</h2>
                                        <p className="text-slate-600 mb-8">How would you like to approach the design?</p>

                                        <div className="space-y-4">
                                            {[
                                                { value: 'existing', label: 'Use Existing Plan', desc: 'Rebuild using plans of the original structure' },
                                                { value: 'modify', label: 'Modify Existing Plan', desc: 'Make changes to the original design while rebuilding' },
                                                { value: 'custom', label: 'Create New Custom Design', desc: 'Work with architects to create a completely new design' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setDesignPlan(option.value)}
                                                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                                                        designPlan === option.value
                                                            ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                            designPlan === option.value
                                                                ? 'bg-vendle-blue text-white'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-slate-900 mb-1">{option.label}</h3>
                                                            <p className="text-sm text-slate-600">{option.desc}</p>
                                                        </div>
                                                        {designPlan === option.value && (
                                                            <CheckCircle2 className="w-6 h-6 text-vendle-blue flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <Button
                                                onClick={prevStep}
                                                variant="outline"
                                                className="px-8 py-6 border-slate-300"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 8 && (
                                    <motion.div
                                        key="step8-claim"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                                    >
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Claim Assistance</h2>
                                        <p className="text-slate-600 mb-8">Would you like assistance with your claim?</p>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => setNeedsAdjuster(true)}
                                                className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                                                    needsAdjuster === true
                                                        ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                        needsAdjuster === true
                                                            ? 'bg-vendle-blue text-white'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        <Users className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-900 mb-1">Yes, I'd like adjuster assistance</h3>
                                                        <p className="text-sm text-slate-600">Our certified adjusters will review your claim and negotiate with your insurance company.</p>
                                                    </div>
                                                    {needsAdjuster === true && (
                                                        <CheckCircle2 className="w-6 h-6 text-vendle-blue flex-shrink-0" />
                                                    )}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setNeedsAdjuster(false)}
                                                className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                                                    needsAdjuster === false
                                                        ? 'border-vendle-blue bg-vendle-blue/5 shadow-md'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                        needsAdjuster === false
                                                            ? 'bg-vendle-blue text-white'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        <DollarSign className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-900 mb-1">No, I'll proceed without an adjuster</h3>
                                                        <p className="text-sm text-slate-600">I'm satisfied with my current insurance estimate.</p>
                                                    </div>
                                                    {needsAdjuster === false && (
                                                        <CheckCircle2 className="w-6 h-6 text-vendle-blue flex-shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        </div>

                                        {needsAdjuster === false && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-6 space-y-4 pt-6 border-t border-slate-200"
                                            >
                                                <div>
                                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Insurance Provider</Label>
                                                    <select
                                                        value={insuranceProvider}
                                                        onChange={(e) => setInsuranceProvider(e.target.value)}
                                                        className="w-full h-12 px-4 border border-slate-300 rounded-lg focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
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
                                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Payment Method</Label>
                                                    <select
                                                        value={paymentMethod}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="w-full h-12 px-4 border border-slate-300 rounded-lg focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20"
                                                    >
                                                        <option value="">Select Payment Method</option>
                                                        <option value="insurance">Insurance Claim</option>
                                                        <option value="cash">Cash/Savings</option>
                                                        <option value="loan">Home Reconstruction Loan</option>
                                                        <option value="mixed">Mixed Funding Sources</option>
                                                    </select>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="flex justify-between mt-8">
                                            <Button
                                                onClick={prevStep}
                                                variant="outline"
                                                className="px-8 py-6 border-slate-300"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back
                                            </Button>
                                            <Button
                                                onClick={nextStep}
                                                disabled={!isCurrentStepValid()}
                                                className="px-8 py-6 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 disabled:opacity-50"
                                            >
                                                Complete Setup
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
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
                            className="max-w-3xl mx-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <button
                                    onClick={handleBackToSelection}
                                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-medium">Back</span>
                                </button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10"
                            >
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">FEMA Assistance Application</h1>
                                    <p className="text-slate-600">Fill out the form below to apply for FEMA assistance</p>
                                </div>

                                <form onSubmit={handleFemaSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                First Name
                                            </Label>
                                            <Input
                                                name="firstName"
                                                value={femaFormData.firstName}
                                                onChange={handleFemaChange}
                                                required
                                                className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Last Name
                                            </Label>
                                            <Input
                                                name="lastName"
                                                value={femaFormData.lastName}
                                                onChange={handleFemaChange}
                                                required
                                                className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
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
                                            value={femaFormData.email}
                                            onChange={handleFemaChange}
                                            required
                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
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
                                            value={femaFormData.phone}
                                            onChange={handleFemaChange}
                                            required
                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Street Address
                                        </Label>
                                        <Input
                                            name="address"
                                            value={femaFormData.address}
                                            onChange={handleFemaChange}
                                            required
                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-2 block">City</Label>
                                            <Input
                                                name="city"
                                                value={femaFormData.city}
                                                onChange={handleFemaChange}
                                                required
                                                className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-2 block">State</Label>
                                            <select
                                                name="state"
                                                value={femaFormData.state}
                                                onChange={handleFemaChange}
                                                required
                                                className="w-full h-12 px-4 border border-slate-300 rounded-lg focus:border-vendle-blue focus:ring-2 focus:ring-vendle-blue/20 transition-colors"
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
                                            <Label className="text-sm font-medium text-slate-700 mb-2 block">ZIP Code</Label>
                                            <Input
                                                name="zipCode"
                                                value={femaFormData.zipCode}
                                                onChange={handleFemaChange}
                                                required
                                                className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            Describe Property Damage
                                        </Label>
                                        <Input
                                            name="propertyDamage"
                                            value={femaFormData.propertyDamage}
                                            onChange={handleFemaChange}
                                            required
                                            className="h-12 border-slate-300 focus:border-vendle-blue focus:ring-vendle-blue/20"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-200">
                                        {[
                                            { name: 'isPrimaryResidence', label: 'This is my primary residence', icon: Home },
                                            { name: 'hasInsurance', label: 'I have property insurance', icon: Shield },
                                            { name: 'isUsCitizen', label: 'I am a U.S. citizen or qualified alien', icon: User }
                                        ].map(({ name, label, icon: Icon }) => (
                                            <div key={name} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={name}
                                                    checked={femaFormData[name as keyof typeof femaFormData] as boolean}
                                                    onCheckedChange={(checked) =>
                                                        setFemaFormData(prev => ({ ...prev, [name]: checked as boolean }))
                                                    }
                                                    className="border-2 border-slate-300 data-[state=checked]:bg-vendle-blue data-[state=checked]:border-vendle-blue"
                                                />
                                                <Label htmlFor={name} className="text-sm font-medium text-slate-700 flex items-center gap-2 cursor-pointer">
                                                    <Icon className="w-4 h-4" />
                                                    {label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                                        <Button
                                            type="button"
                                            onClick={handleBackToSelection}
                                            variant="outline"
                                            className="px-8 py-6 border-slate-300"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={disableFemaSubmit || femaMutation.isPending}
                                            className="px-8 py-6 bg-gradient-to-r from-vendle-blue to-vendle-navy text-white hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {femaMutation.isPending ? "Submitting..." : "Submit Application"}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
}
