import React from 'react';

// Common styling and animations for SVGs
const svgStyles = `
  @keyframes hoverFloat {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
  @keyframes stickerFloat {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(3deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes pulseGlow {
    0% { opacity: 0.7; }
    50% { opacity: 0.9; }
    100% { opacity: 0.7; }
  }
  .char-svg {
    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.15));
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .char-svg:hover {
    transform: scale(1.03) translateY(-5px);
    filter: drop-shadow(0 25px 45px rgba(99, 102, 241, 0.25));
  }
  .sticker-1 {
    animation: stickerFloat 4s ease-in-out infinite;
  }
  .sticker-2 {
    animation: stickerFloat 4.5s ease-in-out infinite 0.5s;
  }
  .sticker-3 {
    animation: stickerFloat 5s ease-in-out infinite 1s;
  }
  .pulse-element {
    animation: pulseGlow 3s ease-in-out infinite;
  }
`;

export function StudentBoyIllustration({ size = 300, primaryColor = '#6366f1', secondaryColor = '#ec4899', style = {} }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <style>{svgStyles}</style>
      <svg
        className="char-svg"
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="boyBgGrad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={`${primaryColor}15`} />
            <stop offset="100%" stopColor={`${secondaryColor}08`} />
          </linearGradient>
          <linearGradient id="hoodieGrad" x1="120" y1="200" x2="280" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="faceGrad" x1="160" y1="110" x2="240" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
          <linearGradient id="tabletGrad" x1="200" y1="260" x2="270" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="205" y1="265" x2="265" y2="325" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
          <linearGradient id="bookGrad" x1="80" y1="180" x2="160" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="300" y1="90" x2="350" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Shadows */}
          <filter id="stickerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <filter id="charShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Background Card Ring */}
        <circle cx="200" cy="200" r="170" fill="url(#boyBgGrad)" stroke={`${primaryColor}20`} strokeWidth="2" />
        <circle cx="200" cy="200" r="140" fill="none" stroke={`${primaryColor}10`} strokeWidth="1" strokeDasharray="6 6" />

        {/* --- Characters Models (Boy) --- */}
        <g filter="url(#charShadow)">
          {/* Shoulders / Torso */}
          <path d="M110 330 C110 270, 140 240, 200 240 C260 240, 290 270, 290 330 C290 350, 270 370, 200 370 C130 370, 110 350, 110 330 Z" fill="url(#hoodieGrad)" />
          
          {/* Hoodie Strings */}
          <path d="M185 240 V290" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <path d="M215 240 V285" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <circle cx="185" cy="293" r="3.5" fill="#e2e8f0" />
          <circle cx="215" cy="288" r="3.5" fill="#e2e8f0" />

          {/* Neck */}
          <rect x="185" y="195" width="30" height="50" rx="10" fill="#fed7aa" />

          {/* Face */}
          <rect x="155" y="105" width="90" height="100" rx="40" fill="url(#faceGrad)" />

          {/* Hair (Cool Modern Crop) */}
          <path d="M150 120 C150 90, 175 75, 200 75 C225 75, 250 90, 250 120 C250 125, 245 130, 235 125 C225 120, 215 120, 200 125 C185 120, 175 120, 165 125 C155 130, 150 125, 150 120 Z" fill="#1e293b" />
          
          {/* Headphones */}
          <path d="M148 150 C148 100, 252 100, 252 150" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
          <rect x="142" y="135" width="12" height="30" rx="6" fill="#334155" />
          <rect x="246" y="135" width="12" height="30" rx="6" fill="#334155" />
          <rect x="145" y="140" width="6" height="20" rx="3" fill={primaryColor} />
          <rect x="249" y="140" width="6" height="20" rx="3" fill={primaryColor} />

          {/* Eyes */}
          <circle cx="185" cy="155" r="4.5" fill="#1e293b" />
          <circle cx="215" cy="155" r="4.5" fill="#1e293b" />
          
          {/* Eyebrows */}
          <path d="M177 146 Q185 142 193 147" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M207 147 Q215 142 223 147" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Smile */}
          <path d="M190 178 Q200 188 210 178" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
          
          {/* Cheeks */}
          <circle cx="172" cy="168" r="5" fill="#fca5a5" opacity="0.6" />
          <circle cx="228" cy="168" r="5" fill="#fca5a5" opacity="0.6" />

          {/* Hands holding Tablet */}
          <rect x="200" y="258" width="80" height="85" rx="10" transform="rotate(-10 200 258)" fill="url(#tabletGrad)" />
          <rect x="205" y="263" width="70" height="75" rx="8" transform="rotate(-10 205 263)" fill="url(#screenGrad)" />
          
          {/* Tablet Screen Content (Mini Charts Mock) */}
          <path d="M215 315 L230 295 L245 305 L260 280" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <circle cx="260" cy="280" r="3" fill="#fff" />
          
          {/* Left Hand fingers */}
          <path d="M185 295 C190 295, 195 290, 202 290 C207 290, 210 295, 202 300 C195 302, 190 300, 185 295 Z" fill="#fed7aa" />
          {/* Right Hand fingers */}
          <path d="M272 270 C277 266, 284 266, 288 271 C292 276, 290 282, 284 285 C278 288, 275 282, 272 270 Z" fill="#fed7aa" />
        </g>

        {/* --- 3D Stickers/SVGs Floating --- */}
        
        {/* Sticker 1: 3D Book Sticker (Bottom Left) */}
        <g className="sticker-1" filter="url(#stickerShadow)">
          <path d="M50 220 L110 200 L125 240 L65 260 Z" fill="url(#bookGrad)" />
          <path d="M110 200 L115 202 V242 L110 240 Z" fill="#b91c1c" />
          <path d="M65 260 L125 240 L122 245 L62 265 Z" fill="#f8fafc" opacity="0.9" />
          <path d="M50 220 L65 260 L62 265 L47 225 Z" fill="#db2777" />
          {/* Bookmark */}
          <path d="M85 210 V235 L92 230 L99 235 V205" fill="#fbbf24" />
          {/* Spark */}
          <path d="M125 195 L128 203 L136 206 L128 209 L125 217 L122 209 L114 206 L122 203 Z" fill="#fbbf24" className="pulse-element" />
        </g>

        {/* Sticker 2: 3D Lightbulb / Idea Sticker (Top Right) */}
        <g className="sticker-2" filter="url(#stickerShadow)">
          <circle cx="320" cy="115" r="22" fill="url(#goldGrad)" />
          <rect x="313" y="132" width="14" height="10" rx="2" fill="#475569" />
          <path d="M310 142 H330 L326 148 H314 Z" fill="#94a3b8" />
          {/* Filament inside */}
          <path d="M312 115 Q320 102 328 115" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M316 115 V125 M324 115 V125" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          {/* Glow Rays */}
          <path d="M320 83 V77 M348 102 L353 97 M348 128 L353 133 M292 102 L287 97 M292 128 L287 133" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" className="pulse-element" />
        </g>

        {/* Sticker 3: AI Spark / Star Sticker (Top Left) */}
        <g className="sticker-3" filter="url(#stickerShadow)" transform="translate(60, 80)">
          <path d="M40 0 L48 18 L66 26 L48 34 L40 52 L32 34 L14 26 L32 18 Z" fill="#38bdf8" />
          <path d="M40 8 L44 18 L54 22 L44 26 L40 36 L36 26 L26 22 L36 18 Z" fill="#fff" />
          <circle cx="10" cy="8" r="4" fill="#6366f1" className="pulse-element" />
          <circle cx="65" cy="45" r="5" fill="#ec4899" className="pulse-element" />
        </g>

        {/* Floating Code tag (Bottom Right) */}
        <g className="sticker-1" filter="url(#stickerShadow)" transform="translate(290, 240)">
          <rect width="75" height="34" rx="10" fill="#1e293b" stroke={`${primaryColor}40`} strokeWidth="1.5" />
          <text x="37.5" y="21" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">&lt;code&gt;</text>
        </g>
      </svg>
    </div>
  );
}

