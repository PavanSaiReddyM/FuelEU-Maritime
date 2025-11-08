import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routesRouter from "./adapters/http/routes.js";
import complianceRouter from "./adapters/http/compliance.js";
import bankingRouter from "./adapters/http/banking.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MongoDB_URI) 
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));



app.use("/routes", routesRouter);
app.use("/compliance", complianceRouter);
app.use("/banking", bankingRouter);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});