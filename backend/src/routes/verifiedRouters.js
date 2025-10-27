import express from "express";
import { login, changePin } from "../controllers/verifiedControllers.js";

const router = express.Router();

router.post("/login", login);

router.post("/changePin", changePin);
