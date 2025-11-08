import { useEffect, useState } from "react";
import { ComplianceRepository } from "../../infrastructure/apis/ComplianceRepository";

export default function PoolingPage() {
  const [year, setYear] = useState("");
  const [ships, setShips] = useState([]);

  const fetchAdjusted = async () => {
    const res = await ComplianceRepository.getAdjustedCB(year);
    setShips(res);
  };

  const createPool = async () => {
    await ComplianceRepository.createPool({ year, members: ships });
    alert("Pool created successfully!");
  };

  const totalCB = ships.reduce((sum, s) => sum + s.adjusted_cb, 0);
  const validPool = totalCB >= 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pooling</h2>
      <div className="flex gap-2 mb-4">
        <input placeholder="Year" onChange={(e) => setYear(e.target.value)} className="border p-2 rounded"/>
        <button onClick={fetchAdjusted} className="bg-blue-500 text-white px-3 rounded">Fetch Ships</button>
      </div>

      {ships.length > 0 && (
        <>
          <table className="w-full border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th>Ship ID</th><th>Adjusted CB</th>
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
    </div>
  );
}
