import express from "express";
import {
  createAccounts,
  getAllAccounts,
} from "../controllers/accountControllers.js";

const router = express.Router();

router.get("/", getAllAccounts);

router.post("/", createAccounts);

export default router;
