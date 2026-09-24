const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path');

config({ path: path.join(__dirname, '.env') });

async function checkDb() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/techmaster');

  const schema = new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed }, { strict: false });
  const CMSData = mongoose.models.CMSData || mongoose.model('CMSData', schema, 'cmsdata');

  const docs = await CMSData.find({}, 'key');
  console.log('CMSData Keys:', docs.map(d => d.key));

  const services = await CMSData.findOne({ key: 'services' });
  console.log('Services count:', services ? services.value.length : 0);

  const servicesPage = await CMSData.findOne({ key: 'servicesPage' });
  console.log('ServicesPage keys:', servicesPage ? Object.keys(servicesPage.value) : 'null');

  mongoose.disconnect();
}
checkDb();
