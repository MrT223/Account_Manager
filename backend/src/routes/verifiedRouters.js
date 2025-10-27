import express from "express";
import { login, changePin } from "../controllers/verifiedControllers.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware kiểm tra token tối giản
const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

router.post("/login", login);

// Dùng PUT cho việc cập nhật PIN và áp dụng bảo vệ bằng token
router.put("/changePin", checkAuth, changePin);

// Endpoint để frontend kiểm tra token
router.get("/checkToken", checkAuth, (req, res) => {
  res.status(200).json({ message: "Token hợp lệ" });
});

export default router;
