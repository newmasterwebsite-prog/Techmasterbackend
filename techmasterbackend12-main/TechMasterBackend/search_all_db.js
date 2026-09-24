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
  console.log(`Searching through ${docs.length} documents...`);
  
  for (const doc of docs) {
    const str = JSON.stringify(doc.value);
    if (str && str.includes("Transform Your Business")) {
      console.log(`FOUND in key: "${doc.key}"`);
      console.log(doc.value);
    }
  }
  
  mongoose.disconnect();
}
search();
