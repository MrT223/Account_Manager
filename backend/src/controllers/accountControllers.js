import Accounts from "../models/Accounts.js";

export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Accounts.find();
    res.status(200).json(accounts);
  } catch (error) {
    console.error("getAllAccounts failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createAccounts = async (req, res) => {
  try {
    const { username } = req.body;
    const account = new Accounts({ username });

    const newAccount = await account.save();
    res.status(201).json(newAccount);
  } catch (error) {
    console.error("createAccounts failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
