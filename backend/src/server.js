import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // 👈 Thêm thư viện CORS
import accountRoutes from "./routes/accountRouters.js";
import verifiedRoutes from "./routes/verifiedRouters.js";
import { connectDB } from "./config/db.js";
import { createPin } from "./controllers/verifiedControllers.js";
import jwt from "jsonwebtoken";

dotenv.config();

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-jwt";

const app = express();

// Cấu hình CORS để chỉ cho phép frontend (http://localhost:5173) truy cập
const corsOptions = {
  origin: "http://localhost:5173", // Nguồn gốc của frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions)); // 👈 Sử dụng middleware CORS đã cấu hình

app.use(express.json()); // Middleware xử lý JSON

// Middleware để bảo vệ các route (kiểm tra JWT)
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, JWT_SECRET); // Xác minh token
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res
        .status(401)
        .json({ message: "Không có quyền truy cập, token không hợp lệ" });
    }
  } else {
    res
      .status(401)
      .json({ message: "Không có quyền truy cập, không có token" });
  }
};

// Áp dụng middleware bảo vệ cho các route quản lý tài khoản (CRUD)
app.use("/api/account", protect, accountRoutes);

// Thêm các route xác thực (login/changePin/checkToken)
app.use("/api/verified", verifiedRoutes);

// Route chào mừng đơn giản
app.get("/", (req, res) => res.send("Account Manager API is running..."));

connectDB().then(() => {
  // Khởi tạo PIN mặc định nếu chưa có
  createPin();

  app.listen(PORT, () => {
    console.log(`Server ok on port ${PORT}`);
  });
});
