import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "./models/Route.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Route.insertMany([
  { route_id: "R1", year: 2025, ghg_intensity: 85, is_baseline: true },
  { route_id: "R2", year: 2025, ghg_intensity: 95 },
  { route_id: "R3", year: 2025, ghg_intensity: 88 },
  { route_id: "R4", year: 2025, ghg_intensity: 90 },
  { route_id: "R5", year: 2025, ghg_intensity: 87 },
]);

console.log("Routes seeded!");
process.exit();
