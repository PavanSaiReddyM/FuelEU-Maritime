import mongoose from "mongoose";

const bankEntrySchema = new mongoose.Schema({
  ship_id: String,
  year: Number,
  amount_gco2eq: Number
});

export default mongoose.model("BankEntry", bankEntrySchema);
