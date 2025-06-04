"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, FileText, Clock, DollarSign, Users, Loader2, Hammer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Project {
    id: number;
    status: string;
    date: string;
    address: string;
    project_type: string;
    design_plan: string;
    current_bid: number;
    bid_count: number;
    end_date: string;
}

const ContractorProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const user = "";
    const { toast } = useToast();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects/available');
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast({
                    title: "Error",
                    description: "Failed to load available projects. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [toast]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTimeRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-vendle-blue" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-vendle-navy">Available Projects</h1>
                <Button 
                    variant="outline" 
                    onClick={() => router.push('/reverse-auction')}
                >
                    View Auctions
                </Button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-vendle-navy/70">No active projects available at the moment.</p>
                    <p className="text-sm text-vendle-navy/50 mt-2">Check back later for new opportunities.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <Badge className={getStatusColor(project.status)}>
                                    {project.status}
                                </Badge>
                                <div className="flex items-center text-sm text-vendle-navy/70">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {getTimeRemaining(project.end_date)}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center text-vendle-navy/70">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span className="text-sm">{project.address}</span>
                                </div>

                                <div className="flex items-center text-vendle-navy/70">
                                    <Hammer className="h-4 w-4 mr-2" />
                                    <span className="text-sm">{project.project_type}</span>
                                </div>

                                <div className="flex items-center text-vendle-navy/70">
                                    <FileText className="h-4 w-4 mr-2" />
                                    <span className="text-sm">{project.design_plan}</span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1 text-vendle-navy/70" />
                                        <span className="font-medium">{project.current_bid.toLocaleString()}</span>
                                        <span className="text-sm text-vendle-navy/50 ml-2">({project.bid_count} bids)</span>
                                    </div>
                                    <Button 
                                        variant="default"
                                        onClick={() => router.push(`/project/${project.id}`)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ContractorProjectsPage; 