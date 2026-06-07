# README Forge — AI GitHub Profile README Builder

README Forge is a production-grade SaaS application designed to help developers create custom, visually rich, and professional GitHub profile READMEs in minutes. Powered by the Google Gemini API, it uses a robust backend AI gateway to optimize prompts, prevent rate limits, cache identical generations, and secure API operations.

## Links
* **Live Application (Frontend)**: [https://forge-readme.vercel.app/](https://forge-readme.vercel.app/)
* **Hosted API Gateway (Backend)**: [https://readme-forge-server.onrender.com](https://readme-forge-server.onrender.com)

---

## Key Features

* **AI-Powered Layout Wizard**: Build your README step-by-step (About Me, Tech Stack, Projects, Work Experience, Stats Cards, visitor counters, and more).
* **Zero Client-Side API Exposure**: The Google Gemini API key is configured and kept strictly on the backend, securing it from public inspection.
* **Server-Side AI Gateway**:
  * **Prompt Optimization**: Strips empty fields, compresses whitespace, and compiles data to save tokens and improve context quality.
  * **Model Fallback Chain**: Dynamically routes requests through working model tiers (`gemini-2.5-flash-lite` -> `gemini-2.5-flash` -> `gemini-3.5-flash`).
  * **Resilient Retry Handling**: Built-in exponential backoff (2s, 5s, 10s) specifically handling rate limits (429) and server errors (5xx).
  * **Request Deduplication**: In-memory request queue prevents duplicate simultaneous generation requests from the same user or IP.
  * **SHA-256 In-Memory Cache**: Hashes configuration payloads to return identical README requests instantly without hitting Gemini API quotas.
* **Responsive, Premium Design**: Harmonious dark/light themes, subtle micro-animations, and a highly polished user interface built with Tailwind CSS.

---

## Tech Stack

### Frontend
* **Core**: React 18 + Vite
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Router**: React Router DOM

### Backend
* **Core**: Node.js + Express
* **Database**: SQLite (`better-sqlite3`) for persistent user sessions, projects tracking, and cost/token usage logs.
* **Security & Limiting**: CORS + Express Rate Limit

---

## Codebase Structure

```
github_readme_builder/
├── dist/                          # Production built frontend assets
├── public/                        # Static assets (brand favicon.png, logo.png)
├── src/                           # Frontend React application
│   ├── app/                       # Global providers, routing, and config
│   │   ├── providers/             # Auth, Theme, and Toast providers
│   │   └── routes/                # Application pages (EditorPage)
│   ├── components/                # Shared layout components
│   │   ├── common/                # Error Boundary and common elements
│   │   └── editor/                # Navbar (TopBar, BottomBar, SettingsDrawer)
│   ├── constants/                 # Wizard steps and static configurations
│   ├── features/                  # Main app feature components
│   │   └── generator/             # Wizard forms, steps list, and preview tabs
│   ├── hooks/                     # Custom hooks (useGenerator state engine)
│   └── utils/                     # UI helper utilities
│
├── server/                        # Express API Gateway
│   ├── db/                        # Database connection and SQLite schema
│   ├── middleware/                # Rate limiter and authentication handlers
│   ├── routes/                    # API routes (/api/generate, /api/auth)
│   └── services/                  # Business logic services
│       └── ai/                    # Provider, Router, Optimizer, Cache, Queue
│
├── vercel.json                    # Vercel deployment routes and reverse proxy
├── vite.config.js                 # Vite bundler configuration
└── package.json                   # Dependencies and scripts
```

---

## Local Development Setup

To run this project on your machine, you must run both the backend server and the frontend development server.

### Prerequisites
* **Node.js** (v18 or newer recommended)
* **npm** (v9 or newer)
* **Google Gemini API Key** (Get a free key from [Google AI Studio](https://aistudio.google.com/))

### 1. Setup the Backend Server
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory based on the `.env.example`:
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL=sqlite:data/readme-forge.db
   JWT_SECRET=your-jwt-secret-key
   GEMINI_API_KEY=your_gemini_api_key_here
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start the development server (runs with automatic hot-reloads on file changes):
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:3001` and initialize the SQLite database.

### 2. Setup the Frontend Server
1. Navigate back to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## Production Deployment

### Frontend (Vercel)
This repository includes a `vercel.json` file designed to work out of the box with Vercel. It proxies any request going to `/api/*` to the hosted Express backend.
1. Update `vercel.json` with your backend server URL in the destination property.
2. Push your project to a GitHub repository.
3. Import the repository into [Vercel](https://vercel.com).
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Deploy.

### Backend (Render / Fly.io)
* **Render**: Create a free Node Web Service. Set the root directory to `server`, build command to `npm install`, and start command to `node index.js`. Add your environment variables (including `GEMINI_API_KEY` and `CORS_ORIGIN`).
* **Fly.io**: Suitable if you want persistent SQLite storage for free. Create a Dockerfile inside the `server/` directory, mount a 1GB volume to `/app/data` in `fly.toml`, and set your secret environment keys.
