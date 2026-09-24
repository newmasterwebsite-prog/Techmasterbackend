const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path');

config({ path: path.join(__dirname, 'src', '.env') });
config({ path: path.join(__dirname, '.env') });

async function search() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  
  const db = mongoose.connection.db;
  const col = db.collection('cmsdatas');
  
  const docs = await col.find({}).toArray();
  console.log(`CMSData keys:`);
  for (const doc of docs) {
    console.log(`- Key: "${doc.key}"`);
    // Search for 20 or billion or counter
    const str = JSON.stringify(doc.value);
    if (str && (str.includes("billion") || str.includes("Billion") || str.includes("Views") || str.includes("views") || str.includes("20"))) {
      console.log(`  MATCHED: value preview (first 200 chars): ${str.substring(0, 200)}`);
    }
  }
  
  mongoose.disconnect();
}
search();
