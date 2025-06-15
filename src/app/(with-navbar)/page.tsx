"use client"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, Play } from "lucide-react"
import { Inter } from "next/font/google"
import { useState, useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DotsBackground from "@/components/DotsBackground"

const inter = Inter({ subsets: ["latin"] })

export default function HomePage() {
  const user = null
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Refs for each section
  const heroRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const whyWeShineRef = useRef<HTMLDivElement>(null)
  const statisticsRef = useRef<HTMLDivElement>(null)
  const newsletterRef = useRef<HTMLDivElement>(null)

  // Scroll animations for each section
  const heroScroll = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const howItWorksScroll = useScroll({
    target: howItWorksRef,
    offset: ["start start", "end start"],
  })

  const whyWeShineScroll = useScroll({
    target: whyWeShineRef,
    offset: ["start start", "end start"],
  })

  const statisticsScroll = useScroll({
    target: statisticsRef,
    offset: ["start start", "end start"],
  })

  const newsletterScroll = useScroll({
    target: newsletterRef,
    offset: ["start start", "end start"],
  })

  // Transform values for each section
  const heroY = useTransform(heroScroll.scrollYProgress, [0, 1], ["0%", "50%"])
  const heroOpacity = useTransform(heroScroll.scrollYProgress, [0, 0.5], [1, 0])

  const howItWorksY = useTransform(howItWorksScroll.scrollYProgress, [0, 1], ["0%", "50%"])
  const howItWorksOpacity = useTransform(howItWorksScroll.scrollYProgress, [0, 0.5], [1, 0])

  const whyWeShineY = useTransform(whyWeShineScroll.scrollYProgress, [0, 1], ["0%", "50%"])
  const whyWeShineOpacity = useTransform(whyWeShineScroll.scrollYProgress, [0, 0.5], [1, 0])

  const statisticsY = useTransform(statisticsScroll.scrollYProgress, [0, 1], ["0%", "50%"])
  const statisticsOpacity = useTransform(statisticsScroll.scrollYProgress, [0, 0.5], [1, 0])

  const newsletterY = useTransform(newsletterScroll.scrollYProgress, [0, 1], ["0%", "50%"])
  const newsletterOpacity = useTransform(newsletterScroll.scrollYProgress, [0, 0.5], [1, 0])

  // Parallax image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 5)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Smooth animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <div className={`min-h-screen bg-white ${inter.className} relative overflow-x-hidden`}>
      {/* hero / top page */}
      <motion.div ref={heroRef} className="relative min-h-screen flex" style={{ y: heroY, opacity: heroOpacity }}>
        {/* parallax image*/}
        <div className="w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #e6eef7 0%, #f3f4f6 50%, #e6eef7 100%)" }}
          >
            <DotsBackground color="#1a365d" opacity={0.13} />
          </div>
          <div className="absolute inset-0">
            {[1, 2, 3, 4, 5].map((num, index) => (
              <motion.div
                key={num}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{
                  opacity: index === currentImageIndex ? 1 : 0,
                  scale: index === currentImageIndex ? 1 : 1.05,
                }}
                transition={{
                  duration: 2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  backgroundImage: `url(/plax${num}.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        {/* right half content */}
        <div className="w-1/2 flex items-center relative">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #e6eef7 0%, #f3f4f6 50%, #e6eef7 100%)" }}
          >
            <DotsBackground color="#1a365d" opacity={0.13} />
          </div>
          <div className="container mx-auto px-12 relative z-10">
            <motion.div className="max-w-xl" initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div className="flex items-center gap-4 mb-8" variants={fadeInUp}>
                <div className="relative">
                  <Image
                    src="/vendle_logo.jpg"
                    alt="Vendle Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                    priority
                  />
                </div>
                <Badge className="px-4 py-2 text-xs bg-blue-100 text-blue-800 border-0 rounded-full font-medium">
                  DISASTER RECOVERY MADE SIMPLE
                </Badge>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]"
                variants={fadeInUp}
              >
                RECONSTRUCTION?{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  VENDLE IT.
                </span>
              </motion.h1>

              <motion.p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg" variants={fadeInUp}>
                Navigate the post-disaster reconstruction process with ease. Connect with trusted contractors, ensure
                fair pricing, and experience transparent communication.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
                <Link href={user ? "/start-claim" : "/signup"}>
                  <Button
                    size="lg"
                    className="group bg-[#1a365d] hover:bg-[#1a365d]/90 text-white rounded-2xl px-10 py-4 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    START RECOVERY
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-gray-200 hover:border-blue-200 rounded-2xl px-10 py-4 text-base font-medium transition-all duration-300 hover:bg-blue-50"
                >
                  <Play className="mr-3 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* how it works sec*/}
      <motion.section
        ref={howItWorksRef}
        className="py-32 relative"
        style={{ y: howItWorksY, opacity: howItWorksOpacity }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #e6eef7 0%, #f3f4f6 50%, #e6eef7 100%)" }}
        >
          <DotsBackground color="#1a365d" opacity={0.13} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="flex items-center justify-center gap-3 mb-4" variants={fadeInUp}>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
              </div>
              <span className="uppercase tracking-wider text-sm text-gray-500 font-semibold">How It Works</span>
            </motion.div>

            <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight" variants={fadeInUp}>
              THE                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  VENDLE
                </span> PROCESS
            </motion.h2>

            <motion.p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" variants={fadeInUp}>
              Automate your entire reconstruction workflow so you recover more, with less effort.
            </motion.p>
          </motion.div>

          <VendleSteps />

          {/* Feature Tags */}
          <motion.div
            className="max-w-6xl mx-auto mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="flex flex-wrap justify-center gap-3">
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
                  className="px-6 py-3 bg-white rounded-full text-gray-700 text-sm font-medium shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* features sec */}
      <motion.section
        ref={whyWeShineRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: whyWeShineY, opacity: whyWeShineOpacity }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #e6eef7 0%, #f3f4f6 50%, #e6eef7 100%)" }}
        >
          <DotsBackground color="#1a365d" opacity={0.13} />
        </div>
        <ParallaxBackground />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-12" variants={fadeInUp}>
              OUR FEATURES
            </motion.h2>

            <motion.div
              className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl"
              variants={fadeInUp}
            >
              <ModernFeaturesList />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        ref={statisticsRef}
        className="py-32 relative"
        style={{ y: statisticsY, opacity: statisticsOpacity }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #e6eef7 0%, #f3f4f6 50%, #e6eef7 100%)" }}
        >
          <DotsBackground color="#1a365d" opacity={0.13} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" variants={fadeInUp}>
              STATISTICS
            </motion.h2>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" variants={fadeInUp}>
              Real numbers that demonstrate our impact on disaster recovery and reconstruction
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                stat: "85%",
                title: "Faster Recovery Time",
                desc: "Our streamlined process reduces reconstruction time from months to weeks, getting families back home faster.",
              },
              {
                stat: "70%",
                title: "Lower Project Costs",
                desc: "Our competitive bidding system and transparent pricing save homeowners thousands on reconstruction costs.",
              },
              {
                stat: "$50B+",
                title: "Recovered Annually",
                desc: "We've helped homeowners recover billions in insurance claims and reconstruction costs across the US.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-3xl p-10 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-4">
                  {item.stat}
                </h3>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h4>
                <p className="text-gray-600 mb-8 leading-relaxed">{item.desc}</p>
                <Link href="/signup">
                  <Button className="group bg-[#1a365d] hover:bg-[#1a365d]/90 text-white rounded-xl transition-all duration-300 hover:scale-105">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter & Footer Section */}
      <motion.section
        ref={newsletterRef}
        className="relative min-h-[700px] overflow-hidden"
        style={{ y: newsletterY, opacity: newsletterOpacity }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/loop_vid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-24">
          {/* Newsletter */}
          <motion.div
            className="max-w-2xl mx-auto text-center mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-6" variants={fadeInUp}>
              Stay Updated
            </motion.h2>
            <motion.p className="text-xl text-gray-200 mb-10 leading-relaxed" variants={fadeInUp}>
              Get the latest updates on disaster recovery and reconstruction.
            </motion.p>
            <motion.form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" variants={fadeInUp}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button className="bg-[#1a365d] hover:bg-[#1a365d]/90 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105">
                Subscribe
              </Button>
            </motion.form>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="grid md:grid-cols-4 gap-12 text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Image
                src="/vendle_logo.jpg"
                alt="Vendle Logo"
                width={120}
                height={40}
                className="mb-6 brightness-0 invert"
              />
              <p className="text-gray-300 leading-relaxed">
                Your trusted partner for home recovery and reconstruction.
              </p>
            </motion.div>

            {[
              {
                title: "Services",
                links: ["Contractor Matching", "Adjuster Certification", "Blind Bidding", "Project Management"],
              },
              {
                title: "Company",
                links: ["About Us", "How It Works", "For Contractors", "Contact"],
              },
              {
                title: "Legal",
                links: ["Terms of Service", "Privacy Policy", "Cookie Policy"],
              },
            ].map((section, index) => (
              <motion.div key={section.title} variants={fadeInUp}>
                <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 pt-8 border-t border-white/20 text-center text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p>© {new Date().getFullYear()} Vendle. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

function ModernFeaturesList() {
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
    <div className="space-y-3">
      {features.map((feature, index) => {
        const isActive = activeIndex === index
        return (
          <div
            key={index}
            className={`
              group cursor-pointer transition-all duration-300 ease-out
              ${isActive ? "bg-white/20" : "hover:bg-white/10"}
              rounded-2xl border border-white/20 hover:border-white/40
              ${isActive ? "shadow-xl border-white/40" : "hover:shadow-lg"}
              p-6
            `}
            onClick={() => setActiveIndex(isActive ? null : index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-white text-sm">
                  +
                </div>
                <h3
                  className={`font-semibold text-lg transition-colors duration-300 ${isActive ? "text-white" : "text-white/90 group-hover:text-white"}`}
                >
                  {feature.title}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ willChange: "transform" }}
              >
                <ChevronDown
                  size={20}
                  className={`transition-colors duration-300 ${isActive ? "text-white" : "text-white/60 group-hover:text-white/80"}`}
                />
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden pt-4 pl-12"
                >
                  <p className="text-white/80 leading-relaxed">{feature.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

function ParallaxBackground() {
  const [current, setCurrent] = useState(0)
  const images = [6, 7, 8, 9, 10]

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="absolute inset-0 w-full h-full">
      {images.map((num, idx) => (
        <motion.div
          key={num}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: idx === current ? 1 : 0,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(/plax${num}.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
    </div>
  )
}

function VideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-slate-900 to-black"
        style={{
          backgroundImage: `url(/placeholder.svg?height=800&width=1200)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
    </div>
  )
}

//function for the steps
function VendleSteps() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      num: 1,
      title: "Share Project Details",
      desc: "Provide clear details about your project through our easy-to-follow forms with guided inputs and intuitive file uploads.",
    },
    {
      num: 2,
      title: "Expert Review (Optional)",
      desc: "Our third-party adjusters can review and negotiate your damage estimate for financial clarity and peace of mind.",
    },
    {
      num: 3,
      title: "Compare Contractor Bids",
      desc: "Receive and compare competitive bids from verified contractors side-by-side, reviewing costs, timelines, and ratings.",
    },
    {
      num: 4,
      title: "Collaborate Seamlessly",
      desc: "Connect with your chosen contractor via user-friendly messaging, scheduling, and document sharing.",
    },
    {
      num: 5,
      title: "Track Progress & Pay Securely",
      desc: "Monitor your project with visual updates and pay securely through our milestone-based payment system.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Progress line */}
      <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200 rounded-full mx-[10%] z-0">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          animate={{ width: `${((activeStep + 1) / 5) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      {/* step cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
        {steps.map((step, index) => {
          const isCurrent = activeStep === index
          const isPast = activeStep > index

          return (
            <motion.div
              key={step.num}
              className="bg-white rounded-3xl border-2 shadow-lg p-8 flex flex-col items-center text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              animate={{
                borderColor: isCurrent ? "#1a365d" : isPast ? "#1a365d" : "#e5e7eb",
                scale: isCurrent ? 1.05 : 1,
              }}
            >
              {/* to control number of steps animation */}
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 relative z-20"
                animate={{
                  backgroundColor: isCurrent ? "#1a365d" : isPast ? "#1a365d" : "#6b7280",
                  scale: isCurrent ? 1.2 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {step.num}
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
