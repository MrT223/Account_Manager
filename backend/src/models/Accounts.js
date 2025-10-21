import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  label: {
    type: String,
    require: true,
    default: "Mật khẩu",
  },
  password: {
    type: String,
  },
});

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Game", "Ngân hàng", "Mạng xã hội", "Công việc", "Khác"],
      default: "Khác",
    },
    password: {
      type: [passwordSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Accounts = mongoose.model("Accounts", accountSchema);
export default Accounts;
