import { useState } from "react";
import { Users, Ship, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ComplianceRepository } from "../../infrastructure/apis/ComplianceRepository";
import { toast } from "sonner";

export default function PoolingPage() {
  const [year, setYear] = useState("");
  const [ships, setShips] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdjusted = async () => {
    if (!year) {
      toast.error("Please enter a year");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await ComplianceRepository.getAdjustedCB(year);
      setShips(res || []);
      toast.success("Ship data fetched");
    } catch (err) {
      console.error("fetchAdjusted error:", err);
      setError(err?.response?.data || err?.message || "Failed to fetch");
      setShips([]);
      toast.error("Failed to fetch ship data");
    } finally {
      setLoading(false);
    }
  };

  const createPool = async () => {
    if (!ships.length) {
      toast.error("No ships to pool");
      return;
    }
    try {
      const res = await ComplianceRepository.createPool({ year, members: ships });
      // backend expected to return { message, totalCB, result }
      setResult(res.result ?? []);
      toast.success("Pool created successfully!");
    } catch (err) {
      console.error("createPool error:", err);
      toast.error("Failed to create pool: " + (err?.response?.data?.error || err?.message));
    }
  };

  const totalCB = ships.reduce((sum, s) => sum + (Number(s.adjusted_cb || 0)), 0);
  const validPool = ships.length > 0 && totalCB >= 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Compliance Pooling</h1>
            <p className="mt-2 text-white/90 max-w-2xl">
              Pool adjusted compliance balances across vessels to share surplus/deficits.
            </p>
          </div>
          <Users className="w-20 h-20 text-white/20" />
        </div>
      </div>

      {/* Fetch */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 border">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><Ship className="w-5 h-5 text-blue-600" /> Load Pool Members</h2>
        <div className="flex gap-3">
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year (e.g., 2025)"
            type="number"
            className="border rounded-lg p-2 w-40 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchAdjusted}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Loading..." : "Fetch Ships"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>{String(error)}</div>
          </div>
        </div>
      )}

      {/* Ships table */}
      {ships.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border">
          <h3 className="text-lg font-semibold mb-3">Pool Members ({ships.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Ship ID</th>
                  <th className="px-4 py-3 text-left">Adjusted CB</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {ships.map((s, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{s.ship_id}</td>
                    <td className={`px-4 py-3 font-semibold ${s.adjusted_cb >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {s.adjusted_cb >= 0 ? "+" : ""}
                      {Number(s.adjusted_cb).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${s.adjusted_cb >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {s.adjusted_cb >= 0 ? "Contributing" : "Receiving"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary + action */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Pool Balance</div>
              <div className={`text-2xl font-bold ${totalCB >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalCB >= 0 ? "+" : ""}
                {totalCB.toLocaleString()} gCO₂eq
              </div>
            </div>

            <div className="flex items-center gap-3">
              {validPool ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" /> <span className="font-medium">Valid Pool</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" /> <span className="font-medium">Invalid Pool</span>
                </div>
              )}

              <button
                onClick={createPool}
                disabled={!validPool}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-70"
              >
                Create Pool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && result.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border">
          <h3 className="text-lg font-semibold mb-3">Pool Result</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Ship ID</th>
                  <th className="px-4 py-3 text-left">CB Before</th>
                  <th className="px-4 py-3 text-left">CB After</th>
                  <th className="px-4 py-3 text-left">Change</th>
                </tr>
              </thead>
              <tbody>
                {result.map((r, i) => {
                  const change = Number(r.cb_after) - Number(r.cb_before);
                  return (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{r.ship_id}</td>
                      <td className="px-4 py-3">{Number(r.cb_before).toLocaleString()}</td>
                      <td className={`px-4 py-3 font-semibold ${r.cb_after >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {Number(r.cb_after).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {change >= 0 ? "+" : ""}
                        {change.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex gap-4">
          <Users className="w-8 h-8 text-white/80 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Pooling Benefits</h3>
            <ul className="text-sm text-white/90 space-y-1">
              <li>✓ Share compliance credits across multiple vessels</li>
              <li>✓ Reduce individual vessel compliance costs</li>
              <li>✓ Enable flexible, strategic fuel choices</li>
              <li>✓ Improve overall fleet sustainability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
