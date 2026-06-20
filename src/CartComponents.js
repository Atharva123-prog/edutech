import React, { useState } from 'react';
import { BOOKS } from './InterestForm';

const cartIcons = {
  x: (
    <path d="M18 6L6 18 M6 6l12 12" />
  ),
  plus: (
    <path d="M12 5v14M5 12h14" />
  ),
  minus: (
    <path d="M5 12h14" />
  ),
  trash: (
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  ),
  shoppingBag: (
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" />
  ),
  checkCircle: (
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3" />
  ),
  creditCard: (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>
  )
};

function CartIcon({ name, size = 18, color = 'currentColor', style = {} }) {
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
      {cartIcons[name] || null}
    </svg>
  );
}

export function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onCheckout, t }) {
  if (!isOpen) return null;

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const book = BOOKS.find(b => b.id === parseInt(id));
      return book ? { ...book, qty } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  
  // Custom pricing rules: 10% discount if ordering 3 or more books
  const discountRate = itemsCount >= 3 ? 0.10 : 0.0;
  const discount = subtotal * discountRate;
  
  const tax = (subtotal - discount) * 0.05; // 5% tax
  const shipping = subtotal > 50 || subtotal === 0 ? 0.00 : 5.00; // Free over $50
  const total = subtotal - discount + tax + shipping;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      
      <div
        className="cart-drawer"
        style={{
          width: '100%', maxWidth: 440, background: t.bgCard, borderLeft: `1px solid ${t.border}`,
          boxShadow: t.shadowLg, display: 'flex', flexDirection: 'column', height: '100%',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px', borderBottom: `1px solid ${t.border}`, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CartIcon name="shoppingBag" size={20} color={t.primary} />
            Your Cart ({itemsCount})
          </h3>
          <button
            onClick={onClose}
            className="btn-hover"
            style={{
              background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 10,
              padding: 8, cursor: 'pointer', display: 'flex', color: t.textSecondary
            }}
          >
            <CartIcon name="x" size={16} />
          </button>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', color: t.textMuted }}>
              <CartIcon name="shoppingBag" size={48} color={t.textMuted} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Your cart is empty.</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Add reference books from our Bookstore page.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex', gap: 14, padding: 14, borderRadius: 14,
                  background: t.bgInput, border: `1px solid ${t.borderLight}`
                }}
              >
                {/* Micro cover swatch */}
                <div style={{
                  width: 50, height: 70, borderRadius: 6, background: item.imageColor,
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 8, padding: 4, fontWeight: 800, textAlign: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                  {item.title.substring(0, 12)}...
                </div>

                {/* Info & Quantity controls */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: 11, color: t.textMuted, margin: '2px 0 0' }}>By {item.author}</p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: t.bgCard, borderRadius: 8, border: `1px solid ${t.border}`, padding: 2 }}>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: t.textSecondary }}
                      >
                        <CartIcon name={item.qty > 1 ? 'minus' : 'trash'} size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: 12, fontWeight: 700, color: t.text }}>{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: t.textSecondary }}
                      >
                        <CartIcon name="plus" size={12} />
                      </button>
                    </div>
                    
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '24px 28px', borderTop: `1px solid ${t.border}`, background: t.bgNav,
            display: 'flex', flexDirection: 'column', gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: t.textSecondary }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {itemsCount >= 3 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: t.success, fontWeight: 600 }}>
                <span>Quantity Discount (10%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: t.textSecondary }}>
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: t.textSecondary }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900,
              color: t.text, borderTop: `1px solid ${t.borderLight}`, paddingTop: 10, marginTop: 4
            }}>
              <span>Total Price</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => onCheckout({ subtotal, discount, tax, shipping, total, cartItems })}
              className="btn-premium"
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: t.gradient, color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginTop: 10, boxShadow: '0 4px 15px rgba(99,102,241,0.25)'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CheckoutModal({ isOpen, onClose, invoice, onConfirmOrder, t }) {
  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '', card: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirmOrder(form);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)'
    }} onClick={onClose}>
      
      <div
        className="glass-card animate-scale-in"
        style={{
          width: '100%', maxWidth: 540, borderRadius: 24, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', border: `1px solid ${t.border}`
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', background: `${t.primary}05`
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: t.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CartIcon name="creditCard" size={18} color={t.primary} />
            Complete Checkout — Pay ${invoice.total.toFixed(2)}
          </h3>
          <button
            onClick={onClose}
            className="btn-hover"
            style={{
              background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 10,
              padding: 6, cursor: 'pointer', display: 'flex', color: t.textSecondary
            }}
          >
            <CartIcon name="x" size={14} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', maxHeight: '75vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Order Summary Swatch */}
          <div style={{ background: t.bgInput, padding: 14, borderRadius: 12, fontSize: 13, border: `1px solid ${t.borderLight}` }}>
            <div style={{ fontWeight: 700, color: t.text, marginBottom: 6 }}>Books Ordered ({invoice.cartItems.length}):</div>
            <div style={{ color: t.textSecondary, lineHeight: 1.5 }}>
              {invoice.cartItems.map(item => `${item.title} (x${item.qty})`).join(', ')}
            </div>
          </div>

          <h4 style={{ fontSize: 14, fontWeight: 800, color: t.text, margin: '6px 0 0' }}>Delivery Information</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary, marginBottom: 4, display: 'block' }}>Full Name</label>
              <input
                type="text" placeholder="John Doe" value={form.name} required
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="premium-input"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary, marginBottom: 4, display: 'block' }}>Shipping Address</label>
              <input
                type="text" placeholder="123 Main St, Apt 4B" value={form.address} required
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="premium-input"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary, marginBottom: 4, display: 'block' }}>City</label>
              <input
                type="text" placeholder="San Francisco" value={form.city} required
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="premium-input"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary, marginBottom: 4, display: 'block' }}>Zip Code</label>
              <input
                type="text" placeholder="94103" value={form.zip} required
                onChange={e => setForm({ ...form, zip: e.target.value })}
                className="premium-input"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: 'none' }}
              />
            </div>
          </div>

          <h4 style={{ fontSize: 14, fontWeight: 800, color: t.text, margin: '6px 0 0' }}>Payment Information</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ gridColumn: 'span 3' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary, marginBottom: 4, display: 'block' }}>Credit Card Number</label>
              <input
                type="text" placeholder="4111 2222 3333 4444" value={form.card} required
                onChange={e => setForm({ ...form, card: e.target.value })}
                className="premium-input"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary, marginBottom: 4, display: 'block' }}>Expiry Date</label>
              <input
                type="text" placeholder="MM/YY" value={form.expiry} required
                onChange={e => setForm({ ...form, expiry: e.target.value })}
                className="premium-input"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary, marginBottom: 4, display: 'block' }}>CVV</label>
              <input
                type="text" placeholder="123" value={form.cvv} required
                onChange={e => setForm({ ...form, cvv: e.target.value })}
                className="premium-input"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgInput, color: t.text, fontSize: 13, outline: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium"
            style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: t.gradient, color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginTop: 12, boxShadow: '0 4px 15px rgba(99,102,241,0.25)'
            }}
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            ) : (
              <>
                <CartIcon name="checkCircle" size={16} color="#fff" />
                Place Order — pay ${invoice.total.toFixed(2)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
