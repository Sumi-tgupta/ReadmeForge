# 🏗️ Architecture

## Stack
- Frontend: React 18 + Vite (configured in Vite 6, using React Router DOM v7, Tailwind CSS v3, and Framer Motion for premium animations)
- Backend: Node.js + Express
- Database: SQLite (via `better-sqlite3` for sessions, projects, and token/cost analytics)
- Infra: Vercel (for frontend React app), Render or Fly.io (for backend server)

## Folder Map
```
github_readme_builder/
├── dist/                          # Production built frontend assets
├── public/                        # Static assets (brand favicon.png, logo.png)
├── src/                           # Frontend React application
│   ├── app/                       # Global providers, routing, and config
│   │   ├── providers/             # Auth, Theme, and Toast providers
│   │   └── routes/                # Application routes
│   │       └── pages/             # Premium multi-tool route pages (HomePortal, ProfileBuilder, ProjectBuilder, Settings, NotFound)
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
│       └── ai/                    # Provider, Router, Optimizer, Cache, Queue, Scanner
```

## Data Flow
1. **User Interaction**: User enters information into the AI-Powered Layout Wizard on the React frontend or submits a public repo URL.
2. **API Request**: Frontend sends generation requests to the backend API Gateway (`/api/generate` or `/api/generate/project`).
3. **AI Gateway processing**:
   - **Queue/Deduplication**: Prevents concurrent duplicate requests from same user/IP.
   - **SHA-256 In-Memory Cache**: Check if request matches a previous hash. If yes, return cached response immediately.
   - **Prompt Optimization**: Strips whitespace, compiles fields, and prepares efficient prompt payload.
   - **Model Fallback Chain**: Tries `gemini-2.5-flash-lite` -> fallback `gemini-2.5-flash` -> fallback `gemini-3.5-flash` with exponential backoff on retry (429 rate limit or 5xx error).
4. **Database Logging**: Usage, sessions, and token tracking are recorded in the SQLite database.
5. **Response Delivery**: Generated README Markdown is sent back to the client and rendered in real-time.

## Key Integrations
- **Google Gemini API**: Dynamic content generation.
- **Lucide React**: Icon library.
- **SQLite (`better-sqlite3`)**: Internal tracking and analytics store.

## Changelog
---
### [2026-06-29 | SESSION-1 | OPERATION: Create]

**File(s) Affected:** `brain/architecture.md`
**Status:** ✅ Done

#### BEFORE
> NEW FILE

#### AFTER
> Project architecture file initialized with Tech Stack, Folder Map, Data Flow, and Key Integrations.

#### REASON
> Initialization of project brain for tracking project architecture.

#### REMAINING
> Keep updated as features are added or changes to folders occur.
---
### [2026-06-29 | SESSION-3 | OPERATION: Refactor / Edit]

**File(s) Affected:** `brain/architecture.md`, `src/app/App.jsx`, `server/routes/generate.js`
**Status:** ✅ Done

#### BEFORE
> Minimal React Router structure where "/" maps directly to the profile wizard `EditorPage.jsx`. Backend gateway only has single `POST /api/generate` route.

#### AFTER
> Enhanced routes architecture to lazy load HomePortal, ProfileBuilder (original wizard), ProjectBuilder (new tools), Settings diagnostics panel, and NotFound pages. Backend gateway enhanced with `POST /api/generate/project` repository scraper.

#### REASON
> Transform the platform into a developer-focused SaaS multi-tool suite with Framer Motion transitions and repository crawling.

#### REMAINING
> Add more documentation tools in future sessions.
---
