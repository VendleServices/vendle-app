"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Landmark, Banknote, ShieldCheck, TrendingUp, Info, CheckCircle } from 'lucide-react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function SecFundPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fundingCompleted, setFundingCompleted] = useState(false);
  const router = useRouter();

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleLoanSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("Loan Application Submitted", {
        description: "Your application is being processed. We will notify you upon approval.",
    });
    setFundingCompleted(true);
    // Navigate to inspection page after 3 seconds
    setTimeout(() => {
      router.push('/inspection-plan');
    }, 3000);
  }
  
  const handleFundTransfer = () => {
      toast("Awaiting Transfer", {
          description: "Please follow the instructions to complete the bank transfer.",
      });
      setFundingCompleted(true);
      // Navigate to inspection page after 3 seconds
      setTimeout(() => {
        router.push('/inspection-plan');
      }, 3000);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        className="mt-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!fundingCompleted ? (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800">Secure Project Funding</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Choose a funding source to ensure your project is financially secured. Funds will be held in a secure escrow account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SBA Disaster Loan */}
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-xl hover:border-blue-500 ${selectedOption === 'sba' ? 'border-blue-500 border-2' : ''}`}
                  onClick={() => handleSelectOption('sba')}
                >
                  <CardHeader>
                      <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                              <Landmark className="w-6 h-6 text-blue-600" />
                          </div>
                          <CardTitle>SBA Disaster Loan</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Access low-interest, long-term loans from the Small Business Administration to repair or replace damaged property.</p>
                  </CardContent>
                </Card>

                {/* Vendle Financial Partners */}
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-xl hover:border-green-500 ${selectedOption === 'vendle' ? 'border-green-500 border-2' : ''}`}
                  onClick={() => handleSelectOption('vendle')}
                >
                  <CardHeader>
                      <div className="flex items-center space-x-4">
                          <div className="p-3 bg-green-100 rounded-full">
                              <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                          <CardTitle>Vendle Financial Partners</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Explore pre-approved loan offers from our network of trusted financial partners, tailored for restoration projects.</p>
                  </CardContent>
                </Card>

                {/* Emergency Funds */}
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-xl hover:border-yellow-500 ${selectedOption === 'emergency' ? 'border-yellow-500 border-2' : ''}`}
                  onClick={() => handleSelectOption('emergency')}
                >
                  <CardHeader>
                      <div className="flex items-center space-x-4">
                          <div className="p-3 bg-yellow-100 rounded-full">
                              <Banknote className="w-6 h-6 text-yellow-600" />
                          </div>
                          <CardTitle>Emergency Funds</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Use your own emergency funds. Securely transfer the amount to your project's escrow account.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : (
          <motion.div
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
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your funds are ready!</h1>
                <p className="text-lg text-gray-600 mb-8">Next, let's plan your rebuild.</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Preparing your inspection plan...</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedOption && !fundingCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {selectedOption === 'sba' && (
              <Card>
                <CardHeader><CardTitle>SBA Loan Application</CardTitle></CardHeader>
                <CardContent>
                    <p className='text-sm mb-4 text-gray-600'>You may be pre-approved for an SBA Disaster Loan. Please provide some basic financial information to proceed.</p>
                    <form onSubmit={handleLoanSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="income">Annual Income</Label>
                            <Input id="income" type="number" placeholder="e.g., 50000" required />
                        </div>
                        <div>
                            <Label htmlFor="credit-score">Estimated Credit Score</Label>
                            <Input id="credit-score" type="number" placeholder="e.g., 700" required />
                        </div>
                        <Button type="submit">Submit Application</Button>
                    </form>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">On approval, funds will be deposited into an escrow account and we will confirm the loan amount and repayment terms.</p>
                </CardFooter>
              </Card>
            )}
            
            {selectedOption === 'vendle' && (
              <Card>
                <CardHeader><CardTitle>Vendle Partners Loan Application</CardTitle></CardHeader>
                <CardContent>
                    <p className='text-sm mb-4 text-gray-600'>Our partners offer competitive rates. Let's get your application started.</p>
                    <form onSubmit={handleLoanSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="loan-amount">Requested Loan Amount</Label>
                            <Input id="loan-amount" type="number" placeholder="e.g., 25000" required />
                        </div>
                         <div>
                            <Label htmlFor="income-vendle">Annual Income</Label>
                            <Input id="income-vendle" type="number" placeholder="e.g., 50000" required />
                        </div>
                        <Button type="submit">Check Offers</Button>
                    </form>
                </CardContent>
                 <CardFooter>
                  <p className="text-xs text-gray-500">On approval, funds will be deposited into an escrow account and we will confirm the loan amount and repayment terms.</p>
                </CardFooter>
              </Card>
            )}

            {selectedOption === 'emergency' && (
              <Card>
                <CardHeader><CardTitle>Secure Bank Transfer</CardTitle></CardHeader>
                <CardContent>
                  <p className='text-sm mb-4 text-gray-600'>Please transfer the required project funds to the following bank account. The funds will be held securely in escrow.</p>
                  <div className="p-4 bg-gray-50 rounded-md border">
                    <p><strong>Bank Name:</strong> Vendle Escrow Services</p>
                    <p><strong>Account Number:</strong> 123-456-7890</p>
                    <p><strong>Routing Number:</strong> 0987654321</p>
                    <p className="mt-2 text-red-600"><strong>Important:</strong> Please include your project ID as the transfer reference.</p>
                  </div>
                  <Button onClick={handleFundTransfer} className="mt-4">I Have Transferred the Funds</Button>
                </CardContent>
                 <CardFooter>
                  <p className="text-xs text-gray-500">We will notify you once the transfer is confirmed and the amount is deposited into the escrow account.</p>
                </CardFooter>
              </Card>
            )}
            
            <div className="mt-8 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-semibold text-indigo-800">Escrow Investment Opportunity</h3>
                        <div className="mt-2 text-sm text-indigo-700">
                            <p>For projects expected to last longer than 6 months, your escrow funds can be invested in a high-yield savings account or short-term treasury securities to grow while you wait. We will record and provide all investment terms for your review.</p>
                        </div>
                    </div>
                </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 