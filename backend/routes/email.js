const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 preference globally for this process
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: (process.env.EMAIL_USER || '').replace(/\s/g, ''),
    pass: (process.env.EMAIL_PASS || '').replace(/\s/g, ''),
  },
  pool: true,
  maxConnections: 3,
  family: 4
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('📧 Email Transporter Error:', error.message);
  } else {
    console.log('📧 Email Server is ready to take our messages');
  }
});

// @route   POST /api/email/send
// @desc    Send email to one or more leads
router.post('/send', async (req, res) => {
  const { recipients, subject, message } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      msg: 'Email credentials are not configured.'
    });
  }

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ success: false, msg: 'No recipients provided.' });
  }
  if (!subject || !message) {
    return res.status(400).json({ success: false, msg: 'Subject and message are required.' });
  }

  const fromEmail = process.env.EMAIL_USER.replace(/\s/g, '');

  // Define the send function
  const sendEmail = async ({ email, name }) => {
    return transporter.sendMail({
      from: `"EduSystem Admissions" <${fromEmail}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
          <div style="background: #1a1a1a; color: #fff; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">EduSystem College</h2>
            <p style="margin: 6px 0 0; opacity: 0.7; font-size: 13px;">Admissions Department</p>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>
            <div style="font-size: 14px; color: #374151; line-height: 1.7; white-space: pre-line;">${message}</div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">This email was sent by EduSystem Admissions. Please do not reply to this email directly.</p>
          </div>
        </div>
      `,
    });
  };

  // Return success immediately to the frontend
  res.json({
    success: true,
    msg: recipients.length > 1 ? `Process started for ${recipients.length} emails.` : 'Email is being sent.',
    sent: recipients.length
  });

  // Process all emails in the background
  (async () => {
    try {
      // Use a simple loop to avoid overwhelming the SMTP pool for larger batches
      for (const recipient of recipients) {
        await sendEmail(recipient);
      }
      console.log(`✅ Successfully sent ${recipients.length} emails in background.`);
    } catch (err) {
      console.error('Background email error:', err.message);
    }
  })();
});

module.exports = router;
