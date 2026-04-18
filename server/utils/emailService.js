const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define message
  const message = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Send email
  try {
    console.log(`Attempting to send email to: ${options.email} via ${process.env.SMTP_HOST}`);
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email Error Detail:', error.message);
    if (process.env.SMTP_USER === 'your-email@gmail.com') {
      console.warn('⚠️ WARNING: You are still using placeholder email in .env');
    }
    return null;
  }
};

const sendNewApplicationEmail = async (recruiterEmail, candidateName, jobTitle) => {
  const clientUrl = process.env.CLIENT_URL;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #000; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">New Application Received!</h2>
      <p>Hello,</p>
      <p>A new candidate <strong>${candidateName}</strong> has applied for your position: <strong>${jobTitle}</strong>.</p>
      <div style="margin: 30px 0;">
        <a href="${clientUrl}/my-jobs" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Candidate</a>
      </div>
      <p style="color: #888; font-size: 12px;">This is an automated message from Hiretify.</p>
    </div>
  `;

  return sendEmail({
    email: recruiterEmail,
    subject: `New Applicant for ${jobTitle} - Hiretify`,
    html
  });
};

const sendStatusUpdateEmail = async (candidateEmail, candidateName, jobTitle, status) => {
  const clientUrl = process.env.CLIENT_URL;
  const statusColors = {
    accepted: '#22c55e',
    rejected: '#ef4444',
    reviewed: '#3b82f6'
  };

  const statusText = {
    accepted: 'ACCEPTED',
    rejected: 'REJECTED',
    reviewed: 'UNDER REVIEW'
  };

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #000; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">Application Status Updated</h2>
      <p>Hi ${candidateName},</p>
      <p>The status of your application for <strong>${jobTitle}</strong> has been updated to:</p>
      <div style="margin: 30px 0; display: inline-block; padding: 10px 20px; background: ${statusColors[status] || '#f3f4f6'}; color: #fff; border-radius: 50px; font-weight: 900; font-size: 14px;">
        ${(statusText[status] || status).toUpperCase()}
      </div>
      <p>You can check more details on your dashboard.</p>
      <div style="margin: 30px 0;">
        <a href="${clientUrl}/applied-jobs" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Applications</a>
      </div>
      <p style="color: #888; font-size: 12px;">This is an automated message from Hiretify.</p>
    </div>
  `;

  return sendEmail({
    email: candidateEmail,
    subject: `Update on your application for ${jobTitle}`,
    html
  });
};

module.exports = {
  sendNewApplicationEmail,
  sendStatusUpdateEmail
};
