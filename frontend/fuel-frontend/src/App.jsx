import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Navigation from "./adapters/ui/components/Navigation.jsx";
import RoutesPage from "./adapters/ui/pages/RoutesPage";
import ComparePage from "./adapters/ui/pages/ComparePage";
import BankingPage from "./adapters/ui/pages/BankingPage";
import PoolingPage from "./adapters/ui/pages/PoolingPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<RoutesPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/banking" element={<BankingPage />} />
              <Route path="/pooling" element={<PoolingPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
