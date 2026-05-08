const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: (process.env.EMAIL_USER || '').replace(/\s/g, ''),
    pass: (process.env.EMAIL_PASS || '').replace(/\s/g, ''),
  },
  pool: true,
  maxConnections: 3
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
    console.error('📧 Email Error: Credentials missing in environment variables');
    return res.status(500).json({
      success: false,
      msg: 'Email credentials are not configured in the server environment.'
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
      from: `"Skyra Institute" <${fromEmail}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #4f46e5; margin: 0;">Skyra Institute</h2>
            <p style="color: #64748b; margin: 5px 0 0;">Admissions & Communication</p>
          </div>
          <div style="color: #1e293b; line-height: 1.6;">
            <p>Dear <strong>${name}</strong>,</p>
            <div style="margin: 20px 0; background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #4f46e5;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
            <p>Best Regards,<br/><strong>Skyra Admissions Team</strong></p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            This is an automated message. Please do not reply directly to this email.
          </div>
        </div>
      `,
    });
  };

  try {
    // Send emails sequentially to avoid spam filters and connection limits
    // For production stability, we await the results
    const results = [];
    for (const recipient of recipients) {
      const info = await sendEmail(recipient);
      results.push(info);
    }

    console.log(`✅ Successfully sent ${results.length} emails.`);
    
    res.json({ 
      success: true, 
      msg: recipients.length > 1 ? `${recipients.length} emails sent successfully.` : 'Email sent successfully.',
      sent: recipients.length 
    });
  } catch (err) {
    console.error('📧 Nodemailer Error:', err);
    
    // Provide a more descriptive error message for production debugging
    let errorMsg = 'Failed to send email.';
    if (err.message.includes('EAUTH')) {
      errorMsg = 'Email authentication failed. Please check your App Password.';
    } else if (err.message.includes('ECONN')) {
      errorMsg = 'Could not connect to email server.';
    }

    res.status(500).json({ 
      success: false, 
      msg: errorMsg,
      error: err.message
    });
  }
});


module.exports = router;
