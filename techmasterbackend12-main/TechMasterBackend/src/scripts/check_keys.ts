import mongoose from "mongoose";
import { CMSData } from "../models/CMSData";

async function main() {
  const uri = "mongodb+srv://Noopur_11:Gunu%40123@cluster0.zsrsakf.mongodb.net/techmaster?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  const docs = await CMSData.find({}, "key");
  const keys = docs.map(d => d.key);
  console.log("All keys:");
  console.log(JSON.stringify(keys, null, 2));
  console.log("Has featuredVideos key:", keys.includes("featuredVideos"));
  console.log("Has reels key:", keys.includes("reels"));
  await mongoose.disconnect();
}

main().catch(console.error);
