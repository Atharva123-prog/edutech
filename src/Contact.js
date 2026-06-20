import React, { useState } from 'react';

const contactIcons = {
  mail: (
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  ),
  mapPin: (
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z" />
  ),
  chevronDown: (
    <path d="M19 9l-7 7-7-7" />
  ),
  check: (
    <path d="M20 6L9 17l-5-5" />
  )
};

function ContactIcon({ name, size = 18, color = 'currentColor', style = {} }) {
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
      {contactIcons[name] || null}
    </svg>
  );
}

export default function ContactPage({ t, showToast }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', interest: 'General Support' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call to submit contact form
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast("Thank you for reaching out! We will reply within 24 hours.", "success");
      setForm({ name: '', email: '', subject: '', message: '', interest: 'General Support' });
    }, 1200);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the AI Tutor system work?",
      a: "Our AI Tutor utilizes advanced large language model capabilities, loaded with course-specific context. When you ask a question in the AI Tutor tab, it reviews the lessons in your active courses to provide personalized, step-by-step guidance rather than just giving a copy-pasted answer."
    },
    {
      q: "Can I access both online courses and physical textbooks?",
      a: "Yes! EduAI is a unified platform. You can enroll in expert-crafted video courses under the 'Courses' tab, and order supplementary physical textbooks and references from our 'Bookstore'. Bookstore orders are shipped directly to your shipping address."
    },
    {
      q: "What happens after I place an order in the bookstore?",
      a: "As soon as you place an order, it is registered under your Account Profile. You can track its status ('Processing', 'Shipped', 'Delivered') in your Order History tab. We dispatch books within 24 hours via premium mail services."
    },
    {
      q: "Do you offer certificates for completed courses?",
      a: "Absolutely! Once you complete 100% of the lessons in a course and mark them complete, a digital certificate of completion is generated. This can be viewed and printed directly from your Profile Page under completed courses."
    },
    {
      q: "Is there a student discount for textbook purchases?",
      a: "Yes! When placing an order, standard student discount rates (up to 15%) are automatically applied during checkout depending on the number of books in your cart. We also offer free shipping on orders over $50."
    },
    {
      q: "How can I request additional support or custom group licenses?",
      a: "For institutional access, school partnerships, or enterprise team licenses, please use the Contact Us form on this page and select 'Enterprise Partnerships'. Our sales team will get back to you with a custom quote."
    }
  ];

  return (
    <div className="animate-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', position: 'relative' }}>
      {/* Glow Blobs for premium ambiance */}
      <div className="glow-blob glow-blob-primary" style={{ width: 400, height: 400, top: -100, left: -200 }} />
      <div className="glow-blob glow-blob-secondary" style={{ width: 350, height: 350, bottom: 100, right: -150 }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 50, position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: t.text, marginBottom: 12 }}>
          Get in Touch & <span style={{ backgroundImage: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Support</span>
        </h1>
        <p style={{ fontSize: 16, color: t.textSecondary, maxWidth: 600, margin: '0 auto' }}>
          Have questions about the platform, bookstore orders, or custom institutional access? Send us a message or browse our FAQ below.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start', position: 'relative', zIndex: 1 }}>
        
        {/* Contact Form Section */}
        <div className="glass-card" style={{ padding: 32, borderRadius: 24, boxShadow: t.shadowLg }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }} className="animate-scale-in">
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: `${t.success}15`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
              }}>
                <ContactIcon name="check" size={32} color={t.success} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 8 }}>Message Sent Successfully!</h3>
              <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
                We've received your query and our team will get back to you shortly. A confirmation email has been dispatched to your inbox.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-premium"
                style={{
                  padding: '12px 28px', borderRadius: 12, border: 'none',
                  background: t.gradient, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer'
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 6 }}>Send a Message</h2>
              
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                  className="premium-input"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 14, outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                  className="premium-input"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 14, outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary, marginBottom: 6, display: 'block' }}>What can we help you with?</label>
                <select
                  value={form.interest}
                  onChange={e => setForm({...form, interest: e.target.value})}
                  className="premium-input"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 14, outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="General Support">General Support</option>
                  <option value="Bookstore Orders">Bookstore & Order Fulfillment</option>
                  <option value="Course Curriculum">Course Queries & Certificates</option>
                  <option value="AI Integration">AI Assistant Tools Feedback</option>
                  <option value="Enterprise Partnerships">Enterprise Partnerships</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Subject</label>
                <input
                  type="text"
                  placeholder="Subject line"
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  required
                  className="premium-input"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 14, outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary, marginBottom: 6, display: 'block' }}>Message</label>
                <textarea
                  placeholder="Write your detailed message here..."
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  required
                  rows="4"
                  className="premium-input"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 14, outline: 'none', resize: 'vertical',
                    lineHeight: 1.6
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-premium"
                style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                  background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 4px 15px rgba(99,102,241,0.25)'
                }}
              >
                {loading ? (
                  <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  "Submit Message"
                )}
              </button>
            </form>
          )}

          {/* Quick info row */}
          <div style={{
            marginTop: 30, paddingTop: 24, borderTop: `1px solid ${t.borderLight}`,
            display: 'flex', flexDirection: 'column', gap: 14
          }}>
            {[
              { icon: 'mail', text: 'support@eduai.org' },
              { icon: 'phone', text: 'Toll-Free Support: +1 (800) 555-EDUAI' },
              { icon: 'mapPin', text: '500 Innovation Way, Suite 400, SF, CA' }
            ].map((info, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: t.textSecondary }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: t.bgInput,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ContactIcon name={info.icon} size={15} color={t.primary} />
                </div>
                {info.text}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 8, height: 20, background: t.gradient, borderRadius: 2
            }} />
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    borderRadius: 16, overflow: 'hidden', border: `1px solid ${isOpen ? t.primary + '30' : t.border}`
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="faq-question"
                    style={{ background: isOpen ? `${t.primary}05` : 'transparent' }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: t.text, paddingRight: 15 }}>
                      {faq.q}
                    </span>
                    <ContactIcon
                      name="chevronDown"
                      size={18}
                      color={isOpen ? t.primary : t.textMuted}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </button>
                  <div className={`faq-answer-container ${isOpen ? 'open' : ''}`}>
                    <p style={{
                      padding: '0 24px 20px', fontSize: 14, color: t.textSecondary,
                      lineHeight: 1.7, borderTop: `1px solid ${t.borderLight}`, paddingTop: 12
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
