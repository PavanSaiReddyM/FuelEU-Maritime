import express from "express";
import ShipCompliance from "../../models/ShipCompliance.js";
import { calculateCB } from "../../core/complianceService.js";

const router = express.Router();

router.get("/cb", async (req, res) => {
  const { shipId, year, actualIntensity, fuelConsumption } = req.query;
  const cb = calculateCB(Number(actualIntensity), Number(fuelConsumption));
  const record = await ShipCompliance.create({ ship_id: shipId, year, cb_gco2eq: cb });
  res.json(record);
});

export default router;
