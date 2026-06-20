import React, { useState } from 'react';

const formIcons = {
  check: (
    <path d="M20 6L9 17l-5-5" />
  ),
  sparkles: (
    <path d="M12 3l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" />
  ),
  bookOpen: (
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zm20 0h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="7" fill="none" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </>
  ),
  refresh: (
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" />
  )
};

function FormIcon({ name, size = 18, color = 'currentColor', style = {} }) {
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
      {formIcons[name] || null}
    </svg>
  );
}
const BOOKS = [
  { id: 1, title: 'Eloquent JavaScript, 3rd Edition', author: 'Marijn Haverbeke', price: 29.99, rating: 4.8, category: 'Web Dev', imageColor: 'linear-gradient(135deg, #f59e0b, #d97706)', desc: 'A deep dive into the JavaScript language. Explains basic logic, control flow, functions, OOP, and asynchronous programming in modern JS.' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', price: 34.50, rating: 4.9, category: 'Programming', imageColor: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', desc: 'A handbook of agile software craftsmanship. Learn to distinguish good code from bad, write clean code, and refactor code step-by-step.' },
  { id: 3, title: 'Python Crash Course', author: 'Eric Matthes', price: 24.99, rating: 4.7, category: 'Programming', imageColor: 'linear-gradient(135deg, #10b981, #047857)', desc: 'A fast-paced, thorough introduction to programming with Python. Hands-on projects covering web app development and data analysis.' },
  { id: 4, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', price: 68.00, rating: 4.9, category: 'Computer Science', imageColor: 'linear-gradient(135deg, #6b7280, #374151)', desc: 'The definitive guide to algorithms and data structures. Comprehensive coverage from foundations to advanced techniques.' },
  { id: 5, title: 'Hands-On Machine Learning', author: 'Aurélien Géron', price: 44.99, rating: 4.8, category: 'AI & ML', imageColor: 'linear-gradient(135deg, #8b5cf6, #5b21b6)', desc: 'Explore the ML landscape using Scikit-Learn, Keras, and TensorFlow. Perfect for engineers aiming to master neural networks.' },
  { id: 6, title: 'Design Patterns', author: 'Erich Gamma', price: 39.99, rating: 4.8, category: 'Computer Science', imageColor: 'linear-gradient(135deg, #6366f1, #4338ca)', desc: 'The classic Gang of Four book. Detailed catalog of 23 design patterns to solve common object-oriented software design problems.' },
  { id: 7, title: 'SQL Practice & Database Design', author: 'Mark Thompson', price: 19.99, rating: 4.6, category: 'Database', imageColor: 'linear-gradient(135deg, #ec4899, #be185d)', desc: 'A practical approach to relational database design and master complex queries, subqueries, joins, and optimization.' },
  { id: 8, title: 'The Pragmatic Programmer', author: 'David Thomas', price: 32.00, rating: 4.9, category: 'Programming', imageColor: 'linear-gradient(135deg, #14b8a6, #0f766e)', desc: 'Timeless advice to cultivate professional growth, write maintainable code, test robustly, and master development workflows.' },
  { id: 9, title: 'React Key Concepts', author: 'Maximilian Schwarz', price: 27.99, rating: 4.7, category: 'Web Dev', imageColor: 'linear-gradient(135deg, #06b6d4, #0891b2)', desc: 'A visual guide to understanding React component state, props, rendering cycles, hooks, and routing optimizations.' },
  { id: 10, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', price: 42.50, rating: 4.9, category: 'Computer Science', imageColor: 'linear-gradient(135deg, #f43f5e, #be123c)', desc: 'Deep dive into data systems: replication, partitioning, transactions, consensus, batch/stream processing, and scaling.' },
  { id: 11, title: 'DevOps Handbook', author: 'Gene Kim', price: 23.99, rating: 4.7, category: 'DevOps', imageColor: 'linear-gradient(135deg, #f97316, #c2410c)', desc: 'How to create world-class speed, reliability, and security by integrating development, QA, and operations.' },
  { id: 12, title: 'Learning Web Design', author: 'Jennifer Robbins', price: 21.99, rating: 4.5, category: 'Design', imageColor: 'linear-gradient(135deg, #84cc16, #4d7c0f)', desc: 'Learn the fundamentals of HTML, CSS, responsive layout systems, and CSS grid to create stunning websites.' },
  { id: 13, title: 'Deep Learning with Python', author: 'François Chollet', price: 49.99, rating: 4.8, category: 'AI & ML', imageColor: 'linear-gradient(135deg, #a855f7, #6b21a8)', desc: 'Written by the creator of Keras. Master deep learning from first principles through practical computer vision and NLP examples.' },
  { id: 14, title: 'AWS Certified Cloud Practitioner', author: 'Ben Piper', price: 26.50, rating: 4.6, category: 'DevOps', imageColor: 'linear-gradient(135deg, #fbbf24, #b45309)', desc: 'A complete preparation guide for the AWS CCP exam covering global infrastructure, security, pricing, and support.' },
  { id: 15, title: 'UX Research & Design Methods', author: 'Don Norman', price: 22.00, rating: 4.8, category: 'Design', imageColor: 'linear-gradient(135deg, #d946ef, #a21caf)', desc: 'A guide to user-centered design. Focuses on usability principles, user research, wireframing, and interactive prototyping.' },
  { id: 16, title: 'Mathematics for Machine Learning', author: 'Marc Peter Deisenroth', price: 35.99, rating: 4.9, category: 'Mathematics', imageColor: 'linear-gradient(135deg, #38bdf8, #0369a1)', desc: 'The mathematical foundations of machine learning: linear algebra, analytic geometry, matrix decompositions, and probability.' }
];

export default function InterestForm({ user, courses, books, savedInterest, onSaveInterest, t }) {
  const [step, setStep] = useState(savedInterest ? 'roadmap' : 'survey');
  const [selectedTopics, setSelectedTopics] = useState(savedInterest?.topics || []);
  const [level, setLevel] = useState(savedInterest?.level || 'beginner');
  const [goal, setGoal] = useState(savedInterest?.goal || 'Personal Projects');

  const topics = [
    { id: 'Programming', label: 'General Programming', emoji: '💻' },
    { id: 'Web Dev', label: 'Web Development', emoji: '⚛️' },
    { id: 'AI/ML', label: 'AI & Machine Learning', emoji: '🤖' },
    { id: 'Data Science', label: 'Data Science & Analytics', emoji: '📊' },
    { id: 'Computer Science', label: 'Core Computer Science', emoji: '🏗️' },
    { id: 'DevOps', label: 'DevOps & Systems', emoji: '🟢' },
    { id: 'Design', label: 'UI/UX Design', emoji: '🎨' },
    { id: 'Mathematics', label: 'Mathematics', emoji: '📐' }
  ];

  const handleTopicToggle = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSave = () => {
    if (selectedTopics.length === 0) {
      alert("Please select at least one topic of interest!");
      return;
    }
    const preference = { topics: selectedTopics, level, goal };
    onSaveInterest(preference);
    setStep('roadmap');
  };

  const handleReset = () => {
    setStep('survey');
  };

  // Generate Personalized Recommendations
  const filteredCourses = courses.filter(c => {
    const matchesTopic = selectedTopics.some(topic => c.category?.toLowerCase() === topic.toLowerCase() || c.tags?.toLowerCase().includes(topic.toLowerCase()));
    const matchesLevel = c.level?.toLowerCase() === level.toLowerCase();
    return matchesTopic && matchesLevel;
  }).slice(0, 2);

  const filteredBooks = books.filter(b => {
    const matchesTopic = selectedTopics.some(topic => b.category?.toLowerCase() === topic.toLowerCase() || b.title?.toLowerCase().includes(topic.toLowerCase()));
    return matchesTopic;
  }).slice(0, 2);

  // Fallbacks if no exact matches
  const recommendedCourses = filteredCourses.length > 0 ? filteredCourses : courses.slice(0, 2);
  const recommendedBooks = filteredBooks.length > 0 ? filteredBooks : books.slice(0, 2);

  return (
    <div style={{ marginBottom: 36 }} className="animate-in">
      {step === 'survey' ? (
        <div className="glass-card" style={{
          padding: 32, borderRadius: 24, boxShadow: t.shadow,
          border: `2px dashed ${t.primary}40`, position: 'relative'
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FormIcon name="sparkles" color={t.primary} size={22} />
            Personalize Your Learning Experience
          </h3>
          <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 24 }}>
            Take 30 seconds to answer three quick questions. We will compile a tailored roadmap of online courses and textbooks suited to your career goals.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Question 1: Topics */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 12, display: 'block' }}>
                1. Which topics do you want to master? (Select all that apply)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {topics.map(topic => {
                  const isActive = selectedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicToggle(topic.id)}
                      className={`interest-checkbox ${isActive ? 'active' : ''}`}
                    >
                      <span style={{ fontSize: 18 }}>{topic.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{topic.label}</span>
                      {isActive && (
                        <div style={{
                          marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%',
                          background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <FormIcon name="check" size={12} color="#fff" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question 2 & 3: Level & Goal */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8, display: 'block' }}>
                  2. Experience Level
                </label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="premium-input"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 14, outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="beginner">Beginner (No prior experience)</option>
                  <option value="intermediate">Intermediate (Build basic applications)</option>
                  <option value="advanced">Advanced (Deep dive production/systems)</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8, display: 'block' }}>
                  3. Primary Learning Goal
                </label>
                <select
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="premium-input"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`,
                    background: t.bgInput, color: t.text, fontSize: 14, outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="Career Transition">Career Transition / Getting a Job</option>
                  <option value="Academic Excellence">Academic Excellence / Exam prep</option>
                  <option value="Personal Projects">Personal Projects / Prototyping</option>
                  <option value="Ace Tech Interviews">Ace Technical Coding Interviews</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSave}
              className="btn-premium"
              style={{
                padding: '12px 28px', borderRadius: 12, border: 'none',
                background: t.gradient, color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 15px rgba(99,102,241,0.2)'
              }}
            >
              Generate Roadmap <FormIcon name="sparkles" size={16} color="#fff" />
            </button>
          </div>
        </div>
      ) : (
        /* Personalized Learning Roadmap Display */
        <div className="glass-card animate-scale-in" style={{
          padding: '28px 32px', borderRadius: 24, boxShadow: t.shadow,
          borderLeft: `6px solid ${t.primary}`
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FormIcon name="sparkles" color={t.primary} size={18} />
                Roadmap: {goal}
              </h3>
              <p style={{ fontSize: 13, color: t.textSecondary, margin: '4px 0 0' }}>
                Customized for experience: <strong style={{ textTransform: 'capitalize', color: t.primary }}>{level}</strong> | Interests: {selectedTopics.join(', ')}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn-hover"
              style={{
                padding: '6px 12px', borderRadius: 8, border: `1px solid ${t.border}`,
                background: t.bgInput, color: t.textSecondary, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
              }}
            >
              <FormIcon name="refresh" size={12} color={t.textSecondary} />
              Re-calibrate preferences
            </button>
          </div>

          {/* Interactive Steps Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Step 1: Online Course Recommendation */}
            <div style={{ background: t.bgInput, padding: 20, borderRadius: 16, border: `1px solid ${t.borderLight}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', background: t.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff'
                }}>1</div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: t.textMuted, letterSpacing: '0.05em' }}>
                  Interactive Course
                </div>
              </div>
              {recommendedCourses.map(course => (
                <div key={course.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{course.title}</h4>
                  <p style={{ fontSize: 12, color: t.textSecondary, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: t.textSecondary, marginTop: 4 }}>
                    <span style={{ color: t.primary, fontWeight: 700 }}>Instructor: {course.instructor}</span>
                    <span>★ {course.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Step 2: Book Purchase Recommendation */}
            <div style={{ background: t.bgInput, padding: 20, borderRadius: 16, border: `1px solid ${t.borderLight}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', background: t.secondary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff'
                }}>2</div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: t.textMuted, letterSpacing: '0.05em' }}>
                  Recommended Literature
                </div>
              </div>
              {recommendedBooks.map(book => (
                <div key={book.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 6 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{book.title}</h4>
                  <p style={{ fontSize: 12, color: t.textSecondary, lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {book.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: t.textSecondary, marginTop: 4 }}>
                    <span style={{ color: t.secondary, fontWeight: 700 }}>By {book.author}</span>
                    <span style={{ fontWeight: 700, color: t.text }}>${book.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Step 3: AI Assistant Practice Concept */}
            <div style={{ background: t.bgInput, padding: 20, borderRadius: 16, border: `1px solid ${t.borderLight}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', background: t.success,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff'
                  }}>3</div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: t.textMuted, letterSpacing: '0.05em' }}>
                    AI Practice Project
                  </div>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 4 }}>
                  {goal === 'Career Transition' ? 'Build a Portfolio System' : goal === 'Ace Tech Interviews' ? 'Solve 20 Dynamic Problems' : 'Assemble a prototype'}
                </h4>
                <p style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>
                  Utilize the <strong>AI Tutor</strong> to generate quizzes on {selectedTopics[0] || 'programming'} concepts and get explanations for debugging your project.
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: t.success, marginTop: 8 }}>
                <FormIcon name="award" size={14} color={t.success} />
                Milestone: Ready for Certifications
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { BOOKS }; // export books for reuse
