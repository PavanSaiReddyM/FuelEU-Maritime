import { useState } from "react";
import { Landmark, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { ComplianceRepository } from "../../infrastructure/apis/ComplianceRepository";
import { toast } from "sonner";

export default function BankingPage() {
  const [year, setYear] = useState("");
  const [cb, setCb] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCB = async () => {
    if (!year) {
      toast.error("Please enter a year");
      return;
    }
    setLoading(true);
    try {
      const res = await ComplianceRepository.getCB({
        shipId: "R001",
        year,
        actualIntensity: 91.0,
        fuelConsumption: 5000,
      });
      setCb(res);
      toast.success("Compliance balance fetched successfully");
    } catch {
      toast.error("Failed to fetch compliance balance");
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (!amount || !year) {
      toast.error("Please enter both year and amount");
      return;
    }
    try {
      await ComplianceRepository.bank({ year, amount: Number(amount) });
      toast.success("Banked successfully!");
      setAmount("");
    } catch {
      toast.error("Failed to bank credits");
    }
  };

  const handleApply = async () => {
    if (!amount || !year) {
      toast.error("Please enter both year and amount");
      return;
    }
    try {
      await ComplianceRepository.apply({ year, amount: Number(amount) });
      toast.success("Applied banked balance successfully!");
      setAmount("");
    } catch {
      toast.error("Failed to apply balance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-3">Compliance Banking</h1>
            <p className="text-white/90 max-w-2xl">
              Bank surplus compliance or apply credits to offset deficits.
              Efficiently manage your performance under FuelEU Maritime.
            </p>
          </div>
          <Landmark className="w-24 h-24 mt-6 md:mt-0 text-white/20" />
        </div>
      </div>

      {/* Fetch Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 border">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Check Compliance Balance
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the reporting year to fetch your current compliance balance.
        </p>
        <div className="flex gap-4 flex-wrap">
          <input
            type="number"
            placeholder="Enter year (e.g. 2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-40 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchCB}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Fetching..." : "Fetch CB"}
          </button>
        </div>
      </div>

      {/* CB Results */}
      {cb && (
        <div className="bg-white rounded-xl shadow p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-2">Compliance Results</h2>
          <p className="text-sm text-gray-500 mb-6">Year {cb.year} compliance overview</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-500">Compliance Balance</p>
              <p
                className={`text-2xl font-bold ${
                  cb.cb_gco2eq >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {cb.cb_gco2eq >= 0 ? "+" : ""}
                {cb.cb_gco2eq.toLocaleString()} gCO₂eq
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-500">Actual Intensity</p>
              <p className="text-2xl font-bold text-gray-700">
                {cb.actual_intensity} gCO₂eq/MJ
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-500">Target Intensity</p>
              <p className="text-2xl font-bold text-gray-700">
                {cb.target_intensity} gCO₂eq/MJ
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-500">Status</p>
              <span
                className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${
                  cb.cb_gco2eq >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {cb.cb_gco2eq >= 0 ? "Surplus" : "Deficit"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Banking Operations */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 border">
        <h2 className="text-xl font-semibold mb-2">Banking Operations</h2>
        <p className="text-sm text-gray-500 mb-4">
          Bank surplus credits or apply stored credits to cover deficits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <input
            type="number"
            placeholder="Enter amount (gCO₂eq)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full sm:w-60 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleBank}
            disabled={!cb || cb.cb_gco2eq <= 0 || !amount}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-70"
          >
            <TrendingUp className="w-4 h-4" />
            Bank Surplus
          </button>
          <button
            onClick={handleApply}
            disabled={!amount}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:opacity-70"
          >
            <TrendingDown className="w-4 h-4" />
            Apply Credits
          </button>
        </div>

        {cb && cb.cb_gco2eq <= 0 && (
          <p className="text-sm text-gray-500">
            ⚠️ Banking is only available when you have a positive compliance balance.
          </p>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex gap-4">
          <Landmark className="w-8 h-8 text-white/80 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Banking Rules</h3>
            <ul className="text-sm text-white/90 space-y-1">
              <li>✓ Surpluses can be banked indefinitely for future use.</li>
              <li>✓ Borrow up to two reporting periods ahead (max 200% of annual need).</li>
              <li>✓ No penalties for timely transfers.</li>
              <li>✓ Smart banking supports long-term compliance strategy.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
