import Verified from "../models/Verified.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = JWT_SECRET;
const DEFAULT_PIN = DEFAULT_PIN;

export const createPin = async (req, res) => {
  const pinExist = await Verified.findOne();
  if (!pinExist) {
    await Verified.create({ PIN: DEFAULT_PIN });
    console.log(`Lan dau dang nhap, da tao ma PIN mac dinh: ${DEFAULTPIN}`);
  }
};

export const login = async (req, res) => {
  try {
    const { PIN } = req.body;
    if (!PIN) return res.status(400).json({ message: "Thiếu PIN" });

    const verified = await Verified.findOne();
    if (!verified) return res.status(500).json({ message: "Chưa có PIN" });

    if (PIN !== verified.PIN) {
      return res.status(401).json({ message: "PIN sai" });
    }

    const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: "15m" });
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

    if (oldPin !== Verified.PIN) {
      return res.status(401).json({ message: "PIN cũ sai" });
    }

    Verified.PIN = newPin;
    await Verified.save();
    res.json({ message: "Đổi PIN thành công" });
  } catch (error) {
    console.error("changePin failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
