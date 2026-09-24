const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    const FormData = require('form-data');
    
    // Create a dummy PDF file
    const dummyPdfPath = path.join(__dirname, 'dummy.pdf');
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    const form = new FormData();
    form.append('name', 'Test User');
    form.append('email', 'test@example.com');
    form.append('phone', '1234567890');
    form.append('jobTitle', 'Test Engineer');
    form.append('experience', 'https://github.com/test');
    form.append('message', 'Why join? Testing.');
    form.append('coverLetter', 'This is a cover letter.');
    form.append('resume', fs.createReadStream(dummyPdfPath), {
      filename: 'dummy.pdf',
      contentType: 'application/pdf'
    });

    console.log('Sending request to http://localhost:5000/api/v1/cms/public/resume...');
    
    const response = await fetch('http://localhost:5000/api/v1/cms/public/resume', {
      method: 'POST',
      body: form
    });

    const text = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Body:', text);
    
    if (fs.existsSync(dummyPdfPath)) {
      fs.unlinkSync(dummyPdfPath);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUpload();
