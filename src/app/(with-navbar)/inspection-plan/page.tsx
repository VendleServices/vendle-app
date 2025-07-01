"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Calendar,
  AlertTriangle,
  Shield,
  Home,
  Settings,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

interface Inspector {
  id: string;
  name: string;
  license: string;
  rating: number;
  specialties: string[];
  avatar: string;
  phone: string;
  email: string;
  availability: string[];
}

interface InspectionAssessment {
  structuralDamage: string;
  foundationStatus: string;
  rebuildFeasibility: string;
  safetyAndAccess: string;
  recommendations: string[];
}

interface RebuildStrategy {
  id: string;
  name: string;
  description: string;
  estimatedCost: string;
  timeline: string;
  pros: string[];
  cons: string[];
}

const availableInspectors: Inspector[] = [
  {
    id: '1',
    name: 'Michael Rodriguez',
    license: 'CA-78901',
    rating: 4.9,
    specialties: ['Structural Assessment', 'Foundation Analysis', 'Safety Evaluation'],
    avatar: '/team/diego.jpg',
    phone: '(555) 123-4567',
    email: 'michael.rodriguez@vendle.com',
    availability: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: '2',
    name: 'Jennifer Kim',
    license: 'CA-45678',
    rating: 4.8,
    specialties: ['Damage Assessment', 'Rebuild Planning', 'Code Compliance'],
    avatar: '/team/kaz.jpg',
    phone: '(555) 234-5678',
    email: 'jennifer.kim@vendle.com',
    availability: ['Tuesday', 'Thursday', 'Saturday']
  }
];

const rebuildStrategies: RebuildStrategy[] = [
  {
    id: 'original',
    name: 'Rebuild Original Design',
    description: 'Reconstruct the property exactly as it was before the damage',
    estimatedCost: '$180,000 - $220,000',
    timeline: '4-6 months',
    pros: ['Maintains original character', 'Faster approval process', 'Lower design costs'],
    cons: ['May not address previous issues', 'Limited modernization opportunities']
  },
  {
    id: 'modified',
    name: 'Modified Layout & Floor Plan',
    description: 'Rebuild with improvements to layout, functionality, and modern features',
    estimatedCost: '$200,000 - $250,000',
    timeline: '5-7 months',
    pros: ['Better functionality', 'Modern amenities', 'Improved energy efficiency'],
    cons: ['Higher costs', 'Longer approval process', 'More complex planning']
  }
];

