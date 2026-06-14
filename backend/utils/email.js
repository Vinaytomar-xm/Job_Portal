const nodemailer = require('nodemailer');

// ─── CREATE TRANSPORTER ───────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ─── STATUS COLORS & LABELS ───────────────────────────────────────
const getStatusInfo = (status) => {
  const map = {
    accepted:    { color: '#43d9a2', emoji: '🎉', label: 'Accepted',    msg: 'Congratulations! You have been selected.' },
    rejected:    { color: '#ff6584', emoji: '😔', label: 'Rejected',    msg: 'Unfortunately, your application was not selected this time.' },
    shortlisted: { color: '#5eb3ff', emoji: '⭐', label: 'Shortlisted', msg: 'Great news! You have been shortlisted for the next round.' },
    reviewed:    { color: '#ff9f6b', emoji: '👀', label: 'Under Review', msg: 'Your application is currently being reviewed.' },
    pending:     { color: '#8888a8', emoji: '⏳', label: 'Pending',     msg: 'Your application is pending review.' },
  };
  return map[status] || map.pending;
};

// ─── SEND APPLICATION STATUS EMAIL ───────────────────────────────
const sendStatusUpdateEmail = async ({ toEmail, toName, jobTitle, companyName, status }) => {
  // If email not configured, just log and skip
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[EMAIL SKIP] No email config. Would send "${status}" mail to ${toEmail}`);
    return;
  }

  const info = getStatusInfo(status);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#14141d;border-radius:16px;overflow:hidden;border:1px solid #1e1e2e;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6c63ff,#5eb3ff);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Job<span style="opacity:0.8;">Board</span></h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Application Status Update</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <p style="color:#f0f0f8;font-size:16px;margin:0 0 8px;">Hi <strong>${toName}</strong>,</p>
      <p style="color:#8888a8;font-size:15px;margin:0 0 32px;">Here's an update on your application.</p>

      <!-- Job Card -->
      <div style="background:#1a1a26;border-radius:12px;padding:24px;margin-bottom:24px;border-left:4px solid ${info.color};">
        <p style="margin:0 0 4px;color:#8888a8;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Applied For</p>
        <h2 style="margin:0 0 4px;color:#f0f0f8;font-size:20px;font-weight:700;">${jobTitle}</h2>
        <p style="margin:0;color:#8888a8;font-size:14px;">${companyName}</p>
      </div>

      <!-- Status Badge -->
      <div style="text-align:center;background:#111118;border-radius:12px;padding:28px 24px;margin-bottom:24px;">
        <div style="font-size:48px;margin-bottom:12px;">${info.emoji}</div>
        <div style="display:inline-block;background:${info.color}22;border:1px solid ${info.color}44;border-radius:100px;padding:8px 24px;margin-bottom:16px;">
          <span style="color:${info.color};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${info.label}</span>
        </div>
        <p style="margin:0;color:#f0f0f8;font-size:16px;">${info.msg}</p>
      </div>

      <p style="color:#555570;font-size:13px;text-align:center;margin:0;">
        Log in to <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="color:#6c63ff;text-decoration:none;">JobBoard</a> to view your application details.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid #1e1e2e;text-align:center;">
      <p style="margin:0;color:#555570;font-size:12px;">© 2025 JobBoard · You're receiving this because you applied for a job.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"JobBoard" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `${info.emoji} Application ${info.label} — ${jobTitle} at ${companyName}`,
      html,
    });
    console.log(`✅ Email sent to ${toEmail} (status: ${status})`);
  } catch (err) {
    console.error(`❌ Email failed for ${toEmail}:`, err.message);
    // Don't throw — email failure shouldn't break the API response
  }
};

module.exports = { sendStatusUpdateEmail };
