"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, Users, CheckCircle, Download, Eye, Clock, Shield, Award, Gavel } from 'lucide-react';
import { toast } from "sonner";
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
    { id: 2, name: 'Exterior Elevation', status: 'draft', description: 'Front, side, and rear elevation drawings' },
    { id: 3, name: 'Material Recommendations', status: 'draft', description: 'Specifications for building materials and finishes' },
  ]);

  const [legalDocuments, setLegalDocuments] = useState([
    { id: 1, name: 'Scope of Work Contract', status: 'draft', description: 'Detailed contract outlining project scope and deliverables' },
    { id: 2, name: 'Contractor Agreement Terms', status: 'draft', description: 'Terms and conditions for contractor engagement' },
    { id: 3, name: 'Insurance Settlement Agreement', status: 'draft', description: 'Agreement terms for insurance settlement' },
  ]);

  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const handleDocumentAction = (document: any, action: string) => {
    if (action === 'view') {
      setSelectedDocument(document);
      toast("Document Preview", {
        description: `Opening ${document.name} for review.`,
      });
    } else if (action === 'approve') {
      toast("Document Approved", {
        description: `${document.name} has been approved and will be finalized.`,
      });
    } else if (action === 'download') {
      toast("Download Started", {
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
              {/* Assigned Architect */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Assigned Architect</CardTitle>
                      <CardDescription>Your dedicated design specialist</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4 mb-4">
                    <img 
                      src={assignedArchitect.avatar} 
                      alt={assignedArchitect.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{assignedArchitect.name}</h3>
                      <p className="text-sm text-gray-600">{assignedArchitect.role}</p>
                      <p className="text-xs text-gray-500">License: {assignedArchitect.license}</p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">Licensed Professional</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Award className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Rating: <strong>{assignedArchitect.rating}/5.0</strong></span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {assignedArchitect.specialties?.map(specialty => (
                        <Badge key={specialty} variant="secondary" className="text-xs text-white bg-blue-600">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assigned Legal Consultant */}
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Gavel className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Legal Consultant</CardTitle>
                      <CardDescription>Your legal documentation specialist</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4 mb-4">
                    <img 
                      src={assignedLegalConsultant.avatar} 
                      alt={assignedLegalConsultant.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{assignedLegalConsultant.name}</h3>
                      <p className="text-sm text-gray-600">{assignedLegalConsultant.role}</p>
                      <p className="text-xs text-gray-500">License: {assignedLegalConsultant.license}</p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">Licensed Attorney</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Award className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Rating: <strong>{assignedLegalConsultant.rating}/5.0</strong></span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {assignedLegalConsultant.specialties?.map(specialty => (
                        <Badge key={specialty} variant="secondary" className="text-xs text-white bg-green-600">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
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
                    {architectDocuments?.map((doc) => (
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
              <Card>
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
                    {legalDocuments?.map((doc) => (
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
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 