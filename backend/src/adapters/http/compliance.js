import express from "express";
import ShipCompliance from "../../models/ShipCompliance.js";
import { calculateCB } from "../../core/complianceService.js";

const router = express.Router();

router.get("/cb", async (req, res) => {
  try {
    const { shipId, year, actualIntensity, fuelConsumption } = req.query;


    if (!shipId || !year || !actualIntensity || !fuelConsumption) {
      return res.status(400).json({
        error: "Missing required query parameters: shipId, year, actualIntensity, or fuelConsumption"
      });
    }

    const intensityNum = Number(actualIntensity);
    const fuelNum = Number(fuelConsumption);


    if (isNaN(intensityNum) || isNaN(fuelNum)) {
      return res.status(400).json({
        error: "actualIntensity and fuelConsumption must be valid numbers"
      });
    }

    const cb = calculateCB(intensityNum, fuelNum);

 
    if (isNaN(cb)) {
      return res.status(500).json({
        error: "CB calculation failed — result is NaN"
      });
    }

    const record = await ShipCompliance.create({
      ship_id: shipId,
      year,
      cb_gco2eq: cb
    });

    res.json(record);
  } catch (error) {
    console.error("Error in /compliance/cb:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
