import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import Contractors from "./pages/Contractors";
import NotFound from "./pages/NotFound";
import StartClaim from "./pages/start-claim/page";
import InsuranceProviderPage from "./pages/start-claim/insurance/page";
import FemaAssistancePage from "./pages/start-claim/fema/page";
import InspectionPreparationPage from "./pages/start-claim/inspection/page";
import MyProjectsPage from "./pages/MyProjects";
import InformSitePage from "./pages/start-claim/inform-site/page";
import ContractorAuth from "./pages/ContractorAuth";
import ReverseAuction from "./pages/ReverseAuction";
import CreateRestorPage from "./pages/start-claim/create-restor/page";
import ScheduleCleanupPage from "./pages/start-claim/schedule-cleanup/page";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contractors" element={<Contractors />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-projects" element={<MyProjectsPage />} />
                <Route path="/start-claim">
                  <Route index element={<StartClaim />} />
                  <Route path="insurance" element={<InsuranceProviderPage />} />
                  <Route path="fema" element={<FemaAssistancePage />} />
                  <Route path="inspection" element={<InspectionPreparationPage />} />
                  <Route path="inform-site" element={<InformSitePage />} />
                  <Route path="create-restor" element={<CreateRestorPage />} />
                  <Route path="schedule-cleanup" element={<ScheduleCleanupPage />} />
                </Route>
                <Route path="/contractor-auth" element={<ContractorAuth />} />
                <Route path="/reverse-auction" element={<ReverseAuction />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
