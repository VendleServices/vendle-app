import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout";
import MyProjectsLayout from "@/pages/MyProjects/layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import OnboardingPage from "./pages/start-claim/insurance/Onboarding";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import Contractors from "./pages/Contractors";
import StartClaim from "./pages/start-claim/page";
import InsuranceProviderPage from "./pages/start-claim/insurance/page";
import FemaAssistancePage from "./pages/start-claim/fema/page";
import InspectionPreparationPage from "./pages/start-claim/inspection/page";
import MyProjectsPage from "./pages/MyProjects/page";
import InformSitePage from "./pages/start-claim/inform-site/page";
import ContractorAuth from "./pages/ContractorAuth";
import ReverseAuction from "./pages/ReverseAuction";
import CreateRestorPage from "./pages/start-claim/create-restor/page";
import ScheduleCleanupPage from "./pages/start-claim/schedule-cleanup/page";
import ContractorProjects from "./pages/ContractorProjects";
import ClaimPage from "./pages/Claim/page";
import Reviews from "./pages/Reviews";
import AuctionDetailsPage from './pages/auction/[auction_id]';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
              <Routes>
            <Route element={<Layout><Outlet /></Layout>}>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contractors" element={<Contractors />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contractor-projects" element={<ContractorProjects />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/start-claim">
                  <Route index element={<StartClaim />} />
                  <Route path="insurance">
                    <Route index element={<InsuranceProviderPage />} />
                    <Route path="onboarding" element={<OnboardingPage />} />
                  </Route>
                  <Route path="fema" element={<FemaAssistancePage />} />
                  <Route path="inspection" element={<InspectionPreparationPage />} />
                  <Route path="inform-site" element={<InformSitePage />} />
                  <Route path="create-restor" element={<CreateRestorPage />} />
                  <Route path="schedule-cleanup" element={<ScheduleCleanupPage />} />
                </Route>
                <Route path="/contractor-auth" element={<ContractorAuth />} />
                <Route path="/reverse-auction" element={<ReverseAuction />} />
                <Route path="/auction/:auction_id" element={<AuctionDetailsPage />} />
            </Route>
            <Route element={<MyProjectsLayout><Outlet /></MyProjectsLayout>}>
              <Route path="/my-projects" element={<MyProjectsPage />} />
              <Route path="/claim/:id" element={<ClaimPage />} />
            </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
                    <a href="/" className="text-blue-500 hover:text-blue-700 underline">
                      Return to Home
                    </a>
                  </div>
                </div>} />
              </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
