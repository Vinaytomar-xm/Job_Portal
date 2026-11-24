const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const getStatusInfo = (status) => {
  const map = {
    accepted: { color: '#43d9a2', label: 'Accepted', msg: 'Congratulations! You have been selected.' },
    rejected: { color: '#ff6584', label: 'Rejected', msg: 'Unfortunately, your application was not selected this time.' },
    shortlisted: { color: '#5eb3ff', label: 'Shortlisted', msg: 'Great news! You have been shortlisted for the next round.' },
    reviewed: { color: '#ff9f6b', label: 'Under Review', msg: 'Your application is currently being reviewed.' },
    pending: { color: '#8888a8', label: 'Pending', msg: 'Your application is pending review.' },
  };  
  return map[status] || map.pending;
};

// ── Existing function (unchanged) ────────────────────────────────
const sendStatusUpdateEmail = async ({ toEmail, toName, jobTitle, companyName, status }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[EMAIL SKIP] Would send "${status}" mail to ${toEmail}`);
    return;
  }
  const info = getStatusInfo(status);
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#14141d;border-radius:16px;overflow:hidden;border:1px solid #1e1e2e;">
    <div style="background:linear-gradient(135deg,#6c63ff,#5eb3ff);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;">Job<span style="opacity:0.8;">Board</span></h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Application Status Update</p>
    </div>
    <div style="padding:40px 32px;">
      <p style="color:#f0f0f8;font-size:16px;margin:0 0 8px;">Hi <strong>${toName}</strong>,</p>
      <p style="color:#8888a8;font-size:15px;margin:0 0 32px;">Here's an update on your application.</p>
      <div style="background:#1a1a26;border-radius:12px;padding:24px;margin-bottom:24px;border-left:4px solid ${info.color};">
        <p style="margin:0 0 4px;color:#8888a8;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Applied For</p>
        <h2 style="margin:0 0 4px;color:#f0f0f8;font-size:20px;font-weight:700;">${jobTitle}</h2>
        <p style="margin:0;color:#8888a8;font-size:14px;">${companyName}</p>
      </div>
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
    <div style="padding:20px 32px;border-top:1px solid #1e1e2e;text-align:center;">
      <p style="margin:0;color:#555570;font-size:12px;">© 2026 JobBoard</p>
    </div>
  </div>
</body></html>`;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"JobBoard" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `${info.emoji} Application ${info.label} — ${jobTitle} at ${companyName}`,
      html,
    });
    console.log(`Status email sent to ${toEmail}`);
  } catch (err) {
    console.error(`Email failed:`, err.message);
  }
};

// ── NEW: OTP Email ────────────────────────────────────────────────
const sendOtpEmail = async ({ toEmail, toName, otp }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[EMAIL SKIP] OTP for ${toEmail}: ${otp}`);
    return;
  }

  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#14141d;border-radius:16px;overflow:hidden;border:1px solid #1e1e2e;">
    <div style="background:linear-gradient(135deg,#6c63ff,#5eb3ff);padding:32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;">Job<span style="opacity:0.8;">Board</span></h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Password Reset</p>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <p style="color:#f0f0f8;font-size:16px;margin:0 0 8px;">Hi <strong>${toName}</strong>,</p>
      <p style="color:#8888a8;font-size:14px;margin:0 0 32px;line-height:1.6;">
        You requested a password reset. Use the OTP below — it expires in <strong style="color:#f0f0f8;">10 minutes</strong>.
      </p>

      <!-- OTP Box -->
      <div style="background:#111118;border:2px dashed #6c63ff;border-radius:16px;padding:32px 24px;margin-bottom:28px;">
        <p style="margin:0 0 8px;color:#8888a8;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Your OTP</p>
        <p style="margin:0;color:#6c63ff;font-size:48px;font-weight:900;letter-spacing:12px;">${otp}</p>
      </div>

      <div style="background:rgba(255,101,132,0.08);border:1px solid rgba(255,101,132,0.2);border-radius:10px;padding:14px 18px;margin-bottom:24px;text-align:left;">
        <p style="margin:0;color:#ff6584;font-size:13px;line-height:1.6;">
          ⚠️ If you did not request this, ignore this email. Your password will not change.
          Do not share this OTP with anyone.
        </p>
      </div>

      <p style="color:#555570;font-size:12px;margin:0;">This OTP expires at ${new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #1e1e2e;text-align:center;">
      <p style="margin:0;color:#555570;font-size:12px;">© 2026 JobBoard · This is an automated email</p>
    </div>
  </div>
</body></html>`;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"JobBoard" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Your JobBoard OTP: ${otp} (expires in 10 min)`,
      html,
    });
    console.log(`OTP email sent to ${toEmail}`);
  } catch (err) {
    console.error(`OTP email failed:`, err.message);
    throw new Error('Failed to send OTP email. Please try again.');
  }
};

module.exports = { sendStatusUpdateEmail, sendOtpEmail };