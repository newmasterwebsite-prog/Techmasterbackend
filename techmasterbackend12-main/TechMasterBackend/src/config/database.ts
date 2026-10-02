import mongoose from "mongoose";
import { User } from "../models/User";
import { CMSData } from "../models/CMSData";

// No-op cleanup
const cleanupCMSBloat = async () => {};


export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in the environment variables.");
      process.exit(1);
    }

    mongoose.connection.on("connected", () => {
      console.log("Successfully connected to MongoDB database: techmaster");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection disconnected.");
    });

    await mongoose.connect(mongoUri);

    // Run one-time startup cleanup for existing base64 resume bloat
    void cleanupCMSBloat();

    // Seed/Update default admin for login verification
    const adminEmail = "techmasteradmin@gmail.com";
    const adminPass = "Techmaster@2026";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.findOne({ email: "admin@gmail.com" });
    }

    if (admin) {
      admin.email = adminEmail;
      admin.password = adminPass;
      await admin.save();
      console.log(`Updated admin credentials: ${adminEmail} / ${adminPass}`);
    } else {
      await User.create({
        fullName: "Super Admin",
        email: adminEmail,
        password: adminPass,
        role: "Super Admin",
        status: "Active",
      });
      console.log(`Seeded default admin credentials: ${adminEmail} / ${adminPass}`);
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
