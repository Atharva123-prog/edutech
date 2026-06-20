import React, { useState } from 'react';
import { BOOKS } from './InterestForm';

const storeIcons = {
  search: (
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  ),
  star: (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  ),
  shoppingCart: (
    <path d="M9 22a1 1 0 100-2 1 1 0 000 2zM20 22a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  ),
  filter: (
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  ),
  plus: (
    <path d="M12 5v14M5 12h14" />
  ),
  check: (
    <path d="M20 6L9 17l-5-5" />
  )
};

function StoreIcon({ name, size = 18, color = 'currentColor', style = {} }) {
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
      {storeIcons[name] || null}
    </svg>
  );
}

export default function BookstorePage({ cart, onAddToCart, onToggleCart, t }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(70);

  const categories = ['All', 'Programming', 'Web Dev', 'AI & ML', 'Computer Science', 'Database', 'DevOps', 'Design', 'Mathematics'];

  const filteredBooks = BOOKS.filter(book => {
    const matchSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                        book.author.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || book.category === category;
    const matchPrice = book.price <= maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="animate-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', position: 'relative' }}>
      
      {/* Floating Blobs */}
      <div className="glow-blob glow-blob-secondary" style={{ width: 450, height: 450, top: -50, right: -150 }} />
      <div className="glow-blob glow-blob-accent" style={{ width: 350, height: 350, bottom: 50, left: -100 }} />

      {/* Header Row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 20, marginBottom: 36, position: 'relative', zIndex: 2
      }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: t.text, margin: 0 }}>
            Reference <span style={{ backgroundImage: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bookstore</span>
          </h1>
          <p style={{ fontSize: 15, color: t.textSecondary, marginTop: 6 }}>
            Expand your learning with our handpicked syllabus-aligned textbooks and academic guides.
          </p>
        </div>

        {/* Cart Trigger */}
        <button
          onClick={onToggleCart}
          className="btn-premium"
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px',
            borderRadius: 14, border: 'none', background: t.gradient, color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
          }}
        >
          <StoreIcon name="shoppingCart" size={18} color="#fff" />
          View Cart
          {cartItemCount > 0 && (
            <span style={{
              background: '#fff', color: t.primary, borderRadius: '50%',
              width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, marginLeft: 4, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      <div className="glass-card" style={{
        padding: '24px 28px', borderRadius: 20, marginBottom: 36,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24,
        position: 'relative', zIndex: 2
      }}>
        {/* Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary }}>Search Books</label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, background: t.bgInput,
            borderRadius: 12, padding: '0 14px', border: `1px solid ${t.border}`
          }}>
            <StoreIcon name="search" size={16} color={t.textMuted} />
            <input
              type="text"
              placeholder="Title or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="premium-input"
              style={{
                flex: 1, padding: '12px 0', border: 'none', background: 'transparent',
                fontSize: 14, color: t.text, outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Category select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary }}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="premium-input"
            style={{
              padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
              background: t.bgInput, color: t.text, fontSize: 14, outline: 'none', cursor: 'pointer'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price filter slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary }}>Max Price</label>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.primary }}>${maxPrice.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="10"
            max="70"
            step="1"
            value={maxPrice}
            onChange={e => setMaxPrice(parseFloat(e.target.value))}
            className="price-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted }}>
            <span>$10.00</span>
            <span>$70.00</span>
          </div>
        </div>
      </div>

      {/* Bookstore grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 24,
        position: 'relative',
        zIndex: 2
      }}>
        {filteredBooks.map(book => {
          const cartQty = cart[book.id] || 0;
          return (
            <div
              key={book.id}
              className="glass-card card-hover"
              style={{
                borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden'
              }}
            >
              {/* Cover layout */}
              <div
                className="book-cover-gradient"
                style={{
                  height: 180, background: book.imageColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center',
                  color: '#fff'
                }}
              >
                <div style={{ position: 'relative', zIndex: 3 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', opacity: 0.75, letterSpacing: '0.05em' }}>
                    {book.category}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, marginTop: 8, textShadow: '0 2px 4px rgba(0,0,0,0.4)', lineHeight: 1.3 }}>
                    {book.title}
                  </h3>
                  <div style={{ fontSize: 11, fontStyle: 'italic', marginTop: 6, opacity: 0.9 }}>
                    {book.author}
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, background: t.primaryLight, color: t.primary, padding: '4px 10px', borderRadius: 20 }}>
                    {book.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: 12, fontWeight: 700 }}>
                    <StoreIcon name="star" size={13} color="#f59e0b" />
                    {book.rating}
                  </div>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.text, margin: '2px 0 0', lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {book.title}
                </h3>
                
                <p style={{ fontSize: 12, color: t.textMuted, margin: 0, fontStyle: 'italic' }}>
                  By {book.author}
                </p>

                <p style={{
                  fontSize: 13, color: t.textSecondary, lineHeight: 1.5, margin: 0, flex: 1,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {book.desc}
                </p>

                {/* Add to Cart Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: t.text }}>
                    ${book.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => onAddToCart(book.id)}
                    className="btn-premium"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                      borderRadius: 10, border: 'none', background: cartQty > 0 ? t.success : t.primaryLight,
                      color: cartQty > 0 ? '#fff' : t.primary, fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {cartQty > 0 ? (
                      <>
                        <StoreIcon name="check" size={14} color="#fff" />
                        In Cart ({cartQty})
                      </>
                    ) : (
                      <>
                        <StoreIcon name="plus" size={14} color={t.primary} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No results message */}
      {filteredBooks.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: t.textMuted, position: 'relative', zIndex: 2 }}>
          <StoreIcon name="filter" size={48} color={t.textMuted} style={{ marginBottom: 16, opacity: 0.4 }} />
          <p style={{ fontSize: 15 }}>No reference books match your search or price criteria. Try relaxing the filter fields.</p>
        </div>
      )}

    </div>
  );
}
