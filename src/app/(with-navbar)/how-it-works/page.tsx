"use client"
import { useEffect, useRef, useState } from "react"
import { FileText, ShieldCheck, Users, CheckCheck, MessageCircle, Clock, CreditCard, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(-1)
  const [timelineProgress, setTimelineProgress] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      id: 1,
      title: "Share Your Project Details",
      prompt: "Tell us about your project!",
      description:
        "Provide clear details about your project through our easy-to-follow forms with guided inputs, helpful examples, and intuitive file uploads.",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: 2,
      title: "Optional Expert Review & Adjuster Negotiation",
      prompt: "Let our experts ensure you're covered.",
      description:
        "Our third-party adjusters can review, negotiate, and validate your damage estimate, giving you peace of mind and financial clarity.",
      icon: <ShieldCheck className="h-6 w-6" />,
      optional: true,
    },
    {
      id: 3,
      title: "Get Competitive Bids from Contractors",
      prompt: "Your project is open! Bids are on their way.",
      description:
        "Watch as verified contractors send competitive bids for your project, with clear information on costs, timelines, and scope.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      id: 4,
      title: "Compare & Select the Best Contractor",
      prompt: "Compare bids effortlessly.",
      description:
        "Our interactive dashboard lets you compare contractor bids side-by-side, including pricing, timelines, ratings, and previous customer feedback.",
      icon: <CheckCheck className="h-6 w-6" />,
    },
    {
      id: 5,
      title: "Connect & Engage",
      prompt: "Seamlessly communicate with your chosen contractor.",
      description:
        "Enjoy a user-friendly messaging and scheduling interface for easy communication, document sharing, and appointment scheduling.",
      icon: <MessageCircle className="h-6 w-6" />,
    },
    {
      id: 6,
      title: "Track Your Project's Progress",
      prompt: "Track progress with ease.",
      description:
        "Our visually engaging progress tracking tools keep you updated with regular check-ins and milestone notifications throughout your project.",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      id: 7,
      title: "Secure & Transparent Payment System",
      prompt: "Pay confidently at each step.",
      description:
        "Our intuitive payment system features milestone-based payments and progress verification checkpoints, ensuring security and accountability.",
      icon: <CreditCard className="h-6 w-6" />,
    },
  ]

  useEffect(() => {
    // Simple scroll handler to update timeline progress
    const handleScroll = () => {
      if (timelineRef.current && stepsRef.current) {
        const rect = stepsRef.current.getBoundingClientRect()
        const timelineStart = rect.top
        const timelineEnd = rect.bottom
        const viewportHeight = window.innerHeight

        // Calculate how much of the timeline is visible
        const visibleStart = Math.max(0, Math.min(viewportHeight, timelineStart))
        const visibleEnd = Math.max(0, Math.min(viewportHeight, timelineEnd))
        const visibleHeight = visibleEnd - visibleStart

        // Calculate progress based on viewport position
        const progress = Math.min(1, Math.max(0, (window.scrollY - timelineStart + viewportHeight / 2) / rect.height))
        setTimelineProgress(progress)

        // Determine active step based on scroll position
        const stepHeight = rect.height / steps.length
        const currentStep = Math.floor(progress * steps.length)
        setActiveStep(Math.min(steps.length - 1, Math.max(-1, currentStep)))
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial calculation
    setTimeout(handleScroll, 100)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [steps.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            <span className="text-sm font-semibold tracking-wide uppercase">Process Overview</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6 tracking-tight">How Vendle Works</h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            Simplifying disaster recovery and property repair with an intuitive, modern user experience that puts you in
            control.
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative mb-20" ref={timelineRef}>
          {/* Desktop Timeline */}
          <div className="hidden lg:block" ref={stepsRef}>
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-100 transform -translate-x-1/2 rounded-full overflow-hidden">
              <div
                className="w-full bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-700 ease-out rounded-full"
                style={{ height: `${Math.max(5, timelineProgress * 100)}%` }}
              />
            </div>

            <div className="space-y-24">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex items-center gap-12 ${index % 2 === 0 ? "" : "flex-row-reverse"}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <Card
                      className={`bg-white/90 backdrop-blur-sm border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-blue-200 ${
                        activeStep >= index ? "opacity-100 translate-y-0" : "opacity-70 translate-y-4"
                      }`}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          {index % 2 === 0 ? (
                            <>
                              <div className="flex items-center gap-2 ml-auto">
                                {step.optional && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                                  >
                                    Optional
                                  </Badge>
                                )}
                                <Badge className="bg-blue-600 hover:bg-blue-600">Step {step.id}</Badge>
                              </div>
                            </>
                          ) : (
                            <>
                              <Badge className="bg-blue-600 hover:bg-blue-600">Step {step.id}</Badge>
                              {step.optional && (
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                                >
                                  Optional
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-blue-900 mb-3">{step.title}</h3>
                        <p className="text-blue-600 italic mb-3 text-lg">"{step.prompt}"</p>
                        <p className="text-slate-600 leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg ring-4 ring-white transition-all duration-500 ${
                        activeStep >= index ? "scale-100" : "scale-90 opacity-70"
                      }`}
                    >
                      {step.icon}
                    </div>
                    {/* Pulse Ring Animation */}
                    {activeStep === index && (
                      <div className="absolute inset-0 rounded-2xl bg-blue-400 animate-ping opacity-20" />
                    )}
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-8">
            {/* Mobile Timeline Line */}
            <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="w-full bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-700 ease-out rounded-full"
                style={{ height: `${Math.max(5, timelineProgress * 100)}%` }}
              />
            </div>

            {steps.map((step, index) => (
              <Card
                key={step.id}
                className={`bg-white/90 backdrop-blur-sm border border-blue-100 shadow-lg ml-16 transition-all duration-500 ${
                  activeStep >= index ? "opacity-100 translate-x-0" : "opacity-70 translate-x-4"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg flex-shrink-0 -ml-20 transition-all duration-500 ${
                        activeStep >= index ? "scale-100" : "scale-90 opacity-70"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-600 hover:bg-blue-600">Step {step.id}</Badge>
                        {step.optional && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            Optional
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-blue-900 mb-2">{step.title}</h3>
                      <p className="text-blue-600 italic mb-2">"{step.prompt}"</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Grid Overview */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Complete Process Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className="group bg-white/90 backdrop-blur-sm border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {step.id}
                    </Badge>
                    {step.optional && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-blue-900 mb-2 text-lg leading-tight">{step.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                Vendle makes navigating disaster recovery smooth, transparent, and stress-free, from the first report to
                final completion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3 text-lg transition-all duration-300 hover:scale-105"
                >
                  <Link href="/start-claim">
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-blue-300 text-blue-100 hover:bg-blue-800 hover:text-white font-semibold px-8 py-3 text-lg transition-all duration-300"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          75%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default HowItWorks
