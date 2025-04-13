
import { useState, useRef, useEffect } from "react";
import { PageTransition } from "@/lib/transitions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Send, Loader2, Bot, User, FileText, Clock, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContractorBrowser from "@/components/ContractorBrowser";

type Message = {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

// Mock contractor data - in a real app, this would come from a database
type Contractor = {
  id: string;
  name: string;
  avatar: string;
  location: string;
  specialty: string;
};

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([{
    content: "Hello! I can answer questions about your uploaded insurance estimate. What would you like to know?",
    role: "assistant",
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [selectedContractors, setSelectedContractors] = useState<Contractor[]>([]);
  const [requestingQuote, setRequestingQuote] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulate PDF content for demonstration
  const [pdfContent, setPdfContent] = useState<string | null>(null);

  useEffect(() => {
    // Simulate retrieving PDF content from localStorage
    const savedPdfContent = localStorage.getItem("uploadedPdfContent");
    
    if (savedPdfContent) {
      setPdfContent(savedPdfContent);
    } else {
      // For demonstration purposes - this would be populated from the actual PDF in a real implementation
      const demoContent = `
        Insurance Estimate
        Property Address: 123 Main St, Anytown, USA
        Claim Number: CLM-2023-78945
        Date of Loss: 10/15/2023
        
        Coverage Summary:
        Dwelling: $450,000
        Other Structures: $45,000
        Personal Property: $225,000
        Loss of Use: $90,000
        
        Estimated Damages:
        Roof Replacement: $28,500
        Structural Repairs: $65,000
        Interior Repairs: $42,000
        Electrical System: $12,500
        Plumbing System: $8,750
        HVAC System: $9,200
        
        Total Estimated Cost: $165,950
        Depreciation: $22,450
        Deductible: $2,500
        
        Net Claim Payment: $141,000
      `;
      
      localStorage.setItem("uploadedPdfContent", demoContent);
      setPdfContent(demoContent);
    }

    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }

    // Retrieve selected contractors from localStorage
    const savedContractors = localStorage.getItem("selectedContractors");
    if (savedContractors) {
      setSelectedContractors(JSON.parse(savedContractors));
    }
  }, [messages]);

  // Update localStorage when selected contractors change
  useEffect(() => {
    if (selectedContractors.length > 0) {
      localStorage.setItem("selectedContractors", JSON.stringify(selectedContractors));
    }
  }, [selectedContractors]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      content: input,
      role: "user" as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Simulate AI processing with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Basic keyword-based response generation based on the PDF content
      // In a real implementation, this would use a proper AI model
      let response = "I'm not sure about that. Could you ask something about the insurance estimate?";
      
      const userQuery = input.toLowerCase();
      
      if (pdfContent) {
        if (userQuery.includes("total") || userQuery.includes("cost")) {
          response = "The total estimated cost of damages is $165,950.";
        } else if (userQuery.includes("deductible")) {
          response = "Your deductible amount is $2,500.";
        } else if (userQuery.includes("claim") || userQuery.includes("payment")) {
          response = "The net claim payment is $141,000 after depreciation and deductible.";
        } else if (userQuery.includes("roof")) {
          response = "The roof replacement is estimated at $28,500.";
        } else if (userQuery.includes("coverage") || userQuery.includes("dwelling")) {
          response = "Your dwelling coverage is $450,000, with other structures at $45,000, personal property at $225,000, and loss of use at $90,000.";
        } else if (userQuery.includes("address") || userQuery.includes("property")) {
          response = "The insured property address is 123 Main St, Anytown, USA.";
        } else if (userQuery.includes("claim number")) {
          response = "Your claim number is CLM-2023-78945.";
        } else if (userQuery.includes("date of loss")) {
          response = "The date of loss is recorded as 10/15/2023.";
        } else if (userQuery.includes("structural") || userQuery.includes("structure")) {
          response = "Structural repairs are estimated at $65,000.";
        } else if (userQuery.includes("interior")) {
          response = "Interior repairs are estimated at $42,000.";
        } else if (userQuery.includes("electrical")) {
          response = "Electrical system repairs are estimated at $12,500.";
        } else if (userQuery.includes("plumbing")) {
          response = "Plumbing system repairs are estimated at $8,750.";
        } else if (userQuery.includes("hvac") || userQuery.includes("heating") || userQuery.includes("air")) {
          response = "HVAC system repairs are estimated at $9,200.";
        } else if (userQuery.includes("depreciation")) {
          response = "The depreciation amount is $22,450.";
        }
      }
      
      const botMessage = {
        content: response,
        role: "assistant" as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContractorSelect = (contractors: Contractor[]) => {
    setSelectedContractors(contractors);
    if (contractors.length > 0) {
      toast({
        title: "Contractors Selected",
        description: `You've selected ${contractors.length} contractors for your project.`,
      });
    }
  };

  const handleRequestQuote = (contractor: Contractor) => {
    setRequestingQuote(true);
    
    // Simulate sending quote request
    setTimeout(() => {
      toast({
        title: "Quote Request Sent",
        description: `Request for quote sent to ${contractor.name}. They will be notified.`,
      });
      setRequestingQuote(false);
    }, 1500);
  };

  const handleRequestAllQuotes = () => {
    setRequestingQuote(true);
    
    // Simulate sending quote request to all selected contractors
    setTimeout(() => {
      toast({
        title: "Quote Requests Sent",
        description: `Request for quotes sent to all ${selectedContractors.length} selected contractors.`,
      });
      setRequestingQuote(false);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Project Resources</h2>
          <ContractorBrowser onSelect={handleContractorSelect} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Project Summary Card */}
          <Card className="p-6 md:col-span-4 bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Property Address</p>
                <p className="font-medium">123 Main St, Anytown, USA</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Type</p>
                <p className="font-medium">Full Reconstruction</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Insurance Estimate</p>
                <p className="font-medium">$165,950</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Design Plan</p>
                <p className="font-medium">Use Existing Plan</p>
              </div>
            </div>
          </Card>
          
          {/* AI Chatbot Card */}
          <Card className="p-6 md:col-span-8 bg-white shadow-md flex flex-col h-[600px]">
            <h2 className="text-xl font-semibold mb-4">Insurance Estimate Assistant</h2>
            
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`
                        max-w-[80%] p-3 rounded-lg flex items-start gap-3
                        ${message.role === "user" 
                          ? "bg-vendle-blue text-white" 
                          : "bg-gray-100 text-vendle-navy"}
                      `}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {message.role === "user" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg text-vendle-navy flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <p>Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage();
                  }
                }}
                placeholder="Ask a question about your insurance estimate..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vendle-blue focus:border-transparent"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-vendle-blue hover:bg-vendle-blue/90"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </Card>

          {/* Selected Contractors Section */}
          {selectedContractors.length > 0 && (
            <Card className="md:col-span-12 bg-white shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Selected Contractors</CardTitle>
                  {selectedContractors.length > 1 && (
                    <Button 
                      onClick={handleRequestAllQuotes}
                      disabled={requestingQuote}
                      className="bg-vendle-teal hover:bg-vendle-teal/90"
                    >
                      {requestingQuote ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Request All Quotes
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedContractors.map((contractor) => (
                    <Card key={contractor.id} className="overflow-hidden border border-gray-200">
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vendle-sand text-vendle-navy text-2xl">
                            {contractor.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{contractor.name}</h3>
                            <p className="text-sm text-gray-500">{contractor.location}</p>
                            <p className="text-xs mt-1 text-vendle-navy bg-vendle-blue/10 inline-block px-2 py-0.5 rounded-full">
                              {contractor.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Quote pending</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRequestQuote(contractor)}
                            disabled={requestingQuote}
                            className="bg-vendle-blue hover:bg-vendle-blue/90"
                          >
                            {requestingQuote ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <FileText className="h-4 w-4 mr-1" />
                            )}
                            Request Quote
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
