import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routesRouter from "./adapters/http/routes.js";
import complianceRouter from "./adapters/http/compliance.js";
import bankingRouter from "./adapters/http/banking.js";
import poolRoutes from "./adapters/http/pools.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
mongoose.connect(process.env.MongoDB_URI) 
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));



app.use("/api/routes", routesRouter);
app.use("/api/compliance", complianceRouter);
app.use("/api/banking", bankingRouter);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});