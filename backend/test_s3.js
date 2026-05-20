require('dotenv').config({ path: '../.env' });
const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function test() {
  try {
    console.log("Testing connection...");
    console.log("Region:", process.env.AWS_REGION);
    console.log("Bucket:", process.env.AWS_BUCKET_NAME);
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: 'test.txt',
      Body: 'Hello world',
    });
    await s3.send(command);
    console.log("Successfully uploaded to S3!");
  } catch (err) {
    console.error("Failed:", err);
  }
}
test();
