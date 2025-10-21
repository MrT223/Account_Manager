import mongoose from "mongoose";

export const connectDB = async (params) => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error");
    process.exit(1);
  }
};
