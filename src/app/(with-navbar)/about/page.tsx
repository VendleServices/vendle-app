"use client"
import TeamGlobe from "@/components/TeamGlobe"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

export default function AboutUs() {
  return (
    <div className="container relative mx-auto px-6 pt-20 pb-16 max-w-7xl bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content Accordion */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8 -mt-8"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="story" className="border border-border rounded-xl shadow-sm bg-white">
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
            <AccordionItem value="mission" className="border border-border rounded-xl shadow-sm bg-white mt-6">
              <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-accent/10 rounded-t-xl data-[state=open]:rounded-b-none">
                Our Mission
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                <p>
                  As we built our platform, we realized we had a larger calling. When we looked at the aftermath of
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
          <div className="w-full h-full max-w-2xl mx-auto -ml-12">
            <TeamGlobe />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
