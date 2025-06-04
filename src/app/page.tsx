"use client"
import { useEffect, useRef } from 'react';
import Link from "next/link";
import Button from '@/components/Button';
import { ArrowRight, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observer for staggered animations
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-20 md:pt-36 md:pb-24 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-vendle-blue/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] bg-vendle-teal/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-vendle-blue/10 text-vendle-blue text-sm font-medium">
              <span>Rebuilding with confidence</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-vendle-navy mb-6 leading-tight">
              Your trusted partner for home recovery and reconstruction
            </h1>
            
            <p className="text-xl text-vendle-navy/70 mb-8 max-w-2xl mx-auto">
              Navigate the post-disaster reconstruction process with ease. Vendle connects you with trusted contractors and ensures transparency through every step.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth?mode=signup">
                <Button 
                  size="lg" 
                  variant="primary"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                >
                  Start Recovery
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  How It Works
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 mb-3 flex items-center justify-center bg-vendle-blue/10 text-vendle-blue rounded-full">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-vendle-navy">Verified Contractors</h3>
              </div>
              
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 mb-3 flex items-center justify-center bg-vendle-teal/10 text-vendle-teal rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-vendle-navy">Certified Adjusters</h3>
              </div>
              
              <div className="flex flex-col items-center p-4">
                <div className="w-12 h-12 mb-3 flex items-center justify-center bg-vendle-sand/20 text-vendle-navy rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-vendle-navy">Transparent Bidding</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section 
        ref={featuresRef} 
        className="py-20 md:py-24 bg-gradient-to-b from-white to-vendle-gray/10"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-vendle-navy mb-4">
              Simple Steps to Rebuild
            </h2>
            <p className="text-lg text-vendle-navy/70">
              Our streamlined process helps you navigate the complexities of home recovery with ease.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 flex items-center justify-center bg-vendle-blue text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-vendle-navy mb-3">
                Share Your Project Details
              </h3>
              <p className="text-vendle-navy/70">
                Tell us about your rebuild needs, upload your insurance estimate, and define your project scope.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 flex items-center justify-center bg-vendle-teal text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-vendle-navy mb-3">
                Connect with Contractors
              </h3>
              <p className="text-vendle-navy/70">
                Review profiles of qualified contractors in your area and schedule consultations.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 flex items-center justify-center bg-vendle-navy text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-vendle-navy mb-3">
                Compare Blind Bids
              </h3>
              <p className="text-vendle-navy/70">
                Receive transparent bids based on fair market value, not influenced by competing offers.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center animate-on-scroll">
            <Link href="/signup">
              <Button 
                variant="primary" 
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                Start Your Recovery
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-vendle-navy mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-vendle-navy/70">
              Hear from homeowners who rebuilt with confidence using Vendle.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-medium border border-vendle-gray/10 animate-on-scroll">
              <p className="text-vendle-navy/80 mb-6">
                "After the wildfire, we were overwhelmed with the rebuilding process. Vendle made it simple to connect with quality contractors and their blind bidding system saved us nearly 20% on our rebuild costs."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-vendle-blue/10 flex items-center justify-center text-vendle-blue font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-vendle-navy">James Doherty</h4>
                  <p className="text-sm text-vendle-navy/60">Paradise, CA</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-medium border border-vendle-gray/10 animate-on-scroll">
              <p className="text-vendle-navy/80 mb-6">
                "The certified adjuster service was a game-changer. They identified thousands in overlooked damage that our insurance company had missed. The entire experience was transparent and professional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-vendle-teal/10 flex items-center justify-center text-vendle-teal font-bold">
                  SL
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-vendle-navy">Sarah Lanning</h4>
                  <p className="text-sm text-vendle-navy/60">Houston, TX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-vendle-blue text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Recovery?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of homeowners who have rebuilt with confidence using Vendle.
            </p>
            <Link href="/signup">
              <Button 
                variant="secondary" 
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
                className="bg-white text-vendle-blue hover:bg-white/90"
              >
                Begin Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-vendle-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Vendle</h3>
              <p className="text-white/70 mb-4">
                Your trusted partner for home recovery and reconstruction.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contractor Matching</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Adjuster Certification</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blind Bidding</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Project Management</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">For Contractors</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
            <p>© {new Date().getFullYear()} Vendle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
