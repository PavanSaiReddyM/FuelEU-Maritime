import { useState } from "react";
import { ComplianceRepository } from "../../infrastructure/apis/ComplianceRepository";

export default function BankingPage() {
  const [year, setYear] = useState("");
  const [cb, setCb] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchCB = async () => {
    const res = await ComplianceRepository.getCB(year);
    setCb(res);
  };

  const handleBank = async () => {
    await ComplianceRepository.bank({ year, amount: Number(amount) });
    alert("Balance banked successfully!");
  };

  const handleApply = async () => {
    await ComplianceRepository.apply({ year, amount: Number(amount) });
    alert("Applied banked balance!");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Banking</h2>
      <div className="flex gap-2 mb-4">
        <input placeholder="Year" onChange={(e) => setYear(e.target.value)} className="border p-2 rounded"/>
        <button onClick={fetchCB} className="bg-blue-500 text-white px-3 rounded">Fetch CB</button>
      </div>

      {cb && (
        <div className="mb-4">
          <p>Compliance Balance: <b>{cb.cb_gco2eq}</b></p>
        </div>
      )}

      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} className="border p-2 rounded mb-2" />
      <div className="flex gap-2">
        <button onClick={handleBank} disabled={cb?.cb_gco2eq <= 0} className="bg-green-600 text-white px-3 py-1 rounded">Bank</button>
        <button onClick={handleApply} className="bg-yellow-600 text-white px-3 py-1 rounded">Apply</button>
      </div>
    </div>
  );
}
