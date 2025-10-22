import express from "express";
import dotenv from "dotenv";
import accountRoutes from "./routes/accountRouters.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use("/api/account", accountRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server ok");
  });
});
