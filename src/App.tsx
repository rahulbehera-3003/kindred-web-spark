import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Company from "./pages/Company";
import HRMSData from "./pages/HRMSData";
import ExpenseApprovalPolicy from "./pages/ExpenseApprovalPolicy";
import CardApprovalFlow from "./pages/CardApprovalFlow";
import Cards from "./pages/Cards";
import CreateCompanyCard from "./pages/CreateCompanyCard";
import CreateEmployeeBenefitCard from "./pages/CreateEmployeeBenefitCard";
import EmployeeBenefitsAutomation from "./pages/EmployeeBenefitsAutomation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/company" element={<Company />} />
          <Route path="/hrms-data" element={<HRMSData />} />
          <Route path="/expense-approval-policy" element={<ExpenseApprovalPolicy />} />
          <Route path="/card-approval-flow" element={<CardApprovalFlow />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/create-company-card" element={<CreateCompanyCard />} />
          <Route path="/create-employee-benefit-card" element={<CreateEmployeeBenefitCard />} />
          <Route path="/employee-benefits-automation" element={<EmployeeBenefitsAutomation />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
