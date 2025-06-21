"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, ShieldCheck, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Adjuster {
  id: string;
  name: string;
  region: string;
  availability: string;
  rating: number;
  specialties: string[];
  avatar: string;
  verified: boolean;
}

const publicAdjusters: Adjuster[] = [
  {
    id: '1',
    name: 'John Doe',
    region: 'Northeast',
    availability: 'Next Week',
    rating: 4.8,
    specialties: ['Flood', 'Fire', 'Commercial'],
    avatar: '/team/david.jpeg',
    verified: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    region: 'West Coast',
    availability: 'In 2 Weeks',
    rating: 4.9,
    specialties: ['Earthquake', 'Wildfire', 'Residential'],
    avatar: '/team/sav.jpg',
    verified: true,
  },
  {
    id: '3',
    name: 'Peter Jones',
    region: 'Southeast',
    availability: 'Available Now',
    rating: 4.7,
    specialties: ['Hurricane', 'Tornado', 'Large Loss'],
    avatar: '/team/minh.jpg',
    verified: true,
  },
    {
    id: '4',
    name: 'Kaz Williams',
    region: 'Midwest',
    availability: 'Available Now',
    rating: 4.6,
    specialties: ['Hail', 'Wind Damage', 'Farming Claims'],
    avatar: '/team/kaz.jpg',
    verified: true,
  },
];

export default function PubAdjustOptPage() {
  const [showAdjusters, setShowAdjusters] = useState(false);
  const [selectedAdjuster, setSelectedAdjuster] = useState<Adjuster | null>(null);
  const { toast } = useToast();

  const handleSelectAdjuster = (adjuster: Adjuster) => {
    setSelectedAdjuster(adjuster);
    toast({
      title: 'Adjuster Selected',
      description: `You have selected ${adjuster.name}. Proceed to schedule.`,
    });
  };

  const handleSchedule = () => {
    if (selectedAdjuster) {
      // Here you would typically have more logic:
      // 1. Open a scheduling modal/calendar
      // 2. Send a notification to the adjuster (API call)
      // For now, we just show a toast.
      toast({
        title: 'Scheduling Request Sent',
        description: `A notification has been sent to ${selectedAdjuster.name} to review your documents.`,
      });
      // After scheduling, you might want to redirect or update UI
    }
  };
  
  const handleNoThanks = () => {
    setShowAdjusters(false);
    toast({
        title: "No Problem",
        description: "You can proceed with your claim. You can always hire an adjuster later.",
    })
  }

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
            <CardTitle className="text-3xl font-bold text-gray-800">Need a Public Adjuster?</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              A Public Adjuster can help you get a fair settlement from your insurance company. They work for you, not the insurer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Based on your claim details, hiring a Public Adjuster might be beneficial. They can manage your claim, document the damage, and negotiate with your insurance provider to maximize your payout. Would you like to see a list of Vendle-verified public adjusters in your area?
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => setShowAdjusters(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">Yes, Show Me Adjusters</Button>
              <Button onClick={handleNoThanks} size="lg" variant="outline">No, Thanks</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showAdjusters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Verified Public Adjusters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicAdjusters.map((adjuster) => (
                <Card key={adjuster.id} className={`transition-all duration-300 hover:shadow-xl ${selectedAdjuster?.id === adjuster.id ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16 border-2 border-gray-200">
                        <AvatarImage src={adjuster.avatar} alt={adjuster.name} />
                        <AvatarFallback>{adjuster.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          {adjuster.name}
                          {adjuster.verified && <ShieldCheck className="w-5 h-5 ml-2 text-green-500" />}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <div className="flex items-center mr-4">
                            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" /> {adjuster.rating}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" /> {adjuster.region}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-2" /> Availability: <span className="font-semibold ml-1">{adjuster.availability}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {adjuster.specialties.map(spec => (
                          <span key={spec} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{spec}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleSelectAdjuster(adjuster)}>
                      <Mail className="w-4 h-4 mr-2" /> Contact
                    </Button>
                    <Button 
                        onClick={() => handleSelectAdjuster(adjuster)}
                        disabled={selectedAdjuster?.id === adjuster.id}
                        className="bg-green-500 hover:bg-green-600"
                    >
                      Choose Adjuster
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {selectedAdjuster && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Next Step: Schedule with {selectedAdjuster.name}</h3>
                <p className="text-gray-600 mb-4">
                  Once you schedule, {selectedAdjuster.name} will be notified to review your documents or schedule a site visit. They will then upload a revised report and a new estimate to your project profile.
                </p>
                <Button onClick={handleSchedule} size="lg" className="bg-blue-600 hover:bg-blue-700">Schedule & Notify Adjuster</Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 