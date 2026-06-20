# EduAI Platform - React Client Application

This directory contains the React.js client frontend application for the **EduAI Platform**. It handles all page routing, dynamic onboarding survey roadmaps, e-commerce bookstore shopping carts, public contact widgets, interactive mascot illustrations, and the administrative dashboard.

---

## 🎨 Design System & Style Guidelines
The application uses a custom, unified styling theme defined in `src/index.css` and `src/App.css`:
- **Neon Glassmorphism**: Cards feature blurred backdrops (`backdrop-filter`) and thin translucent borders.
- **Ambient glowing Blobs**: Neon accent background elements (`.glow-blob-primary`, `.glow-blob-secondary`) pulse smoothly.
- **Animated SVG Mascots**: High-fidelity illustrations located in `src/Illustrations.js` (Dev & Ava) react with active hover speech bubbles.
- **Micro-Animations**: Hover states apply scaling and glow effects.

---

## 📂 Project Structure
```
eduai/
├── public/                 # Static assets
└── src/
    ├── App.js              # Core shell containing page switching, auth state, and router
    ├── App.css             # Main styling, keyframes, transitions, and sliders
    ├── Bookstore.js        # Bookstore catalog, price range filtering, and searches
    ├── CartComponents.js   # Cart sliding drawer overlay and checkout details modal
    ├── Contact.js          # Contact Us form and collapsible FAQ accordion cards
    ├── Footer.js           # Global 4-column official corporate footer
    ├── Illustrations.js    # Student Boy and Student Girl interactive SVG mascots
    ├── InterestForm.js     # Diagnostic onboarding survey and dynamic dashboard roadmap widget
    └── index.js            # Entry point for React DOM
```

---

## ⚙️ Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Opens [http://localhost:3000](http://localhost:3000) in your browser. The page will reload if you make code edits.

### `npm run build`
Builds the app for production to the `build` folder. It bundles React in production mode and optimizes the build for performance.

### `npm test`
Launches the test runner in interactive watch mode.

---

## 🔌 API Integration
The client communicates with the FastAPI server running on `http://localhost:8000`. 
API requests are channeled through the helper interface `api` declared in `src/App.js`.
Cart storage and study roadmap interests are persistently saved in `localStorage` keyed individually per user email account.
