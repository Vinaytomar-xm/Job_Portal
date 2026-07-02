import { Link } from 'react-router-dom';

const CONSENT_KEY = 'jb_cookie_consent';

export default function Footer() {
  const reopenBanner = () => {
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
  };

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', padding: '40px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 32 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg, #6c63ff, #5eb3ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, color: '#fff',
              }}>J</div>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-1)' }}>JobBoard</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
              Connecting talent with opportunity. Find your dream job or your next great hire.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              For Candidates
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="/jobs">Browse Jobs</FooterLink>
              <FooterLink to="/register">Create Account</FooterLink>
              <FooterLink to="/dashboard">My Applications</FooterLink>
            </div>
          </div>

          {/* Companies */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              For Companies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="/company/register">Register Company</FooterLink>
              <FooterLink to="/company/post-job">Post a Job</FooterLink>
              <FooterLink to="/company/dashboard">Dashboard</FooterLink>
            </div>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Privacy & Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={reopenBanner} style={{
                background: 'none', border: 'none', padding: 0, textAlign: 'left',
                fontSize: 13, color: 'var(--text-3)', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
              >
                🍪 Cookie Preferences
              </button>
              {/* Real hyperlinks */}
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 20,
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            © 2026 JobBoard · Built with ❤️ by Vinay Singh Tomar
          </p>
          {/* <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <SecurityBadge color="#43d9a2" bg="rgba(67,217,162,0.1)" border="rgba(67,217,162,0.25)">
              🔒 Secure Sessions
            </SecurityBadge>
            <SecurityBadge color="#6c63ff" bg="rgba(108,99,255,0.1)" border="rgba(108,99,255,0.25)">
              🍪 GDPR Compliant
            </SecurityBadge>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} style={{
      fontSize: 13, color: 'var(--text-3)',
      textDecoration: 'none', transition: 'color 0.15s',
    }}
      onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
      onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
    >
      {children}
    </Link>
  );
}

function SecurityBadge({ color, bg, border, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, border: `1px solid ${border}`,
      borderRadius: 99, padding: '3px 10px',
      fontSize: 11, color, fontWeight: 600,
    }}>
      {children}
    </span>
  );
}
