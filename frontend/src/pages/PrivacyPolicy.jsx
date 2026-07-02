import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us when you create an account, post a job, or apply for a position. This includes:
• Name, email address, and password
• Professional information such as resume, skills, and work experience
• Company information for employer accounts
• Communications you send us`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Match job seekers with relevant opportunities
• Send you notifications about your applications and job listings
• Communicate with you about our services, updates, and promotions
• Protect against fraudulent, unauthorized, or illegal activity`,
    },
    {
      title: '3. Cookies & Tracking',
      content: `We use cookies and similar technologies to:
• Keep you signed in securely (httpOnly session cookies — not accessible by JavaScript)
• Remember your preferences and settings
• Understand how you use our platform to improve it
• Analytics cookies are optional and require your consent

You can manage your cookie preferences at any time via the Cookie Preferences link in the footer.`,
    },
    {
      title: '4. Data Sharing',
      content: `We do not sell your personal information. We may share your information with:
• Employers when you apply for a job (only the details you choose to share)
• Service providers who assist us in operating the platform
• Law enforcement when required by applicable law

Your resume and cover letter are only shared with companies whose jobs you apply to.`,
    },
    {
      title: '5. Data Security',
      content: `We implement industry-standard security measures including:
• httpOnly cookies for session management (XSS attack protection)
• Encrypted passwords using bcrypt
• HTTPS encryption for all data in transit
• Regular security audits

No method of transmission over the Internet is 100% secure, but we strive to protect your personal information.`,
    },
    {
      title: '6. Your Rights',
      content: `You have the right to:
• Access the personal information we hold about you
• Correct inaccurate or incomplete information
• Request deletion of your personal data
• Withdraw consent for optional data processing at any time
• Lodge a complaint with your local data protection authority

To exercise any of these rights, please contact us.`,
    },
    {
      title: '7. Data Retention',
      content: `We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal purposes.`,
    },
    {
      title: '8. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by displaying a notice on our platform. Your continued use of JobBoard after such changes constitutes acceptance of the updated policy.`,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 780 }}>

        {/* Header */}
        <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>🛡️</div>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-1)' }}>Privacy Policy</h1>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
                Last updated: January 2026 · Effective: January 1, 2026
              </p>
            </div>
          </div>
          <div style={{
            background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              At <strong style={{ color: 'var(--text-1)' }}>JobBoard</strong>, your privacy matters. This policy explains what data we collect,
              why we collect it, and how we protect it. We believe in transparency —
              no confusing legalese, just plain language.
            </p>
          </div>
        </div>

        {/* Quick summary pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
          {[
            { icon: '🔒', text: 'httpOnly cookies — XSS safe' },
            { icon: '🚫', text: 'We never sell your data' },
            { icon: '📧', text: 'Email only when you apply' },
            { icon: '🍪', text: 'Optional cookies need consent' },
          ].map(p => (
            <span key={p.text} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 99, padding: '7px 14px',
              fontSize: 13, color: 'var(--text-2)',
            }}>
              {p.icon} {p.text}
            </span>
          ))}
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {sections.map((sec, i) => (
            <div key={i} className="card fade-in">
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14 }}>
                {sec.title}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{
          marginTop: 40, background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 16,
          padding: 32, textAlign: 'center',
        }}>
          <p style={{ fontSize: 22 }}>📬</p>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', margin: '10px 0 8px' }}>
            Questions about your privacy?
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>
            We're happy to help. Reach out and we'll respond within 48 hours.
          </p>
          <a href="mailto:privacy@jobboard.com" className="btn btn-primary">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
