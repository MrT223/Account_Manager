import express from "express";
import {
  createAccounts,
  deleteAccounts,
  getAllAccounts,
  updateAccounts,
} from "../controllers/accountControllers.js";

const router = express.Router();

router.get("/", getAllAccounts);

router.post("/", createAccounts);

router.put("/:id", updateAccounts);

router.delete("/:id", deleteAccounts);

export default router;
