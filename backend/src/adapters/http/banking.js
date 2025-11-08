import express from "express";
import BankEntry from "../../models/BankEntry.js";
import { validateBankApplication } from "../../core/bankingService.js";

const router = express.Router();

router.get("/records", async (req, res) => {
  const { shipId, year } = req.query;
  const entries = await BankEntry.find({ ship_id: shipId, year });
  res.json(entries);
});

router.post("/bank", async (req, res) => {
  const { shipId, year, amount } = req.body;
  const entry = await BankEntry.create({ ship_id: shipId, year, amount_gco2eq: amount });
  res.json(entry);
});

router.post("/apply", async (req, res) => {
  const { shipId, year, amount } = req.body;
  const totalBanked = await BankEntry.aggregate([
    { $match: { ship_id: shipId, year } },
    { $group: { _id: null, total: { $sum: "$amount_gco2eq" } } }
  ]);

  const available = totalBanked[0]?.total || 0;
  if (!validateBankApplication(amount, available))
    return res.status(400).json({ error: "Insufficient banked CB" });

  res.json({ message: "Banked CB applied successfully" });
});

export default router;
