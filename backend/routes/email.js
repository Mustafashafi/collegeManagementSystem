const express = require('express');
const router = express.Router();
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Setup Brevo
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// @route POST /api/email/send
router.post('/send', async (req, res) => {
  const { recipients, subject, message } = req.body;

  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({ success: false, msg: 'Brevo API key missing' });
  }

  if (!process.env.EMAIL_USER) {
    return res.status(500).json({ success: false, msg: 'Sender email missing' });
  }

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ success: false, msg: 'No recipients provided' });
  }

  if (!subject || !message) {
    return res.status(400).json({ success: false, msg: 'Subject & message required' });
  }

  try {
    for (const recipient of recipients) {
      await tranEmailApi.sendTransacEmail({
        sender: {
          email: process.env.EMAIL_USER,
          name: "EduSystem Admissions"
        },
        to: [
          {
            email: recipient.email,
            name: recipient.name
          }
        ],
        subject: subject,
        htmlContent: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
            <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
              <h2>EduSystem College</h2>
              <p>Admissions Department</p>
            </div>
            <div style="background: #fff; padding: 30px;">
              <p>Dear <strong>${recipient.name}</strong>,</p>
              <div style="white-space: pre-line;">${message}</div>
              <hr/>
              <p style="font-size:12px;color:#999;">This email was sent by EduSystem Admissions.</p>
            </div>
          </div>
        `
      });
    }

    res.json({
      success: true,
      msg: `Sent ${recipients.length} emails`,
      sent: recipients.length
    });

  } catch (err) {
    console.error("FULL ERROR:", err.response?.body || err.message);

    res.status(500).json({
      success: false,
      msg: 'Failed to send email',
      error: err.message
    });
  }
});

module.exports = router;