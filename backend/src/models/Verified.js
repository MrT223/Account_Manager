import mongoose from "mongoose";

const PinSchema = new mongoose.Schema(
  {
    PIN: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Verified = mongoose.model("Verified", PinSchema);
export default Verified;
