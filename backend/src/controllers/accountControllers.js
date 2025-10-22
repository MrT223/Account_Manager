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
    const { name, username, category, password } = req.body;
    const account = new Accounts({ name, username, category, password });

    const newAccount = await account.save();
    res.status(201).json(newAccount);
  } catch (error) {
    console.error("createAccounts failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateAccounts = async (req, res) => {
  try {
    const { name, username, category, password } = req.body;
    const updatedAccounts = await Accounts.findByIdAndUpdate(
      req.params.id,
      { name, username, category, password },
      { new: true }
    );

    if (!updatedAccounts) {
      return res.status(404).json({ message: "No valid" });
    }
    res.status(200).json(updatedAccounts);
  } catch (error) {
    console.error("updateAccounts failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteAccounts = async (req, res) => {
  try {
    const deletedAccounts = await Accounts.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted!" });
    if (!deletedAccounts) {
      return res.status(404).json({ message: "No valid" });
    }
  } catch (error) {
    console.error("deleteAccounts failed!", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
