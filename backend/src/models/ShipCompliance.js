import mongoose from "mongoose";

const shipComplianceSchema = new mongoose.Schema({
  ship_id: String,
  year: Number,
  cb_gco2eq: Number
});

export default mongoose.model("ShipCompliance", shipComplianceSchema);
