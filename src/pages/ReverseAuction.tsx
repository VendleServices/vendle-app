"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  address: string;
  description: string;
  currentBid: number;
  deadline: string;
  status: 'active' | 'closed';
  type: 'insurance' | 'fema';
}

export default function ReverseAuction() {
  const { user } = useAuth();
  const [projects] = useState<Project[]>([
    {
      id: "1",
      title: "Water Damage Restoration",
      address: "123 Main St, Anytown, USA",
      description: "Complete water damage restoration including drywall replacement, flooring, and mold remediation",
      currentBid: 15000,
      deadline: "2024-04-15",
      status: 'active',
      type: 'insurance'
    },
    {
      id: "2",
      title: "Fire Damage Repair",
      address: "456 Oak Ave, Somewhere, USA",
      description: "Structural repairs and smoke damage cleanup after kitchen fire",
      currentBid: 25000,
      deadline: "2024-04-20",
      status: 'active',
      type: 'insurance'
    },
    {
      id: "3",
      title: "Storm Damage Assessment",
      address: "789 Pine Rd, Anywhere, USA",
      description: "Roof damage assessment and repair after severe storm",
      currentBid: 8000,
      deadline: "2024-04-10",
      status: 'closed',
      type: 'fema'
    }
  ]);

  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});

  const handleBidChange = (projectId: string, value: string) => {
    setBidAmounts(prev => ({
      ...prev,
      [projectId]: parseFloat(value) || 0
    }));
  };

  const handleSubmitBid = (projectId: string) => {
    // In a real app, this would submit the bid to the server
    console.log(`Submitting bid of $${bidAmounts[projectId]} for project ${projectId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-vendle-navy mb-2">
          Welcome, {user?.name || 'Contractor'}
        </h1>
        <p className="text-vendle-navy/70">
          Browse available projects and submit your bids
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-vendle-navy">
                  {project.title}
                </CardTitle>
                <Badge className={project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800">
                  {project.type.toUpperCase()}
                </Badge>
                <Badge className="bg-vendle-navy text-white">
                  ${project.currentBid.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-vendle-navy/70 mb-4">{project.address}</p>
              <p className="text-sm text-vendle-navy/70 mb-4">{project.description}</p>
              <p className="text-sm text-vendle-navy/70 mb-4">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </p>
              
              {project.status === 'active' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-vendle-navy">Your Bid:</span>
                    <Input
                      type="number"
                      value={bidAmounts[project.id] || ''}
                      onChange={(e) => handleBidChange(project.id, e.target.value)}
                      className="w-32"
                      placeholder="Amount"
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmitBid(project.id)}
                    className="w-full bg-vendle-navy text-white hover:bg-vendle-navy/90"
                    disabled={!bidAmounts[project.id] || bidAmounts[project.id] >= project.currentBid}
                  >
                    Submit Bid
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
} 