import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

import Footer from './Footer';
import ContactPage from './Contact';
import InterestForm, { BOOKS } from './InterestForm';
import BookstorePage from './Bookstore';
import { CartDrawer, CheckoutModal } from './CartComponents';
import { StudentBoyIllustration, StudentGirlIllustration } from './Illustrations';

// ─── API Helper ────────────────────────────────────────────────────────────────
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : (window.location.hostname.startsWith("192.168.") || window.location.hostname.startsWith("10.") || window.location.hostname.startsWith("172."))
    ? `http://${window.location.hostname}:8000`
    : "https://edubackend-q6ja.onrender.com";

const api = {
  _headers: (token) => {
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },
  get: async (path, token) => {
    const res = await fetch(`${API_BASE}${path}`, { headers: api._headers(token) });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || res.statusText); }
    return res.json();
  },
  post: async (path, body, token) => {
    const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: api._headers(token), body: JSON.stringify(body) });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || res.statusText); }
    return res.json();
  },
  put: async (path, body, token) => {
    const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: api._headers(token), body: JSON.stringify(body) });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || res.statusText); }
    return res.json();
  },
  delete: async (path, token) => {
    const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: api._headers(token) });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || res.statusText); }
    return res.json();
  },
};

// ─── Themes ────────────────────────────────────────────────────────────────────
const themes = {
  light: {
    isDark: false,
    bg: '#f4f9fd', // Softest sky-blue tinted light background (Unacademy feel)
    bgCard: '#ffffff', // Clean white cards
    bgCardHover: '#edf5fa',
    bgInput: '#edf2f7',
    bgNav: 'rgba(255, 255, 255, 0.85)',
    text: '#0f172a', // Deep slate for premium high-contrast readability
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    border: 'rgba(14, 165, 233, 0.08)', // Sky-blue tinted borders
    borderLight: 'rgba(14, 165, 233, 0.04)',
    primary: '#0ea5e9', // Sky blue primary (Unacademy-like vibrant color)
    primaryLight: 'rgba(14, 165, 233, 0.08)',
    secondary: '#ec4899', // Pink secondary
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #ec4899 100%)', // Sky blue to Pink gradient
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    shadow: '0 2px 8px rgba(14, 165, 233, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
    shadowLg: '0 20px 25px -5px rgba(14, 165, 233, 0.08), 0 8px 10px -6px rgba(14, 165, 233, 0.03)',
    bubbleColor: 'rgba(14, 165, 233, 0.06)',
  },
  dark: {
    isDark: true,
    bg: '#070a13', // Midnight dark blue
    bgCard: '#0f1424', // Navy slate card
    bgCardHover: '#182037',
    bgInput: '#182037',
    bgNav: 'rgba(7, 10, 19, 0.9)',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.03)',
    primary: '#38bdf8', // Electric sky blue primary
    primaryLight: 'rgba(56, 189, 248, 0.12)',
    secondary: '#f472b6', // Electric pink
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #f472b6 100%)', // Sky blue to Pink gradient
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    bubbleColor: 'rgba(56, 189, 248, 0.08)',
  }
};;

// ─── Icon Component ────────────────────────────────────────────────────────────
const icons = {
  eye: (
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z" />
  ),
  dollar: (
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  ),
  home: (
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
  ),
  book: (
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  ),
  user: (
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  ),
  star: (
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  ),
  zap: (
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="7" fill="none" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </>
  ),
  brain: (
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  ),
  logout: (
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  ),
  search: (
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  ),
  check: (
    <path d="M5 13l4 4L19 7" />
  ),
  x: (
    <path d="M6 18L18 6M6 6l12 12" />
  ),
  play: (
    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
  ),
  lock: (
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  ),
  mail: (
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  ),
  clock: (
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  grid: (
    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  ),
  trending: (
    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  ),
  chat: (
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  ),
  send: (
    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  ),
  sparkle: (
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  ),
  sun: (
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  ),
  moon: (
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  ),
  shield: (
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  ),
  plus: (
    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  ),
  trash: (
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  ),
  edit: (
    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  ),
  'bar-chart': (
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  ),
  users: (
    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  ),
  layers: (
    <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  ),
  'arrow-right': (
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
  ),
  menu: (
    <path d="M4 6h16M4 12h16M4 18h16" />
  ),
  'chevron-down': (
    <path d="M19 9l-7 7-7-7" />
  ),
};

function Icon({ name, size = 20, color = 'currentColor', style = {} }) {
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
      style={{ flexShrink: 0, ...style }}
    >
      {icons[name] || null}
    </svg>
  );
}

// ─── Toast Component ───────────────────────────────────────────────────────────
function Toast({ toast, onDismiss, t }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColors = { success: t.success, error: t.danger, info: t.primary, warning: t.warning };
  const iconNames = { success: 'check', error: 'x', info: 'sparkle', warning: 'zap' };

  return (
    <div className="toast-enter" style={{
      position: 'fixed', top: 24, right: 24, zIndex: 10000,
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
      background: bgColors[toast.type] || t.primary, color: '#fff',
      borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      fontSize: 14, fontWeight: 500, maxWidth: 400,
    }}>
      <Icon name={iconNames[toast.type] || 'check'} size={18} color="#fff" />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={onDismiss} style={{
        background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6,
        padding: 4, cursor: 'pointer', display: 'flex',
      }}>
        <Icon name="x" size={14} color="#fff" />
      </button>
    </div>
  );
}

