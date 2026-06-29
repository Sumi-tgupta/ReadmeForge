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
