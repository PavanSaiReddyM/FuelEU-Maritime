import { useEffect, useState } from "react";
import { RouteRepository } from "../../infrastructure/apis/RouteRepository";
import { toast } from "sonner";
import { Ship, Filter, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [filters, setFilters] = useState({ vessel: "", fuel: "", year: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setting, setSetting] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await RouteRepository.getAll();
        setRoutes(data || []);
        toast.success("Routes fetched successfully");
      } catch (err) {
        console.error("Failed to fetch routes:", err);
        setError(err.message || "Failed to load routes");
        toast.error("Failed to fetch routes");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const filtered = routes.filter(
    (r) =>
      (!filters.vessel ||
        r.ship_type?.toLowerCase().includes(filters.vessel.toLowerCase())) &&
      (!filters.fuel ||
        r.fuel_type?.toLowerCase().includes(filters.fuel.toLowerCase())) &&
      (!filters.year || String(r.year) === String(filters.year))
  );

  const handleBaseline = async (id) => {
    setSetting(id);
    try {
      await RouteRepository.setBaseline(id);
      toast.success("Baseline route set successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to set baseline");
    } finally {
      setSetting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Loading routes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Routes Overview</h1>
            <p className="mt-2 text-white/90 max-w-2xl">
              Explore all registered shipping routes, their emissions, and energy use. You can also
              set a baseline route for compliance comparison.
            </p>
          </div>
          <Ship className="w-20 h-20 text-white/20" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
          <Filter className="w-5 h-5 text-blue-600" />
          Filter Routes
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Vessel"
            value={filters.vessel}
            onChange={(e) => setFilters({ ...filters, vessel: e.target.value })}
            className="border rounded-lg p-2 w-40 focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Fuel"
            value={filters.fuel}
            onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
            className="border rounded-lg p-2 w-40 focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Year"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="border rounded-lg p-2 w-32 focus:ring-2 focus:ring-blue-500"
            type="number"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          All Routes ({filtered.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">Route ID</th>
                <th className="px-4 py-3">Ship</th>
                <th className="px-4 py-3">Fuel</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">GHG Intensity</th>
                <th className="px-4 py-3">Fuel (t)</th>
                <th className="px-4 py-3">Distance (nm)</th>
                <th className="px-4 py-3">Energy (MJ)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.route_id}</td>
                  <td className="px-4 py-3">{r.ship_type}</td>
                  <td className="px-4 py-3">{r.fuel_type}</td>
                  <td className="px-4 py-3">{r.year}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{r.ghg_intensity}</td>
                  <td className="px-4 py-3">{r.fuel_consumption}</td>
                  <td className="px-4 py-3">{r.distance}</td>
                  <td className="px-4 py-3">{r.energy}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleBaseline(r._id)}
                      disabled={setting === r._id}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 disabled:opacity-70 flex items-center gap-1"
                    >
                      {setting === r._id && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {setting === r._id ? "Setting..." : "Set Baseline"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No routes match your filters.
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-8 h-8 text-white/80 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Baseline Route Information</h3>
            <ul className="text-sm text-white/90 space-y-1">
              <li>✓ Only one route can be set as baseline per year</li>
              <li>✓ Baseline is used for compliance and intensity comparison</li>
              <li>✓ Make sure selected route represents standard operational data</li>
              <li>✓ Setting a baseline overrides the previous one</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
