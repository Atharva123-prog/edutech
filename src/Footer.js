import React, { useState } from 'react';

const footerIcons = {
  send: (
    <path d="M12 19l9-7-9-7-9 7 9 7zm0 0v-10" />
  ),
  twitter: (
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  ),
  github: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  ),
  linkedin: (
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />
  )
};

function FooterIcon({ name, size = 18, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {footerIcons[name] || null}
    </svg>
  );
}

export default function Footer({ t, onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer style={{
      background: t.isDark ? '#080c16' : '#f8fafc',
      borderTop: `1px solid ${t.border}`,
      color: t.textSecondary,
      padding: '60px 24px 30px',
      fontSize: 14,
      position: 'relative',
      overflow: 'hidden',
      zIndex: 10
    }}>
      {/* Decorative Blob */}
      <div className="glow-blob glow-blob-primary" style={{ width: 300, height: 300, bottom: -150, left: '50%', transform: 'translateX(-50%)' }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 40,
        marginBottom: 50,
        position: 'relative',
        zIndex: 2
      }}>
        {/* Branding & Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: t.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>EduAI</span>
          </div>
          <p style={{ color: t.textMuted, lineHeight: 1.6, fontSize: 13 }}>
            Empowering lifelong learners with interactive artificial intelligence tools, expert-crafted courses, and specialized reference literature.
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: t.textSecondary, margin: '2px 0 6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: t.primary }}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            Toll-Free: +1 (800) 555-EDUAI
          </p>
          <form onSubmit={handleSubscribe} style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: t.text, marginBottom: 8, letterSpacing: '0.05em' }}>
              Subscribe to Newsletter
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder={subscribed ? "Subscribed! Thank you!" : "Enter email address"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={subscribed}
                required
                className="premium-input"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1px solid ${t.border}`,
                  background: t.bgInput,
                  color: t.text,
                  fontSize: 13,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={subscribed}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: t.gradient,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FooterIcon name="send" color="#fff" size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Column 2: Platform Links */}
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
            {['Dashboard', 'Courses', 'AI Tools', 'Bookstore'].map(item => (
              <li key={item}>
                <button
                  onClick={() => onNavigate(item === 'AI Tools' ? 'ai' : item.toLowerCase())}
                  style={{
                    background: 'none', border: 'none', padding: 0, color: t.textSecondary,
                    cursor: 'pointer', textAlign: 'left', transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.color = t.primary}
                  onMouseLeave={e => e.target.style.color = t.textSecondary}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
            {['Student Portal', 'Syllabus Guides', 'Reference Books', 'Developer API', 'Community Hub'].map(item => (
              <li key={item} style={{ color: t.textSecondary }}>
                <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = t.primary}
                      onMouseLeave={e => e.target.style.color = t.textSecondary}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact & Support */}
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
            <li>
              <button
                onClick={() => onNavigate('contact')}
                style={{
                  background: 'none', border: 'none', padding: 0, color: t.textSecondary,
                  cursor: 'pointer', textAlign: 'left', transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.target.style.color = t.primary}
                onMouseLeave={e => e.target.style.color = t.textSecondary}
              >
                Help & Contact Us
              </button>
            </li>
            {['Knowledge Base', 'Security Audits', 'Fulfillment Services', 'Terms of Use', 'Privacy Policy'].map(item => (
              <li key={item} style={{ color: t.textSecondary }}>
                <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = t.primary}
                      onMouseLeave={e => e.target.style.color = t.textSecondary}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom Row */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        paddingTop: 30,
        borderTop: `1px solid ${t.borderLight}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ color: t.textMuted, fontSize: 13 }}>
          © 2026 EduAI Learning Technologies, Inc. Built with ❤️ and human ingenuity.
        </div>
        
        {/* Social Icons */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['twitter', 'github', 'linkedin'].map(social => (
            <a
              key={social}
              href={`https://${social}.com`}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: t.bgInput,
                border: `1px solid ${t.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: t.textSecondary,
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = t.primary;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = t.textSecondary;
                e.currentTarget.style.background = t.bgInput;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FooterIcon name={social} size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
