import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { GitCompare, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { RouteRepository } from "../../infrastructure/apis/RouteRepository";
import { toast } from "sonner";

export default function ComparePage() {
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fallback target if backend doesn't give baseline
  const TARGET_GHG = 89.3368;

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await RouteRepository.getComparison();
        // normalize data shape and compute percentDiff & compliant if not present
        const normalized = (data || []).map((r) => {
          const ghg = Number(r.ghg_intensity ?? r.ghgIntensity ?? r.ghg ?? 0);
          // if backend returned baseline value per route, use it; otherwise use TARGET_GHG
          const baseline = Number(r.baseline ?? TARGET_GHG);
          const percentDiff = baseline !== 0 ? ((ghg / baseline - 1) * 100) : 0;
          const compliant = ghg <= baseline;
          return {
            route_id: r.route_id ?? r.routeId ?? r.ship_id ?? "unknown",
            ghg_intensity: ghg,
            percentDiff,
            compliant,
            // keep original fields for table if present
            ...r,
          };
        });
        setComparison(normalized);
      } catch (err) {
        console.error("Compare fetch error:", err);
        setError(err?.response?.data?.error || err?.message || "Failed to load data");
        toast.error("Failed to load comparison data");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-slate-600" />
          <p className="text-slate-600">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          <strong>Error:</strong> {String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl p-6 shadow">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Route Comparison</h1>
            <p className="mt-2 text-white/90 max-w-2xl">
              Compare routes against the compliance baseline and inspect GHG intensity differences.
            </p>
          </div>
          <GitCompare className="w-20 h-20 text-white/20" />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border">
        <h2 className="text-lg font-semibold mb-3">GHG Intensity Comparison</h2>
        <p className="text-sm text-gray-500 mb-4">Route performance vs baseline (lower is better).</p>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route_id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="ghg_intensity" radius={[8, 8, 0, 0]}>
                {comparison.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.compliant ? "#16a34a" : "#dc2626"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-4 border">
        <h3 className="text-lg font-semibold mb-3">Detailed Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">GHG Intensity</th>
                <th className="px-4 py-3">% Difference</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.route_id}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${r.compliant ? "text-green-600" : "text-red-600"}`}>
                      {r.ghg_intensity} gCO₂eq/MJ
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.percentDiff < 0 ? (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      )}
                      <span className={r.percentDiff < 0 ? "text-green-600" : "text-red-600"}>
                        {Number(r.percentDiff).toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        r.compliant ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {r.compliant ? "✓ Compliant" : "✗ Non-compliant"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
