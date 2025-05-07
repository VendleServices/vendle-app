"use client";

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateRestorPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [claimId, setClaimId] = useState<number | null>(null);

  useEffect(() => {
    const id = searchParams.get('claimId');
    if (!id) {
      toast({
        title: "Error",
        description: "No claim ID provided",
        variant: "destructive",
        duration: 5000,
      });
      navigate('/my-projects');
      return;
    }
    setClaimId(parseInt(id));
  }, [searchParams, navigate, toast]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    auctionEndDate: '',
    scopeOfWork: [] as string[],
    photos: [] as string[]
  });

  const getProjectsPath = () => {
    if (!user) return '/my-projects';
    return user.user_type === 'contractor' ? '/contractor-projects' : '/my-projects';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: Array.from(e.target.files as FileList).map(file => URL.createObjectURL(file))
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!claimId) {
    toast({
        title: "Error",
        description: "No claim ID available",
        variant: "destructive",
      duration: 5000,
    });
      return;
    }

    try {
      const response = await fetch('/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim_id: claimId,
          title: formData.title,
          description: formData.description,
          starting_bid: parseFloat(formData.startingBid),
          auction_end_date: formData.auctionEndDate,
          scope_of_work: formData.scopeOfWork,
          photos: formData.photos
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create auction');
      }

      toast({
        title: "Success",
        description: "Auction created successfully",
      });
      navigate(getProjectsPath());
    } catch (error) {
      console.error('Error creating auction:', error);
      toast({
        title: "Error",
        description: "Failed to create auction",
        variant: "destructive",
      });
    }
  };

  if (!claimId) {
    return null; // or a loading spinner
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center p-4 pt-24"
    >
      <Card className="w-[70vw] min-w-[40rem] max-w-[60rem] bg-white">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl font-bold text-vendle-navy">
              Create Restoration Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
              <Label htmlFor="title" className="text-lg">Job Title</Label>
                <Input
                id="title"
                name="title"
                value={formData.title}
                  onChange={handleInputChange}
                placeholder="Enter a descriptive title for the restoration job"
                  required
                className="text-lg"
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
              <Label htmlFor="startingBid" className="text-lg">Starting Bid Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-vendle-navy/50" />
                </div>
                <Input
                  id="startingBid"
                  name="startingBid"
                  type="number"
                  value={formData.startingBid}
                  onChange={handleInputChange}
                  placeholder="Enter starting bid amount"
                  required
                  min="0"
                  step="0.01"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="auctionEndDate" className="text-lg">Auction End Date</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-vendle-navy/50" />
                </div>
                <Input
                  id="auctionEndDate"
                  name="auctionEndDate"
                  type="datetime-local"
                  value={formData.auctionEndDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-vendle-navy/70">
                Contractors must submit their bids before this date and time
              </p>
            </div>

              <div className="space-y-4">
                <Label className="text-lg">Scope of Work</Label>
              <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="debrisRemoval"
                    checked={formData.scopeOfWork.includes('Debris Removal')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          scopeOfWork: [...prev.scopeOfWork, 'Debris Removal']
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          scopeOfWork: prev.scopeOfWork.filter(item => item !== 'Debris Removal')
                        }));
                      }
                    }}
                    />
                  <Label htmlFor="debrisRemoval">Debris Removal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                    id="toxicMaterial"
                    checked={formData.scopeOfWork.includes('Toxic Material Cleanup')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          scopeOfWork: [...prev.scopeOfWork, 'Toxic Material Cleanup']
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          scopeOfWork: prev.scopeOfWork.filter(item => item !== 'Toxic Material Cleanup')
                        }));
                      }
                    }}
                    />
                  <Label htmlFor="toxicMaterial">Toxic Material Cleanup</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hazardMitigation"
                    checked={formData.scopeOfWork.includes('Hazard Mitigation')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          scopeOfWork: [...prev.scopeOfWork, 'Hazard Mitigation']
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          scopeOfWork: prev.scopeOfWork.filter(item => item !== 'Hazard Mitigation')
                        }));
                      }
                    }}
                    />
                  <Label htmlFor="hazardMitigation">Hazard Mitigation</Label>
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
                onClick={() => navigate(getProjectsPath())}
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
      </Card>
    </motion.div>
  );
} 