export default function InspectionPlanPage() {
  const [currentStep, setCurrentStep] = useState<'assignment' | 'scheduling' | 'assessment' | 'strategy' | 'complete'>('assignment');
  const [assignedInspector, setAssignedInspector] = useState<Inspector | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [assessment, setAssessment] = useState<InspectionAssessment | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [inspectionStatus, setInspectionStatus] = useState<'pending' | 'scheduled' | 'in-progress' | 'complete'>('pending');
  const { toast } = useToast();

  // Step 1: Assign inspector based on project location
  const assignInspector = (inspector: Inspector) => {
    setAssignedInspector(inspector);
    setCurrentStep('scheduling');
    toast({
      title: "Inspector Assigned",
      description: `${inspector.name} has been assigned to your project.`,
    });
  };

  // Step 2: Schedule on-site visit
  const scheduleInspection = (date: string) => {
    setScheduledDate(date);
    setInspectionStatus('scheduled');
    
    // Automatically simulate the assessment after scheduling
    const mockAssessment: InspectionAssessment = {
      structuralDamage: "Moderate structural damage to load-bearing walls. Foundation appears sound with minor settling.",
      foundationStatus: "Good condition with minor settling. No major structural issues detected.",
      rebuildFeasibility: "Highly feasible. Site is accessible and suitable for reconstruction.",
      safetyAndAccess: "Site is safe for construction. Good access for equipment and materials.",
      recommendations: [
        "Replace damaged load-bearing walls",
        "Reinforce foundation connections",
        "Update electrical system to current code",
        "Improve insulation and energy efficiency"
      ]
    };
    
    setAssessment(mockAssessment);
    setInspectionStatus('complete');
    setCurrentStep('strategy');
    
    toast({
      title: "Inspection Scheduled & Completed",
      description: `Your inspection has been scheduled for ${date} and the assessment is complete.`,
    });
  };

  // Step 3: Simulate inspector assessment
  const simulateAssessment = () => {
    const mockAssessment: InspectionAssessment = {
      structuralDamage: "Moderate structural damage to load-bearing walls. Foundation appears sound with minor settling.",
      foundationStatus: "Good condition with minor settling. No major structural issues detected.",
      rebuildFeasibility: "Highly feasible. Site is accessible and suitable for reconstruction.",
      safetyAndAccess: "Site is safe for construction. Good access for equipment and materials.",
      recommendations: [
        "Replace damaged load-bearing walls",
        "Reinforce foundation connections",
        "Update electrical system to current code",
        "Improve insulation and energy efficiency"
      ]
    };
    
    setAssessment(mockAssessment);
    setInspectionStatus('complete');
    setCurrentStep('strategy');
    toast({
      title: "Assessment Complete",
      description: "Inspector has completed the site assessment.",
    });
  };

  // Step 4: User selects rebuild strategy
  const selectRebuildStrategy = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    setCurrentStep('complete');
    toast({
      title: "Strategy Selected",
      description: "Your rebuild strategy has been recorded.",
    });
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
            <CardTitle className="text-3xl font-bold text-gray-800">Site Inspection & Plan Development</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Step 6: Complete inspection and planning for your rebuild project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Inspector Assignment */}
              {currentStep === 'assignment' && (
                <motion.div
                  key="assignment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Step 1: Inspector Assignment</h3>
                    <p className="text-gray-600 mb-6">We've identified qualified inspectors in your area. Select one to proceed:</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableInspectors.map((inspector) => (
                      <Card key={inspector.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <img 
                              src={inspector.avatar} 
                              alt={inspector.name}
                              className="w-16 h-16 rounded-full border-2 border-gray-200"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{inspector.name}</h4>
                              <p className="text-sm text-gray-600">License: {inspector.license}</p>
                              <div className="flex items-center mt-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">Rating: {inspector.rating}/5.0</span>
                              </div>
                              
                              <div className="mt-3">
                                <h5 className="font-medium text-sm mb-2">Specialties:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {inspector.specialties.map(specialty => (
                                    <Badge key={specialty} variant="secondary" className="text-xs text-white">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4 space-y-1 text-sm">
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{inspector.phone}</span>
                                </div>
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{inspector.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full mt-4"
                            onClick={() => assignInspector(inspector)}
                          >
                            Assign Inspector
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Scheduling */}
              {currentStep === 'scheduling' && (
                <motion.div
                  key="scheduling"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Step 2: Schedule On-Site Visit</h3>
                    <p className="text-gray-600 mb-6">
                      Inspector <strong>{assignedInspector?.name}</strong> is ready to schedule your inspection.
                    </p>
                  </div>
                  
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Available Dates</h4>
                          <div className="space-y-2">
                            {assignedInspector?.availability.map((day, index) => (
                              <Button
                                key={day}
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => scheduleInspection(`${day}, ${new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}`)}
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                {day}, {new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">What to Expect</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Inspector will assess structural damage
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Evaluate foundation status
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Determine rebuild feasibility
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              Assess safety and access
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button onClick={simulateAssessment} className="w-full">
                    Simulate Inspection Completion
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Assessment Results */}
              {currentStep === 'assessment' && assessment && (
                <motion.div
                  key="assessment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Step 3: Inspection Assessment Complete</h3>
                    <p className="text-gray-600 mb-6">
                      Inspector <strong>{assignedInspector?.name}</strong> has completed the site assessment.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                          Structural Damage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{assessment.structuralDamage}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                          Foundation Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{assessment.foundationStatus}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Home className="w-5 h-5 mr-2 text-green-500" />
                          Rebuild Feasibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{assessment.rebuildFeasibility}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-purple-500" />
                          Safety & Access
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{assessment.safetyAndAccess}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {assessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Button onClick={() => setCurrentStep('strategy')} className="w-full">
                    Continue to Rebuild Strategy
                  </Button>
                </motion.div>
              )}

              {/* Step 4: Rebuild Strategy Selection */}
              {currentStep === 'strategy' && (
                <motion.div
                  key="strategy"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Step 4: Select Rebuild Strategy</h3>
                    <p className="text-gray-600 mb-6">
                      Based on the inspection findings, choose your preferred rebuild approach:
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {rebuildStrategies.map((strategy) => (
                      <Card 
                        key={strategy.id} 
                        className={`cursor-pointer transition-all ${
                          selectedStrategy === strategy.id 
                            ? 'border-2 border-blue-500 bg-blue-50' 
                            : 'hover:shadow-lg'
                        }`}
                        onClick={() => selectRebuildStrategy(strategy.id)}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {strategy.name}
                            {selectedStrategy === strategy.id && (
                              <CheckCircle className="w-6 h-6 text-blue-500" />
                            )}
                          </CardTitle>
                          <CardDescription>{strategy.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Estimated Cost:</span>
                              <span className="text-green-600 font-semibold">{strategy.estimatedCost}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Timeline:</span>
                              <span className="text-blue-600">{strategy.timeline}</span>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-sm mb-2 text-green-700">Pros:</h5>
                              <ul className="space-y-1">
                                {strategy.pros.map((pro, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-sm mb-2 text-red-700">Cons:</h5>
                              <ul className="space-y-1">
                                {strategy.cons.map((con, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                    <AlertTriangle className="w-3 h-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {selectedStrategy && (
                    <div className="mt-6 text-center">
                      <Button 
                        onClick={() => setCurrentStep('complete')}
                        className="px-8 py-3"
                      >
                        Confirm Strategy Selection
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Completion */}
              {currentStep === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-4">Inspection & Planning Complete!</h1>
                      <p className="text-lg text-gray-600 mb-8">
                        Your rebuild strategy has been recorded and the inspection plan is ready.
                      </p>
                    </div>
                    
                    <Card className="mb-6">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Inspector:</span>
                            <p className="text-gray-600">{assignedInspector?.name}</p>
                          </div>
                          <div>
                            <span className="font-medium">Scheduled Date:</span>
                            <p className="text-gray-600">{scheduledDate}</p>
                          </div>
                          <div>
                            <span className="font-medium">Inspection Status:</span>
                            <p className="text-green-600 font-semibold">Complete</p>
                          </div>
                          <div>
                            <span className="font-medium">Rebuild Strategy:</span>
                            <p className="text-gray-600">
                              {rebuildStrategies.find(s => s.id === selectedStrategy)?.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" onClick={() => setCurrentStep('assignment')}>
                        Start Over
                      </Button>
                      <Button>
                        Continue to Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 