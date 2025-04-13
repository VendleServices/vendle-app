import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition, SlideUpTransition } from '@/lib/transitions';
import { motion } from 'framer-motion';
import { 
  Building2, 
  CheckCircle2, 
  BarChart2, 
  Zap, 
  FileText, 
  UploadCloud, 
  Award, 
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Contractors = () => {
  const benefits = [
    {
      icon: <Building2 className="h-8 w-8 text-vendle-blue" />,
      title: "Increased Visibility",
      description: "Connect with homeowners actively seeking quality restoration services in your area."
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-vendle-blue" />,
      title: "Streamlined Bidding",
      description: "Our transparent reverse auction system makes the bidding process efficient and fair."
    },
    {
      icon: <Zap className="h-8 w-8 text-vendle-blue" />,
      title: "AI-Assisted Tools",
      description: "Leverage our cutting-edge AI tools to create accurate, competitive bids faster."
    },
    {
      icon: <Shield className="h-8 w-8 text-vendle-blue" />,
      title: "Verified Projects",
      description: "Access pre-qualified leads with verified damage assessments and insurance approvals."
    }
  ];

  const documents = [
    {
      title: "Proof of Experience",
      description: "Previous contracts, client testimonials, or relevant certifications"
    },
    {
      title: "Financial Stability",
      description: "At least one year of recent financial statements"
    },
    {
      title: "General Liability Insurance",
      description: "Minimum coverage of $1 million"
    },
    {
      title: "Automobile Insurance",
      description: "Minimum coverage of $1 million"
    },
    {
      title: "Workers' Compensation",
      description: "Valid insurance certificate"
    },
    {
      title: "Licensing and Certification",
      description: "All applicable contractor licenses and certifications"
    },
    {
      title: "Project Portfolio",
      description: "Images and descriptions of previous restoration projects"
    },
    {
      title: "Online Presence",
      description: "Links to website and social media platforms"
    }
  ];

  return (
    <PageTransition className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-vendle-blue/10 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <SlideUpTransition className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-vendle-navy mb-6">
              Contractors: Building Our Nation Together
            </h1>
            <p className="text-xl text-vendle-navy/80 mb-8">
              Contractors are the backbone of America's infrastructure and resilience, ensuring communities recover swiftly and safely after unforeseen disasters. At Vendle, we deeply value your expertise, dedication, and commitment to excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contractor-auth?mode=login">
                <Button size="lg" className="min-w-44">
                  Login to Get Started
                </Button>
              </Link>
              <Link to="/contractor-auth?mode=signup">
                <Button variant="outline" size="lg" className="min-w-44">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </SlideUpTransition>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <SlideUpTransition className="text-center mb-12">
          <h2 className="text-3xl font-bold text-vendle-navy mb-4">
            Why Partner with Vendle?
          </h2>
          <p className="text-lg text-vendle-navy/70 max-w-3xl mx-auto">
            Vendle connects trusted contractors like you directly with homeowners seeking quality, transparent, and timely restoration services.
          </p>
        </SlideUpTransition>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-medium transition-all border-t-4 border-t-vendle-blue">
                <CardContent className="pt-6">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-vendle-navy mb-2">{benefit.title}</h3>
                  <p className="text-vendle-navy/70">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Ready to Make a Difference Section */}
        <SlideUpTransition className="text-center mb-12">
          <h2 className="text-3xl font-bold text-vendle-navy mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-vendle-navy/70 max-w-3xl mx-auto">
            Join our growing community of trusted contractors dedicated to serving communities across the nation.
          </p>
        </SlideUpTransition>

        {/* Steps Section */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1 */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-vendle-teal text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <span className="font-semibold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-vendle-navy">Log in to Your Vendle Account</h3>
            </div>
            <div className="ml-14">
              <p className="text-vendle-navy/70 mb-4">
                Login to your existing account or create a new one to get started with Vendle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contractor-auth?mode=login">
                  <Button className="min-w-36">
                    Login
                  </Button>
                </Link>
                <Link to="/contractor-auth?mode=signup">
                  <Button variant="outline" className="min-w-36">
                    Sign Up Here
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-vendle-teal text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <span className="font-semibold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-vendle-navy">Upload Your Required Documents</h3>
            </div>
            <div className="ml-14">
              <p className="text-vendle-navy/70 mb-6">
                After logging in, you'll be prompted to upload the following documents step-by-step:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {documents.map((doc, index) => (
                  <Card key={index} className="border-l-4 border-l-vendle-sand shadow-subtle hover:shadow-medium transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-vendle-sand mr-2 mt-1 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-vendle-navy">{doc.title}</h4>
                          <p className="text-sm text-vendle-navy/70">{doc.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="bg-vendle-blue/5 border border-vendle-blue/20 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <UploadCloud className="h-8 w-8 text-vendle-blue mr-3" />
                  <h4 className="text-lg font-semibold text-vendle-navy">
                    Streamlined Document Verification
                  </h4>
                </div>
                <p className="text-vendle-navy/70 mb-4">
                  Our intelligent verification system provides real-time feedback and helps you
                  complete your application quickly and accurately.
                </p>
                <Link to="/contractor-auth">
                  <Button>
                    Start Document Upload
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partnership Section */}
      <div className="bg-vendle-teal/10 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 text-vendle-teal mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-vendle-navy mb-4">
              Your Partnership Matters
            </h2>
            <p className="text-lg text-vendle-navy/80 mb-8">
              Together, we will continue to strengthen and protect American communities, one restoration at a time. We're excited to welcome you aboard and look forward to achieving great things together.
            </p>
            <Link to="/contractor-auth">
              <Button size="lg" className="min-w-48">
                Login to Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contractors;
