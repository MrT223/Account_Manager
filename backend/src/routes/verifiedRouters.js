import express from "express";
import { login, changePin } from "../controllers/verifiedControllers.js";

const router = express.router();

router.post("/login", login);

router.post("/changePin", changePin);
