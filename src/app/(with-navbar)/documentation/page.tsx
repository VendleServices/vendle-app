"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, Users, CheckCircle, Download, Eye, Clock, Shield, Award, Gavel } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Professional {
  id: string;
  name: string;
  role: string;
  license: string;
  rating: number;
  specialties: string[];
  avatar: string;
}

const assignedArchitect: Professional = {
  id: '1',
  name: 'Sarah Chen',
  role: 'Licensed Architect',
  license: 'CA-12345',
  rating: 4.9,
  specialties: ['Residential Design', 'Structural Planning', 'Building Codes'],
  avatar: '/team/sav.jpg',
};

const assignedLegalConsultant: Professional = {
  id: '2',
  name: 'David Thompson',
  role: 'Legal Consultant',
  license: 'Bar #98765',
  rating: 4.8,
  specialties: ['Contract Law', 'Insurance Claims', 'Construction Law'],
  avatar: '/team/david.jpeg',
};

export default function DocumentationPage() {
  const [architectDocuments, setArchitectDocuments] = useState([
    { id: 1, name: 'Floor Plan', status: 'draft', description: 'Detailed floor plan showing room layouts and dimensions' },
    { id: 2, name: 'Remote Inspection Report', status: 'draft', description: 'Report based on remote/virtual inspection of the property' },
    { id: 3, name: 'Adjustment Estimate', status: 'draft', description: 'Estimate for adjustments and repairs based on inspection findings' },
  ]);

  const [legalDocuments, setLegalDocuments] = useState([
    { id: 1, name: 'Scope of Work Contract', status: 'draft', description: 'Detailed contract outlining project scope and deliverables' },
    { id: 2, name: 'Contractor Agreement Terms', status: 'draft', description: 'Terms and conditions for contractor engagement' },
    { id: 3, name: 'Insurance Settlement Agreement', status: 'draft', description: 'Agreement terms for insurance settlement' },
  ]);

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { toast } = useToast();

  const handleDocumentAction = (document: any, action: string) => {
    if (action === 'view') {
      setSelectedDocument(document);
      toast({
        title: "Document Preview",
        description: `Opening ${document.name} for review.`,
      });
    } else if (action === 'approve') {
      toast({
        title: "Document Approved",
        description: `${document.name} has been approved and will be finalized.`,
      });
    } else if (action === 'download') {
      toast({
        title: "Download Started",
        description: `${document.name} is being downloaded.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">Architectural & Legal Documentation</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              We've assigned a licensed architect and legal consultant to create comprehensive documentation for your rebuild project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="border-2 border-blue-200 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Need Architectural or Legal Documentation?</CardTitle>
                      <CardDescription>
                        Get in contact with a licensed architect or legal consultant to assist with your rebuild project. They can help you prepare the necessary documents and guide you through the process.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-4">
                    <Button className="bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Find a Professional
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Architectural Documents */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Architectural Documents</CardTitle>
                      <CardDescription>Design documents created by your architect</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {architectDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{doc.name}</h4>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                          <div className="flex items-center mt-2">
                            <Clock className="w-4 h-4 mr-1 text-gray-500" />
                            <span className="text-xs text-gray-500">Status: {doc.status}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDocumentAction(doc, 'view')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDocumentAction(doc, 'download')}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDocumentAction(doc, 'approve')}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Legal Documents */}
              <Card className="opacity-50 pointer-events-none">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Gavel className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Legal Documents</CardTitle>
                      <CardDescription>Contracts and agreements drafted by your legal consultant</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      Legal documents section coming soon.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 