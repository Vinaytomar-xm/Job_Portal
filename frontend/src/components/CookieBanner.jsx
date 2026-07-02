import { useState, useEffect } from 'react';

const CONSENT_KEY = 'jb_cookie_consent';

/*
  Cookie categories:
  - necessary:   always on (session/auth cookies — cannot be refused)
  - analytics:   optional (e.g. page views)
  - preferences: optional (e.g. theme, filters)
*/

export default function CookieBanner() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({
    analytics:   false,
    preferences: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      // Show banner after short delay so page loads first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const saveConsent = (consentPrefs) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      necessary:   true,            // always true
      ...consentPrefs,
      timestamp:   new Date().toISOString(),
    }));
    setVisible(false);
  };

  const acceptAll = () => saveConsent({ analytics: true, preferences: true });
  const rejectAll = () => saveConsent({ analytics: false, preferences: false });
  const saveCustom = () => saveConsent(prefs);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop blur for expanded mode */}
      {expanded && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 9998, backdropFilter: 'blur(4px)',
        }} onClick={() => setExpanded(false)} />
      )}

      <div style={{
        position: 'fixed',
        ...(expanded
          ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 540 }
          : { bottom: 24, left: 24, right: 24, maxWidth: 560, margin: '0 auto' }
        ),
        background: 'var(--bg-card)',
        border: '1px solid var(--border-2)',
        borderRadius: 16,
        padding: expanded ? 32 : 24,
        zIndex: 9999,
        boxShadow: '0 12px 50px rgba(0,0,0,0.7)',
        animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* ── Compact view ── */}
        {!expanded && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>🍪</span>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>We use cookies</p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                We use essential cookies to keep you logged in, and optional cookies to improve your experience.{' '}
                <button onClick={() => setExpanded(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                  Manage preferences →
                </button>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
              <button onClick={rejectAll} className="btn btn-outline btn-sm">Reject optional</button>
              <button onClick={acceptAll} className="btn btn-primary btn-sm">Accept all</button>
            </div>
          </div>
        )}

        {/* ── Expanded / detailed view ── */}
        {expanded && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>🍪</span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Cookie Preferences</h2>
              </div>
              <button onClick={() => setExpanded(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.7 }}>
              JobBoard uses cookies to provide a secure, personalised experience. You can choose which non-essential
              cookies to allow below. Necessary cookies cannot be disabled as they are required for the site to function.
            </p>

            {/* Cookie categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {/* Necessary — always on */}
              <CookieRow
                icon="🔒"
                title="Necessary Cookies"
                description="Required for authentication (login sessions) and core site functionality. These cannot be disabled."
                enabled={true}
                locked={true}
              />

              {/* Analytics */}
              <CookieRow
                icon="📊"
                title="Analytics Cookies"
                description="Help us understand how visitors use the site — page views, session duration, etc. All data is anonymised."
                enabled={prefs.analytics}
                locked={false}
                onChange={v => setPrefs(p => ({ ...p, analytics: v }))}
              />

              {/* Preferences */}
              <CookieRow
                icon="⚙️"
                title="Preference Cookies"
                description="Remember your choices like search filters, job type preferences, and display settings across visits."
                enabled={prefs.preferences}
                locked={false}
                onChange={v => setPrefs(p => ({ ...p, preferences: v }))}
              />
            </div>

            {/* Privacy note */}
            <div style={{
              background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            }}>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
                🛡️ Your data is never sold. Auth cookies are <strong>httpOnly</strong> — JavaScript cannot access them, protecting you from XSS attacks.
                You can change your preferences at any time.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={rejectAll}  className="btn btn-outline" style={{ flex: 1 }}>Reject optional</button>
              <button onClick={saveCustom} className="btn btn-outline" style={{ flex: 1 }}>Save my choices</button>
              <button onClick={acceptAll}  className="btn btn-primary" style={{ flex: 1.5 }}>Accept all</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: ${expanded ? 'translate(-50%,-46%)' : 'translateY(20px)'}; }
          to   { opacity: 1; transform: ${expanded ? 'translate(-50%,-50%)' : 'translateY(0)'}; }
        }
      `}</style>
    </>
  );
}

/* ── Individual cookie toggle row ── */
function CookieRow({ icon, title, description, enabled, locked, onChange }) {
  return (
    <div style={{
      background: 'var(--bg-hover)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 20, marginTop: 2 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{title}</p>
          {locked ? (
            <span className="badge badge-accent">Always On</span>
          ) : (
            <Toggle enabled={enabled} onChange={onChange} />
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

/* ── Toggle switch ── */
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 44, height: 24, borderRadius: 99, border: 'none',
        background: enabled ? 'var(--primary)' : 'var(--border-2)',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: enabled ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', display: 'block',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}
