import express from "express";
import Route from "../../models/Route.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const doc = req.body;
    const col = (await import("mongoose")).default.connection.collection("routes");
    const result = await col.insertOne(doc);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/", async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});


router.post("/:id/baseline", async (req, res) => {
  await Route.updateMany({}, { is_baseline: false });
  await Route.findByIdAndUpdate(req.params.id, { is_baseline: true });
  res.json({ message: "Baseline set successfully" });
});


router.get("/comparison", async (req, res) => {
  const baseline = await Route.findOne({ is_baseline: true });
  if (!baseline) return res.status(400).json({ error: "No baseline found" });

  const routes = await Route.find({ is_baseline: false });
  const results = routes.map(r => ({
    route_id: r.route_id,
    percentDiff: ((r.ghg_intensity - baseline.ghg_intensity) / baseline.ghg_intensity) * 100,
    compliant: r.ghg_intensity <= baseline.ghg_intensity
  }));
  res.json(results);
});

export default router;
