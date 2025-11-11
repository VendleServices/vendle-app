"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Inter } from 'next/font/google';
import { Building2, Mail, Phone, MapPin, Home, Shield, User } from 'lucide-react';
import { useApiService } from "@/services/api";

const inter = Inter({ subsets: ['latin'] });

export default function FemaAssistancePage() {
    const apiService = useApiService();
    const router = useRouter();
    const [formData, setFormData] = useState({
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const submitFemaForm = async () => {
        try {
            const response = await apiService.post("/api/fema", formData);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    const femaMutation = useMutation({
        mutationFn: submitFemaForm,
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            femaMutation.mutate();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const disableSubmit = !formData.firstName || !formData.lastName || !formData.email || !formData.phone
        || !formData.address || !formData.city || !formData.state || !formData.zipCode;

    const buttonText = femaMutation.isPending ? "Submitting Application..." : "Submit Application";

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto"
                >
                    <Card className="overflow-hidden border-none shadow-xl bg-white">
                        <div className="max-w-3xl mx-auto">
                            {/* Form */}
                            <div className="p-6 lg:p-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <CardTitle className={`text-4xl font-bold text-center text-vendle-navy tracking-tight ${inter.className}`}>
                                        FEMA Assistance Application
                                    </CardTitle>
                                </motion.div>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                            className="grid grid-cols-2 gap-6"
                                        >
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium flex items-center gap-2" htmlFor="firstName">
                                                    <User className="w-4 h-4" />
                                                    First Name
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium flex items-center gap-2" htmlFor="lastName">
                                                    <User className="w-4 h-4" />
                                                    Last Name
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                            className="space-y-2"
                                        >
                                            <Label className="text-lg font-medium flex items-center gap-2" htmlFor="email">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                            />
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="space-y-2"
                                        >
                                            <Label className="text-lg font-medium flex items-center gap-2" htmlFor="phone">
                                                <Phone className="w-4 h-4" />
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                            />
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            className="space-y-2"
                                        >
                                            <Label className="text-lg font-medium flex items-center gap-2" htmlFor="address">
                                                <MapPin className="w-4 h-4" />
                                                Street Address
                                            </Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                            />
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.7, duration: 0.5 }}
                                            className="grid grid-cols-3 gap-6"
                                        >
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium" htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium" htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium" htmlFor="zipCode">ZIP Code</Label>
                                                <Input
                                                    id="zipCode"
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.8, duration: 0.5 }}
                                            className="space-y-2"
                                        >
                                            <Label className="text-lg font-medium flex items-center gap-2" htmlFor="propertyDamage">
                                                <Building2 className="w-4 h-4" />
                                                Describe Property Damage
                                            </Label>
                                            <Input
                                                id="propertyDamage"
                                                name="propertyDamage"
                                                value={formData.propertyDamage}
                                                onChange={handleChange}
                                                required
                                                className="h-12 text-lg transition-all duration-300 focus:ring-2 focus:ring-vendle-blue/20 focus:border-vendle-blue hover:border-vendle-blue/50"
                                            />
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.9, duration: 0.5 }}
                                            className="space-y-4 pt-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="isPrimaryResidence"
                                                    name="isPrimaryResidence"
                                                    checked={formData.isPrimaryResidence}
                                                    onCheckedChange={(checked) =>
                                                        setFormData(prev => ({ ...prev, isPrimaryResidence: checked as boolean }))
                                                    }
                                                    className="border-2 border-vendle-blue/50 data-[state=checked]:bg-vendle-blue data-[state=checked]:text-white"
                                                />
                                                <Label className="text-lg font-medium flex items-center gap-2" htmlFor="isPrimaryResidence">
                                                    <Home className="w-4 h-4" />
                                                    This is my primary residence
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="hasInsurance"
                                                    name="hasInsurance"
                                                    checked={formData.hasInsurance}
                                                    onCheckedChange={(checked) =>
                                                        setFormData(prev => ({ ...prev, hasInsurance: checked as boolean }))
                                                    }
                                                    className="border-2 border-vendle-blue/50 data-[state=checked]:bg-vendle-blue data-[state=checked]:text-white"
                                                />
                                                <Label className="text-lg font-medium flex items-center gap-2" htmlFor="hasInsurance">
                                                    <Shield className="w-4 h-4" />
                                                    I have property insurance
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="isUsCitizen"
                                                    name="isUsCitizen"
                                                    checked={formData.isUsCitizen}
                                                    onCheckedChange={(checked) =>
                                                        setFormData(prev => ({ ...prev, isUsCitizen: checked as boolean }))
                                                    }
                                                    className="border-2 border-vendle-blue/50 data-[state=checked]:bg-vendle-blue data-[state=checked]:text-white"
                                                />
                                                <Label className="text-lg font-medium flex items-center gap-2" htmlFor="isUsCitizen">
                                                    <User className="w-4 h-4" />
                                                    I am a U.S. citizen or qualified alien
                                                </Label>
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1, duration: 0.5 }}
                                            className="flex justify-center space-x-6 pt-8"
                                        >
                                            <Button
                                                type="button"
                                                onClick={() => router.back()}
                                                className="px-12 py-6 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xl transition-all duration-300"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={disableSubmit || femaMutation.isPending}
                                                className="px-12 py-6 bg-vendle-blue text-white hover:bg-vendle-blue/90 text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {buttonText}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}