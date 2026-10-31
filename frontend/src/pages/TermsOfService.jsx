import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 780 }}>

        <Link to="/" style={{ fontSize: 13, color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          ← Back to Home
        </Link>

        <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #43d9a2, #5eb3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📋</div>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-1)' }}>Terms of Service</h1>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Last updated: January 2026</p>
            </div>
          </div>
          <div style={{ background: 'rgba(67,217,162,0.07)', border: '1px solid rgba(67,217,162,0.2)', borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              By using JobBoard, you agree to these terms. Please read them carefully. These terms are governed by the laws of India.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            {
              title: '1. Acceptance of Terms',
              content: `By accessing or using JobBoard ("the Platform"), you confirm that you are at least 18 years old and agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.`,
            },
            {
              title: '2. User Accounts',
              content: `• You are responsible for maintaining the confidentiality of your account credentials
- You must provide accurate, current, and complete information during registration
- You may not create accounts on behalf of others without their explicit consent
- You may not use another person's account without permission
- We reserve the right to suspend accounts that violate these terms`,
            },
            {
              title: '3. Job Seekers',
              content: `As a job seeker, you agree to:

- Provide truthful information in your profile and applications
- Not apply for jobs you are clearly unqualified for with intent to mislead
- Not use automated tools to mass-apply to jobs
- Not misrepresent your qualifications, experience, or identity
- Accept that employers make independent hiring decisions and JobBoard is not responsible for outcomes`,
            },
            {
              title: '4. Employers / Companies',
              content: `As an employer, you agree to:

- Post only genuine job opportunities
- Not post illegal, discriminatory, or misleading job listings
- Not collect fees from job seekers — this platform is for legitimate employment only
- Respond to applications in good faith
- Comply with all applicable Indian labour laws including equal opportunity requirements
- Not use candidate data for purposes other than evaluating their application`,
            },
            {
              title: '5. Prohibited Conduct',
              content: `You must not:

- Post false, misleading, or fraudulent content
- Harass, discriminate against, or harm other users
- Attempt to gain unauthorised access to any part of the platform
- Use the platform to distribute spam or malware
- Scrape, copy, or redistribute platform data without permission
- Impersonate any person or organisation
- Post content that violates Indian law including the IT Act 2000`,
            },
            {
              title: '6. Content Ownership',
              content: `• You retain ownership of content you post (resumes, job listings, etc.)
- By posting content, you grant JobBoard a non-exclusive licence to display it on the platform
- You confirm you have the right to share any content you post
- JobBoard does not claim ownership of user-submitted content`,
            },
            {
              title: '7. Platform Availability',
              content: `JobBoard is provided on an "as is" basis. We do not guarantee:

- Uninterrupted or error-free service
- That job listings are accurate or current
- Employment outcomes for any user

We may modify, suspend, or discontinue the platform at any time with reasonable notice.`,
            },
            {
              title: '8. Limitation of Liability',
              content: `To the maximum extent permitted by Indian law:

- JobBoard is not liable for hiring decisions made by employers
- We are not responsible for false information provided by users
- Our total liability for any claim shall not exceed ₹1,000
- We are not liable for indirect, incidental, or consequential damages`,
            },
            {
              title: '9. Termination',
              content: `We may terminate or suspend your account at any time if you violate these terms. You may delete your account at any time. Upon termination, your data will be handled per our Privacy Policy.`,
            },
            {
              title: '10. Governing Law',
              content: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Indore, Madhya Pradesh, India.`,
            },
            {
              title: '11. Contact',
              content: `For questions about these terms:
Email: legal@jobboard.com
Response time: Within 7 business days`,
            },
          ].map((sec, i) => (
            <div key={i} className="card">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12 }}>{sec.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{sec.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}