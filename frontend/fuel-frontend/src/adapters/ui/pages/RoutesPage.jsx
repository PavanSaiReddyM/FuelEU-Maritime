import { useEffect, useState } from "react";
import { RouteRepository } from "../../infrastructure/apis/RouteRepository";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [filters, setFilters] = useState({ vessel: "", fuel: "", year: "" });
 const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await RouteRepository.getAll();
        setRoutes(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch routes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const filtered = routes.filter(
    (r) =>
      (!filters.vessel || r.ship_type === filters.vessel) &&
      (!filters.fuel || r.fuel_type === filters.fuel) &&
      (!filters.year || r.year === Number(filters.year))
  );

  const handleBaseline = async (id) => {
    try {
      await RouteRepository.setBaseline(id);
      alert("Baseline route set successfully!");
    } catch (err) {
      alert("Failed to set baseline: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Routes</h2>

      <div className="flex gap-2 mb-4">
        <input placeholder="Vessel" onChange={e => setFilters({ ...filters, vessel: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Fuel" onChange={e => setFilters({ ...filters, fuel: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Year" onChange={e => setFilters({ ...filters, year: e.target.value })} className="border p-2 rounded" />
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Route ID</th><th>Ship</th><th>Fuel</th><th>Year</th>
            <th>GHG</th><th>Fuel (t)</th><th>Distance</th><th>Energy</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r._id} className="border-t">
              <td>{r.route_id}</td>
              <td>{r.ship_type}</td>
              <td>{r.fuel_type}</td>
              <td>{r.year}</td>
              <td>{r.ghg_intensity}</td>
              <td>{r.fuel_consumption}</td>
              <td>{r.distance}</td>
              <td>{r.energy}</td>
              <td>
                <button
                  onClick={() => handleBaseline(r._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Set Baseline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
