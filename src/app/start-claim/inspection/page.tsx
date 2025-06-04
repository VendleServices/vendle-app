"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function InspectionPreparationPage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center p-4"
        >
            <Card className="w-[70vw] min-w-[40rem] max-w-[60rem] bg-white">
                <div className="p-12">
                    <CardHeader className="pb-8">
                        <CardTitle className="text-4xl font-bold text-center text-vendle-navy">
                            Claim Successfully Filed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="text-center">
                            <p className="text-xl text-gray-700 mb-6">
                                Your claim has been successfully filed! The next step is preparing for the site inspection.
                            </p>
                            <p className="text-lg text-gray-600">
                                A claims adjuster will contact you to schedule the inspection. Here's what you can do to prepare:
                            </p>
                        </div>

                        <div className="bg-vendle-blue/5 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-vendle-navy mb-4">Before the Inspection:</h3>
                            <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
                                <li>Document all damage with photos and videos</li>
                                <li>Make a list of damaged items and their approximate value</li>
                                <li>Keep receipts for any temporary repairs or emergency services</li>
                                <li>Prepare any relevant documentation (insurance policy, previous inspection reports, etc.)</li>
                            </ul>
                        </div>

                        <div className="bg-vendle-blue/5 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-vendle-navy mb-4">During the Inspection:</h3>
                            <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
                                <li>Be present to answer questions and provide access to all damaged areas</li>
                                <li>Point out all damage, even if it seems minor</li>
                                <li>Share your documentation and evidence of damage</li>
                                <li>Ask questions about the claims process and next steps</li>
                            </ul>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Button
                                onClick={() => navigate("/dashboard")}
                                className="px-12 py-6 bg-vendle-navy text-white rounded-2xl text-xl font-semibold hover:bg-vendle-navy/90 transition-colors duration-300 shadow-xl hover:shadow-2xl"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
} 