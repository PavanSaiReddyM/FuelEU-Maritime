import { useEffect, useState } from "react";
import { RouteRepository } from "../../infrastructure/apis/RouteRepository";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ComparePage() {
  const [data, setData] = useState([]);

   const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const data = await RouteRepository.getComparison();
        setComparison(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Compare Routes</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="route_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="ghg_intensity" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

      <table className="w-full border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Route</th><th>GHG</th><th>% Diff</th><th>Compliant</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-t">
              <td>{r.route_id}</td>
              <td>{r.ghg_intensity}</td>
              <td>{r.percentDiff?.toFixed(2)}%</td>
              <td>{r.compliant ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
