import mongoose from "mongoose";
import { CMSData } from "../models/CMSData";

async function main() {
  const uri = "mongodb+srv://Noopur_11:Gunu%40123@cluster0.zsrsakf.mongodb.net/techmaster?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB Atlas");
  const docs = await CMSData.find({}, "key");
  console.log("Keys in CMSData collection:");
  console.log(docs.map(d => d.key));
  await mongoose.disconnect();
}

main().catch(console.error);
