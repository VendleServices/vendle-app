"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, ShieldCheck, UserCheck, ClipboardCheck } from "lucide-react"
import { Inter } from "next/font/google"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const inter = Inter({ subsets: ['latin'] })

export default function HomePage() {
  // Mock auth state - replace with your actual auth context
  const user = null

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
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="mb-8">
              <Image
                src="/vendle_logo.jpg"
                alt="Vendle Logo"
                width={120}
                height={40}
                className="mx-auto"
                priority
              />
            </div>

            <Badge className="mb-6 px-4 py-1.5 text-sm bg-purple-50 text-purple-700 hover:bg-purple-50 border border-purple-100">
              DISASTER RECOVERY MADE SIMPLE
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight uppercase">
              RECONSTRUCTION?{" "}
              <span className="text-purple-700">
                VENDLE IT.
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Navigate the post-disaster reconstruction process with ease. Connect with trusted contractors, ensure fair
              pricing, and experience transparent communication.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href={user ? "/start-claim" : "/signup"}>
                <Button
                  size="lg"
                  className="bg-purple-700 hover:bg-purple-800 text-white rounded-lg px-8 transition-colors duration-200"
                >
                  START RECOVERY
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="rounded-lg px-8 border-gray-200 hover:bg-gray-50">
                  HOW IT WORKS
                </Button>
              </Link>
            </div>

            {/* Two Column Section */}
            <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Why Vendle Section */}
              <motion.div
                className="bg-white border-l-4 border-purple-500 rounded-2xl p-8 shadow-sm flex flex-col gap-4 items-center text-center max-w-full transition-all duration-300 min-h-[320px]"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ minWidth: '340px' }}
              >
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight leading-tight text-center">Why Vendle?</h2>
                <div className="flex flex-col gap-2 w-full">
                  {/* Feature Accordions */}
                  {[{
                    icon: <ShieldCheck className="h-5 w-5 text-purple-700" />, title: "Verified Contractors", desc: "All contractors are thoroughly vetted and verified for quality and reliability."
                  }, {
                    icon: <UserCheck className="h-5 w-5 text-purple-700" />, title: "Certified Adjusters", desc: "Professional adjusters ensure accurate damage assessment and fair settlements."
                  }, {
                    icon: <ClipboardCheck className="h-5 w-5 text-purple-700" />, title: "Transparent Bidding", desc: "Get fair market value through our blind bidding system, free from price inflation."
                  }].map((item, i) => {
                    const [open, setOpen] = useState(false);
                    return (
                      <motion.div
                        key={item.title}
                        className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl border border-purple-100 bg-white shadow-sm cursor-pointer transition-all duration-200 ${open ? 'bg-purple-50' : ''}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 + i * 0.1, type: 'spring', bounce: 0.3 }}
                        onClick={() => setOpen((v) => !v)}
                      >
                        <motion.div animate={{ scale: open ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                          {item.icon}
                        </motion.div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug">{item.title}</h3>
                            <span className="ml-2 text-purple-500 text-xs">{open ? '▲' : '▼'}</span>
                          </div>
                          <motion.div
                            initial={false}
                            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-normal mt-1">{item.desc}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Steps to Rebuild Section */}
              <motion.div
                className="bg-white border-l-4 border-purple-500 rounded-2xl p-8 shadow-sm flex flex-col gap-4 items-center text-center max-w-full transition-all duration-300 min-h-[320px]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ minWidth: '340px' }}
              >
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight leading-tight text-center">Steps to Rebuild</h2>
                <div className="relative flex flex-col gap-2 w-full items-center">
                  {/* Timeline vertical line with animation */}
                  <motion.div
                    className="absolute left-6 top-6 bottom-6 w-1 bg-purple-200 z-0 rounded-full"
                    initial={{ height: 0 }}
                    whileInView={{ height: 'calc(100% - 3rem)' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ minHeight: '2rem' }}
                  />
                  {/* Step Accordions */}
                  {[{
                    num: 1, title: "Share Project Details", desc: "Tell us about your rebuild needs and upload your insurance estimate."
                  }, {
                    num: 2, title: "Connect with Contractors", desc: "Review profiles of qualified contractors in your area."
                  }, {
                    num: 3, title: "Compare Blind Bids", desc: "Receive transparent bids based on fair market value."
                  }].map((item, i) => {
                    const [open, setOpen] = useState(false);
                    return (
                      <motion.div
                        key={item.title}
                        className={`flex items-center gap-4 w-full px-4 py-2 rounded-xl border border-purple-100 bg-white shadow-sm cursor-pointer transition-all duration-200 relative z-10 ${open ? 'bg-purple-50' : ''}`}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 + i * 0.1, type: 'spring', bounce: 0.3 }}
                        onClick={() => setOpen((v) => !v)}
                      >
                        <motion.div animate={{ scale: open ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-700 text-white font-bold text-sm md:text-base">{item.num}</motion.div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug">{item.title}</h3>
                            <span className="ml-2 text-purple-500 text-xs">{open ? '▲' : '▼'}</span>
                          </div>
                          <motion.div
                            initial={false}
                            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-normal mt-1">{item.desc}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
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
              <Image
                src="/vendle_logo.jpg"
                alt="Vendle Logo"
                width={100}
                height={32}
                className="mb-4"
              />
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
