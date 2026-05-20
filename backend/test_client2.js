const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function testUpload() {
  const form = new FormData();
  form.append('email', 'test@example.com');
  form.append('role', 'student');
  
  const testImagePath = path.join(__dirname, 'test2.jpg');
  fs.writeFileSync(testImagePath, 'fake image content');
  
  form.append('avatar', fs.createReadStream(testImagePath));

  try {
    const response = await axios.post('http://localhost:5000/api/auth/profile-image', form, {
      headers: form.getHeaders()
    });
    console.log("SUCCESS:", response.data);
  } catch (err) {
    console.error("FAIL:", err.response ? err.response.data : err.message);
  } finally {
    fs.unlinkSync(testImagePath);
  }
}
testUpload();
