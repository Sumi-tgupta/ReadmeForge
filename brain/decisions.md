# 🧭 Architecture Decision Records (ADR)

## ADR-001 — Server-Side AI Gateway for Gemini API
- **Date:** 2026-06-29
- **Status:** Accepted
- **Context:** Delivering a SaaS for GitHub profile README builders requires calling the Gemini API. Exposing the Google Gemini API keys directly on the frontend React client makes them vulnerable to public inspection and misuse. Additionally, client-side requests cannot easily deduplicate requests, handle model fallbacks, or cache identical configurations globally.
- **Decision:** Implement a Node.js + Express API Gateway (`server/`) that runs separately. All Gemini API calls are securely configured on the server. The server acts as a gateway implementing caching, prompt optimization, request deduplication, and a model fallback chain.
- **Rejected Alternatives:**
  - *Direct client-side calls*: Rejected because it exposes the API key to the user's browser.
  - *Vercel Serverless Functions only*: Rejected because we need stateful tracking, rate limit queues, and an SQLite database that is more reliable with a persistent Express server.
- **Consequences:** 
  - Increases operational complexity (requires deploying and managing a backend service).
  - Enhances security and reduces costs via request caching and prompt optimization.
  - Provides a centralized SQLite database for usage statistics.

---
## ADR-002 — Secure Cookie Session Auth with GitHub OAuth and Offline Mock Mode
- **Date:** 2026-06-29
- **Status:** Accepted
- **Context:** The application needs a production-ready authentication system for saving projects and tracking generations. We want to avoid user friction by allowing building before logging in. The system must use secure HTTP-only cookies to avoid security vulnerabilities linked to local/sessionStorage, and must be easy to test without forcing developers to create a real GitHub OAuth application immediately.
- **Decision:** Implement a secure cookie session manager using UUID-based sessions stored in SQLite. Create a hybrid GitHub OAuth client that falls back to a simulated mock profile flow in development if client credentials are not defined in `.env`. Integrate an event-driven `executeWithAuth` handler to pause builders, authenticate, and automatically resume tasks without progress loss.
- **Rejected Alternatives:**
  - *JWT Bearer Tokens in LocalStorage*: Rejected due to susceptibility to XSS attacks and lack of server-side session control.
  - *Enforcing Auth upfront*: Rejected to minimize onboarding friction and align with premium SaaS trials.
- **Consequences:**
  - Improves developer onboarding speed via offline sandbox mode.
  - Mitigates CSRF via secure state cookie verification.
  - Secures user data through HTTP-only, SameSite=Lax cookies.

---
---
## ADR-003 — Production Proxy Callback Routing for Cookie CSRF Synchronization
- **Date:** 2026-06-30
- **Status:** Accepted
- **Context:** The frontend React SPA is hosted on Vercel (`vercel.app`) and the backend Express API server is hosted on Render (`onrender.com`). During GitHub OAuth authentication, the browser initiates the flow at the frontend proxy endpoint (`/api/auth/login`), generating and saving an `oauth_state` security cookie under the Vercel domain. If the GitHub OAuth App callback redirects the browser to the direct Render backend domain (`onrender.com/api/auth/callback`), the browser will not send the Vercel domain cookie, triggering a false-positive CSRF mismatch error.
- **Decision:** Route the GitHub OAuth redirect callback through the Vercel proxy URL (`forge-readme.vercel.app/api/auth/callback`) instead of the backend Render URL. Because the browser remains on the same origin (`vercel.app`), the CSRF cookie is successfully attached to the callback request. Vercel then proxies this request to the Render backend, allowing secure validation.
- **Rejected Alternatives:**
  - *Setting `SameSite=None` with `Secure` on the cookie*: Rejected because it requires configuring cross-site cookies which modern browsers partition, block, or restrict by default, leading to unreliable logins.
  - *Disabling CSRF checks in production*: Rejected because it leaves the application vulnerable to session hijacking and replay attacks.
- **Consequences:**
  - Preserves secure HttpOnly cookie checks without requiring cross-site cookies.
  - Requires registering the Vercel domain URL as the callback in the GitHub Developer settings.

---
## Changelog
---
### [2026-06-29 | SESSION-1 | OPERATION: Create]

**File(s) Affected:** `brain/decisions.md`
**Status:** ✅ Done

#### BEFORE
> NEW FILE

#### AFTER
> Initialized ADR-001 documentation for the Server-side AI Gateway design choice.

#### REASON
> Documentation of the core architectural decision of the application.

