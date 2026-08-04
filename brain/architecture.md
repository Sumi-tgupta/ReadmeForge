# 🏗️ Architecture

## Stack
- Frontend: React 18 + Vite (configured in Vite 6, using React Router DOM v7, Tailwind CSS v3, and Framer Motion for premium animations)
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL) for user sessions, saved projects, repository cache, and token log history
- Infra: Vercel (for frontend React app), Render or Fly.io (for backend server)

## Folder Map
```
github_readme_builder/
├── dist/                          # Production built frontend assets
├── public/                        # Static assets (brand favicon.png, logo.png)
├── src/                           # Frontend React application
│   ├── app/                       # Global providers, routing, and config
│   │   ├── providers/             # Theme, and Toast providers
│   │   └── routes/                # Application routes (HomePortal, ProfileBuilder, ProjectBuilder, Dashboard, Projects)
│   ├── components/                # Shared layout components
│   │   ├── agent/                 # AgentGraphVisualizer (Live DAG workflow view)
│   │   ├── common/                # Error Boundary, MarkdownRenderer, CommandPalette, Skeleton
│   │   ├── conversation/          # Conversational Guided Wizard & Chat Engine
│   │   └── editor/                # BadgeConfigurator, SectionOrganizer, GitHubExporter, TopBar
│   ├── features/                  # Auth & Generator feature modules
│   └── hooks/                     # Custom hooks (useGenerator, useAuth, useProjects, useSEO)
│
├── server/                        # Express API Gateway
│   ├── auth/                      # GitHub OAuth client & Mock sandbox modes
│   ├── db/                        # Supabase PostgreSQL schema, connection, and PL/pgSQL functions
│   ├── middleware/                # Rate limiters, guest limits, cookie auth middleware
│   ├── models/                    # User, Project, Generation, ConversationSession, repositoryCache
│   ├── routes/                    # API routes (/api/generate, /api/generate/project, /api/auth, /api/projects)
│   └── services/                  # Business logic services
│       ├── ai/                    # Multi-Agent Graph DAG (agentOrchestrator, graphEngine, agents/, algorithms/, guardrails/)
│       └── github/                # Repository Scanner & Metadata Crawlers
```

## Data Flow
1. **User Interaction**: User submits a public repo URL or configures a profile README.
2. **API Request**: Frontend triggers `/api/generate/project` with `mode: 'multi-agent'` or listens to `/api/generate/agent-stream`.
3. **Multi-Agent DAG Graph Engine**:
   - **Algorithms**: Ranks file importance using PageRank file centrality (`fileImportance.js`).
   - **Input Guardrails**: Scrubs secrets, API keys, tokens, emails, and blocks prompt injection (`inputSanitizer.js`).
   - **Parallel Agent Graph**: Executes Planner, Architecture Specialist (ASCII flow), Setup Specialist, and Features Specialist in parallel.
   - **Visual Stylist & Critique Agent**: Formats Shields.io badges, header styling, and audits quality against 6 quality vectors with auto-repair (`markdownValidator.js`).
4. **1-Click GitHub Export**: Users commit the finished README directly to their GitHub repository via REST API.

## Key Integrations
- **Google Gemini API**: AI Gateway fallback chain (`gemini-2.5-flash-lite`, `gemini-2.5-flash`, `gemini-3.5-flash`).
- **Supabase (PostgreSQL)**: Distributed cloud database storage.
- **GitHub REST API**: Automated OAuth commits and repo scanner.

## Changelog
---
### [2026-08-04 | SESSION-53 | OPERATION: Refactor / Upgrade]

**File(s) Affected:** `brain/architecture.md`, `server/services/ai/agentGraph/`, `server/services/ai/algorithms/`, `server/services/ai/guardrails/`, `src/components/agent/`, `src/components/editor/`
**Status:** ✅ Done

#### BEFORE
> Single-prompt LLM call for project README generation without real-time agent visualization or guardrail auto-repair.

#### AFTER
> Full Multi-Agent DAG Graph Engine with 6 specialized agents, PageRank file centrality algorithm, secret/injection guardrails, real-time SSE stream, Shields.io configurator, modular section organizer, and 1-click GitHub commit exporter.

#### REASON
> Deliver a God-Level multi-agent experience across frontend, backend, security, and algorithms.

#### REMAINING
> None.
---

