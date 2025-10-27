import Verified from "../models/Verified.js";
import jwt from "jsonwebtoken";

// LƯU Ý: Đã bỏ định nghĩa hằng số ở đây để tránh lỗi undefined.
// Các biến môi trường sẽ được truy cập trực tiếp qua process.env bên trong các hàm.

export const createPin = async () => {
  const pinExist = await Verified.findOne();
  if (!pinExist) {
    // Truy cập process.env.DEFAULT_PIN ngay tại thời điểm sử dụng
    const DEFAULT_PIN_VALUE = process.env.DEFAULT_PIN;

    // Kiểm tra và đặt PIN mặc định (hoặc dùng một giá trị an toàn nếu vẫn là undefined)
    const pinToUse = DEFAULT_PIN_VALUE || "123456";

    await Verified.create({ PIN: pinToUse });
    console.log(`Lan dau dang nhap, da tao ma PIN mac dinh: ${pinToUse}`);
  }
};

export const login = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET; // Truy cập tại đây để đảm bảo đã được tải

  try {
    const { PIN } = req.body;
    if (!PIN) return res.status(400).json({ message: "Thiếu PIN" });

    const verified = await Verified.findOne();
    if (!verified) return res.status(500).json({ message: "Chưa có PIN" });

    if (PIN !== verified.PIN) {
      return res.status(401).json({ message: "PIN sai" });
    }

    const token = jwt.sign({ sub: verified._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("login failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const changePin = async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;
    if (!oldPin || !newPin)
      return res.status(400).json({ message: "Thiếu dữ liệu" });

    const verified = await Verified.findOne();
    if (!verified) return res.status(500).json({ message: "Chưa có PIN" });

    if (oldPin !== verified.PIN) {
      return res.status(401).json({ message: "PIN cũ sai" });
    }

    verified.PIN = newPin;
    await verified.save();
    res.json({ message: "Đổi PIN thành công" });
  } catch (error) {
    console.error("changePin failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