// ─── Floating Bubbles ──────────────────────────────────────────────────────────
function FloatingBubbles({ t }) {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const bubbles = [
    { size: 120, top: '10%', left: '5%', delay: 0, duration: 20, parallax: 0.03 },
    { size: 80, top: '60%', left: '85%', delay: 2, duration: 25, parallax: 0.05 },
    { size: 60, top: '30%', left: '70%', delay: 4, duration: 18, parallax: 0.04 },
    { size: 100, top: '70%', left: '15%', delay: 1, duration: 22, parallax: 0.02 },
    { size: 50, top: '20%', left: '50%', delay: 3, duration: 28, parallax: 0.06 },
    { size: 90, top: '80%', left: '60%', delay: 5, duration: 16, parallax: 0.03 },
    { size: 40, top: '45%', left: '30%', delay: 6, duration: 24, parallax: 0.05 },
    { size: 70, top: '15%', left: '90%', delay: 2.5, duration: 30, parallax: 0.04 },
  ];

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2);
    setMouseOffset({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <div onMouseMove={handleMouseMove} style={{ position: 'absolute', inset: 0, pointerEvents: 'auto', zIndex: 0 }}>
        {bubbles.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              transform: `translate(${mouseOffset.x * b.parallax}px, ${mouseOffset.y * b.parallax}px)`,
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              backgroundImage: t.isDark
                ? `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, ${t.primary}18 40%, rgba(244, 114, 182, 0.04) 70%, transparent 100%)`
                : `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.75) 0%, ${t.primary}18 45%, rgba(236, 72, 153, 0.08) 75%, transparent 100%)`,
              border: `1px solid ${t.primary}15`,
              boxShadow: t.isDark
                ? 'inset -3px -3px 10px rgba(0,0,0,0.5), inset 3px 3px 10px rgba(255,255,255,0.05)'
                : 'inset -3px -3px 10px rgba(14, 165, 233, 0.03), inset 3px 3px 10px rgba(255,255,255,0.6)',
              animation: `bubbleFloat ${b.duration}s ease-in-out ${b.delay}s infinite`,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({ onAuth, showToast, t }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '', is_admin: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', form.email);
        formData.append('password', form.password);
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });
        if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Login failed'); }
        const data = await res.json();
        onAuth(data.access_token);
        showToast('Welcome back!', 'success');
      } else {
        await api.post('/auth/register', { email: form.email, password: form.password, name: form.name, is_admin: form.is_admin });
        const formData = new URLSearchParams();
        formData.append('username', form.email);
        formData.append('password', form.password);
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });
        if (!res.ok) throw new Error('Auto-login failed');
        const data = await res.json();
        onAuth(data.access_token);
        showToast('Account created successfully!', 'success');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: t.bg, padding: 20,
    }}>
      <div className="animate-in" style={{
        width: '100%', maxWidth: 420, background: t.bgCard, borderRadius: 20,
        border: `1px solid ${t.border}`, boxShadow: t.shadowLg, padding: '40px 36px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: t.gradient,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Icon name="brain" size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: t.text }}>EduAI</h1>
          <p style={{ color: t.textSecondary, fontSize: 14, marginTop: 4 }}>AI-Powered Learning Platform</p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex', background: t.bgInput, borderRadius: 12, padding: 4, marginBottom: 28,
        }}>
          {['Login', 'Register'].map((tab, i) => (
            <button key={tab} onClick={() => { setIsLogin(i === 0); setError(''); }} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              background: (i === 0 ? isLogin : !isLogin) ? t.bgCard : 'transparent',
              color: (i === 0 ? isLogin : !isLogin) ? t.primary : t.textSecondary,
              boxShadow: (i === 0 ? isLogin : !isLogin) ? t.shadow : 'none',
            }}>
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, background: `${t.danger}15`,
            color: t.danger, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="x" size={16} color={t.danger} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Full Name</label>
              <div style={{
                display: 'flex', alignItems: 'center', background: t.bgInput,
                borderRadius: 12, border: `1px solid ${t.border}`, padding: '0 14px',
              }}>
                <Icon name="user" size={18} color={t.textMuted} />
                <input
                  type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required={!isLogin}
                  style={{
                    flex: 1, padding: '12px 10px', border: 'none', background: 'transparent',
                    fontSize: 14, color: t.text, outline: 'none',
                  }}
                />
              </div>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Email</label>
            <div style={{
              display: 'flex', alignItems: 'center', background: t.bgInput,
              borderRadius: 12, border: `1px solid ${t.border}`, padding: '0 14px',
            }}>
              <Icon name="mail" size={18} color={t.textMuted} />
              <input
                type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required
                style={{
                  flex: 1, padding: '12px 10px', border: 'none', background: 'transparent',
                  fontSize: 14, color: t.text, outline: 'none',
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Password</label>
            <div style={{
              display: 'flex', alignItems: 'center', background: t.bgInput,
              borderRadius: 12, border: `1px solid ${t.border}`, padding: '0 14px',
            }}>
              <Icon name="lock" size={18} color={t.textMuted} />
              <input
                type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required
                style={{
                  flex: 1, padding: '12px 10px', border: 'none', background: 'transparent',
                  fontSize: 14, color: t.text, outline: 'none',
                }}
              />
            </div>
          </div>
          {!isLogin && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="register-is-admin"
                  checked={form.is_admin}
                  onChange={e => setForm({ ...form, is_admin: e.target.checked })}
                  style={{ cursor: 'pointer', width: 16, height: 16 }}
                />
                <label htmlFor="register-is-admin" style={{ fontSize: 14, fontWeight: 600, color: t.textSecondary, cursor: 'pointer' }}>
                  Register as Admin
                </label>
              </div>
              {form.is_admin && (
                <div style={{ fontSize: 12, color: t.warning, marginTop: 6, fontWeight: 500 }}>
                  ⚠️ Admin status requires entering the correct admin password.
                </div>
              )}
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {loading ? (
              <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            ) : (
              <>{isLogin ? 'Sign In' : 'Create Account'}<Icon name="arrow-right" size={18} color="#fff" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────────
function LandingPage({ onNavigate, t }) {
  const [boyBubble, setBoyBubble] = useState("Hey! I'm Dev. I coordinate Bookstore orders and build your personalized learning roadmaps. Let's learn!");
  const [girlBubble, setGirlBubble] = useState("Hello! I'm Ava. I power the AI Tutor and generate adaptive study quizzes. What concept shall we conquer today?");
  
  // Interactive Quotes Explainer States
  const quotesList = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
      insight: "Mandela's quote highlights that learning is not just about memorizing facts; it is the ultimate tool for personal empowerment, structural equality, and global progress. With education, individuals gain the critical thinking needed to challenge injustices and design innovative solutions to humanity's biggest problems.",
      application: "Use EduAI's tailored roadmaps to acquire skills in areas like Web Development and Python, empowering yourself to solve local and global challenges."
    },
    {
      text: "The mind is not a vessel to be filled, but a fire to be kindled.",
      author: "Plutarch",
      insight: "Plutarch shifts the focus of learning from passive reception to active discovery. True education ignites curiosity, critical analysis, and self-motivated research. Rather than just storing information in memory, a kindled mind continuously seeks answers, experiments, and creates new knowledge.",
      application: "Rather than reading static content, use our AI Tutor to ask 'Why' and 'How' questions, igniting interactive debates and personal experiments."
    },
    {
      text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      author: "Mahatma Gandhi",
      insight: "Gandhi advocates for a lifestyle of infinite curiosity. While life is fleeting, our capacity and need for growth is eternal. Lifelong learning keeps the mind active, empathetic, and adaptable, encouraging us to seek knowledge across multiple disciplines throughout our entire lives.",
      application: "Keep expanding your skills by diving into different topics in our Bookstore, ranging from UX Design to Advanced Machine Learning."
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King",
      insight: "King reminds us that knowledge is a permanent personal asset. Markets may crash, environments may change, but the skills, wisdom, and cognitive frameworks you build remain forever yours, providing constant security and opening doors wherever you go.",
      application: "Completing courses and scoring high on quizzes builds verifiable expertise that you carry with you throughout your entire career path."
    }
  ];

  const [selectedQuoteIdx, setSelectedQuoteIdx] = useState(0);
  const [customQuery, setCustomQuery] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [explanationResult, setExplanationResult] = useState(quotesList[0]);

  const handleExplainQuote = (idx) => {
    setSelectedQuoteIdx(idx);
    setExplaining(true);
    setExplanationResult(null);
    setTimeout(() => {
      setExplaining(false);
      setExplanationResult(quotesList[idx]);
    }, 800);
  };

  const handleCustomExplain = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    setExplaining(true);
    setExplanationResult(null);
    
    setTimeout(() => {
      const q = customQuery.toLowerCase();
      let insight = "Curiosity is the engine of intellect. Asking questions about topics like this is the first step of the learning cycle. Learning involves forming a hypothesis, researching existing literature, testing the concept, and refining your understanding.";
      let application = "Take advantage of our AI Tutor to dive deeper into this query, and check the Bookstore for advanced monographs on this feature.";
      
      if (q.includes('python') || q.includes('code') || q.includes('programming') || q.includes('javascript')) {
        insight = "Programming and computational thinking are the languages of the modern world. Writing code teaches logical decomposition—breaking large, scary problems into small, executable steps. It shifts you from a passive consumer of software to an active creator.";
        application = "Check out our 'Python Fundamentals' or 'JavaScript Mastery' courses to start building, and order the 'Clean Code Reference' from our Bookstore.";
      } else if (q.includes('math') || q.includes('algebra') || q.includes('calculus') || q.includes('theorem') || q.includes('geometry')) {
        insight = "Mathematics is the underlying code of the universe. From gravity to internet algorithms, math provides the quantitative tools to model reality. Mastering math trains the brain in abstract reasoning, pattern recognition, and absolute proof.";
        application = "Verify your analytical skills using our adaptive 'Smart Quizzes' and order the 'Discrete Mathematics Guide' in the Bookstore.";
      } else if (q.includes('ai') || q.includes('artificial') || q.includes('machine learning') || q.includes('llm') || q.includes('chatgpt')) {
        insight = "Artificial Intelligence represents the biggest shift in human productivity since the steam engine. By building models that simulate human cognition, we can automate complex workflows, discover new drugs, and personalize education at an infinite scale.";
        application = "Interact directly with our 'AI Tools' tab, ask the AI Tutor for lesson breakdowns, and read the 'Deep Learning Textbook' in our Bookstore.";
      }
      
      setExplaining(false);
      setExplanationResult({
        text: customQuery,
        author: "User Query",
        insight,
        application
      });
    }, 1000);
  };

  const features = [
    { icon: 'brain', title: 'AI Tutor', desc: 'Get instant help from an AI-powered tutor that adapts to your learning style and pace.' },
    { icon: 'zap', title: 'Smart Quizzes', desc: 'AI-generated quizzes that test your understanding and provide detailed explanations.' },
    { icon: 'sparkle', title: 'Personalized Learning', desc: 'Content recommendations tailored to your goals, interests, and progress.' },
    { icon: 'trending', title: 'Progress Tracking', desc: 'Comprehensive analytics to visualize your growth and keep you motivated.' },
  ];

  const stats = [
    { value: '50+', label: 'Expert Courses' },
    { value: '10K+', label: 'Active Students' },
    { value: '1M+', label: 'AI Interactions' },
  ];

  const testimonials = [
    { name: "Sarah K.", role: "Career Transition Student", text: "The reference bookstore textbooks paired with the AI Tutor completely changed my learning process. I passed my AWS Developer certification in just 6 weeks!", avatar: "SK", color: "#ec4899" },
    { name: "Marcus L.", role: "Self-Taught Web Developer", text: "The personalized roadmap recommended courses and reference books that were exactly at my skill level. Having everything in one dashboard is a game changer.", avatar: "ML", color: "#38bdf8" },
    { name: "Jessica T.", role: "Computer Science Major", text: "I love the interactive quizzes! The detailed AI explanations helped me master dynamic programming and graph traversals ahead of my finals.", avatar: "JT", color: "#10b981" }
  ];

  return (
    <div style={{ minHeight: '100vh', background: t.bg, position: 'relative', overflow: 'hidden' }}>
      <FloatingBubbles t={t} />
      {/* Decorative Blobs */}
      <div className="glow-blob glow-blob-primary" style={{ width: 600, height: 600, top: -200, left: -200 }} />
      <div className="glow-blob glow-blob-secondary" style={{ width: 450, height: 450, bottom: 200, right: -150 }} />

      {/* Hero with Character Columns */}
      <section style={{
        position: 'relative', minHeight: '95vh', display: 'flex', alignItems: 'center',
        padding: '120px 24px 80px', zIndex: 2
      }}>
        <div style={{
          maxWidth: 1300, margin: '0 auto', width: '100%',
        }} className="hero-grid">
          
          {/* Left Column: Student Boy Mascot Dev */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} className="animate-in">
            <div 
              onMouseEnter={() => setBoyBubble("I'm ready when you are! Check out our Bookstore for 15+ coding and design manuals.")}
              onMouseLeave={() => setBoyBubble("Hey! I'm Dev. I coordinate Bookstore orders and build your personalized learning roadmaps. Let's learn!")}
              style={{ cursor: 'pointer' }}
            >
              <StudentBoyIllustration size={280} primaryColor="#6366f1" secondaryColor="#ec4899" />
            </div>
            
            {/* Dev Conversation Card */}
            <div className="glass-card" style={{
              padding: '16px 20px', borderRadius: 16, marginTop: 15, maxWidth: 280,
              border: `1px solid ${t.primary}30`, position: 'relative',
              boxShadow: t.shadow, background: `${t.primary}05`
            }}>
              {/* Bubble Arrow pointing up */}
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0, borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent', borderBottom: `10px solid ${t.borderLight}`
              }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: t.primary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Dev • Mascot
              </div>
              <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                "{boyBubble}"
              </p>
            </div>
          </div>

          {/* Center Column: Hero Content */}
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <div className="animate-in" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: t.primaryLight, padding: '8px 18px', borderRadius: 50,
              fontSize: 13, fontWeight: 600, color: t.primary, marginBottom: 28,
              border: `1px solid ${t.primary}22`,
            }}>
              <Icon name="sparkle" size={16} color={t.primary} />
              Unified Learning Platform & Bookstore
            </div>
            <h1 className="animate-in" style={{
              fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 900, lineHeight: 1.15,
              color: t.text, marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              Learn Smarter with{' '}
              <span style={{
                backgroundImage: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite',
              }}>
                AI-Powered
              </span>
              {' '}Education
            </h1>
            <p className="animate-in" style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)', color: t.textSecondary,
              lineHeight: 1.7, marginBottom: 40,
            }}>
              Experience tailored interest roadmaps, responsive chat tutoring, syllabus-aligned reference literature, and adaptive test quizzes.
            </p>
            
            <div className="animate-in" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <button onClick={() => onNavigate('auth')} style={{
                padding: '16px 36px', borderRadius: 14, border: 'none',
                background: t.gradient, color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              }} className="btn-premium">
                Get Started Free <Icon name="arrow-right" size={20} color="#fff" />
              </button>
              <button onClick={() => onNavigate('auth')} style={{
                padding: '16px 36px', borderRadius: 14,
                border: `2px solid ${t.border}`, background: t.bgCard,
                color: t.text, fontSize: 16, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name="play" size={20} color={t.primary} /> Watch Demo
              </button>
            </div>
          </div>

          {/* Right Column: Student Girl Mascot Ava */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} className="animate-in">
            <div 
              onMouseEnter={() => setGirlBubble("I can generate custom multiple-choice quizzes on any topic instantly. Ask me!")}
              onMouseLeave={() => setGirlBubble("Hello! I'm Ava. I power the AI Tutor and generate adaptive study quizzes. What concept shall we conquer today?")}
              style={{ cursor: 'pointer' }}
            >
              <StudentGirlIllustration size={280} primaryColor="#ec4899" secondaryColor="#6366f1" />
            </div>
            
            {/* Ava Conversation Card */}
            <div className="glass-card" style={{
              padding: '16px 20px', borderRadius: 16, marginTop: 15, maxWidth: 280,
              border: `1px solid ${t.secondary}30`, position: 'relative',
              boxShadow: t.shadow, background: `${t.secondary}05`
            }}>
              {/* Bubble Arrow pointing up */}
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0, borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent', borderBottom: `10px solid ${t.borderLight}`
              }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: t.secondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ava • Mascot
              </div>
              <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                "{girlBubble}"
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive AI Quotes & Queries Explainer */}
      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: t.text, marginBottom: 12 }}>
            Interactive AI <span style={{ backgroundImage: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Concept & Quote</span> Explainer
          </h2>
          <p style={{ fontSize: 16, color: t.textSecondary, maxWidth: 600, margin: '0 auto' }}>
            Click an educational quote or type your own concept query below. Watch our interactive AI system explain it and break down its application!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
          
          {/* Left panel: selection of quotes & input field */}
          <div className="glass-card" style={{ padding: 30, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 4 }}>Select a Quote</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {quotesList.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExplainQuote(idx)}
                  className="card-hover"
                  style={{
                    padding: '16px 20px', borderRadius: 16, textAlign: 'left',
                    background: selectedQuoteIdx === idx && !customQuery ? `${t.primary}12` : t.bgInput,
                    border: `1px solid ${selectedQuoteIdx === idx && !customQuery ? t.primary + '60' : t.border}`,
                    cursor: 'pointer', transition: 'all 0.25s', display: 'block', width: '100%'
                  }}
                >
                  <p style={{ fontSize: 13, color: t.text, margin: '0 0 6px', fontWeight: 600, lineHeight: 1.4 }}>
                    "{q.text}"
                  </p>
                  <span style={{ fontSize: 11, color: t.primary, fontWeight: 700 }}>
                    — {q.author}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Query Explainer */}
            <form onSubmit={handleCustomExplain} style={{ marginTop: 10, paddingTop: 20, borderTop: `1px solid ${t.borderLight}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: t.text, marginBottom: 12 }}>Or Enter Your Own Concept</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  placeholder="e.g., Explain Python Loops or Calculus"
                  value={customQuery}
                  onChange={e => { setCustomQuery(e.target.value); }}
                  className="premium-input"
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 13, outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={explaining}
                  style={{
                    padding: '12px 20px', borderRadius: 12, border: 'none',
                    background: t.gradient, color: '#fff', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Explain
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: dynamic animated explainer output terminal */}
          <div className="glass-card" style={{
            padding: 32, borderRadius: 24, minHeight: 380,
            display: 'flex', flexDirection: 'column', border: `1px solid ${t.primary}20`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: t.textMuted, marginLeft: 10 }}>eduai-tutor-shell ~ concept-explainer</span>
            </div>

            {explaining ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', border: `3px solid ${t.primary}20`,
                  borderTopColor: t.primary, animation: 'spin 0.8s linear infinite'
                }} />
                <span style={{ fontSize: 14, color: t.textSecondary, fontFamily: 'monospace' }}>AI Tutor analysis in progress...</span>
              </div>
            ) : explanationResult ? (
              <div className="animate-scale-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: t.primary, letterSpacing: '0.05em' }}>
                    Active Subject / Quote
                  </span>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: t.text, margin: '6px 0 0', lineHeight: 1.4 }}>
                    "{explanationResult.text}"
                  </h4>
                  <p style={{ fontSize: 12, color: t.textMuted, margin: '4px 0 0' }}>— {explanationResult.author}</p>
                </div>

                <div style={{ padding: 16, borderRadius: 12, background: `${t.primary}08`, borderLeft: `3px solid ${t.primary}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: t.primary, marginBottom: 4 }}>
                    Deeper Philosophical Meaning
                  </div>
                  <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.6, margin: 0 }}>
                    {explanationResult.insight}
                  </p>
                </div>

                <div style={{ padding: 16, borderRadius: 12, background: `${t.secondary}08`, borderLeft: `3px solid ${t.secondary}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: t.secondary, marginBottom: 4 }}>
                    How to Apply This Practically
                  </div>
                  <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.6, margin: 0 }}>
                    {explanationResult.application}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: 14 }}>
                Please select a quote or enter an educational query to begin explanation.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Know About Us Section */}
      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="glass-card" style={{ padding: '50px 40px', borderRadius: 28, boxShadow: t.shadowLg }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 50, alignItems: 'center' }}>
            
            {/* Story text */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.primary, uppercase: 'true', marginBottom: 12, letterSpacing: '0.05em' }}>
                KNOW ABOUT US
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: t.text, marginBottom: 20 }}>
                Bridging Literature and <span style={{ backgroundImage: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Next-Gen AI</span> Mentoring
              </h2>
              <p style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.7, marginBottom: 18 }}>
                EduAI was founded by a coalition of educators, engineers, and textbook authors who realized traditional online learning is often isolated and passive. Students read materials without immediate feedback, or converse with generic chat models that lack learning context.
              </p>
              <p style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.7, marginBottom: 24 }}>
                We built a unified hub: an **expert-curated course catalog**, an **official bookstore with 15+ comprehensive manuals**, and a **fully integrated AI study tutor**. It continuously adapts and monitors your dashboard roadmaps to maximize comprehension and retention.
              </p>
              <button 
                onClick={() => onNavigate('contact')}
                style={{
                  padding: '14px 28px', borderRadius: 12, border: `1px solid ${t.primary}40`,
                  background: t.primaryLight, color: t.primary, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                className="btn-hover"
              >
                Learn More & Contact Our Team
              </button>
            </div>

            {/* Core Values grid */}
            <div className="core-values-grid">
              {[
                { title: "24/7 AI Tutor", icon: "brain", desc: "Ava is always online to break down code, check your logic, and clear up tricky lesson doubts.", color: t.secondary },
                { title: "Curated Bookstore", icon: "grid", desc: "Get immediate access to physical & digital textbooks shipped directly to your location.", color: t.primary },
                { title: "Tailored Roadmaps", icon: "sparkle", desc: "Our diagnostic survey generates customized sequential roadmaps based on your level.", color: "#10b981" },
                { title: "Verifiable Badges", icon: "trending", desc: "Earn official completion certificates, track study stats, and monitor your quiz records.", color: "#fbbf24" }
              ].map((val, idx) => (
                <div key={idx} style={{
                  padding: 24, borderRadius: 20, background: t.bgInput, border: `1px solid ${t.border}`,
                  display: 'flex', flexDirection: 'column', gap: 12
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: val.color + '15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon name={val.icon} size={20} color={val.color} />
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: t.text, margin: 0 }}>{val.title}</h4>
                  <p style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5, margin: 0 }}>{val.desc}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Features List */}
      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: t.text, marginBottom: 16 }}>
            Why Choose <span style={{ color: t.primary }}>EduAI</span>?
          </h2>
          <p style={{ fontSize: 17, color: t.textSecondary, maxWidth: 500, margin: '0 auto' }}>
            Our AI-driven platform transforms how you learn with cutting-edge technology.
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24,
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card card-hover" style={{
              padding: 32, borderRadius: 20,
              animation: `fadeInUp 0.5s ease-out ${i * 0.1}s forwards`, opacity: 0,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: t.primaryLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Icon name={f.icon} size={24} color={t.primary} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '60px 20px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1
      }}>
        <div className="glass-card stats-grid" style={{
          borderRadius: 24, padding: '48px 32px',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 40, fontWeight: 900, color: t.primary,
                background: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 15, color: t.textSecondary, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: t.text, marginBottom: 12 }}>
            Loved by <span style={{ backgroundImage: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Students</span> Everywhere
          </h2>
          <p style={{ fontSize: 16, color: t.textSecondary, maxWidth: 500, margin: '0 auto' }}>
            Here is how actual students are using our courses, reference books, and AI learning tools.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {testimonials.map((test, i) => (
            <div key={i} className="glass-card card-hover" style={{ padding: 28, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: test.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 800, color: '#fff'
                }}>
                  {test.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: 0 }}>{test.name}</h4>
                  <p style={{ fontSize: 12, color: t.textSecondary, margin: '2px 0 0' }}>{test.role}</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6, margin: 0, flex: 1, fontStyle: 'italic' }}>
                "{test.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px 100px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', padding: '60px 40px', borderRadius: 28,
          background: t.gradient, position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(99,102,241,0.35)'
        }}>
          <div style={{
            position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1), transparent)',
          }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16, position: 'relative' }}>
            Ready to Transform Your Learning?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 32, position: 'relative' }}>
            Join thousands of students already learning with AI. Start free today.
          </p>
          <button onClick={() => onNavigate('auth')} style={{
            padding: '16px 40px', borderRadius: 14, border: 'none',
            background: '#fff', color: '#6366f1', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', position: 'relative',
          }}>
            Start Learning Now
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Course Card ───────────────────────────────────────────────────────────────
function CourseCard({ course, enrolled, progress, onClick, t }) {
  const levelColors = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };
  const levelColor = levelColors[course.level] || t.primary;

  return (
    <div className="card-hover" onClick={onClick} style={{
      background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}`,
      boxShadow: t.shadow, cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header gradient */}
      <div style={{
        height: 8, background: t.gradient,
      }} />
      <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: `${levelColor}18`, color: levelColor, textTransform: 'capitalize',
          }}>
            {course.level}
          </span>
          <span style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: t.primaryLight, color: t.primary,
          }}>
            {course.category}
          </span>
          <span style={{
            marginLeft: 'auto', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: course.price > 0 ? `${t.warning}15` : `${t.success}15`,
            color: course.price > 0 ? t.warning : t.success,
          }}>
            {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
          </span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 8, lineHeight: 1.4 }}>
          {course.title}
        </h3>
        <p style={{
          fontSize: 13, color: t.textSecondary, lineHeight: 1.6, marginBottom: 16,
          flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.textSecondary }}>
            <Icon name="user" size={14} color={t.textMuted} />
            {course.instructor}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
            <Icon name="star" size={14} color="#f59e0b" />
            {course.rating?.toFixed(1) || '4.5'}
          </div>
        </div>
        {enrolled && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', fontSize: 12, color: t.textSecondary, marginBottom: 6,
            }}>
              <span>Progress</span>
              <span style={{ fontWeight: 700, color: t.primary }}>{progress || 0}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: t.bgInput }}>
              <div style={{
                height: '100%', borderRadius: 3, background: t.gradient,
                width: `${progress || 0}%`, transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getCourseVideoUrl = (title) => {
  const mapping = {
    'Python Fundamentals': 'https://www.youtube.com/embed/kqtD5dpn9C8',
    'JavaScript Mastery': 'https://www.youtube.com/embed/W6NZ1pKBiUY',
    'Machine Learning with Python': 'https://www.youtube.com/embed/GwIo3gToViM',
    'React Development': 'https://www.youtube.com/embed/Ke90Tje7VS0',
    'Data Structures & Algorithms': 'https://www.youtube.com/embed/8hly31xKjhc',
    'Web Development Bootcamp': 'https://www.youtube.com/embed/mU6anWqZsJg',
    'Deep Learning & Neural Networks': 'https://www.youtube.com/embed/aircAruvnKk',
    'Cloud Computing with AWS': 'https://www.youtube.com/embed/3hLmDS179YE',
    'Cybersecurity Essentials': 'https://www.youtube.com/embed/nzj7Wg46zgA',
    'Database Design & SQL': 'https://www.youtube.com/embed/HXV3zeQKqGY',
    'Mobile App Development': 'https://www.youtube.com/embed/0-S5a0eXPoc',
    'UI/UX Design Principles': 'https://www.youtube.com/embed/c9Wg6Ry_OMY',
    'Next.js 14 Web Apps': 'https://www.youtube.com/embed/wm5gMKuwSYk',
    'AI Agents & LangChain': 'https://www.youtube.com/embed/aywZtOOa_Ip',
    'DevOps & Docker Bootcamp': 'https://www.youtube.com/embed/RqTEHSUpY5g',
    'Intro to Blockchain & Web3': 'https://www.youtube.com/embed/coQ5dg8wM2o',
  };
  return mapping[title] || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
};

// ─── Course Detail Modal ───────────────────────────────────────────────────────
function CourseDetailModal({ course, enrolled, progress, token, onClose, onEnroll, onProgress, showToast, t }) {
  const [completing, setCompleting] = useState(null);
  const lessons = course.lessons || [];
  const totalLessons = lessons.length || 1;
  const completedCount = Math.round((progress || 0) * totalLessons / 100);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${course.id}/enroll`, {}, token);
      onEnroll();
      showToast('Successfully enrolled!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCompleteLesson = async (lessonIndex) => {
    setCompleting(lessonIndex);
    const newProgress = Math.min(100, Math.round(((lessonIndex + 1) / totalLessons) * 100));
    try {
      await api.put(`/progress/${course.id}`, { progress: newProgress }, token);
      onProgress(course.id, newProgress);
      showToast(`Lesson completed! Progress: ${newProgress}%`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div className="animate-in" onClick={e => e.stopPropagation()} style={{
        background: t.bgCard, borderRadius: 24, border: `1px solid ${t.border}`,
        boxShadow: t.shadowLg, width: '100%', maxWidth: 640,
        maxHeight: '85vh', overflowY: 'auto', position: 'relative',
      }}>
        {/* Header */}
        <div style={{ padding: '32px 32px 0' }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16, background: t.bgInput,
            border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer',
          }}>
            <Icon name="x" size={18} color={t.textSecondary} />
          </button>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: t.primaryLight, color: t.primary, textTransform: 'capitalize',
            }}>
              {course.level}
            </span>
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: `${t.success}15`, color: t.success,
            }}>
              {course.category}
            </span>
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: course.price > 0 ? `${t.warning}15` : `${t.success}15`,
              color: course.price > 0 ? t.warning : t.success,
            }}>
              {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
            </span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: t.text, marginBottom: 12 }}>
            {course.title}
          </h2>
          <p style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
            {course.description}
          </p>
          <div style={{
            display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24,
            padding: '16px 0', borderTop: `1px solid ${t.borderLight}`, borderBottom: `1px solid ${t.borderLight}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: t.textSecondary }}>
              <Icon name="user" size={16} color={t.textMuted} /> {course.instructor}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#f59e0b' }}>
              <Icon name="star" size={16} color="#f59e0b" /> {course.rating?.toFixed(1) || '4.5'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: t.textSecondary }}>
              <Icon name="users" size={16} color={t.textMuted} /> {course.students || 0} students
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: t.textSecondary }}>
              <Icon name="clock" size={16} color={t.textMuted} /> {lessons.length} lessons
            </div>
          </div>
        </div>

        {/* Progress or Enroll */}
        <div style={{ padding: '0 32px' }}>
          {enrolled ? (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: t.text }}>Your Progress</span>
                <span style={{ fontWeight: 700, color: t.primary }}>{progress || 0}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: t.bgInput }}>
                <div style={{
                  height: '100%', borderRadius: 5, background: t.gradient,
                  width: `${progress || 0}%`, transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ) : (
            <button onClick={handleEnroll} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}>
              <Icon name="plus" size={18} color="#fff" /> {course.price > 0 ? `Enroll Now — $${course.price.toFixed(2)}` : 'Enroll Now — Free'}
            </button>
          )}
        </div>

        {/* Video Player */}
        {enrolled && (
          <div style={{ padding: '0 32px 24px' }}>
            <div style={{
              borderRadius: 16, overflow: 'hidden', border: `1px solid ${t.border}`,
              aspectRatio: '16/9', background: '#000', boxShadow: t.shadow,
            }}>
              <iframe
                width="100%"
                height="100%"
                src={(course.video_url || getCourseVideoUrl(course.title)) + ((course.video_url || getCourseVideoUrl(course.title)).includes('?') ? '&autoplay=1&mute=1' : '?autoplay=1&mute=1')}
                title="Course Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ display: 'block' }}
              ></iframe>
            </div>
          </div>
        )}

        {/* Curriculum */}
        <div style={{ padding: '0 32px 32px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 16 }}>Curriculum</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lessons.length > 0 ? lessons.map((lesson, i) => {
              const isCompleted = enrolled && i < completedCount;
              const isCurrent = enrolled && i === completedCount;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, background: isCompleted ? `${t.success}10` : isCurrent ? t.primaryLight : t.bgInput,
                  border: `1px solid ${isCompleted ? `${t.success}20` : isCurrent ? `${t.primary}20` : t.borderLight}`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: isCompleted ? t.success : isCurrent ? t.primary : t.bgCardHover,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: isCompleted || isCurrent ? '#fff' : t.textMuted,
                  }}>
                    {isCompleted ? <Icon name="check" size={16} color="#fff" /> : i + 1}
                  </div>
                  <span style={{
                    flex: 1, fontSize: 14, fontWeight: isCompleted || isCurrent ? 600 : 500,
                    color: isCompleted ? t.success : t.text,
                  }}>
                    {typeof lesson === 'string' ? lesson : lesson.title || `Lesson ${i + 1}`}
                  </span>
                  {enrolled && isCurrent && (
                    <button
                      disabled={completing === i}
                      onClick={() => handleCompleteLesson(i)}
                      style={{
                        padding: '6px 14px', borderRadius: 8, border: 'none',
                        background: t.gradient, color: '#fff', fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      {completing === i ? (
                        <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      ) : (
                        <><Icon name="check" size={14} color="#fff" /> Complete</>
                      )}
                    </button>
                  )}
                  {!enrolled && (
                    <Icon name="lock" size={16} color={t.textMuted} />
                  )}
                </div>
              );
            }) : (
              <div style={{ padding: 24, textAlign: 'center', color: t.textMuted, fontSize: 14 }}>
                No lessons available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, courses, enrollments, progressMap, onCourseClick, t, interest, onSaveInterest }) {
  const enrolledCourses = enrollments.map(e => ({
    ...(e.course || {}),
    progress: progressMap[e.course?.id] ?? e.progress ?? 0,
  })).filter(c => c.id);

  const avgProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((a, c) => a + (c.progress || 0), 0) / enrolledCourses.length)
    : 0;
  const completedCount = enrolledCourses.filter(c => c.progress >= 100).length;

  const stats = [
    { icon: 'book', label: 'Enrolled', value: enrolledCourses.length, color: '#6366f1' },
    { icon: 'trending', label: 'Avg Progress', value: `${avgProgress}%`, color: '#8b5cf6' },
    { icon: 'award', label: 'Completed', value: completedCount, color: '#10b981' },
    { icon: 'layers', label: 'Available', value: courses.length, color: '#f59e0b' },
  ];

  const recommended = courses.filter(c => !enrolledCourses.some(e => e.id === c.id)).slice(0, 3);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
      {/* Welcome */}
      <div className="animate-in welcome-banner" style={{
        background: t.gradient,
        marginBottom: 36, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent)',
        }} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, position: 'relative' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Learner'} 👋
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', position: 'relative' }}>
          Continue your learning journey. You're making great progress!
        </p>
      </div>

      {/* Interactive Learning Preferences & Customized Roadmap */}
      <InterestForm
        user={user}
        courses={courses}
        books={BOOKS}
        savedInterest={interest}
        onSaveInterest={onSaveInterest}
        t={t}
      />

      {/* Stats Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20, marginBottom: 40,
      }}>
        {stats.map((s, i) => (
          <div key={i} className="animate-in card-hover" style={{
            padding: '24px', borderRadius: 18, background: t.bgCard,
            border: `1px solid ${t.border}`, boxShadow: t.shadow,
            animationDelay: `${i * 0.1}s`,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${s.color}15`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: 14,
            }}>
              <Icon name={s.icon} size={22} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: t.text }}>{s.value}</div>
            <div style={{ fontSize: 13, color: t.textSecondary, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      {enrolledCourses.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 20 }}>
            Continue Learning
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
          }}>
            {enrolledCourses.map(c => (
              <CourseCard
                key={c.id} course={c} enrolled progress={c.progress}
                onClick={() => onCourseClick(c)} t={t}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 6 }}>
            <Icon name="sparkle" size={22} color={t.primary} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
            AI Recommendations
          </h2>
          <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 20 }}>
            Based on your learning pattern, we recommend these courses.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
          }}>
            {recommended.map(c => (
              <CourseCard
                key={c.id} course={c} enrolled={false}
                onClick={() => onCourseClick(c)} t={t}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Courses Page ──────────────────────────────────────────────────────────────
function CoursesPage({ courses, enrolledIds, progressMap, onCourseClick, t }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  const categories = ['all', ...new Set(courses.map(c => c.category).filter(Boolean))];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  const filtered = courses.filter(c => {
    const matchSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || c.category === category;
    const matchLevel = level === 'all' || c.level === level;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
      <div className="animate-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: t.text, marginBottom: 8 }}>
          Explore Courses
        </h1>
        <p style={{ fontSize: 15, color: t.textSecondary }}>
          Browse our collection of {courses.length}+ expert-crafted courses.
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32,
        padding: '20px 24px', borderRadius: 16, background: t.bgCard,
        border: `1px solid ${t.border}`, boxShadow: t.shadow,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220,
          background: t.bgInput, borderRadius: 12, padding: '0 14px',
          border: `1px solid ${t.borderLight}`,
        }}>
          <Icon name="search" size={18} color={t.textMuted} />
          <input
            type="text" placeholder="Search courses..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, padding: '12px 0', border: 'none', background: 'transparent',
              fontSize: 14, color: t.text, outline: 'none',
            }}
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{
          padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
          background: t.bgInput, color: t.text, fontSize: 14, outline: 'none', cursor: 'pointer',
        }}>
          {categories.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
          ))}
        </select>
        <select value={level} onChange={e => setLevel(e.target.value)} style={{
          padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
          background: t.bgInput, color: t.text, fontSize: 14, outline: 'none', cursor: 'pointer',
        }}>
          {levels.map(l => (
            <option key={l} value={l}>{l === 'all' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: 20, fontSize: 14, color: t.textSecondary }}>
        Showing <strong style={{ color: t.text }}>{filtered.length}</strong> courses
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
      }}>
        {filtered.map(c => (
          <CourseCard
            key={c.id} course={c}
            enrolled={enrolledIds.has(c.id)}
            progress={progressMap[c.id]}
            onClick={() => onCourseClick(c)} t={t}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          padding: 60, textAlign: 'center', color: t.textMuted, fontSize: 15,
        }}>
          <Icon name="search" size={40} color={t.textMuted} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p>No courses match your filters. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}

// ─── AI Page ───────────────────────────────────────────────────────────────────
function AIPage({ token, showToast, t }) {
  const [activeTab, setActiveTab] = useState('tutor');

  const tabs = [
    { id: 'tutor', label: 'AI Tutor', icon: 'chat' },
    { id: 'quiz', label: 'Quiz Generator', icon: 'zap' },
    { id: 'summary', label: 'Summarizer', icon: 'sparkle' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div className="animate-in" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: t.text, marginBottom: 8 }}>
          AI Learning Tools
        </h1>
        <p style={{ fontSize: 15, color: t.textSecondary }}>
          Leverage AI to enhance your learning experience.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 28, background: t.bgCard,
        padding: 6, borderRadius: 14, border: `1px solid ${t.border}`,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none',
            background: activeTab === tab.id ? t.gradient : 'transparent',
            color: activeTab === tab.id ? '#fff' : t.textSecondary,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name={tab.icon} size={18} color={activeTab === tab.id ? '#fff' : t.textMuted} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tutor' && <AITutor token={token} showToast={showToast} t={t} />}
      {activeTab === 'quiz' && <AIQuiz token={token} showToast={showToast} t={t} />}
      {activeTab === 'summary' && <AISummary token={token} showToast={showToast} t={t} />}
    </div>
  );
}

// ─── AI Tutor ──────────────────────────────────────────────────────────────────
function AITutor({ token, showToast, t }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI tutor. Ask me anything about your courses, concepts, or any topic you\'re learning. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content }))
      }, token);
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      showToast(err.message, 'error');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: t.bgCard, borderRadius: 20, border: `1px solid ${t.border}`,
      boxShadow: t.shadow, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 300px)', minHeight: 500,
    }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, marginBottom: 20,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: msg.role === 'user' ? t.gradient : t.primaryLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon
                name={msg.role === 'user' ? 'user' : 'brain'}
                size={18}
                color={msg.role === 'user' ? '#fff' : t.primary}
              />
            </div>
            <div style={{
              maxWidth: '75%', padding: '14px 18px', borderRadius: 16,
              background: msg.role === 'user' ? t.gradient : t.bgInput,
              color: msg.role === 'user' ? '#fff' : t.text,
              fontSize: 14, lineHeight: 1.7,
              borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
              borderBottomLeftRadius: msg.role === 'user' ? 16 : 4,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: t.primaryLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="brain" size={18} color={t.primary} />
            </div>
            <div style={{
              padding: '14px 18px', borderRadius: 16, borderBottomLeftRadius: 4,
              background: t.bgInput, display: 'flex', gap: 6,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%', background: t.textMuted,
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 20px', borderTop: `1px solid ${t.border}`,
        display: 'flex', gap: 12,
      }}>
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask your AI tutor anything..."
          style={{
            flex: 1, padding: '14px 18px', borderRadius: 14,
            border: `1px solid ${t.border}`, background: t.bgInput,
            color: t.text, fontSize: 14, outline: 'none',
          }}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{
          padding: '14px 20px', borderRadius: 14, border: 'none',
          background: t.gradient, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14,
        }}>
          <Icon name="send" size={18} color="#fff" /> Send
        </button>
      </div>
    </div>
  );
}

// ─── AI Quiz ───────────────────────────────────────────────────────────────────
function AIQuiz({ token, showToast, t }) {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [quizTopic, setQuizTopic] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    try {
      const res = await api.post('/ai/quiz', { topic: topic.trim(), count: 5 }, token);
      setQuestions(res.questions || []);
      setQuizTopic(res.topic || topic);
      showToast('Quiz generated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIdx, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      showToast('Please answer all questions first.', 'warning');
      return;
    }
    setSubmitted(true);
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    showToast(`Score: ${score}/${questions.length} (${Math.round(score / questions.length * 100)}%)`, score === questions.length ? 'success' : 'info');
  };

  const score = submitted ? questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0) : 0;

  return (
    <div style={{
      background: t.bgCard, borderRadius: 20, border: `1px solid ${t.border}`,
      boxShadow: t.shadow, padding: 32,
    }}>
      {/* Topic Input */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <input
          type="text" value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generateQuiz()}
          placeholder="Enter a topic (e.g., JavaScript Promises, Machine Learning)..."
          style={{
            flex: 1, padding: '14px 18px', borderRadius: 14,
            border: `1px solid ${t.border}`, background: t.bgInput,
            color: t.text, fontSize: 14, outline: 'none',
          }}
        />
        <button onClick={generateQuiz} disabled={loading || !topic.trim()} style={{
          padding: '14px 24px', borderRadius: 14, border: 'none',
          background: t.gradient, color: '#fff', cursor: 'pointer',
          fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
          whiteSpace: 'nowrap',
        }}>
          {loading ? (
            <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          ) : (
            <><Icon name="zap" size={18} color="#fff" /> Generate Quiz</>
          )}
        </button>
      </div>

      {/* Questions */}
      {questions.length > 0 && (
        <>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 8 }}>
            Quiz: {quizTopic}
          </h3>
          {submitted && (
            <div style={{
              padding: '14px 20px', borderRadius: 12, marginBottom: 24,
              background: score === questions.length ? `${t.success}15` : `${t.primary}10`,
              border: `1px solid ${score === questions.length ? `${t.success}30` : `${t.primary}20`}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <Icon name="award" size={24} color={score === questions.length ? t.success : t.primary} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>
                  Score: {score}/{questions.length} ({Math.round(score / questions.length * 100)}%)
                </div>
                <div style={{ fontSize: 13, color: t.textSecondary }}>
                  {score === questions.length ? 'Perfect score! 🎉' : 'Review the explanations below.'}
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {questions.map((q, qIdx) => (
              <div key={q.id || qIdx} style={{
                padding: '20px 24px', borderRadius: 16, background: t.bgInput,
                border: `1px solid ${t.borderLight}`,
              }}>
                <p style={{ fontWeight: 600, color: t.text, marginBottom: 14, fontSize: 15 }}>
                  {qIdx + 1}. {q.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(q.options || []).map((opt, oIdx) => {
                    const isSelected = answers[qIdx] === opt;
                    const isCorrect = submitted && opt === q.answer;
                    const isWrong = submitted && isSelected && opt !== q.answer;
                    let borderColor = t.border;
                    let bg = t.bgCard;
                    if (isCorrect) { borderColor = t.success; bg = `${t.success}12`; }
                    if (isWrong) { borderColor = t.danger; bg = `${t.danger}12`; }
                    if (!submitted && isSelected) { borderColor = t.primary; bg = t.primaryLight; }

                    return (
                      <button key={oIdx} onClick={() => handleAnswer(qIdx, opt)} style={{
                        padding: '12px 16px', borderRadius: 10,
                        border: `2px solid ${borderColor}`, background: bg,
                        color: t.text, fontSize: 14, cursor: submitted ? 'default' : 'pointer',
                        textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                        fontWeight: isSelected ? 600 : 400,
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${isCorrect ? t.success : isWrong ? t.danger : isSelected ? t.primary : t.textMuted}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isCorrect ? t.success : isWrong ? t.danger : isSelected ? t.primary : 'transparent',
                        }}>
                          {(isSelected || isCorrect) && <Icon name="check" size={12} color={isSelected || isCorrect ? '#fff' : 'transparent'} />}
                        </div>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <div style={{
                    marginTop: 12, padding: '12px 16px', borderRadius: 10,
                    background: `${t.primary}08`, border: `1px solid ${t.primary}15`,
                    fontSize: 13, color: t.textSecondary, lineHeight: 1.6,
                  }}>
                    <strong style={{ color: t.primary }}>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!submitted && (
            <button onClick={handleSubmit} style={{
              marginTop: 24, padding: '14px 32px', borderRadius: 14, border: 'none',
              background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, margin: '24px auto 0',
            }}>
              <Icon name="check" size={18} color="#fff" /> Submit Answers
            </button>
          )}
          {submitted && (
            <button onClick={() => { setQuestions([]); setAnswers({}); setSubmitted(false); setTopic(''); }} style={{
              marginTop: 24, padding: '14px 32px', borderRadius: 14, border: 'none',
              background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, margin: '24px auto 0',
            }}>
              <Icon name="zap" size={18} color="#fff" /> Take Another Quiz
            </button>
          )}
        </>
      )}

      {questions.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: t.textMuted }}>
          <Icon name="zap" size={48} color={t.textMuted} style={{ marginBottom: 16, opacity: 0.4 }} />
          <p style={{ fontSize: 15 }}>Enter a topic above to generate an AI-powered quiz.</p>
        </div>
      )}
    </div>
  );
}

// ─── AI Summary ────────────────────────────────────────────────────────────────
function AISummary({ token, showToast, t }) {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('explanation');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = [
    { id: 'concise', label: 'Concise Summary', icon: 'zap' },
    { id: 'detailed', label: 'Detailed Summary', icon: 'book' },
    { id: 'explanation', label: 'Complete Explanation', icon: 'sparkle' },
    { id: 'eli5', label: 'ELI5', icon: 'chat' },
    { id: 'study_notes', label: 'Study Notes', icon: 'edit' },
  ];

  const handleSummarize = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/summary', { text: text.trim(), style }, token);
      setSummary(res.summary || '');
      showToast('AI response generated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: t.bgCard, borderRadius: 20, border: `1px solid ${t.border}`,
      boxShadow: t.shadow, padding: 32,
    }}>
      <textarea
        value={text} onChange={e => setText(e.target.value)}
        placeholder="Enter a topic/concept to explain or paste text content to summarize..."
        style={{
          width: '100%', minHeight: 180, padding: 18, borderRadius: 14,
          border: `1px solid ${t.border}`, background: t.bgInput,
          color: t.text, fontSize: 14, lineHeight: 1.7, outline: 'none',
          resize: 'vertical',
        }}
      />

      {/* Style Selector */}
      <div style={{ display: 'flex', gap: 8, margin: '20px 0', flexWrap: 'wrap' }}>
        {styles.map(s => (
          <button key={s.id} onClick={() => setStyle(s.id)} style={{
            padding: '10px 18px', borderRadius: 10,
            border: `2px solid ${style === s.id ? t.primary : t.border}`,
            background: style === s.id ? t.primaryLight : 'transparent',
            color: style === s.id ? t.primary : t.textSecondary,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name={s.icon} size={16} color={style === s.id ? t.primary : t.textMuted} />
            {s.label}
          </button>
        ))}
      </div>

      <button onClick={handleSummarize} disabled={loading || !text.trim()} style={{
        padding: '14px 28px', borderRadius: 14, border: 'none',
        background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {loading ? (
          <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        ) : (
          <><Icon name="sparkle" size={18} color="#fff" /> Summarize</>
        )}
      </button>

      {summary && (
        <div style={{
          marginTop: 24, padding: '24px', borderRadius: 16,
          background: t.primaryLight, border: `1px solid ${t.primary}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Icon name="sparkle" size={18} color={t.primary} />
            <h4 style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Summary</h4>
          </div>
          <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ────────────────────────────────────────────────────────────────
function AdminPage({ token, courses, showToast, onRefresh, t, currentUser }) {
  const [users, setUsers] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '', description: '', category: 'Programming', level: 'beginner',
    instructor: '', rating: 4.5, students_count: 0, lessons: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchAdmin = useCallback(async () => {
    try {
      const [u, e] = await Promise.all([
        api.get('/admin/users', token).catch(() => []),
        api.get('/admin/enrollments', token).catch(() => []),
      ]);
      setUsers(u || []);
      setAllEnrollments(e || []);
    } catch (err) {
      // silently handle
    }
  }, [token]);

  useEffect(() => { fetchAdmin(); }, [fetchAdmin]);

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/admin/courses/${id}`, token);
      showToast('Course deleted', 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? All their course enrollments will be wiped.')) return;
    try {
      await api.delete(`/admin/users/${id}`, token);
      showToast('User deleted successfully', 'success');
      fetchAdmin();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const lessonsArr = newCourse.lessons.split('\n').filter(l => l.trim()).map(l => l.trim());
      await api.post('/admin/courses', {
        ...newCourse,
        lessons: lessonsArr,
        rating: parseFloat(newCourse.rating),
        students_count: parseInt(newCourse.students_count) || 0,
      }, token);
      showToast('Course created!', 'success');
      setNewCourse({ title: '', description: '', category: 'Programming', level: 'beginner', instructor: '', rating: 4.5, students_count: 0, lessons: '' });
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'bar-chart' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'courses', label: 'Courses', icon: 'book' },
    { id: 'enrollments', label: 'Enrollments', icon: 'trending' },
    { id: 'create', label: 'Create Course', icon: 'plus' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
      <div className="animate-in" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: t.text, marginBottom: 8 }}>
          <Icon name="shield" size={28} color={t.primary} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 15, color: t.textSecondary }}>Manage users, courses, and platform settings.</p>
      </div>

      {/* Section Tabs */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap',
      }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: '10px 20px', borderRadius: 12,
            border: `1px solid ${activeSection === s.id ? t.primary : t.border}`,
            background: activeSection === s.id ? t.primaryLight : t.bgCard,
            color: activeSection === s.id ? t.primary : t.textSecondary,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name={s.icon} size={16} color={activeSection === s.id ? t.primary : t.textMuted} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeSection === 'overview' && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20,
        }}>
          {[
            { label: 'Total Users', value: users.length, icon: 'users', color: '#6366f1' },
            { label: 'Total Courses', value: courses.length, icon: 'book', color: '#8b5cf6' },
            { label: 'Total Enrollments', value: allEnrollments.length, icon: 'trending', color: '#10b981' },
            { 
              label: 'Total Revenue', 
              value: '$' + allEnrollments.reduce((sum, e) => sum + (e.amount_paid || 0), 0).toFixed(2), 
              icon: 'dollar', 
              color: '#f59e0b' 
            },
          ].map((s, i) => (
            <div key={i} className="card-hover" style={{
              padding: 28, borderRadius: 18, background: t.bgCard,
              border: `1px solid ${t.border}`, boxShadow: t.shadow,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${s.color}15`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 14,
              }}>
                <Icon name={s.icon} size={24} color={s.color} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: t.text }}>{s.value}</div>
              <div style={{ fontSize: 14, color: t.textSecondary, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {activeSection === 'users' && (
        <div style={{
          background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}`,
          boxShadow: t.shadow, overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {['Name', 'Email', 'Admin', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '14px 20px', textAlign: 'left', fontSize: 13,
                      fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: t.text }}>
                      {u.name || '—'}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: t.textSecondary }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background: u.is_admin ? `${t.success}15` : `${t.textMuted}15`,
                        color: u.is_admin ? t.success : t.textMuted,
                      }}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', display: 'flex', gap: 8 }}>
                      <button onClick={() => setSelectedUserStats(u)} style={{
                        padding: '6px 14px', borderRadius: 8, border: `1px solid ${t.primary}30`,
                        background: t.primaryLight, color: t.primary, fontSize: 12,
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 4
                      }} className="btn-hover">
                        <Icon name="eye" size={12} color={t.primary} />
                        View Stats
                      </button>
                      {currentUser && u.id === currentUser.id ? (
                        <button disabled style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none',
                          background: `${t.textMuted}10`, color: t.textMuted, fontSize: 12,
                          fontWeight: 600, cursor: 'not-allowed', display: 'flex',
                          alignItems: 'center', gap: 4, opacity: 0.5
                        }}>
                          <Icon name="trash" size={12} color={t.textMuted} />
                          Delete (Self)
                        </button>
                      ) : (
                        <button onClick={() => handleDeleteUser(u.id)} style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none',
                          background: `${t.danger}15`, color: t.danger, fontSize: 12,
                          fontWeight: 600, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', gap: 4
                        }}>
                          <Icon name="trash" size={12} color={t.danger} />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: t.textMuted }}>No users found.</div>
          )}
        </div>
      )}

      {/* Courses */}
      {activeSection === 'courses' && (
        <div style={{
          background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}`,
          boxShadow: t.shadow, overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {['Title', 'Category', 'Level', 'Instructor', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '14px 20px', textAlign: 'left', fontSize: 13,
                      fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: t.text }}>
                      {c.title}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: t.textSecondary }}>
                      {c.category}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: t.primaryLight, color: t.primary, textTransform: 'capitalize',
                      }}>
                        {c.level}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: t.textSecondary }}>
                      {c.instructor}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button onClick={() => handleDeleteCourse(c.id)} style={{
                        padding: '6px 14px', borderRadius: 8, border: 'none',
                        background: `${t.danger}15`, color: t.danger, fontSize: 12,
                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <Icon name="trash" size={14} color={t.danger} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Course */}
      {activeSection === 'create' && (
        <div style={{
          background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}`,
          boxShadow: t.shadow, padding: 32,
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 24 }}>Create New Course</h3>
          <form onSubmit={handleCreateCourse}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[
                { label: 'Title', key: 'title', type: 'text', placeholder: 'Course title' },
                { label: 'Instructor', key: 'instructor', type: 'text', placeholder: 'Instructor name' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder} value={newCourse[f.key]}
                    onChange={e => setNewCourse({ ...newCourse, [f.key]: e.target.value })} required
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      border: `1px solid ${t.border}`, background: t.bgInput,
                      color: t.text, fontSize: 14, outline: 'none',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Category</label>
                <select value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: `1px solid ${t.border}`, background: t.bgInput,
                  color: t.text, fontSize: 14, outline: 'none',
                }}>
                  {['Programming', 'Data Science', 'AI/ML', 'Web Development', 'Mobile', 'Design', 'DevOps', 'Security', 'Business', 'Mathematics'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Level</label>
                <select value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })} style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: `1px solid ${t.border}`, background: t.bgInput,
                  color: t.text, fontSize: 14, outline: 'none',
                }}>
                  {['beginner', 'intermediate', 'advanced'].map(l => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Rating</label>
                <input
                  type="number" step="0.1" min="0" max="5" value={newCourse.rating}
                  onChange={e => setNewCourse({ ...newCourse, rating: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    border: `1px solid ${t.border}`, background: t.bgInput,
                    color: t.text, fontSize: 14, outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Initial Students</label>
                <input
                  type="number" min="0" value={newCourse.students_count}
                  onChange={e => setNewCourse({ ...newCourse, students_count: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    border: `1px solid ${t.border}`, background: t.bgInput,
                    color: t.text, fontSize: 14, outline: 'none',
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Description</label>
              <textarea
                placeholder="Course description..." value={newCourse.description}
                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} required
                style={{
                  width: '100%', minHeight: 100, padding: '12px 16px', borderRadius: 12,
                  border: `1px solid ${t.border}`, background: t.bgInput,
                  color: t.text, fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6,
                }}
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary, marginBottom: 6, display: 'block' }}>
                Lessons (one per line)
              </label>
              <textarea
                placeholder={'Introduction to the Course\nSetting Up Environment\nCore Concepts\n...'} value={newCourse.lessons}
                onChange={e => setNewCourse({ ...newCourse, lessons: e.target.value })}
                style={{
                  width: '100%', minHeight: 120, padding: '12px 16px', borderRadius: 12,
                  border: `1px solid ${t.border}`, background: t.bgInput,
                  color: t.text, fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6,
                }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: 24, padding: '14px 32px', borderRadius: 14, border: 'none',
              background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {loading ? (
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <><Icon name="plus" size={18} color="#fff" /> Create Course</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Enrollments */}
      {activeSection === 'enrollments' && (
        <div style={{
          background: t.bgCard, borderRadius: 18, border: `1px solid ${t.border}`,
          boxShadow: t.shadow, overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {['Student Name', 'Email', 'Course Title', 'Enrollment Date', 'Amount Paid', 'Progress'].map(h => (
                    <th key={h} style={{
                      padding: '14px 20px', textAlign: 'left', fontSize: 13,
                      fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allEnrollments.map(e => (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: t.text }}>
                      {e.user?.name || `User #${e.user_id}`}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: t.textSecondary }}>
                      {e.user?.email || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: t.text }}>
                      {e.course?.title || `Course #${e.course_id}`}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: t.textSecondary }}>
                      {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: e.amount_paid > 0 ? t.warning : t.success }}>
                      {e.amount_paid > 0 ? `$${e.amount_paid.toFixed(2)}` : 'Free'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 80, height: 6, borderRadius: 3, background: t.bgInput, overflow: 'hidden' }}>
                          <div style={{ width: `${e.progress || 0}%`, height: '100%', background: t.gradient }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.primary }}>{e.progress || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allEnrollments.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: t.textMuted }}>No enrollments found.</div>
          )}
        </div>
      )}

      {/* User Stats Modal */}
      {selectedUserStats && (() => {
        const userEnrollments = allEnrollments.filter(e => e.user_id === selectedUserStats.id);
        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, padding: 20
          }} onClick={() => setSelectedUserStats(null)}>
            <div style={{
              background: t.bgCard, border: `1px solid ${t.border}`,
              borderRadius: 24, width: '100%', maxWidth: 650,
              boxShadow: t.shadowLg, overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{
                padding: '24px 28px', borderBottom: `1px solid ${t.borderLight}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: `${t.primary}05`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: t.primaryLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon name="user" size={20} color={t.primary} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0 }}>
                      User Statistics
                    </h3>
                    <p style={{ fontSize: 13, color: t.textSecondary, margin: '2px 0 0' }}>
                      Detailed activity report
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedUserStats(null)} style={{
                  background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 10,
                  padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', transition: 'all 0.2s', color: t.textSecondary
                }} className="btn-hover">
                  <Icon name="x" size={16} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '28px', maxHeight: '70vh', overflowY: 'auto' }}>
                
                {/* User Info & Quick Stats Grid */}
                <div style={{
                  background: t.bgInput, borderRadius: 16, padding: 20, marginBottom: 24,
                  border: `1px solid ${t.borderLight}`
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Details</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: t.text, marginTop: 4 }}>{selectedUserStats.name}</div>
                    <div style={{ fontSize: 14, color: t.textSecondary, marginTop: 2 }}>{selectedUserStats.email}</div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: t.bgCard, padding: 16, borderRadius: 12, border: `1px solid ${t.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Icon name="clock" size={14} color={t.warning} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: t.textSecondary }}>Logins Made</span>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: t.text }}>
                        {selectedUserStats.login_count || 0}
                      </div>
                    </div>

                    <div style={{ background: t.bgCard, padding: 16, borderRadius: 12, border: `1px solid ${t.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Icon name="book" size={14} color={t.success} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: t.textSecondary }}>Enrollments</span>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: t.text }}>
                        {userEnrollments.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Enrollments Detail */}
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="layers" size={16} color={t.primary} />
                    Enrolled Courses List
                  </h4>

                  {userEnrollments.length === 0 ? (
                    <div style={{
                      padding: '30px 20px', textAlign: 'center', border: `1px dashed ${t.border}`,
                      borderRadius: 16, color: t.textMuted, fontSize: 14
                    }}>
                      This user has not enrolled in any courses yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {userEnrollments.map(e => (
                        <div key={e.id} style={{
                          padding: 16, borderRadius: 14, background: t.bgCard,
                          border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: 10
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>
                                {e.course?.title || `Course #${e.course_id}`}
                              </div>
                              <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>
                                Enrolled: {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                            <span style={{
                              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                              background: e.amount_paid > 0 ? `${t.warning}15` : `${t.success}15`,
                              color: e.amount_paid > 0 ? t.warning : t.success
                            }}>
                              {e.amount_paid > 0 ? `$${e.amount_paid.toFixed(2)}` : 'Free'}
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                            <span style={{ fontSize: 12, color: t.textSecondary, fontWeight: 500, width: 55 }}>Progress:</span>
                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: t.bgInput, overflow: 'hidden' }}>
                              <div style={{ width: `${e.progress || 0}%`, height: '100%', background: t.gradient }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: t.primary }}>{e.progress || 0}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ user, enrollments, progressMap, courses, onCourseClick, t, token, onRefreshUser, showToast, orders = [] }) {
  const enrolledCourses = enrollments.map(e => ({
    ...(e.course || {}),
    progress: progressMap[e.course?.id] ?? e.progress ?? 0,
  })).filter(c => c.id);

  const completedCount = enrolledCourses.filter(c => c.progress >= 100).length;
  const avgProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((a, c) => a + (c.progress || 0), 0) / enrolledCourses.length)
    : 0;

  const [profileTab, setProfileTab] = useState('courses');

  const statusColors = {
    delivered: { bg: `${t.success}15`, text: t.success },
    shipped: { bg: `${t.primary}15`, text: t.primary },
    processing: { bg: `${t.warning}15`, text: t.warning },
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      {/* Profile Header */}
      <div className="animate-in" style={{
        padding: 36, borderRadius: 24, background: t.bgCard,
        border: `1px solid ${t.border}`, boxShadow: t.shadow, marginBottom: 28,
        textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, background: t.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 32, fontWeight: 800, color: '#fff',
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: t.text, marginBottom: 6 }}>
          {user?.name || 'User'}
        </h2>
        <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 6 }}>{user?.email}</p>
        {user?.is_admin && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: `${t.primary}15`, color: t.primary,
          }}>
            <Icon name="shield" size={14} color={t.primary} /> Admin
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 36,
      }}>
        {[
          { label: 'Enrolled Courses', value: enrolledCourses.length, color: '#6366f1' },
          { label: 'Completed Courses', value: completedCount, color: '#10b981' },
          { label: 'Avg Progress', value: `${avgProgress}%`, color: '#8b5cf6' },
          { label: 'Bookstore Orders', value: orders.length, color: '#ec4899' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: 24, borderRadius: 16, background: t.bgCard,
            border: `1px solid ${t.border}`, boxShadow: t.shadow, textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: t.textSecondary, fontWeight: 500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: 'flex', gap: 12, borderBottom: `1px solid ${t.border}`, marginBottom: 24, paddingBottom: 2
      }}>
        {[
          { id: 'courses', label: 'My Enrolled Courses', icon: 'book' },
          { id: 'orders', label: 'Bookstore Orders History', icon: 'grid' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setProfileTab(tab.id)}
            style={{
              padding: '10px 18px', border: 'none', background: 'none', fontSize: 15,
              fontWeight: 700, color: profileTab === tab.id ? t.primary : t.textSecondary,
              borderBottom: profileTab === tab.id ? `3px solid ${t.primary}` : '3px solid transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
            }}
          >
            <Icon name={tab.icon} size={16} color={profileTab === tab.id ? t.primary : t.textMuted} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Render */}
      {profileTab === 'courses' ? (
        <>
          {enrolledCourses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enrolledCourses.map(c => (
                <div key={c.id} onClick={() => onCourseClick(c)} className="card-hover" style={{
                  padding: '18px 22px', borderRadius: 16, background: t.bgCard,
                  border: `1px solid ${t.border}`, boxShadow: t.shadow, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: t.primaryLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name="book" size={20} color={t.primary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 8 }}>{c.title}</h4>
                    <div style={{ height: 6, borderRadius: 3, background: t.bgInput }}>
                      <div style={{
                        height: '100%', borderRadius: 3, background: c.progress >= 100 ? t.success : t.gradient,
                        width: `${c.progress || 0}%`, transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: c.progress >= 100 ? t.success : t.primary,
                  }}>
                    {c.progress || 0}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: 40, textAlign: 'center', color: t.textMuted, background: t.bgCard,
              borderRadius: 16, border: `1px solid ${t.border}`,
            }}>
              <Icon name="book" size={40} color={t.textMuted} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>You haven't enrolled in any courses yet.</p>
            </div>
          )}
        </>
      ) : (
        /* Orders tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.length > 0 ? (
            orders.map(order => (
              <div
                key={order.id}
                style={{
                  background: t.bgCard, padding: 22, borderRadius: 18, border: `1px solid ${t.border}`,
                  boxShadow: t.shadow, display: 'flex', flexDirection: 'column', gap: 14
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 12, color: t.textMuted }}>Order ID: </span>
                    <strong style={{ fontSize: 13, color: t.text, fontFamily: 'monospace' }}>{order.id}</strong>
                    <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>
                      Placed on: {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>

                  <span style={{
                    padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: (statusColors[order.status.toLowerCase()] || statusColors.processing).bg,
                    color: (statusColors[order.status.toLowerCase()] || statusColors.processing).text,
                    textTransform: 'capitalize'
                  }}>
                    {order.status}
                  </span>
                </div>

                {/* Items details */}
                <div style={{ background: t.bgInput, borderRadius: 12, padding: 14, border: `1px solid ${t.borderLight}` }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: t.text, fontWeight: 500 }}>
                          {item.title} <span style={{ color: t.textMuted, fontSize: 11 }}>x{item.qty}</span>
                        </span>
                        <span style={{ color: t.textSecondary }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, borderTop: `1px solid ${t.borderLight}`, paddingTop: 10 }}>
                  <span style={{ color: t.textSecondary, fontSize: 12 }}>Recipient: <strong>{order.shipping.name}</strong></span>
                  <span style={{ color: t.text, fontSize: 15, fontWeight: 800 }}>
                    Total: ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: 40, textAlign: 'center', color: t.textMuted, background: t.bgCard,
              borderRadius: 16, border: `1px solid ${t.border}`,
            }}>
              <Icon name="grid" size={40} color={t.textMuted} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>You haven't placed any bookstore orders yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const [token, setToken] = useState(() => localStorage.getItem('eduai_token') || '');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(!!localStorage.getItem('eduai_token'));
  const [page, setPage] = useState('landing');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [theme, setTheme] = useState(() => localStorage.getItem('eduai_theme') || 'light');
  const [toast, setToast] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bookstore, Cart, and Personalization States
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [interest, setInterest] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutInvoice, setCheckoutInvoice] = useState(null);

  // Sync user data on login/logout
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`eduai_cart_${user.email}`);
      setCart(savedCart ? JSON.parse(savedCart) : {});

      const savedOrders = localStorage.getItem(`eduai_orders_${user.email}`);
      setOrders(savedOrders ? JSON.parse(savedOrders) : []);

      const savedInterest = localStorage.getItem(`eduai_interest_${user.email}`);
      setInterest(savedInterest ? JSON.parse(savedInterest) : null);
    } else {
      setCart({});
      setOrders([]);
      setInterest(null);
    }
  }, [user]);

  const handleAddToCart = (bookId) => {
    setCart(prev => {
      const updated = { ...prev, [bookId]: (prev[bookId] || 0) + 1 };
      if (user) localStorage.setItem(`eduai_cart_${user.email}`, JSON.stringify(updated));
      return updated;
    });
    showToast("Book added to cart!", "success");
  };

  const handleUpdateCartQty = (bookId, qty) => {
    setCart(prev => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[bookId];
      } else {
        updated[bookId] = qty;
      }
      if (user) localStorage.setItem(`eduai_cart_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleConfirmOrder = (shippingDetails) => {
    if (!checkoutInvoice) return;
    const newOrder = {
      id: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      items: checkoutInvoice.cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty
      })),
      total: checkoutInvoice.total,
      shipping: shippingDetails,
      status: 'Processing'
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      if (user) localStorage.setItem(`eduai_orders_${user.email}`, JSON.stringify(updated));
      return updated;
    });

    setCart({});
    if (user) localStorage.removeItem(`eduai_cart_${user.email}`);

    setCheckoutInvoice(null);
    setCartOpen(false);
    showToast("Order placed successfully!", "success");
    navigateTo("profile");
  };

  const handleSaveInterest = (preference) => {
    setInterest(preference);
    if (user) localStorage.setItem(`eduai_interest_${user.email}`, JSON.stringify(preference));
    showToast("Learning preferences updated!", "success");
  };

  const t = themes[theme];

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('eduai_theme', next);
      return next;
    });
  }, []);

  // Fetch user
  const fetchUser = useCallback(async () => {
    if (!token) {
      setUserLoading(false);
      return;
    }
    setUserLoading(true);
    try {
      const u = await api.get('/profile', token);
      setUser(u);
      setPage(prev => (prev === 'landing' || prev === 'auth') ? 'dashboard' : prev);
    } catch {
      setToken('');
      localStorage.removeItem('eduai_token');
    } finally {
      setUserLoading(false);
    }
  }, [token]);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      const c = await api.get('/courses');
      setCourses(c || []);
    } catch {
      // silently handle
    }
  }, []);

  // Fetch enrollments
  const fetchEnrollments = useCallback(async () => {
    if (!token) return;
    try {
      const e = await api.get('/my-courses', token);
      setEnrollments(e || []);
      const pMap = {};
      (e || []).forEach(en => {
        if (en.course?.id) pMap[en.course.id] = en.progress ?? 0;
      });
      setProgressMap(pMap);
    } catch {
      // silently handle
    }
  }, [token]);

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const enrolledIds = new Set(enrollments.map(e => e.course?.id).filter(Boolean));

  const handleAuth = (newToken) => {
    setToken(newToken);
    localStorage.setItem('eduai_token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setEnrollments([]);
    setProgressMap({});
    localStorage.removeItem('eduai_token');
    setPage('landing');
    showToast('Logged out successfully', 'info');
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleProgressUpdate = (courseId, newProgress) => {
    setProgressMap(prev => ({ ...prev, [courseId]: newProgress }));
  };

  const handleEnrollSuccess = () => {
    fetchEnrollments();
  };

  const navigateTo = (p) => {
    setPage(p);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (userLoading) {
    return (
      <div style={{
        background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: t.text, gap: 16
      }}>
        <div style={{
          width: 48, height: 48, border: `4px solid ${t.primary}22`,
          borderTopColor: t.primary, borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: t.textSecondary }}>Loading your workspace...</p>
      </div>
    );
  }

  // If not logged in, show landing, bookstore, contact, or auth
  if (!token || !user) {
    return (
      <div style={{ background: t.bg, minHeight: '100vh', color: t.text }}>
        {toast && <Toast toast={toast} onDismiss={() => setToast(null)} t={t} />}
        {/* Minimal Navbar with Public Tabs */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: t.bgNav, backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${t.border}`, padding: '0 24px',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div onClick={() => navigateTo('landing')} style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: t.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="brain" size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: t.text }}>EduAI</span>
            </div>

            {/* Public links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
              <button onClick={() => navigateTo('landing')} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: page === 'landing' ? t.primaryLight : 'transparent',
                color: page === 'landing' ? t.primary : t.textSecondary,
              }}>
                Home
              </button>
              <button onClick={() => navigateTo('bookstore')} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: page === 'bookstore' ? t.primaryLight : 'transparent',
                color: page === 'bookstore' ? t.primary : t.textSecondary,
              }}>
                Bookstore
              </button>
              <button onClick={() => navigateTo('contact')} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: page === 'contact' ? t.primaryLight : 'transparent',
                color: page === 'contact' ? t.primary : t.textSecondary,
              }}>
                Contact Us
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={toggleTheme} style={{
                background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 10,
                padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}>
                <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} color={t.textSecondary} />
              </button>
              <button onClick={() => navigateTo('auth')} style={{
                padding: '10px 22px', borderRadius: 10, border: 'none',
                background: t.gradient, color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
              }} className="desktop-nav">
                Sign In
              </button>
              {/* Mobile menu button for logged out users */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
                padding: 8, borderRadius: 10, border: `1px solid ${t.border}`,
                background: t.bgInput, cursor: 'pointer',
              }} className="mobile-menu-btn">
                <Icon name="menu" size={20} color={t.textSecondary} />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu for logged out users */}
          {mobileMenuOpen && (
            <div style={{
              padding: '12px 24px 16px', borderTop: `1px solid ${t.borderLight}`,
              display: 'flex', flexDirection: 'column', gap: 4,
            }} className="mobile-menu animate-in">
              <button onClick={() => navigateTo('landing')} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: page === 'landing' ? t.primaryLight : 'transparent',
                color: page === 'landing' ? t.primary : t.textSecondary,
                width: '100%', textAlign: 'left',
              }}>
                <Icon name="home" size={18} color={page === 'landing' ? t.primary : t.textMuted} />
                Home
              </button>
              <button onClick={() => navigateTo('bookstore')} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: page === 'bookstore' ? t.primaryLight : 'transparent',
                color: page === 'bookstore' ? t.primary : t.textMuted,
                width: '100%', textAlign: 'left',
              }}>
                <Icon name="grid" size={18} color={page === 'bookstore' ? t.primary : t.textMuted} />
                Bookstore
              </button>
              <button onClick={() => navigateTo('contact')} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: page === 'contact' ? t.primaryLight : 'transparent',
                color: page === 'contact' ? t.primary : t.textSecondary,
                width: '100%', textAlign: 'left',
              }}>
                <Icon name="mail" size={18} color={page === 'contact' ? t.primary : t.textMuted} />
                Contact Us
              </button>
              <button onClick={() => navigateTo('auth')} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: page === 'auth' ? t.primaryLight : 'transparent',
                color: page === 'auth' ? t.primary : t.textMuted,
                width: '100%', textAlign: 'left',
              }}>
                <Icon name="user" size={18} color={page === 'auth' ? t.primary : t.textMuted} />
                Sign In
              </button>
            </div>
          )}
        </nav>
        <div style={{ paddingTop: 64 }}>
          {page === 'auth' && (
            <AuthPage onAuth={handleAuth} showToast={showToast} t={t} />
          )}
          {(page === 'landing' || page === 'dashboard') && (
            <>
              <LandingPage onNavigate={navigateTo} t={t} />
              <Footer t={t} onNavigate={navigateTo} />
            </>
          )}
          {page === 'bookstore' && (
            <>
              <BookstorePage
                cart={cart}
                onAddToCart={(bookId) => {
                  showToast("Please sign in to add books to your cart!", "info");
                  navigateTo("auth");
                }}
                onToggleCart={() => {
                  showToast("Please sign in to view your cart!", "info");
                  navigateTo("auth");
                }}
                t={t}
              />
              <Footer t={t} onNavigate={navigateTo} />
            </>
          )}
          {page === 'contact' && (
            <>
              <ContactPage t={t} showToast={showToast} />
              <Footer t={t} onNavigate={navigateTo} />
            </>
          )}
        </div>
      </div>
    );
  }

  // Logged in layout
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'courses', label: 'Courses', icon: 'book' },
    { id: 'bookstore', label: 'Bookstore', icon: 'grid' },
    { id: 'ai', label: 'AI Tools', icon: 'brain' },
    { id: 'contact', label: 'Contact Us', icon: 'mail' },
    ...(user?.is_admin ? [{ id: 'admin', label: 'Admin', icon: 'shield' }] : []),
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  return (
    <div style={{ background: t.bg, minHeight: '100vh', color: t.text }}>
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} t={t} />}
      
      {/* Bookstore Cart Drawer Overlay */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onCheckout={(inv) => { setCheckoutInvoice(inv); setCartOpen(false); }}
        t={t}
      />

      {/* Bookstore Checkout Billing Form Modal */}
      <CheckoutModal
        isOpen={!!checkoutInvoice}
        onClose={() => setCheckoutInvoice(null)}
        invoice={checkoutInvoice}
        onConfirmOrder={handleConfirmOrder}
        t={t}
      />

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          enrolled={enrolledIds.has(selectedCourse.id)}
          progress={progressMap[selectedCourse.id]}
          token={token}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnrollSuccess}
          onProgress={handleProgressUpdate}
          showToast={showToast}
          t={t}
        />
      )}

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: t.bgNav, backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.border}`, padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => navigateTo('dashboard')}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: t.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="brain" size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: t.text }}>EduAI</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            className="desktop-nav">
            {navItems.map(item => (
              <button key={item.id} onClick={() => navigateTo(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: page === item.id ? t.primaryLight : 'transparent',
                color: page === item.id ? t.primary : t.textSecondary,
              }}>
                <Icon name={item.icon} size={18} color={page === item.id ? t.primary : t.textMuted} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={toggleTheme} style={{
              background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 10,
              padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} color={t.textSecondary} />
            </button>
            
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 10, border: `1px solid ${t.border}`,
              background: t.bgCard, color: t.textSecondary,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }} className="desktop-nav">
              <Icon name="logout" size={16} color={t.textSecondary} />
              Logout
            </button>
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
              padding: 8, borderRadius: 10, border: `1px solid ${t.border}`,
              background: t.bgInput, cursor: 'pointer',
            }} className="mobile-menu-btn">
              <Icon name="menu" size={20} color={t.textSecondary} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            padding: '12px 24px 16px', borderTop: `1px solid ${t.borderLight}`,
            display: 'flex', flexDirection: 'column', gap: 4,
          }} className="mobile-menu animate-in">
            {navItems.map(item => (
              <button key={item.id} onClick={() => navigateTo(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: page === item.id ? t.primaryLight : 'transparent',
                color: page === item.id ? t.primary : t.textSecondary,
                width: '100%', textAlign: 'left',
              }}>
                <Icon name={item.icon} size={18} color={page === item.id ? t.primary : t.textMuted} />
                {item.label}
              </button>
            ))}
            {/* Logout inside Mobile Menu */}
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              background: 'transparent', color: t.danger,
              width: '100%', textAlign: 'left',
            }}>
              <Icon name="logout" size={18} color={t.danger} />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <div style={{ paddingTop: 64, minHeight: 'calc(100vh - 64px - 340px)' }}>
        {page === 'dashboard' && (
          <Dashboard
            user={user} courses={courses} enrollments={enrollments}
            progressMap={progressMap} onCourseClick={handleCourseClick} t={t}
            interest={interest} onSaveInterest={handleSaveInterest}
          />
        )}
        {page === 'courses' && (
          <CoursesPage
            courses={courses} enrolledIds={enrolledIds}
            progressMap={progressMap} onCourseClick={handleCourseClick} t={t}
          />
        )}
        {page === 'bookstore' && (
          <BookstorePage
            cart={cart} onAddToCart={handleAddToCart}
            onToggleCart={() => setCartOpen(true)} t={t}
          />
        )}
        {page === 'ai' && (
          <AIPage token={token} showToast={showToast} t={t} />
        )}
        {page === 'contact' && (
          <ContactPage t={t} showToast={showToast} />
        )}
        {page === 'admin' && user?.is_admin && (
          <AdminPage
            token={token} courses={courses} showToast={showToast}
            onRefresh={() => { fetchCourses(); fetchEnrollments(); }} t={t}
            currentUser={user}
          />
        )}
        {page === 'profile' && (
          <ProfilePage
            user={user} enrollments={enrollments} progressMap={progressMap}
            courses={courses} onCourseClick={handleCourseClick} t={t}
            token={token} onRefreshUser={fetchUser} showToast={showToast}
            orders={orders}
          />
        )}
      </div>
      
      {/* Official Corporate Footer */}
      <Footer t={t} onNavigate={navigateTo} />
    </div>
  );
}

export default App;
