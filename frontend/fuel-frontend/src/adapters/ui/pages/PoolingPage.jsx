import { useEffect, useState } from "react";
import { ComplianceRepository } from "../../infrastructure/apis/ComplianceRepository";

export default function PoolingPage() {
  const [year, setYear] = useState("");
  const [ships, setShips] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdjusted = async () => {
    if (!year) {
      setError("Please enter a year");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await ComplianceRepository.getAdjustedCB(year);
      setShips(res || []);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPool = async () => {
    try {
      const res = await ComplianceRepository.createPool({ year, members: ships });
      setResult(res.result);
      alert("Pool created successfully!");
    } catch (err) {
      alert("Failed: " + (err.response?.data?.error || err.message));
    }
  };

  const totalCB = ships.reduce((sum, s) => sum + (s.adjusted_cb || 0), 0);
  const validPool = ships.length > 0 && totalCB >= 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pooling</h2>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={fetchAdjusted} disabled={loading} className="bg-blue-500 text-white px-3 rounded">
          {loading ? "Loading..." : "Fetch Ships"}
        </button>
      </div>

      {error && <div className="text-red-600 mb-3">{String(error)}</div>}

      {ships.length > 0 && (
        <>
          <table className="w-full border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th>Ship ID</th>
                <th>Adjusted CB</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((s, i) => (
                <tr key={i} className="border-t">
                  <td>{s.ship_id}</td>
                  <td>{s.adjusted_cb}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className={`font-semibold ${validPool ? "text-green-600" : "text-red-600"}`}>
            Pool Total: {totalCB}
          </p>

          <button onClick={createPool} disabled={!validPool} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
            Create Pool
          </button>
        </>
      )}

      {result && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Pool Result</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Ship ID</th>
                <th>CB Before</th>
                <th>CB After</th>
              </tr>
            </thead>
            <tbody>
              {result.map((r, i) => (
                <tr key={i} className="border-t">
                  <td>{r.ship_id}</td>
                  <td>{r.cb_before}</td>
                  <td>{r.cb_after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
