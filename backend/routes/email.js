const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// @route   POST /api/email/send
// @desc    Send email to one or more leads
router.post('/send', async (req, res) => {
  const { recipients, subject, message } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ 
      success: false, 
      msg: 'Email credentials are not configured in the server .env file (EMAIL_USER and EMAIL_PASS).' 
    });
  }

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ success: false, msg: 'No recipients provided.' });
  }
  if (!subject || !message) {
    return res.status(400).json({ success: false, msg: 'Subject and message are required.' });
  }

  try {
    // Create a transporter using Gmail (or any SMTP service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER.replace(/\s/g, ''),
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
      },
    });

    // Send to all recipients
    const fromEmail = process.env.EMAIL_USER.replace(/\s/g, '');
    const sendPromises = recipients.map(({ email, name }) =>
      transporter.sendMail({
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
      })
    );

    await Promise.all(sendPromises);

    res.json({ success: true, sent: recipients.length });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
