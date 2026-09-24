import mongoose from "mongoose";
import { User } from "../models/User";
import { CMSData } from "../models/CMSData";

const cleanupCMSBloat = async () => {
  try {
    const doc = await CMSData.findOne({ key: "resumes" });
    if (doc && Array.isArray(doc.value)) {
      let modified = false;
      const sanitized = doc.value.map((r: any) => {
        if (!r || typeof r !== "object") return r;
        const copy = { ...r };
        const isBase64 = (str: any) => typeof str === "string" && str.startsWith("data:");
        if (isBase64(copy.resumeUrl) || isBase64(copy.resumeFileUrl)) {
          modified = true;
          const downloadUrl = `/api/v1/resumes/download?id=${copy.id || copy._id}&file=${encodeURIComponent(copy.resumeFileName || 'resume.pdf')}`;
          if (isBase64(copy.resumeUrl)) copy.resumeBase64Data = copy.resumeUrl;
          else if (isBase64(copy.resumeFileUrl)) copy.resumeBase64Data = copy.resumeFileUrl;
          copy.resumeUrl = downloadUrl;
          copy.resumeFileUrl = downloadUrl;
        }
        return copy;
      });

      if (modified) {
        await CMSData.findOneAndUpdate({ key: "resumes" }, { value: sanitized });
        await CMSData.findOneAndUpdate({ key: "careerApplications" }, { value: sanitized });
        console.log("Cleaned up existing base64 resume bloat from MongoDB CMSData successfully.");
      }
    }
  } catch (e) {
    console.warn("CMS database cleanup warning:", e);
  }
};

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
