import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import Index from "./pages/Index";
import GlobalMap from "./pages/GlobalMap";
import Podcasts from "./pages/Podcasts";
import About from "./pages/About";
import Saved from "./pages/Saved";
import Contact from "./pages/Contact";
import Impressum from "./pages/Impressum";
import Newsletter from "./pages/Newsletter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ── Main feed (root + locale aliases) ── */}
            <Route path="/" element={<Index />} />
            <Route path="/de" element={<Index />} />
            <Route path="/en" element={<Index />} />

            {/* ── Static pages ── */}
            <Route path="/map" element={<GlobalMap />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/newsletter" element={<Newsletter />} />

            {/* ── Auth-aware page ── */}
            <Route path="/saved" element={<Saved />} />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