export function StudentGirlIllustration({ size = 300, primaryColor = '#ec4899', secondaryColor = '#6366f1', style = {} }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <style>{svgStyles}</style>
      <svg
        className="char-svg"
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="girlBgGrad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={`${primaryColor}15`} />
            <stop offset="100%" stopColor={`${secondaryColor}08`} />
          </linearGradient>
          <linearGradient id="jacketGrad" x1="120" y1="200" x2="280" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id="girlFaceGrad" x1="160" y1="110" x2="240" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>
          <linearGradient id="laptopGrad" x1="130" y1="280" x2="230" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="sparkGrad" x1="300" y1="220" x2="360" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>

          {/* Shadows */}
          <filter id="stickerShadowGirl" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <filter id="charShadowGirl" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Background Card Ring */}
        <circle cx="200" cy="200" r="170" fill="url(#girlBgGrad)" stroke={`${primaryColor}20`} strokeWidth="2" />
        <circle cx="200" cy="200" r="140" fill="none" stroke={`${primaryColor}10`} strokeWidth="1" strokeDasharray="6 6" />

        {/* --- Characters Models (Girl) --- */}
        <g filter="url(#charShadowGirl)">
          {/* Shoulders / Torso */}
          <path d="M110 330 C110 275, 140 245, 200 245 C260 245, 290 275, 290 330 C290 350, 270 370, 200 370 C130 370, 110 350, 110 330 Z" fill="url(#jacketGrad)" />
          
          {/* White Shirt Collar */}
          <path d="M175 245 L200 270 L225 245" fill="#f8fafc" />
          
          {/* Neck */}
          <rect x="186" y="195" width="28" height="52" rx="10" fill="#ffe4e6" />

          {/* Face */}
          <rect x="155" y="105" width="90" height="100" rx="40" fill="url(#girlFaceGrad)" />

          {/* Hair (Fabulous Bob/Cut with Bangs) */}
          <path d="M148 135 C142 135, 144 95, 175 80 C205 65, 235 80, 252 100 C258 112, 254 165, 252 175 C250 185, 244 185, 244 175 C244 150, 248 130, 240 120 C234 110, 220 108, 200 112 C180 108, 168 110, 160 120 C154 130, 156 150, 156 175 C156 185, 150 185, 148 175 Z" fill="#78350f" />
          <path d="M152 120 Q200 105 248 120" fill="none" stroke="#5b21b6" strokeWidth="2" opacity="0.3" /> {/* Highlights */}

          {/* Smart Glasses */}
          <rect x="160" y="140" width="30" height="24" rx="6" fill="none" stroke="#0f172a" strokeWidth="4" />
          <rect x="210" y="140" width="30" height="24" rx="6" fill="none" stroke="#0f172a" strokeWidth="4" />
          <line x1="190" y1="148" x2="210" y2="148" stroke="#0f172a" strokeWidth="4" />
          {/* Glasses Lens Reflection */}
          <path d="M164 144 L180 156" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M214 144 L230 156" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

          {/* Eyes behind glasses */}
          <circle cx="175" cy="152" r="3" fill="#1e293b" />
          <circle cx="225" cy="152" r="3" fill="#1e293b" />
          
          {/* Smile */}
          <path d="M190 178 Q200 186 210 178" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
          
          {/* Blush */}
          <circle cx="170" cy="172" r="5" fill="#fca5a5" opacity="0.8" />
          <circle cx="230" cy="172" r="5" fill="#fca5a5" opacity="0.8" />

          {/* Laptop open in front */}
          <g transform="translate(130, 275)">
            {/* Screen */}
            <rect width="140" height="90" rx="8" fill="url(#laptopGrad)" stroke="#64748b" strokeWidth="2" />
            <rect x="6" y="6" width="128" height="78" rx="4" fill="#0f172a" />
            {/* Mock Dashboard layout on laptop screen */}
            <rect x="14" y="14" width="40" height="30" rx="3" fill={`${primaryColor}30`} />
            <rect x="60" y="14" width="66" height="6" rx="2" fill="#38bdf8" />
            <rect x="60" y="24" width="50" height="4" rx="2" fill="#94a3b8" />
            <rect x="60" y="32" width="58" height="4" rx="2" fill="#94a3b8" />
            <path d="M14 62 H126 M40 52 L54 62 L75 50" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            {/* Hands typing */}
            <path d="M25 90 C25 80, 45 76, 52 82 C55 86, 50 90, 40 90 Z" fill="#ffe4e6" />
            <path d="M115 90 C115 80, 95 76, 88 82 C85 86, 90 90, 100 90 Z" fill="#ffe4e6" />
          </g>
        </g>

        {/* --- 3D Stickers/SVGs Floating --- */}
        
        {/* Sticker 1: 3D Glowing Brain (Top Left) */}
        <g className="sticker-1" filter="url(#stickerShadowGirl)" transform="translate(45, 95)">
          <rect width="56" height="56" rx="16" fill="url(#sparkGrad)" />
          {/* Inner Brain SVG symbol */}
          <path d="M28 14 C20 14, 17 20, 19 26 C15 28, 15 36, 21 38 C19 43, 25 45, 28 41 C31 45, 37 43, 35 38 C41 36, 41 28, 37 26 C39 20, 36 14, 28 14 Z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 14 V41" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
          <circle cx="28" cy="22" r="3" fill="#fff" className="pulse-element" />
          <circle cx="28" cy="34" r="3" fill="#fff" className="pulse-element" />
        </g>

        {/* Sticker 2: 3D Quiz Checkmark Badge (Bottom Right) */}
        <g className="sticker-2" filter="url(#stickerShadowGirl)" transform="translate(295, 210)">
          <circle cx="25" cy="25" r="25" fill="#10b981" />
          <circle cx="25" cy="25" r="21" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" />
          {/* Checkmark */}
          <path d="M16 25 L22 31 L34 19" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Spark rays */}
          <path d="M25 0 V4 M50 25 H46 M25 50 V46 M0 25 H4" stroke="#10b981" strokeWidth="3" strokeLinecap="round" className="pulse-element" />
        </g>

        {/* Sticker 3: Graduate Hat / Graduation cap (Top Right) */}
        <g className="sticker-3" filter="url(#stickerShadowGirl)" transform="translate(300, 75)">
          <path d="M10 25 L40 12 L70 25 L40 38 Z" fill="#6366f1" />
          <path d="M40 12 L10 25 L40 38 L70 25 Z" fill="#fff" opacity="0.25" />
          <path d="M20 30 V42 C20 48, 60 48, 60 42 V30" fill="#4f46e5" />
          {/* Tassel */}
          <path d="M40 25 L55 30 V45 L58 43 V30" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="58" cy="46" r="3" fill="#fbbf24" />
        </g>

        {/* Floating Badge (Bottom Left) */}
        <g className="sticker-3" filter="url(#stickerShadowGirl)" transform="translate(40, 250)">
          <rect width="80" height="34" rx="10" fill="#1e293b" stroke={`${primaryColor}40`} strokeWidth="1.5" />
          <text x="40" y="21" fill="#ec4899" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">AI Tutor</text>
        </g>
      </svg>
    </div>
  );
}
