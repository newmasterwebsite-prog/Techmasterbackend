const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path');

config({ path: path.join(__dirname, 'src', '.env') });
config({ path: path.join(__dirname, '.env') });

async function getHomepage() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  
  const db = mongoose.connection.db;
  const col = db.collection('cmsdatas');
  
  const doc = await col.findOne({ key: 'homepage' });
  console.log(JSON.stringify(doc ? doc.value : {}, null, 2));
  
  mongoose.disconnect();
}
getHomepage();