#### REMAINING
> Add additional ADRs as more design decisions are made (e.g. SQLite database choice, theme system).
---
### [2026-06-29 | SESSION-18 | OPERATION: Create]

**File(s) Affected:** `brain/decisions.md`
**Status:** ✅ Done

#### BEFORE
> Only ADR-001 was documented.

#### AFTER
> Added ADR-002 detailing the database-backed secure session cookie implementation and offline Mock OAuth mode.

#### REASON
> Log architecture patterns for the security and authentication system.

#### REMAINING
> None.
---
### [2026-06-30 | SESSION-28 | OPERATION: Create]

**File(s) Affected:** `brain/decisions.md`
**Status:** ✅ Done

#### BEFORE
> Only ADR-001 and ADR-002 were documented.

#### AFTER
> Added ADR-003 detailing the proxied callback routing choice to handle CSRF verification across Vercel and Render domains.

#### REASON
> To document the solution for cross-domain CSRF cookie validation in production.

#### REMAINING
> None.
---
## ADR-004 — Migration from SQLite to Supabase (PostgreSQL) using Model-Layer Encapsulation
- **Date:** 2026-07-03
- **Status:** Accepted
- **Context:** While SQLite is excellent for local development, it runs as a local file. For cloud deployments (e.g. Render/Vercel), a persistent file database is difficult to maintain without complex persistent volume volumes. Swapping the storage engine to a hosted service like Supabase PostgreSQL is required. To do this with minimum code changes and keep our codebase clean, we want to isolate all database queries and prevent inline SQL statement pollution inside route controllers.
- **Decision:** Migrate from SQLite to Supabase PostgreSQL using the `@supabase/supabase-js` client SDK. Refactor all database queries to reside strictly inside the Model layer (`UserModel`, `ProjectModel`, `repositoryCache`, and a new `GenerationModel`), leaving Express routes completely database-agnostic. Map SQLite data types to native PostgreSQL features (such as `JSONB` for form configurations and native `BOOLEAN` columns).
- **Rejected Alternatives:**
  - *Full Supabase Auth Integration*: Rejected because it requires refactoring the entire frontend routing context and session cookie manager, violating the least-code-changes objective.
  - *Direct PostgreSQL client (pg)*: Rejected because the Supabase JS client provides cleaner asynchronous mapping primitives out of the box, reducing boilerplate code.
- **Consequences:**
  - Decouples Express routes from database drivers completely.
  - Increases application scalability and durability via cloud-hosted DB.
  - Requires all model methods to be asynchronous (`async/await`), necessitating route handler refactoring to await responses.

---
## Changelog
---
### [2026-06-29 | SESSION-1 | OPERATION: Create]

**File(s) Affected:** `brain/decisions.md`
**Status:** ✅ Done

#### BEFORE
> NEW FILE

#### AFTER
> Initialized ADR-001 documentation for the Server-side AI Gateway design choice.

#### REASON
> Documentation of the core architectural decision of the application.

#### REMAINING
> Add additional ADRs as more design decisions are made (e.g. SQLite database choice, theme system).
---
### [2026-06-29 | SESSION-18 | OPERATION: Create]

**File(s) Affected:** `brain/decisions.md`
**Status:** ✅ Done

#### BEFORE
> Only ADR-001 was documented.

#### AFTER
> Added ADR-002 detailing the database-backed secure session cookie implementation and offline Mock OAuth mode.

#### REASON
> Log architecture patterns for the security and authentication system.

#### REMAINING
> None.
---
### [2026-06-30 | SESSION-28 | OPERATION: Create]

**File(s) Affected:** `brain/decisions.md`
**Status:** ✅ Done

#### BEFORE
> Only ADR-001 and ADR-002 were documented.

#### AFTER
> Added ADR-003 detailing the proxied callback routing choice to handle CSRF verification across Vercel and Render domains.

#### REASON
> To document the solution for cross-domain CSRF cookie validation in production.

#### REMAINING
> None.
---
### [2026-07-03 | SESSION-43 | OPERATION: Refactor]

**File(s) Affected:** `brain/decisions.md`, `server/db/connection.js`, `server/models/`, `server/sessionManager.js`, `server/routes/`
**Status:** ✅ Done

#### BEFORE
> Database layer powered by SQLite via better-sqlite3 with inline SQL queries scattered in Express routes.

#### AFTER
> Database layer migrated to Supabase (PostgreSQL) using the `@supabase/supabase-js` client SDK. Inline database queries encapsulated inside the Model layer.

#### REASON
> To support persistent cloud storage on Supabase with clean separation of concerns and minimal route churn.

#### REMAINING
> None.
---
