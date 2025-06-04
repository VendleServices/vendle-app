"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export default function FemaAssistancePage() {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // TODO: Implement FEMA API submission
            // For now, just navigate to the next step
            router.push("/start-claim/inspection");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const disableSubmit = !formData.firstName || !formData.lastName || !formData.email || !formData.phone
    || !formData.address || !formData.city || !formData.state || !formData.zipCode;

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
                            FEMA Assistance Application
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="h-12 text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="address">Street Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-lg" htmlFor="zipCode">ZIP Code</Label>
                                    <Input
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        required
                                        className="h-12 text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg" htmlFor="propertyDamage">Describe Property Damage</Label>
                                <Input
                                    id="propertyDamage"
                                    name="propertyDamage"
                                    value={formData.propertyDamage}
                                    onChange={handleChange}
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isPrimaryResidence"
                                        name="isPrimaryResidence"
                                        checked={formData.isPrimaryResidence}
                                        onCheckedChange={(checked) => 
                                            setFormData(prev => ({ ...prev, isPrimaryResidence: checked as boolean }))
                                        }
                                    />
                                    <Label className="text-lg" htmlFor="isPrimaryResidence">
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
                                    />
                                    <Label className="text-lg" htmlFor="hasInsurance">
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
                                    />
                                    <Label className="text-lg" htmlFor="isUsCitizen">
                                        I am a U.S. citizen or qualified alien
                                    </Label>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-6 pt-8">
                                <Button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-12 py-6 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xl"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-12 py-6 bg-vendle-navy text-white hover:bg-vendle-navy/90 text-xl"
                                    disabled={disableSubmit}
                                >
                                    Submit Application
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
} 