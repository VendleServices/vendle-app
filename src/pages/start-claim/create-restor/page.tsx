"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function CreateRestorPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    scope: {
      debrisRemoval: false,
      toxicMaterialCleanup: false,
      hazardMitigation: false
    },
    photos: [] as File[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScopeChange = (scope: keyof typeof formData.scope) => {
    setFormData(prev => ({
      ...prev,
      scope: {
        ...prev.scope,
        [scope]: !prev.scope[scope]
      }
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: Array.from(e.target.files as FileList)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form data
    console.log('Form submitted:', formData);
    
    toast({
      title: "Job Created Successfully!",
      description: "Your restoration job has been created and alerted to all qualified contractors in your area. They will begin submitting bids shortly.",
      duration: 5000,
    });
    
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center p-4 pt-24"
    >
      <Card className="w-[70vw] min-w-[40rem] max-w-[60rem] bg-white">
        <div className="p-12">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl font-bold text-vendle-navy">
              Create Restoration Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="address" className="text-lg">Property Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter the property address"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="description" className="text-lg">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the damage and restoration needs"
                  required
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg">Scope of Work</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="debrisRemoval"
                      checked={formData.scope.debrisRemoval}
                      onCheckedChange={() => handleScopeChange('debrisRemoval')}
                    />
                    <Label htmlFor="debrisRemoval" className="text-base">
                      Debris Removal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="toxicMaterialCleanup"
                      checked={formData.scope.toxicMaterialCleanup}
                      onCheckedChange={() => handleScopeChange('toxicMaterialCleanup')}
                    />
                    <Label htmlFor="toxicMaterialCleanup" className="text-base">
                      Toxic Material Cleanup
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hazardMitigation"
                      checked={formData.scope.hazardMitigation}
                      onCheckedChange={() => handleScopeChange('hazardMitigation')}
                    />
                    <Label htmlFor="hazardMitigation" className="text-base">
                      Hazard Mitigation
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="photos" className="text-lg">Pre-Inspection Photos</Label>
                <div className="relative">
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-vendle-navy/20 rounded-lg hover:border-vendle-navy/40 transition-colors">
                    <div className="text-center">
                      <p className="text-vendle-navy/70">Click to upload photos</p>
                      <p className="text-sm text-vendle-navy/50">or drag and drop</p>
                    </div>
                  </div>
                </div>
                {formData.photos.length > 0 && (
                  <p className="text-sm text-vendle-navy/70">
                    {formData.photos.length} photo(s) selected
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-vendle-navy text-white hover:bg-vendle-navy/90"
                >
                  Create Job
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
} 