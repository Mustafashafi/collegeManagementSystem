const express = require('express');
const router = express.Router();

// @route   POST /api/email/send
// @desc    Send email to one or more leads using Brevo API (Direct Fetch Method)
router.post('/send', async (req, res) => {
  const { recipients, subject, message } = req.body;

  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({ 
      success: false, 
      msg: 'Brevo API key is not configured (BREVO_API_KEY).' 
    });
  }

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ success: false, msg: 'No recipients provided.' });
  }
  if (!subject || !message) {
    return res.status(400).json({ success: false, msg: 'Subject and message are required.' });
  }

  try {
    const sendPromises = recipients.map(({ email, name }) => {
      return fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY.trim(),
          'x-sib-api-key': process.env.BREVO_API_KEY.trim(),
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Skyra Admissions', email: 'mustafashafi143@gmail.com' },
          to: [{ email: email, name: name }],
          subject: subject,
          htmlContent: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
              <div style="background: #1a1a1a; color: #fff; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">Skyra Institute</h2>
                <p style="margin: 6px 0 0; opacity: 0.7; font-size: 13px;">Admissions Department</p>
              </div>
              <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
                <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>
                <div style="font-size: 14px; color: #374151; line-height: 1.7; white-space: pre-line;">${message}</div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">This email was sent by Skyra Institute Admissions. Please do not reply to this email directly.</p>
              </div>
            </div>
          `
        })
      });
    });

    const responses = await Promise.all(sendPromises);
    
    // Check if all requests were successful
    for (const response of responses) {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Brevo API error');
      }
    }

    res.json({ success: true, sent: recipients.length });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, msg: err.message || 'Error sending email via Brevo.' });
  }
});

module.exports = router;
