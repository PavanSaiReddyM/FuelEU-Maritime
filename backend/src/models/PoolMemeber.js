import mongoose from "mongoose";

const poolMemberSchema = new mongoose.Schema({
  pool_id: String,
  ship_id: String,
  cb_before: Number,
  cb_after: Number
});

export default mongoose.model("PoolMember", poolMemberSchema);
