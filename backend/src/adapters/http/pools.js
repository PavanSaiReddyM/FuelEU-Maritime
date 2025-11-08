import express from "express";
const router = express.Router();

/**
 * POST /pools
 * Body:
 * {
 *   "year": 2025,
 *   "members": [
 *     { "ship_id": "R001", "adjusted_cb": 120 },
 *     { "ship_id": "R002", "adjusted_cb": -50 },
 *     { "ship_id": "R003", "adjusted_cb": -30 }
 *   ]
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { year, members } = req.body;

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ error: "Invalid members list" });
    }

    // ✅ Step 1: Calculate total CB
    const totalCB = members.reduce((sum, m) => sum + (m.adjusted_cb || 0), 0);
    if (totalCB < 0) {
      return res.status(400).json({ error: "Invalid pool: ∑ adjusted_cb < 0" });
    }

    // ✅ Step 2: Sort by CB (descending)
    const sorted = [...members].sort((a, b) => b.adjusted_cb - a.adjusted_cb);

    // ✅ Step 3: Greedy reallocation (surplus -> deficits)
    const surplus = sorted.filter((m) => m.adjusted_cb > 0);
    const deficits = sorted.filter((m) => m.adjusted_cb < 0);

    for (let deficit of deficits) {
      let need = Math.abs(deficit.adjusted_cb);
      for (let donor of surplus) {
        if (donor.adjusted_cb <= 0) continue;

        const transfer = Math.min(donor.adjusted_cb, need);
        donor.adjusted_cb -= transfer;
        deficit.adjusted_cb += transfer;
        need -= transfer;

        if (need <= 0) break;
      }
    }

    // ✅ Step 4: Ensure rules are respected
    const valid = sorted.every((m) => m.adjusted_cb >= 0);
    if (!valid)
      return res
        .status(400)
        .json({ error: "Rule violation: a member exits negative!" });

    // ✅ Step 5: Return updated CBs
    const result = members.map((m) => ({
      ship_id: m.ship_id,
      cb_before: m.adjusted_cb,
      cb_after:
        sorted.find((s) => s.ship_id === m.ship_id)?.adjusted_cb ?? m.adjusted_cb,
    }));

    res.json({
      message: "Pool created successfully",
      totalCB,
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
