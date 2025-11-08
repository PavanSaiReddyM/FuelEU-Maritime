import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  route_id: String,
  year: Number,
  ghg_intensity: Number,
  is_baseline: { type: Boolean, default: false }
});

export default mongoose.model("Route", routeSchema);
