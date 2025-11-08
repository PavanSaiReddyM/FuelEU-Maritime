import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import RoutesPage from "./adapters/ui/pages/RoutesPage.jsx";
import ComparePage from "./adapters/ui/pages/ComparePage.jsx";
import BankingPage from "./adapters/ui/pages/BankingPage.jsx";
import PoolingPage from "./adapters/ui/pages/PoolingPage.jsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <nav className="bg-blue-600 text-white p-4 flex gap-6">
          <NavLink to="/" className="hover:underline">Routes</NavLink>
          <NavLink to="/compare" className="hover:underline">Compare</NavLink>
          <NavLink to="/banking" className="hover:underline">Banking</NavLink>
          <NavLink to="/pooling" className="hover:underline">Pooling</NavLink>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<RoutesPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/pooling" element={<PoolingPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
