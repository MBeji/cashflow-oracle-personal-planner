import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChromeIOSDiagnostic from "./components/ChromeIOSDiagnostic";
import SimpleReactTest from "./components/SimpleReactTest";
import MinimalTest from "./components/MinimalTest";
import IndexDiagnostic from "./components/IndexDiagnostic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/debug" element={<ChromeIOSDiagnostic />} />
          <Route path="/react-test" element={<SimpleReactTest />} />
          <Route path="/minimal-test" element={<MinimalTest />} />
          <Route path="/index-diagnostic" element={<IndexDiagnostic />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
