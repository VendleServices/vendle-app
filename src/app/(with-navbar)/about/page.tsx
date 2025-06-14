"use client"
import TeamGlobe from "@/components/TeamGlobe"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container relative mx-auto px-6 pt-20 pb-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content Accordion */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8 -mt-8"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="story" className="border-2 border-[#1a365d] rounded-xl shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-accent/10 rounded-t-xl data-[state=open]:rounded-b-none">
                  Our Story
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  <p>
                    Vendle was founded by a group of students from McGill University and Duke University who shared a
                    simple vision: making it easier to find trusted contractors in our local communities.
                  </p>
                  <p className="mt-4">
                    Like many homeowners, we saw firsthand the frustration and uncertainty that came with hiring
                    contractors—whether for routine renovations or urgent repairs. We wanted a solution that was
                    transparent, reliable, and efficient.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mission" className="border-2 border-[#1a365d] rounded-xl shadow-sm bg-white mt-6">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-accent/10 rounded-t-xl data-[state=open]:rounded-b-none">
                  Our Mission
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  <p>
                    As we built our platform, we witnessed the devastating impact of
                    natural disasters—hurricanes, wildfires, and floods—we saw families struggling not just with loss, but
                    with the overwhelming challenge of rebuilding.
                  </p>
                  <p className="mt-4">
                    Finding a fair, trustworthy, and affordable contractor after a disaster was often just as stressful as
                    the event itself. The disaster relief system was broken, leaving homeowners vulnerable to delays,
                    price gouging, and fraud.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex items-center gap-2 px-1">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <div className="h-1 w-1 rounded-full bg-primary/70"></div>
              <div className="h-1 w-1 rounded-full bg-primary/50"></div>
              <div className="h-1 w-1 rounded-full bg-primary/30"></div>
              <div className="h-1 w-1 rounded-full bg-primary/10"></div>
            </div>
          </motion.div>
          {/* Right: Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col justify-center items-center w-full h-[600px] lg:h-[700px] relative bg-white -mt-8"
          >
            <div className="w-full h-full relative">
            <div className="absolute top-12 left-1/2 -translate-x-3 z-15">
  <span className="px-4 py-2 text-xs text-blue-800 font-medium">
    Click the dots to learn more
  </span>
</div>

              <TeamGlobe />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <section className="relative min-h-[700px] overflow-hidden mt-16">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay Updated
            </motion.h2>
            <motion.p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Get the latest updates on disaster recovery and reconstruction.
            </motion.p>
            <motion.form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div>
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
              <motion.div key={section.title}>
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
      </section>
    </div>
  )
}