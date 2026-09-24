const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path');

config({ path: path.join(__dirname, 'src', '.env') });
config({ path: path.join(__dirname, '.env') });

async function inspect() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  
  const db = mongoose.connection.db;
  const col = db.collection('cmsdatas');
  
  const doc = await col.findOne({ key: 'homepage' });
  if (doc && doc.value) {
    const val = doc.value;
    console.log("statisticsCounters:", val.statisticsCounters);
    console.log("statistics:", val.statistics);
    console.log("customSections:", val.customSections);
  } else {
    console.log("No homepage doc found");
  }
  
  mongoose.disconnect();
}
inspect();
