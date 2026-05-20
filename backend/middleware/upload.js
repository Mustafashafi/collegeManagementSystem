const multer = require('multer');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

// Configure the AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const upload = multer({ 
  storage: multerS3({
    s3: s3,
    bucket: function (req, file, cb) {
      if (!process.env.AWS_BUCKET_NAME) {
        return cb(new Error('AWS_BUCKET_NAME environment variable is not set.'));
      }
      cb(null, process.env.AWS_BUCKET_NAME);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueFileName = 'assignments/' + Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
      cb(null, uniqueFileName);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed!'));
    }
  }
});

module.exports = upload;
