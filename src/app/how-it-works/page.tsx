"use client"
import React from 'react';
import { PageTransition, SlideUpTransition } from '@/lib/transitions';
import { 
  FileText, 
  ShieldCheck, 
  Users, 
  CheckCheck, 
  MessageCircle, 
  Clock, 
  CreditCard 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Button from '@/components/Button';
import Link from "next/link"

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Share Your Project Details",
      prompt: "Tell us about your project!",
      description: "Provide clear details about your project through our easy-to-follow forms with guided inputs, helpful examples, and intuitive file uploads.",
      icon: <FileText className="h-12 w-12 text-vendle-blue" />,
      color: "bg-blue-50",
    },
    {
      id: 2,
      title: "Optional Expert Review & Adjuster Negotiation",
      prompt: "Let our experts ensure you're covered.",
      description: "Our third-party adjusters can review, negotiate, and validate your damage estimate, giving you peace of mind and financial clarity.",
      icon: <ShieldCheck className="h-12 w-12 text-vendle-teal" />,
      color: "bg-green-50",
      optional: true
    },
    {
      id: 3,
      title: "Get Competitive Bids from Contractors",
      prompt: "Your project is open! Bids are on their way.",
      description: "Watch as verified contractors send competitive bids for your project, with clear information on costs, timelines, and scope.",
      icon: <Users className="h-12 w-12 text-vendle-blue" />,
      color: "bg-blue-50"
    },
    {
      id: 4,
      title: "Compare & Select the Best Contractor",
      prompt: "Compare bids effortlessly.",
      description: "Our interactive dashboard lets you compare contractor bids side-by-side, including pricing, timelines, ratings, and previous customer feedback.",
      icon: <CheckCheck className="h-12 w-12 text-vendle-teal" />,
      color: "bg-green-50"
    },
    {
      id: 5,
      title: "Connect & Engage",
      prompt: "Seamlessly communicate with your chosen contractor.",
      description: "Enjoy a user-friendly messaging and scheduling interface for easy communication, document sharing, and appointment scheduling.",
      icon: <MessageCircle className="h-12 w-12 text-vendle-blue" />,
      color: "bg-blue-50"
    },
    {
      id: 6,
      title: "Track Your Project's Progress",
      prompt: "Track progress with ease.",
      description: "Our visually engaging progress tracking tools keep you updated with regular check-ins and milestone notifications throughout your project.",
      icon: <Clock className="h-12 w-12 text-vendle-teal" />,
      color: "bg-green-50"
    },
    {
      id: 7,
      title: "Secure & Transparent Payment System",
      prompt: "Pay confidently at each step.",
      description: "Our intuitive payment system features milestone-based payments and progress verification checkpoints, ensuring security and accountability.",
      icon: <CreditCard className="h-12 w-12 text-vendle-blue" />,
      color: "bg-blue-50"
    }
  ];

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-20 pt-24">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <SlideUpTransition className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-vendle-navy mb-4">How Vendle Works</h1>
          <p className="text-xl text-vendle-navy/70 max-w-3xl mx-auto">
            Simplifying disaster recovery and property repair with an intuitive, modern user experience.
          </p>
        </SlideUpTransition>

        <Tabs defaultValue="visual" className="mb-12">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="visual">Visual Journey</TabsTrigger>
              <TabsTrigger value="steps">Step-by-Step Guide</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="visual" className="mt-0">
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-1 bg-vendle-gray/30 -translate-x-1/2 z-0"></div>
              
              <div className="space-y-16 relative z-10">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUpVariant}
                    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="mb-2 inline-block">
                        {step.optional && (
                          <span className="bg-vendle-sand/30 text-vendle-navy px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block mr-2">
                            Optional
                          </span>
                        )}
                        <span className="bg-vendle-blue/10 text-vendle-blue px-3 py-1 rounded-full text-xs font-medium">
                          Step {step.id}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-vendle-navy mb-2">{step.title}</h3>
                      <p className="text-vendle-navy/80 mb-3 italic">"{step.prompt}"</p>
                      <p className="text-vendle-navy/70">{step.description}</p>
                    </div>
                    
                    <div className="hidden md:flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center shadow-subtle z-10`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1 md:hidden">
                      <div className={`w-16 h-16 mx-auto rounded-full ${step.color} flex items-center justify-center shadow-subtle z-10 mb-4`}>
                        {step.icon}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="steps">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-medium transition-shadow duration-300">
                    <CardHeader className={`${step.color} rounded-t-lg`}>
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-white rounded-lg shadow-subtle">
                          {step.icon}
                        </div>
                        <span className="bg-vendle-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                          Step {step.id}
                        </span>
                      </div>
                      <CardTitle className="mt-4">{step.title}</CardTitle>
                      {step.optional && (
                        <span className="bg-vendle-sand/60 text-vendle-navy px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block">
                          Optional
                        </span>
                      )}
                      <CardDescription className="mt-2 text-lg font-medium italic text-vendle-navy/80">
                        "{step.prompt}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-vendle-navy/70">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <SlideUpTransition delay={0.3} className="text-center mt-16">
          <h2 className="text-3xl font-bold text-vendle-navy mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-vendle-navy/70 max-w-2xl mx-auto mb-8">
            Vendle makes navigating disaster recovery smooth, transparent, and stress-free, from the first report to final completion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/start-claim/insurance/onboarding">
              <Button size="lg" className="min-w-44">
                Start Your Project
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="min-w-44">
                Learn More
              </Button>
            </Link>
          </div>
        </SlideUpTransition>
      </div>
    </PageTransition>
  );
};

export default HowItWorks;
