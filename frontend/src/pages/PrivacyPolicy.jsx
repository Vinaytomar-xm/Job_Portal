import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 780 }}>

        <Link to="/" style={{ fontSize: 13, color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          ← Back to Home
        </Link>

        <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛡️</div>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-1)' }}>Privacy Policy</h1>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Last updated: January 2026 · Effective: January 1, 2026</p>
            </div>
          </div>
          <div style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              JobBoard ("we", "our", "us") is operated by Vinay Singh Tomar. This Privacy Policy explains how we collect, use, and protect your personal data in compliance with India's <strong style={{ color: 'var(--text-1)' }}>Digital Personal Data Protection (DPDP) Act, 2023</strong> and international best practices.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
          {[
            { icon: '🔒', text: 'httpOnly cookies — XSS safe' },
            { icon: '🚫', text: 'We never sell your data' },
            { icon: '🇮🇳', text: 'DPDP Act 2023 compliant' },
            { icon: '🍪', text: 'Optional cookies need consent' },
          ].map(p => (
            <span key={p.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 99, padding: '7px 14px', fontSize: 13, color: 'var(--text-2)' }}>
              {p.icon} {p.text}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            {
              title: '1. Data We Collect',
              content: `We collect only what is necessary to provide our service:

- Name, email address, and password (for account creation)
- Phone number (optional, for job seeker profiles)
- Professional details: resume link, skills, cover letters (only when you apply)
- Company details: company name, website, size, description (for employer accounts)
- Session data via httpOnly cookies (not readable by JavaScript)

We do NOT collect: payment information, government IDs, biometric data, or sensitive personal data as defined under DPDP Act 2023.`,
            },
            {
              title: '2. How We Use Your Data',
              content: `Your data is used only for:

- Creating and managing your account
- Matching job seekers with relevant job postings
- Sending application status notifications via email (only when a company responds)
- Maintaining secure login sessions via httpOnly cookies
- Improving platform performance (only with your analytics consent)

We do not use your data for automated profiling or decision-making.`,
            },
            {
              title: '3. Cookies',
              content: `We use two types of cookies:

Necessary cookies (always active):
- jb_token — httpOnly session cookie for authentication. Cannot be read by JavaScript. Required for login to work.

Optional cookies (require your consent):
- Analytics cookies — anonymised usage data to improve the platform
- Preference cookies — remembers your filter and display settings

You can manage or withdraw cookie consent anytime via "Cookie Preferences" in the footer.`,
            },
            {
              title: '4. Data Sharing',
              content: `We share your data only in these limited cases:

- With employers — only the information you explicitly submit in a job application (name, email, cover letter, resume link)
- With service providers — MongoDB Atlas (database hosting), Render (backend hosting), Vercel (frontend hosting). All are bound by data processing agreements.
- With authorities — only when required by Indian law or a valid court order

We never sell, rent, or trade your personal data.`,
            },
            {
              title: '5. Your Rights Under DPDP Act 2023',
              content: `As a Data Principal under India's DPDP Act 2023, you have the right to:

- Access — know what personal data we hold about you
- Correction — request correction of inaccurate data
- Erasure — request deletion of your personal data
- Grievance redressal — raise a complaint with us or the Data Protection Board of India
- Withdrawal of consent — withdraw consent for optional data processing at any time

To exercise any right, email us at: privacy@jobboard.com
We will respond within 72 hours.`,
            },
            {
              title: '6. Data Security',
              content: `We implement the following security measures:

- Passwords are hashed using bcrypt (never stored in plain text)
- Session tokens stored in httpOnly cookies (inaccessible to JavaScript — XSS safe)
- All data transmitted over HTTPS (TLS encryption)
- Database access restricted by IP allowlist

No system is 100% secure. In the event of a data breach, we will notify affected users within 72 hours as required by DPDP Act 2023.`,
            },
            {
              title: '7. Data Retention',
              content: `• Account data: retained while your account is active
- Deleted accounts: data removed within 30 days of deletion request
- Application data: retained for 90 days after a job is closed
- Session cookies: expire after 7 days automatically

You can request early deletion by contacting us.`,
            },
            {
              title: '8. Children\'s Privacy',
              content: `JobBoard is not intended for users under 18 years of age. We do not knowingly collect data from minors. If you believe a minor has registered, please contact us immediately and we will delete the account.`,
            },
            {
              title: '9. Changes to This Policy',
              content: `We may update this policy as our service evolves or legal requirements change. We will notify you via email or a prominent notice on the platform at least 7 days before changes take effect. Continued use after that date constitutes acceptance.`,
            },
            {
              title: '10. Contact & Grievance Officer',
              content: `For any privacy concerns, data requests, or grievances:

Name: Vinay Singh Tomar
Email: privacy@jobboard.com
Response time: Within 72 hours

You may also raise a complaint with the Data Protection Board of India once operational under DPDP Act 2023.`,
            },
          ].map((sec, i) => (
            <div key={i} className="card">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12 }}>{sec.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{sec.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 22 }}>📬</p>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', margin: '10px 0 8px' }}>Questions about your privacy?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>We respond within 72 hours as required by DPDP Act 2023.</p>
          <a href="mailto:privacy@jobboard.com" className="btn btn-primary">Contact Us</a>
        </div>
      </div>
    </div>
  );
}