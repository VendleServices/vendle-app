"use client"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ShieldCheck, UserCheck, ClipboardCheck, ChevronDown } from "lucide-react"
import { Inter } from "next/font/google"
import { useState } from "react"
import { useParallaxImages } from "@/hooks/useParallaxImages"
import React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DotsBackground from "@/components/DotsBackground"

const inter = Inter({ subsets: ["latin"] })

export default function HomePage() {
  // Mock auth state - replace with your actual auth context
  const user = null
  const currentImageIndex = useParallaxImages(5)

  // Animation variants with reduced motion
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className={`min-h-screen bg-white ${inter.className} relative overflow-x-hidden`}>
      {/* Subtle star/dot background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <svg width="100%" height="100%" className="w-full h-full" style={{ opacity: 0.13 }}>
          <defs>
            <pattern id="starfield" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="#222" />
              <circle cx="30" cy="10" r="0.7" fill="#222" />
              <circle cx="20" cy="30" r="0.6" fill="#222" />
              <circle cx="35" cy="35" r="0.8" fill="#222" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#starfield)" />
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex">
        {/* Parallax Section - Left Half */}
        <div
          className="w-1/2 relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #ede9fe 0%, #f3f4f6 100%)" }}
        >
          <DotsBackground color="#a78bfa" opacity={0.18} />
          <div className="absolute inset-0">
            {[1, 2, 3, 4, 5].map((num, index) => (
              <motion.div
                key={num}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index === currentImageIndex ? 1 : 0,
                  scale: index === currentImageIndex ? 1.1 : 1.05,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundImage: `url(/plax${num}.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* Content Section - Right Half */}
        <div
          className="w-1/2 flex items-center relative"
          style={{ background: "linear-gradient(180deg, #ede9fe 0%, #f3f4f6 100%)" }}
        >
          <DotsBackground color="#a78bfa" opacity={0.13} />
          <div className="container mx-auto px-8 relative z-10">
            <motion.div className="max-w-xl text-left" initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/vendle_logo.jpg"
                  alt="Vendle Logo"
                  width={90}
                  height={30}
                  className="h-7 w-auto"
                  priority
                />
                <Badge className="px-3 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-100">
                  DISASTER RECOVERY MADE SIMPLE
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 leading-tight uppercase">
                RECONSTRUCTION? <span className="text-purple-700">VENDLE IT.</span>
              </h1>

              <p className="text-base text-gray-600 mb-8 max-w-md">
                Navigate the post-disaster reconstruction process with ease. Connect with trusted contractors, ensure
                fair pricing, and experience transparent communication.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={user ? "/start-claim" : "/signup"}>
                  <Button
                    size="lg"
                    className="bg-purple-700 hover:bg-purple-800 text-white rounded-lg px-8 transition-colors duration-200"
                  >
                    START RECOVERY
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          {/* Curved SVG transition at the bottom */}
          <div className="absolute left-0 bottom-0 w-full" style={{ pointerEvents: "none", zIndex: 20 }}>
            <svg viewBox="0 0 800 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20">
              <path d="M0 0C150 80 650 0 800 80V80H0V0Z" fill="#ede9fe" />
            </svg>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section
        className="py-20 w-full relative"
        style={{ background: "linear-gradient(180deg, #ede9fe 0%, #f3f4f6 100%)" }}
      >
        <DotsBackground color="#a78bfa" opacity={0.13} />
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Label */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" stroke="#6B7280" strokeWidth="2" />
              <path d="M10 6v4l2 2" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="uppercase tracking-wider text-xs text-gray-500 font-semibold">Product</span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 leading-tight uppercase text-center"
            style={{ letterSpacing: "0.01em" }}
          >
            How it Works ?
          </h2>
          <p className="text-base text-gray-600 mb-8 text-center max-w-lg mx-auto">
            Automate your entire reconstruction workflow so you recover more, with less effort.
          </p>

          {/* Steps Cards */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  num: 1,
                  title: "Share Project Details",
                  desc: "Your dashboard shows every project across your account, with smart filters and recommendations prioritized by urgency and value.",
                },
                {
                  num: 2,
                  title: "Connect with Contractors",
                  desc: "We pull your data and requirements to generate precise, policy-specific project matches automatically.",
                },
                {
                  num: 3,
                  title: "Compare Blind Bids",
                  desc: "Review and monitor every bid's progress. See what's working, and what's still pending—no more spreadsheets.",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.num}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white text-base font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-sm text-center">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated Buzzwords */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Real-Time Metrics",
                "Policy-Aware Coding",
                "Team Workflows",
                "Smart Denial Triage",
                "Insurance Sync",
                "AI-Generated Bids",
                "EHR Integration",
                "Revenue Insights",
              ].map((word, index) => (
                <motion.div
                  key={word}
                  className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-xs font-medium shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* Curved SVG transition at the bottom, curving into the left and stretching full width */}
        <div className="absolute right-0 bottom-0 w-full" style={{ pointerEvents: "none", zIndex: 20 }}>
          <svg viewBox="0 0 1920 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-32">
            <path d="M1920 0C1560 120 360 0 0 120V120H1920V0Z" fill="#ede9fe" />
          </svg>
        </div>
      </section>

      {/* Why We Shine Section */}
      <section className="relative w-full overflow-hidden m-0 p-0 flex items-center justify-center min-h-[220px] py-6">
        {/* Parallax Full-Width Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <ParallaxImages images={[6,7,8,9,10]} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10" />
        </div>
        {/* Content: Left title and right dropdown, both above parallax */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-row items-center justify-between gap-8 px-4 md:px-0">
          {/* Left: WHY WE SHINE title only */}
          <div className="flex flex-col items-start w-1/3">
            <h2 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg text-left mb-0">
              WHY WE SHINE
            </h2>
          </div>
          {/* Right: Dropdown (wider, shorter, farther right) */}
          <div className="w-2/3 flex justify-end">
            <div className="w-full max-w-3xl rounded-xl bg-white/15 backdrop-blur-xl shadow-lg border border-white/20 p-2">
              <ModernFeaturesList compact />
            </div>
          </div>
        </div>
      </section>

      {/* Steps to Rebuild Section */}
      <section
        className="py-12 w-full relative"
        style={{ background: "linear-gradient(180deg, #ede9fe 0%, #f3f4f6 100%)" }}
      >
        <DotsBackground color="#a78bfa" opacity={0.13} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" stroke="#6B7280" strokeWidth="2" />
              <path d="M10 6v4l2 2" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="uppercase tracking-wider text-xs text-gray-500 font-semibold">Steps to Rebuild</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 text-left">Steps to Rebuild</h2>
          <div className="max-w-4xl mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  num: 1,
                  title: "Share Project Details",
                  desc: "Tell us about your rebuild needs and upload your insurance estimate.",
                },
                {
                  num: 2,
                  title: "Connect with Contractors",
                  desc: "Review profiles of qualified contractors in your area.",
                },
                {
                  num: 3,
                  title: "Compare Blind Bids",
                  desc: "Receive transparent bids based on fair market value.",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.num}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-start h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-700 text-white text-base font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-600 mb-8">
              Get the latest updates on disaster recovery and reconstruction.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="bg-purple-700 hover:bg-purple-800 text-white px-8">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Why Vendle Section */}
              <motion.div
                className="bg-white border-l-4 border-purple-500 rounded-2xl p-8 shadow-sm flex flex-col gap-4 items-center text-center max-w-full transition-all duration-300 min-h-[320px]"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ minWidth: "340px" }}
              >
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight leading-tight text-center">
                  Why Vendle?
                </h2>
                <div className="flex flex-col gap-2 w-full">
                  {/* Feature Accordions */}
                  <WhyVendleFeatures />
                </div>
              </motion.div>

              {/* Steps to Rebuild Section */}
              <motion.div
                className="bg-white border-l-4 border-purple-500 rounded-2xl p-8 shadow-sm flex flex-col gap-4 items-center text-center max-w-full transition-all duration-300 min-h-[320px]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ minWidth: "340px" }}
              >
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight leading-tight text-center">
                  Steps to Rebuild
                </h2>
                <div className="relative flex flex-col gap-2 w-full items-center">
                  {/* Timeline vertical line with animation */}
                  <motion.div
                    className="absolute left-6 top-6 bottom-6 w-1 bg-purple-200 z-0 rounded-full"
                    initial={{ height: 0 }}
                    whileInView={{ height: "calc(100% - 3rem)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ minHeight: "2rem" }}
                  />
                  {/* Step Accordions */}
                  <StepsToRebuildFeatures />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-900 py-16 md:py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <Image src="/vendle_logo.jpg" alt="Vendle Logo" width={100} height={32} className="mb-4" />
              <p className="text-gray-600 mb-4">Your trusted partner for home recovery and reconstruction.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900 uppercase">Services</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Contractor Matching
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Adjuster Certification
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Blind Bidding
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Project Management
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900 uppercase">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    For Contractors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900 uppercase">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Vendle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ModernFeaturesList({ compact = false }: { compact?: boolean }) {
  const features = [
    {
      title: "Prioritized Project Matching",
      desc: "AI-powered matching connects you with the most qualified contractors for your specific project needs.",
    },
    {
      title: "Automated Bid Generation",
      desc: "Smart algorithms generate competitive, fair-market bids based on real-time data and project requirements.",
    },
    {
      title: "End-to-End Project Tracking",
      desc: "Complete visibility from initial assessment to project completion with real-time progress updates.",
    },
    {
      title: "Actionable Analytics",
      desc: "Data-driven insights help optimize costs, timelines, and contractor performance across all projects.",
    },
    {
      title: "Seamless Integration",
      desc: "Direct integration with insurance systems eliminates manual data entry and reduces processing time.",
    },
    {
      title: "Multi-Team Collaboration",
      desc: "Streamlined workflows enable seamless coordination between contractors, adjusters, and homeowners.",
    },
  ]

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className={`space-y-2 ${compact ? 'py-2' : 'py-4'}`}>
      {features.map((feature, index) => {
        const isActive = activeIndex === index
        return (
          <motion.div
            key={index}
            className={`
              group cursor-pointer transition-all duration-300 ease-out
              ${isActive ? "bg-purple-50" : "hover:bg-gray-50"}
              rounded-xl border border-gray-100 hover:border-purple-200
              ${isActive ? "shadow-lg border-purple-200" : "hover:shadow-md"}
              ${compact ? 'p-2' : 'p-6'}
            `}
            onClick={() => setActiveIndex(isActive ? null : index)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center font-bold text-base
                    transition-all duration-300
                    bg-purple-700 text-white
                  `}
                >
                  {index + 1}
                </div>
                <h3
                  className={`
                    font-semibold ${compact ? 'text-base' : 'text-lg'} transition-colors duration-300
                    ${isActive ? "text-purple-700" : "text-gray-900 group-hover:text-purple-600"}
                  `}
                >
                  {feature.title}
                </h3>
              </div>
              <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                <ChevronDown
                  size={compact ? 18 : 20}
                  className={`transition-colors duration-300 ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-purple-500"}`}
                />
              </motion.div>
            </div>
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`overflow-hidden ${compact ? 'pt-1 pl-10' : 'pt-4 pl-14'}`}
                >
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

function ParallaxImages({ images }: { images: number[] }) {
  const [current, setCurrent] = useState(0)
  // Simple auto-rotate
  React.useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 4000)
    return () => clearInterval(timer)
  }, [images.length])
  return (
    <div className="absolute inset-0 w-full h-full">
      {images.map((num: number, idx: number) => (
        <motion.div
          key={num}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: idx === current ? 1 : 0, scale: idx === current ? 1.1 : 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(/plax${num}.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
    </div>
  )
}

function WhyVendleFeatures() {
  const features = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-purple-700" />,
      title: "Verified Contractors",
      desc: "All contractors are thoroughly vetted and verified for quality and reliability.",
    },
    {
      icon: <UserCheck className="h-5 w-5 text-purple-700" />,
      title: "Certified Adjusters",
      desc: "Professional adjusters ensure accurate damage assessment and fair settlements.",
    },
    {
      icon: <ClipboardCheck className="h-5 w-5 text-purple-700" />,
      title: "Transparent Bidding",
      desc: "Get fair market value through our blind bidding system, free from price inflation.",
    },
  ]

  return (
    <>
      {features.map((item, i) => (
        <WhyVendleFeatureItem key={item.title} item={item} i={i} />
      ))}
    </>
  )
}

function WhyVendleFeatureItem({ item, i }: { item: any; i: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl border border-purple-100 bg-white shadow-sm cursor-pointer transition-all duration-200 ${
        open ? "bg-purple-50" : ""
      }`}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 + i * 0.1, type: "spring", bounce: 0.3 }}
      onClick={() => setOpen((v) => !v)}
    >
      <motion.div animate={{ scale: open ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 300 }}>
        {item.icon}
      </motion.div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug">{item.title}</h3>
          <span className="ml-2 text-purple-500 text-xs">{open ? "▲" : "▼"}</span>
        </div>
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-normal mt-1">{item.desc}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function StepsToRebuildFeatures() {
  const features = [
    {
      num: 1,
      title: "Share Project Details",
      desc: "Tell us about your rebuild needs and upload your insurance estimate.",
    },
    {
      num: 2,
      title: "Connect with Contractors",
      desc: "Review profiles of qualified contractors in your area.",
    },
    {
      num: 3,
      title: "Compare Blind Bids",
      desc: "Receive transparent bids based on fair market value.",
    },
  ]

  return (
    <>
      {features.map((item, i) => {
        return <StepsToRebuildFeatureItem key={item.title} item={item} num={i + 1} />
      })}
    </>
  )
}

function StepsToRebuildFeatureItem({ item, num }: { item: any; num: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      key={item.title}
      className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl border border-purple-100 bg-white shadow-sm cursor-pointer transition-all duration-200 relative z-10 ${
        open ? "bg-purple-50" : ""
      }`}
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 + num * 0.1, type: "spring", bounce: 0.3 }}
      onClick={() => setOpen((v) => !v)}
    >
      <motion.div
        animate={{ scale: open ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-700 text-white font-bold text-sm md:text-base"
      >
        {num}
      </motion.div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug">{item.title}</h3>
          <span className="ml-2 text-purple-500 text-xs">{open ? "▲" : "▼"}</span>
        </div>
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-normal mt-1">{item.desc}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
