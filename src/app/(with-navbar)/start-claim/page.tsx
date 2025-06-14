"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function StartClaimPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSelection = (hasInsurance: boolean) => {
        if (user?.user_type === 'contractor') {
            toast({
                title: "Access Denied",
                description: "Contractors cannot start claims. Please use your regular user account.",
                variant: "destructive"
            });
            return;
        }

        if (hasInsurance) {
            router.push("/start-claim/insurance/onboarding");
        } else {
            router.push("/start-claim/fema");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-center p-4 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ${inter.className}`}
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-[-10rem]"
            >
                <Card className="w-full min-w-[80rem] bg-gradient-to-r from-vendle-blue to-vendle-navy text-white h-1/2 overflow-hidden shadow-2xl">
                    <div className="flex">
                        <motion.div 
                            className="relative w-2/5"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src="/stock2.jpeg"
                                alt="Insurance claim illustration"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </motion.div>
                        <div className="w-3/5 p-12">
                            <CardHeader className="pb-4">
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <CardTitle className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 tracking-tight">
                                        Start Your Insurance or FEMA Claim
                                    </CardTitle>
                                </motion.div>
                            </CardHeader>
                            <CardContent className="space-y-12">
                                <motion.div 
                                    className="space-y-4"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    <h2 className="text-6xl font-bold text-center tracking-tight">
                                        Do you have property insurance?
                                    </h2>
                                    <p className="text-2xl text-center text-white/90 font-light">
                                        Select your answer to begin your claim process
                                    </p>
                                </motion.div>
                                
                                <div className="flex justify-center space-x-16">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => handleSelection(true)}
                                            className="group px-20 py-10 bg-white text-vendle-navy rounded-2xl text-4xl font-medium hover:bg-vendle-blue/10 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-3">
                                                <CheckCircle2 className="w-8 h-8" />
                                                Yes
                                            </span>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-vendle-blue/20 to-vendle-navy/20"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => handleSelection(false)}
                                            className="group px-20 py-10 bg-white text-vendle-navy rounded-2xl text-4xl font-medium hover:bg-vendle-blue/10 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-3">
                                                <XCircle className="w-8 h-8" />
                                                No
                                            </span>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-vendle-blue/20 to-vendle-navy/20"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </Button>
                                    </motion.div>
                                </div>

                                <motion.div 
                                    className="mt-8 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    <p className="text-lg text-white/80 font-light">
                                        Need help? Contact our support team at support@vendle.com
                                    </p>
                                </motion.div>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
} 