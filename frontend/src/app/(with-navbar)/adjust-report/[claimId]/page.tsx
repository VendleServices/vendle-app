"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { CheckCircle, UploadCloud, FileText, Image as ImageIcon, Folder, X, Receipt, ArrowLeft } from 'lucide-react';

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <motion.div
            className="bg-vendle-blue h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        />
    </div>
);

const FileUploadArea = ({ id, label, icon, multiple, accept, files, setFiles, onFileChange }: any) => {
    const handleLocalFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        onFileChange(e, setFiles);
    };

    const removeFile = (fileToRemove: File) => {
        if (multiple) {
            setFiles((prev: File[]) => prev.filter(file => file !== fileToRemove));
        } else {
            setFiles(null);
        }
    };
    
    const fileList = multiple ? files : (files ? [files] : []);

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-lg font-semibold text-vendle-navy flex items-center gap-2">
                {icon}
                {label}
            </Label>
            <div className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-vendle-blue/50 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="text-center">
                    <UploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-base font-medium text-vendle-navy">Click to upload or drag and drop</p>
                </div>
                <Input id={id} type="file" multiple={multiple} accept={accept} onChange={handleLocalFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <div className="mt-2 space-y-2 h-24 overflow-y-auto">
                {fileList.map((file: File, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                    >
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => removeFile(file)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default function AdjustReportPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [claimId, setClaimId] = useState<string | null>(null);

    const [currentStep, setCurrentStep] = useState(0);

    const [adjusterReport, setAdjusterReport] = useState<File[]>([]);
    const [damageMedia, setDamageMedia] = useState<File[]>([]);
    const [receipts, setReceipts] = useState<File[]>([]);
    const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

    useEffect(() => {
        if (params && params.claimId) {
            const id = Array.isArray(params.claimId) ? params.claimId[0] : params.claimId;
            setClaimId(id);
        } else {
            toast({
                title: "Error",
                description: "No claim ID provided.",
                variant: "destructive",
            });
            router.push('/my-projects');
        }
    }, [params, router, toast]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFiles: Function) => {
        if (e.target.files) {
            if (e.target.multiple) {
                setFiles((prev: File[]) => [...prev, ...Array.from(e.target.files!)]);
            } else {
                setFiles(e.target.files[0]);
            }
        }
    };
    
    const steps = [
        {
            id: 'adjuster-report',
            label: "Adjuster Report (if you have one)",
            icon: <FileText className="w-5 h-5" />,
            multiple: true,
            files: adjusterReport,
            setFiles: setAdjusterReport,
            isOptional: true
        },
        {
            id: 'damage-media',
            label: "Photos/Videos of Damage",
            icon: <ImageIcon className="w-5 h-5" />,
            multiple: true,
            accept: "image/*,video/*",
            files: damageMedia,
            setFiles: setDamageMedia
        },
        {
            id: 'receipts',
            label: "Receipts or Estimates",
            icon: <Receipt className="w-5 h-5" />,
            multiple: true,
            files: receipts,
            setFiles: setReceipts
        },
        {
            id: 'supporting-files',
            label: "Blueprints or Supporting Files",
            icon: <Folder className="w-5 h-5" />,
            multiple: true,
            files: supportingFiles,
            setFiles: setSupportingFiles
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // TODO: Add actual upload logic
        toast({
            title: "Upload Successful",
            description: "Your documents have been submitted.",
        });
        router.push('/my-projects');
    };

    const isNextDisabled = () => {
        const currentStepData = steps[currentStep];
        if (!currentStepData || currentStepData.isOptional) return false;
        
        if (currentStepData.multiple) {
            // We can safely assume files is File[] here because multiple is true
            return (currentStepData.files as File[]).length === 0;
        }
        // We can safely assume files is File | null here
        return !currentStepData.files;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-center min-h-screen p-4 pt-24"
        >
            <Card className="w-[70vw] min-w-[40rem] max-w-[50rem] bg-white shadow-2xl rounded-xl">
                <CardHeader className="text-center pb-4">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}>
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                    </motion.div>
                    <CardTitle className="text-4xl font-bold text-vendle-navy pt-4">
                        Congratulations!
                    </CardTitle>
                    <p className="text-lg text-gray-600 pt-2">The county has issued a clearance. Please upload the following documents.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                        <ProgressBar current={currentStep} total={steps.length} />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                            >
                                {currentStep < steps.length ? (
                                    <FileUploadArea {...steps[currentStep]} onFileChange={handleFileChange} />
                                ) : (
                                    <div className="text-center p-8">
                                        <h2 className="text-2xl font-bold text-vendle-navy mb-4">Ready to Submit?</h2>
                                        <p className="text-gray-600">You've prepared all your documents. Click submit to finalize.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between items-center pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleBack}
                                className={currentStep === 0 ? 'invisible' : 'visible'}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            {currentStep < steps.length ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isNextDisabled()}
                                    className="bg-vendle-navy text-white hover:bg-vendle-navy/90"
                                >
                                    {steps[currentStep]?.isOptional ? "Next / Skip" : "Next"}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="bg-green-500 text-white hover:bg-green-600"
                                >
                                    Submit All Documents
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
} 