const fs = require('fs');
const path = require('path');

async function testUpload() {
  const FormData = require('form-data');
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  
  const form = new FormData();
  form.append('email', 'test@example.com');
  form.append('role', 'student');
  
  // Create a dummy image file
  const testImagePath = path.join(__dirname, 'test.jpg');
  fs.writeFileSync(testImagePath, 'fake image content');
  
  form.append('avatar', fs.createReadStream(testImagePath));

  try {
    const response = await fetch('http://localhost:5000/api/auth/profile-image', {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    console.log("Upload Result:", result);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    fs.unlinkSync(testImagePath);
  }
}

testUpload();
