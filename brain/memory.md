# 🧠 Project Memory

## Last Updated: 2026-07-20

---

## ✅ COMPLETED
- AI-Powered Layout Wizard UI (Frontend) — 2026-06-29
- Server-Side AI Gateway with Prompt Optimization, Fallback Chain, SHA-256 caching, Request Queueing (Backend) — 2026-06-29
- SQLite Database schema for sessions, usage tracking, and token logs — 2026-06-29
- Project-Scoped Rules (`.agents/AGENTS.md`) and `/brain` structure initialization — 2026-06-29
- Lazy routes mapping for Homepage Portal, Profile Builder, Project Builder, Settings Diagnostics, and NotFound views — 2026-06-29
- Repository scanner service & project README generator backend endpoint — 2026-06-29
- Enhanced ThemeProvider supporting system preference theme resolving, localStorage, and document body class list sync — 2026-06-29
- Conversational Builder style interface with session recovery, progressive wizard question engine, and repository scanner logs — 2026-06-29
- Configured light mode warm cream background (#E2DFD2) and glassmorphic translucent navigation bar on homepage portal — 2026-06-29
- Authentication System + GitHub OAuth + User Dashboard + Secure Generation Flow — 2026-06-29

---

## 🔄 IN PROGRESS
- None

---

## ⏳ PENDING / TODO
- [ ] Implement additional README customization options — Priority: MED
- [ ] Add more analytics dashboards for usage tracking — Priority: LOW
- [ ] Connect production deployment to actual host servers — Priority: HIGH

---

## ❌ BLOCKERS
- None

---

## 📋 SESSION LOG

### Session 1 — 2026-06-29
- Did: Initialized Workspace Rules (`.agents/AGENTS.md`) using the Master Prompt of the Brain System and set up the `/brain` directory.
- Changed:
  - [.agents/AGENTS.md](file:///D:/CODE/github_readme_builder/.agents/AGENTS.md)
  - [brain/architecture.md](file:///D:/CODE/github_readme_builder/brain/architecture.md)
  - [brain/patterns.md](file:///D:/CODE/github_readme_builder/brain/patterns.md)
  - [brain/decisions.md](file:///D:/CODE/github_readme_builder/brain/decisions.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for coding tasks, features, or fixes on the README Forge application.

### Session 2 — 2026-06-29
- Did: Replied to user's request for showing the project structure.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await coding or configuration requests from the user.

### Session 3 — 2026-06-29
- Did: Started the backend development server and frontend Vite development server.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's testing of the running servers or feature requests.

### Session 4 — 2026-06-29
- Did: Restructured App route layout to introduce HomePortal, ProfileBuilder (wizard), ProjectBuilder, Settings, and NotFound views. Installed `framer-motion` for transitions. Created backend GitHub repo scanner service and integrated it into the generate routing stack. Enhanced ThemeProvider for Tailwind dark class synchronization and system defaults.
- Changed:
  - [package.json](file:///D:/CODE/github_readme_builder/package.json)
  - [src/app/App.jsx](file:///D:/CODE/github_readme_builder/src/app/App.jsx)
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [src/app/routes/pages/ProfileBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProfileBuilder.jsx)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [src/app/routes/pages/Settings.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Settings.jsx)
  - [src/app/routes/pages/NotFound.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/NotFound.jsx)
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/services/ai/repositoryScanner.js](file:///D:/CODE/github_readme_builder/server/services/ai/repositoryScanner.js)
  - [brain/architecture.md](file:///D:/CODE/github_readme_builder/brain/architecture.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user reviews, visual checks on localhost, or further instructions.

### Session 5 — 2026-06-29
- Did: Fixed the theme toggle support on the Homepage Portal by replacing hardcoded background and text classes with dynamic, theme-responsive variants. Removed the "AI-POWERED DOCUMENTATION SUITE" tag banner as requested.
- Changed:
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for theme updates or other fixes.

### Session 6 — 2026-06-29
- Did: Changed the white theme colors to Blue Green `#0096c7` and the dark theme colors to French Blue `#023e8a` across the Theme Provider vibes (making the wizard editor, settings panels, inputs, and card selections inherit these styles) and on the Homepage Portal pages.
- Changed:
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for theme tweaks.

### Session 7 — 2026-06-29
- Did: Re-aligned the color palette mapping according to user preferences: the light (white) theme is now mapped to French Blue `#023e8a` (with matching deep blue `#03045e` surfaces), and the dark theme is restored to the dark gray developer theme `#0D1117` (with matching `#161B22` surfaces).
- Changed:
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for visual styling tweaks.

### Session 8 — 2026-06-29
- Did: Fine-tuned theme-specific colors for icons, text, headers, mockups, and layout accents across the homepage portal to ensure optimal contrast and visual excellence. Icons in dark mode render as electric blue (#5B8CFF) while light mode icons render as soft cyan-blue.
- Changed:
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for theme specifications checklist.

### Session 9 — 2026-06-29
- Did: Implemented the exact hex code mappings for both themes: Light (French Blue #023e8a background, #0077b6 surface, #00b4d8 accents, #90e0ef nav/subtitles, #caf0f8 descriptions, #e0f8ff icons/step numbers, white/blue CTA buttons) and Dark (Developer Gray #111827 background, #1F2937 surface, #374151 borders, gray/blue text, gradients).
- Changed:
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for theme tweaks.

### Session 10 — 2026-06-29
- Did: Reverted theme color changes and restored the original theme layouts across the Theme Provider and homepage portal pages (Light: gray-50 background/white surface/indigo accents; Dark: gray-950 background/gray-900 surface/indigo accents) as requested.
- Changed:
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for theme specifications checklist.

### Session 11 — 2026-06-29
- Did: Changed the page background color for the Light theme to a warm cream (#E2DFD2) in both ThemeProvider.jsx and HomePortal.jsx, keeping all other default surfaces and layout structures clean.
- Changed:
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for navbar style change.

### Session 12 — 2026-06-29
- Did: Made the main landing page header translucent using a glassmorphic background style, with lower background/border opacity levels and an increased backdrop filter blur.
- Changed:
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for Repository Intelligence Engine.

### Session 13 — 2026-06-29
- Did: Built a production-grade Repository Intelligence Engine under `server/services/github/` utilizing 15 helper sub-modules for URL validations, metadata lookups, lockfile parsing, frameworks, stack detection, feature mapping, command extraction, ASCII tree rendering, queueing, and memory caching. Created SQLite database caching model `repositoryCache.js` for persistent storage, registered new route handler `generateProject.js` under `/api/generate/project`, and refactored the frontend `ProjectBuilder.jsx` to render step-by-step progress loaders side-by-side with log messages.
- Changed:
  - [server/services/github/constants.js](file:///D:/CODE/github_readme_builder/server/services/github/constants.js)
  - [server/services/github/validators.js](file:///D:/CODE/github_readme_builder/server/services/github/validators.js)
  - [server/services/github/requestQueue.js](file:///D:/CODE/github_readme_builder/server/services/github/requestQueue.js)
  - [server/services/github/cache.js](file:///D:/CODE/github_readme_builder/server/services/github/cache.js)
  - [server/services/github/githubClient.js](file:///D:/CODE/github_readme_builder/server/services/github/githubClient.js)
  - [server/services/github/treeScanner.js](file:///D:/CODE/github_readme_builder/server/services/github/treeScanner.js)
  - [server/services/github/dependencyParser.js](file:///D:/CODE/github_readme_builder/server/services/github/dependencyParser.js)
  - [server/services/github/languageDetector.js](file:///D:/CODE/github_readme_builder/server/services/github/languageDetector.js)
  - [server/services/github/frameworkDetector.js](file:///D:/CODE/github_readme_builder/server/services/github/frameworkDetector.js)
  - [server/services/github/stackDetector.js](file:///D:/CODE/github_readme_builder/server/services/github/stackDetector.js)
  - [server/services/github/featureDetector.js](file:///D:/CODE/github_readme_builder/server/services/github/featureDetector.js)
  - [server/services/github/commandExtractor.js](file:///D:/CODE/github_readme_builder/server/services/github/commandExtractor.js)
  - [server/services/github/architectureDetector.js](file:///D:/CODE/github_readme_builder/server/services/github/architectureDetector.js)
  - [server/services/github/summaryBuilder.js](file:///D:/CODE/github_readme_builder/server/services/github/summaryBuilder.js)
  - [server/services/github/githubAnalyzer.js](file:///D:/CODE/github_readme_builder/server/services/github/githubAnalyzer.js)
  - [server/services/github/repositoryScanner.js](file:///D:/CODE/github_readme_builder/server/services/github/repositoryScanner.js)
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/index.js](file:///D:/CODE/github_readme_builder/server/index.js)
  - [server/models/repositoryCache.js](file:///D:/CODE/github_readme_builder/server/models/repositoryCache.js)
  - [server/utils/hash.js](file:///D:/CODE/github_readme_builder/server/utils/hash.js)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user request for UI adjustment.

### Session 14 — 2026-06-29
- Did: Implemented a robust custom regex-based `MarkdownRenderer` component in `src/components/common/` that handles headers, lists, code fences, inline code, bold, italic, links, images, tables, and blockquotes. Cleaned up HTML dangerouslySetInnerHTML rendering inside `ProjectBuilder.jsx` and `GeneratePreview.jsx` using the new component. Reverted `ProfileBuilder.jsx` back to its original step-wizard layout, removing the conversational chat UI per user request.
- Changed:
  - [src/components/common/MarkdownRenderer.jsx](file:///D:/CODE/github_readme_builder/src/components/common/MarkdownRenderer.jsx)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [src/features/generator/GeneratePreview.jsx](file:///D:/CODE/github_readme_builder/src/features/generator/GeneratePreview.jsx)
  - [src/app/routes/pages/ProfileBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProfileBuilder.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user feedback.

### Session 15 — 2026-06-29
- Did: Modified the Gemini project README system prompt in `server/routes/generateProject.js` to strictly enforce badge generation rules. Added validations to prevent generating License badges when none exists, Build Status badges when no actions are found, and Code Style badges when formatting packages are not present in dependencies.
- Changed:
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await server shutdown request.

### Session 16 — 2026-06-29
- Did: Terminated running background development server tasks `task-48` (Vite backend proxy on port 3001) and `task-50` (Vite frontend server on port 5173).
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Completed task.

### Session 17 — 2026-06-29
- Did: Introduced the new "Conversation" builder style, implementing a complete custom guided guided wizard engine and offline components in `src/components/conversation/`. Supported session recovery, resume/discard dialogs, custom inline widgets, repository crawler terminal logs within chat bubble, and settings toggles for interface styles. Wired path configurations and automatic switches to render conversational builder.
- Changed:
  - [src/components/conversation/validators.js](file:///D:/CODE/github_readme_builder/src/components/conversation/validators.js)
  - [src/components/conversation/questionRegistry.js](file:///D:/CODE/github_readme_builder/src/components/conversation/questionRegistry.js)
  - [src/components/conversation/conversationCache.js](file:///D:/CODE/github_readme_builder/src/components/conversation/conversationCache.js)
  - [src/components/conversation/conversationEngine.js](file:///D:/CODE/github_readme_builder/src/components/conversation/conversationEngine.js)
  - [src/components/conversation/conversationStore.js](file:///D:/CODE/github_readme_builder/src/components/conversation/conversationStore.js)
  - [src/components/conversation/TypingIndicator.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/TypingIndicator.jsx)
  - [src/components/conversation/ProgressBar.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ProgressBar.jsx)
  - [src/components/conversation/SuggestionCards.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/SuggestionCards.jsx)
  - [src/components/conversation/ResumeDialog.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ResumeDialog.jsx)
  - [src/components/conversation/ConversationBubble.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationBubble.jsx)
  - [src/components/conversation/ConversationInput.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationInput.jsx)
  - [src/components/conversation/QuestionRenderer.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/QuestionRenderer.jsx)
  - [src/components/conversation/ReviewScreen.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ReviewScreen.jsx)
  - [src/components/conversation/ConversationHeader.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationHeader.jsx)
  - [src/components/conversation/ConversationSidebar.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationSidebar.jsx)
  - [src/components/conversation/ConversationMessages.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationMessages.jsx)
  - [src/components/conversation/ConversationLayout.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationLayout.jsx)
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/Settings.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Settings.jsx)
  - [src/app/App.jsx](file:///D:/CODE/github_readme_builder/src/app/App.jsx)
  - [src/app/routes/pages/ProfileBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProfileBuilder.jsx)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
  - [brain/architecture.md](file:///D:/CODE/github_readme_builder/brain/architecture.md)
- Next: Await user testing.

### Session 18 — 2026-06-29
- Did: Implemented the GitHub OAuth authentication system, secure HTTP-only cookies session manager, user dashboard and saved projects listing routes, and automated action resumption listeners. Integrated SQLite tables for users and sessions, secure cookies refresh cycles, and offline development mock bypass.
- Changed:
  - [server/db/schema.sql](file:///D:/CODE/github_readme_builder/server/db/schema.sql)
  - [server/sessionManager.js](file:///D:/CODE/github_readme_builder/server/sessionManager.js)
  - [server/auth/githubOAuth.js](file:///D:/CODE/github_readme_builder/server/auth/githubOAuth.js)
  - [server/routes/auth.js](file:///D:/CODE/github_readme_builder/server/routes/auth.js)
  - [server/routes/projects.js](file:///D:/CODE/github_readme_builder/server/routes/projects.js)
  - [server/middleware/auth.js](file:///D:/CODE/github_readme_builder/server/middleware/auth.js)
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [server/routes/user.js](file:///D:/CODE/github_readme_builder/server/routes/user.js)
  - [src/services/authApi.js](file:///D:/CODE/github_readme_builder/src/services/authApi.js)
  - [src/features/auth/AuthContext.jsx](file:///D:/CODE/github_readme_builder/src/features/auth/AuthContext.jsx)
  - [src/features/auth/AuthProvider.jsx](file:///D:/CODE/github_readme_builder/src/features/auth/AuthProvider.jsx)
  - [src/features/auth/LoginModal.jsx](file:///D:/CODE/github_readme_builder/src/features/auth/LoginModal.jsx)
  - [src/features/auth/GitHubButton.jsx](file:///D:/CODE/github_readme_builder/src/features/auth/GitHubButton.jsx)
  - [src/features/auth/ProtectedRoute.jsx](file:///D:/CODE/github_readme_builder/src/features/auth/ProtectedRoute.jsx)
  - [src/hooks/useAuth.js](file:///D:/CODE/github_readme_builder/src/hooks/useAuth.js)
  - [src/hooks/useProjects.js](file:///D:/CODE/github_readme_builder/src/hooks/useProjects.js)
  - [src/app/routes/pages/Dashboard.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Dashboard.jsx)
  - [src/app/routes/pages/Projects.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Projects.jsx)
  - [src/app/App.jsx](file:///D:/CODE/github_readme_builder/src/app/App.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [src/features/generator/GeneratePreview.jsx](file:///D:/CODE/github_readme_builder/src/features/generator/GeneratePreview.jsx)
  - [src/components/conversation/ReviewScreen.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ReviewScreen.jsx)
  - [src/components/editor/SettingsDrawer.jsx](file:///D:/CODE/github_readme_builder/src/components/editor/SettingsDrawer.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
  - [brain/decisions.md](file:///D:/CODE/github_readme_builder/brain/decisions.md)
- Next: Fully operational, await user verification.

### Session 19 — 2026-06-29
- Did: Removed the settings drawer gear toggle from the wizard header. Updated default state fallbacks for builder vibe (github) and font size (lg) in the theme provider. Stripped the settings diagnostics page of API cache statistics cards, model list sections, guides, and header emojis, and reformatted it into a centered layout.
- Changed:
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/components/editor/TopBar.jsx](file:///D:/CODE/github_readme_builder/src/components/editor/TopBar.jsx)
  - [src/app/routes/pages/Settings.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Settings.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Completed tasks.

### Session 20 — 2026-06-29
- Did: Terminated both background development tasks (Vite frontend dev server and Express backend server).
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Done.
---

### Session 21 — 2026-06-30
- Did: Answered user's query about OAuth redirect URI and production setup vs. West/Render environment deployment.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's confirmation or next steps.
---

### Session 22 — 2026-06-30
- Did: Clarified the requirement of having two separate GitHub OAuth app configurations for local and production setups.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's confirmation or next steps.
---

### Session 23 — 2026-06-30
- Did: Provided the exact inputs for registering both Local and Production GitHub OAuth applications.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's confirmation or next steps.
---

### Session 24 — 2026-06-30
- Did: Started frontend and backend development servers as background tasks in local environment.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Done.
---

### Session 25 — 2026-06-30
- Did: Explained how to make production OAuth function with Vercel rewrites and Render backend configurations using Environment Variables.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's confirmation or next steps.
---

### Session 26 — 2026-06-30
- Did: Diagnosed and explained the "redirect_uri mismatch" GitHub OAuth error in production.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's confirmation or next steps.
---

### Session 27 — 2026-06-30
- Did: Explained the "Dangerous site" Google Safe Browsing warning that triggers on new free Vercel/Render subdomains and provided bypass/resolution guidelines.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's confirmation or next steps.
---

### Session 28 — 2026-06-30
- Did: Explained the CSRF token mismatch error caused by domain boundary differences between Vercel and Render cookies and provided the correct proxied redirect path configuration fix.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user's confirmation or next steps.
---

### Session 29 — 2026-06-30
- Did: Created checkpoint and synced brain state, documenting ADR-003 for Cross-Origin CSRF validation routing decisions.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
  - [brain/decisions.md](file:///D:/CODE/github_readme_builder/brain/decisions.md)
- Next: Await user's confirmation or next steps.
---

### Session 30 — 2026-06-30
- Did: Performed a major production sweep. Configured featureFlags.js, appConfig.js, logger.js, and analytics.js. Upgraded ToastProvider.jsx to a multi-toast queue. Created Skeleton.jsx and FeedbackStates.jsx primitives. Added key-navigated CommandPalette.jsx (Ctrl+K) globally. Created sitemap.xml, robots.txt, and manifest.json for PWA/SEO optimizations. Integrated Vitest and Playwright configurations with sample component testing. Wrote Architecture.md, Contributing.md, Deployment.md, FolderStructure.md, and DeveloperGuide.md documentation files.
- Changed:
  - [src/app/config/featureFlags.js](file:///D:/CODE/github_readme_builder/src/app/config/featureFlags.js)
  - [src/app/config/appConfig.js](file:///D:/CODE/github_readme_builder/src/app/config/appConfig.js)
  - [src/utils/logger.js](file:///D:/CODE/github_readme_builder/src/utils/logger.js)
  - [src/services/analytics.js](file:///D:/CODE/github_readme_builder/src/services/analytics.js)
  - [src/app/providers/ToastProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ToastProvider.jsx)
  - [src/components/common/Skeleton.jsx](file:///D:/CODE/github_readme_builder/src/components/common/Skeleton.jsx)
  - [src/components/common/FeedbackStates.jsx](file:///D:/CODE/github_readme_builder/src/components/common/FeedbackStates.jsx)
  - [src/components/common/CommandPalette.jsx](file:///D:/CODE/github_readme_builder/src/components/common/CommandPalette.jsx)
  - [src/app/App.jsx](file:///D:/CODE/github_readme_builder/src/app/App.jsx)
  - [src/hooks/useSEO.js](file:///D:/CODE/github_readme_builder/src/hooks/useSEO.js)
  - [public/robots.txt](file:///D:/CODE/github_readme_builder/public/robots.txt)
  - [public/sitemap.xml](file:///D:/CODE/github_readme_builder/public/sitemap.xml)
  - [public/manifest.json](file:///D:/CODE/github_readme_builder/public/manifest.json)
  - [index.html](file:///D:/CODE/github_readme_builder/index.html)
  - [vitest.config.js](file:///D:/CODE/github_readme_builder/vitest.config.js)
  - [tests/setup.js](file:///D:/CODE/github_readme_builder/tests/setup.js)
  - [tests/common/InputField.test.jsx](file:///D:/CODE/github_readme_builder/tests/common/InputField.test.jsx)
  - [playwright.config.js](file:///D:/CODE/github_readme_builder/playwright.config.js)
  - [docs/Architecture.md](file:///D:/CODE/github_readme_builder/docs/Architecture.md)
  - [docs/Contributing.md](file:///D:/CODE/github_readme_builder/docs/Contributing.md)
  - [docs/Deployment.md](file:///D:/CODE/github_readme_builder/docs/Deployment.md)
  - [docs/FolderStructure.md](file:///D:/CODE/github_readme_builder/docs/FolderStructure.md)
  - [docs/DeveloperGuide.md](file:///D:/CODE/github_readme_builder/docs/DeveloperGuide.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Confirm the successful production build checks.
---

### Session 31 — 2026-06-30
- Did: Executed production build command `npm run build` which successfully bundled the React SPA and split assets.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Done. Ready for deployment launch.
---

### Session 32 — 2026-06-30
- Did: Updated the root README.md documentation file based on the full project features, including dual builders, repository intelligence scanner, command palette, OAuth secure cookies, Vitest/Playwright tests, and custom docs subdirectory mapping.
- Changed:
  - [README.md](file:///D:/CODE/github_readme_builder/README.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Completed tasks.
---

### Session 33 — 2026-06-30
- Did: Implemented mobile responsive improvements in GeneratePreview.jsx (collapsible/stackable preview layout) and TopBar.jsx (hidden progress track on mobile). Integrated backend credit checks and credit deductions in generate.js and generateProject.js endpoints. Created DatabaseSetup.md detailing persistent volume configurations and PostgreSQL migration setups.
- Changed:
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [src/features/generator/GeneratePreview.jsx](file:///D:/CODE/github_readme_builder/src/features/generator/GeneratePreview.jsx)
  - [src/components/editor/TopBar.jsx](file:///D:/CODE/github_readme_builder/src/components/editor/TopBar.jsx)
  - [docs/DatabaseSetup.md](file:///D:/CODE/github_readme_builder/docs/DatabaseSetup.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Confirm successful compilation.
---

### Session 34 — 2026-06-30
- Did: Verified and built the production bundles post-responsiveness improvements. The Vite build completed successfully in 29.67s.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Done. Launch-ready.
---

### Session 35 — 2026-06-30
- Did: Concluded all development, optimization, mobile responsiveness sweeps, database guides, and documentation tasks. Checked in session memory.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Stop running servers.
---

### Session 36 — 2026-06-30
- Did: Stopped the running background tasks for the frontend and backend servers (task-36 and task-38).
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Done. All development processes and dev servers terminated.
---

### Session 37 — 2026-07-03
- Did: Started the frontend and backend development servers in the background.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user requests.
---

### Session 38 — 2026-07-03
- Did: Fixed multiple bugs: resolved Light Theme Start Building button and tagline gradient visibility by registering missing custom color ranges in tailwind.config.js, resolved dark theme GitHub UI text contrast using explicit color overrides, implemented sessionStorage persistence for profile builder inputs to survive OAuth login redirects, fixed missing updated_at column in SQLite database, and clarified SQLite-based stack architecture.
- Changed:
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [tailwind.config.js](file:///D:/CODE/github_readme_builder/tailwind.config.js)
  - [src/index.css](file:///D:/CODE/github_readme_builder/src/index.css)
  - [src/hooks/useGenerator.js](file:///D:/CODE/github_readme_builder/src/hooks/useGenerator.js)
  - [server/db/schema.sql](file:///D:/CODE/github_readme_builder/server/db/schema.sql)
  - [server/db/connection.js](file:///D:/CODE/github_readme_builder/server/db/connection.js)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user testing.
---

### Session 39 — 2026-07-03
- Did: Presented the clean workspace folder structure layout to the user, excluding dependency folders (node_modules, .git).
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user requests.
---

### Session 40 — 2026-07-03
- Did: Provided the complete, exhaustive recursive folder and file structure of the workspace (excluding node_modules, .git, .gemini, dist).
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user requests.
---

### Session 41 — 2026-07-03
- Did: Reviewed the completeness status of core application features for the user.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user requests.
---

### Session 42 — 2026-07-03
- Did: Performed a complete backend architecture audit and wrote a comprehensive migration plan from SQLite to Supabase.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user approval on the Supabase Migration Plan.
---

### Session 43 — 2026-07-03
- Did: Executed the SQLite-to-Supabase migration plan. Installed @supabase/supabase-js, refactored connection.js, sessionManager.js, auth middleware, and models (User, Project, repositoryCache) to run on Supabase asynchronously. Created a new GenerationModel to encapsulate tokens and usage log history. Cleaned all routes to remove direct/inline SQLite calls. Removed SQLite-only reinit.js. Verified clean server boot.
- Changed:
  - [server/db/connection.js](file:///D:/CODE/github_readme_builder/server/db/connection.js)
  - [server/models/Generation.js](file:///D:/CODE/github_readme_builder/server/models/Generation.js)
  - [server/models/User.js](file:///D:/CODE/github_readme_builder/server/models/User.js)
  - [server/models/Project.js](file:///D:/CODE/github_readme_builder/server/models/Project.js)
  - [server/models/repositoryCache.js](file:///D:/CODE/github_readme_builder/server/models/repositoryCache.js)
  - [server/sessionManager.js](file:///D:/CODE/github_readme_builder/server/sessionManager.js)
  - [server/middleware/auth.js](file:///D:/CODE/github_readme_builder/server/middleware/auth.js)
  - [server/routes/auth.js](file:///D:/CODE/github_readme_builder/server/routes/auth.js)
  - [server/routes/projects.js](file:///D:/CODE/github_readme_builder/server/routes/projects.js)
  - [server/routes/user.js](file:///D:/CODE/github_readme_builder/server/routes/user.js)
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [brain/decisions.md](file:///D:/CODE/github_readme_builder/brain/decisions.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user verification.
---

### Session 44 — 2026-07-03
- Did: Provided the updated full project directory structure to the user following the Supabase database migration.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user requests.
---

### Session 45 — 2026-07-03
- Did: Converted the SQLite database schema in server/db/schema.sql into a fully compliant PostgreSQL / Supabase schema (featuring UUID primary keys, TIMESTAMPTZ datetimes, CHECK constraints, foreign keys, triggers for updated_at, and Row Level Security policies). Created ConversationSession and UserSettings models. Wrote verification script server/db/verify_tables.js and ran it to verify Supabase connectivity.
- Changed:
  - [server/db/schema.sql](file:///D:/CODE/github_readme_builder/server/db/schema.sql)
  - [server/db/connection.js](file:///D:/CODE/github_readme_builder/server/db/connection.js)
  - [server/models/ConversationSession.js](file:///D:/CODE/github_readme_builder/server/models/ConversationSession.js)
  - [server/models/UserSettings.js](file:///D:/CODE/github_readme_builder/server/models/UserSettings.js)
  - [server/db/verify_tables.js](file:///D:/CODE/github_readme_builder/server/db/verify_tables.js)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user pasting the schema in Supabase SQL Editor and checking connection again.
---

### Session 46 — 2026-07-03
- Did: Regenerated the PostgreSQL/Supabase schema.sql file using pgcrypto extension for gen_random_uuid(), enabled Row Level Security on ALL tables (including repository_cache), added complete RLS policies with WITH CHECK clauses for all tables, and verified backend model compatibility.
- Changed:
  - [server/db/schema.sql](file:///D:/CODE/github_readme_builder/server/db/schema.sql)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user verification of the new schema execution on Supabase SQL Editor.
---

### Session 47 — 2026-07-03
- Did: Executed the verify_tables.js script and verified that all 7 PostgreSQL tables (users, projects, sessions, generation_history, repository_cache, conversation_sessions, user_settings) are successfully created and reachable in the live Supabase project.
- Changed:
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user requests.
---

### Session 48 — 2026-07-03
- Did: Addressed various visual bugs, unified logo styling across the app, and resolved credit-update issues:
  - Unified the project logo styling across Dashboard sidebar, TopBar editor, and LoginModal using the Terminal gradient design.
  - Removed "Settings" / "System Settings" from the home profile dropdown, the dashboard sidebar menu, and redundant fetch calls.
  - Awaited cache-check promise in generateProject.js, and added credit deduction and usage tracking on cache hits to guarantee every creation uses 1 credit.
  - Fixed "View Demo" button on HomePortal by adding a simulation reset state counter.
- Changed:
  - [src/app/routes/pages/Dashboard.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Dashboard.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [src/components/editor/TopBar.jsx](file:///D:/CODE/github_readme_builder/src/components/editor/TopBar.jsx)
  - [src/features/auth/LoginModal.jsx](file:///D:/CODE/github_readme_builder/src/features/auth/LoginModal.jsx)
  - [src/services/authApi.js](file:///D:/CODE/github_readme_builder/src/services/authApi.js)
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user requests.
---

### Session 49 — 2026-07-03
- Did: Initiated code cleanup and resolved key critical security/logic concerns from the Production Audit:
  - Deprecated the duplicate and broken `requireAuth.js` middleware by replacing it with a clean deprecation statement.
  - Resolved the React Rules of Hooks violation in `ProjectBuilder.jsx` by moving the early return checks for conversation mode below all state and lifecycle hooks.
  - Fixed the `formData` ReferenceError in `ConversationLayout.jsx` by including it in the destructured fields of the conversation store hook.
  - Appended the atomic `deduct_user_credit` PL/pgSQL function to `server/db/schema.sql` and refactored `User.js` model to call it first with a read-then-write fallback query, curing the TOCTOU concurrency race conditions.
  - Awaited the asynchronous `trackUsage` and `setPersistentCache` promises in `generate.js` and `generateProject.js` routes to resolve potential background crashes.
  - Cleaned up the `server/package.json` by removing unused dependencies (`better-sqlite3` and `bcryptjs`).
- Changed:
  - [server/middleware/requireAuth.js](file:///D:/CODE/github_readme_builder/server/middleware/requireAuth.js)
  - [server/models/User.js](file:///D:/CODE/github_readme_builder/server/models/User.js)
  - [server/db/schema.sql](file:///D:/CODE/github_readme_builder/server/db/schema.sql)
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [server/package.json](file:///D:/CODE/github_readme_builder/server/package.json)
  - [src/components/conversation/ConversationLayout.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationLayout.jsx)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await user confirmation of deployment.
---

### Session 50 — 2026-07-03
- Did: Located and copied the previously created "Production Readiness Audit" artifact from the system brain folder to the local workspace documentation directory at `docs/ProductionReadinessAudit.md`.
- Changed:
  - [docs/ProductionReadinessAudit.md](file:///D:/CODE/github_readme_builder/docs/ProductionReadinessAudit.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await further tasks from the user.
---

### Session 51 — 2026-07-03
- Did: Fixed all 7 CRITICAL severity issues from the Production Readiness Audit:
  1. **Hooks Violation Fix:** Refactored `conversationStore.js` to extract `useGenerator()` into a standalone `useSafeGenerator()` wrapper hook called at the top level, satisfying React Rules of Hooks.
  2. **ReferenceError Crash Fix:** Fixed `ConversationLayout.jsx` line 261 — replaced `formData[id]` with safe `formData?.[id] ?? ''` to prevent runtime crash when jumping between review questions.
  3. **XSS Fix:** Installed `dompurify` package and integrated `DOMPurify.sanitize()` in `MarkdownRenderer.jsx` before all `dangerouslySetInnerHTML` calls.
  4. **Stubbed AuthProvider Fix:** Replaced the dangerous stub `src/app/providers/AuthProvider.jsx` (which had `isAuthenticated` hardcoded to `true`) with a safe re-export pointing to the real `features/auth/AuthProvider.jsx`.
  5. **SplashScreen Fix:** Rewrote `SplashScreen.jsx` to use the real GitHub OAuth `login()` flow instead of calling the dead `setApiKey()` stub API.
  6. **Duplicate Middleware:** `requireAuth.js` was already deprecated in the previous session.
  7. **ProjectBuilder Hooks:** Early return at line 83 of `ProjectBuilder.jsx` is placed correctly below all hook initializations — confirmed as already fixed in Session 49.
- Changed:
  - [src/components/conversation/conversationStore.js](file:///D:/CODE/github_readme_builder/src/components/conversation/conversationStore.js)
  - [src/components/conversation/ConversationLayout.jsx](file:///D:/CODE/github_readme_builder/src/components/conversation/ConversationLayout.jsx)
  - [src/components/common/MarkdownRenderer.jsx](file:///D:/CODE/github_readme_builder/src/components/common/MarkdownRenderer.jsx)
  - [src/app/providers/AuthProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/AuthProvider.jsx)
  - [src/features/generator/SplashScreen.jsx](file:///D:/CODE/github_readme_builder/src/features/generator/SplashScreen.jsx)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Move to HIGH severity fixes — anonymous AI generation abuse, jarring theme inconsistencies, and missing mobile sidebars.
---

### Session 52 — 2026-07-03
- Did: Fixed all 5 HIGH severity issues from the Production Readiness Audit:
  1. **Theme Consistency (Settings):** Replaced all hardcoded dark colors (`#0D1117`, `#161B22`, `#9CA3AF`) in `Settings.jsx` with dynamic `vc.bg`, `vc.text`, and `isDark` tokens. Also corrected stale SQLite references to Supabase.
  2. **Theme Consistency (NotFound):** Applied same theme token pattern to `NotFound.jsx` — page now correctly shows light background in light mode.
  3. **Mobile Sidebar (Dashboard):** Added `mobileSidebarOpen` state, a full-screen dark overlay, a slide-in sidebar drawer (`translate-x` CSS transition), and a hamburger `Menu` button in the header that only renders on mobile (`md:hidden`).
  4. **Cross-Origin Cookie Fix:** Updated `sessionManager.js` to issue `SameSite=None; Secure` cookies in production (Vercel/Render cross-domain) vs `SameSite=Lax` in local dev.
  5. **Anonymous AI Abuse Fix:** Added `guestLimiter` middleware (3 req/hour IP-based, skipped for authenticated users) to both `generate.js` and `generateProject.js` routes — prevents uncapped token exploitation by anonymous guests.
- Changed:
  - [src/app/routes/pages/Settings.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Settings.jsx)
  - [src/app/routes/pages/NotFound.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/NotFound.jsx)
  - [src/app/routes/pages/Dashboard.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Dashboard.jsx)
  - [server/sessionManager.js](file:///D:/CODE/github_readme_builder/server/sessionManager.js)
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Move to MEDIUM severity fixes or await user direction.
---

### Session 53+54 — 2026-07-03 (MEDIUM + EASY severity)
- Did: Addressed all remaining Medium and Easy audit findings:
  1. **Tailwind Config Fixed:** Added all missing custom tokens to `tailwind.config.js` that were silently broken: `gray-655→gray-650`, `gray-750`, `gray-850`, `gray-905` (dark sidebar), `indigo-650` (brand button), `purple-650` (gradient end), `z-35` (sticky header). Corrected zIndex placement inside `theme.extend`.
  2. **GitHub URL Validation:** Added regex `GITHUB_REPO_REGEX` to `ProjectBuilder.jsx` `handleScan` — now validates proper `github.com/owner/repo` format before submitting.
  3. **HomePortal Decomposition:** Split 722-line monolith into:
     - `home/ProductsSection.jsx` (memo) — product cards
     - `home/FeaturesSection.jsx` (memo) — feature grid
     - `home/FAQSection.jsx` (memo + own state) — accordion
     - `HeroMockup` (inline memo) — mockup animation with isolated state
     - `HowItWorksSection` (inline memo) — steps
     - `PreviewSection` (inline memo) — browser mockup preview
     - HomePortal trimmed from 722 → ~320 lines. All section re-renders now isolated.
  4. **Console.log Cleanup:** Removed 7 verbose `console.log` calls from `generate.js`. Model failure logs now gated to `NODE_ENV === 'development'` only.
- Changed:
  - [tailwind.config.js](file:///D:/CODE/github_readme_builder/tailwind.config.js)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [src/app/routes/pages/home/ProductsSection.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/home/ProductsSection.jsx) ← NEW
  - [src/app/routes/pages/home/FeaturesSection.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/home/FeaturesSection.jsx) ← NEW
  - [src/app/routes/pages/home/FAQSection.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/home/FAQSection.jsx) ← NEW
  - [server/routes/generate.js](file:///D:/CODE/github_readme_builder/server/routes/generate.js)
- Next: All Critical + High + Medium + Easy audit items addressed. Full audit complete ✅
---

### Session 55 — 2026-07-03 (UI & UX Polish)
- Did: Refined, enhanced, and made the platform fully production-ready:
  1. **Light Theme Alignment:** Updated `ThemeProvider.jsx` so all vibe configurations use `bg-[#E2DFD2]` for light backgrounds, matching the homepage brand aesthetics.
  2. **Clickable Branding Logo:** Modified `Dashboard.jsx`, `Projects.jsx`, `ProjectBuilder.jsx`, and `Settings.jsx` to render the identical clickable README Forge SVG logo navigating to `/`.
  3. **Dashboard Light Mode Polish:** Updated text color states in the welcome banner and project card titles (`text-gray-900 / text-white/95`) to support the cream background in light mode.
  4. **Open Saved Projects Fix:** Restructured the Dashboard/Projects "Open" action. Project types now write to `readme_forge_project_restore` in `sessionStorage` and navigate to `/project-builder`, which includes a new initialization `useEffect` restoring the state, loading the URL, and jumping directly to the markdown preview.
  5. **Pricing Section added:** Designed and implemented a responsive, premium `PricingSection` under `home/` showcasing Free, Pro ($5), and Ultra ($20) tiers with perks, and marking purchase buttons as "Coming Soon". Add Pricing link to desktop and mobile navigation menus.
  6. **ProjectBuilder UI Upgrade:** Overhauled the step 0 form layout with a centered, glowing CPU icon container, refined typography, and border card panels.
- Changed:
  - [src/app/providers/ThemeProvider.jsx](file:///D:/CODE/github_readme_builder/src/app/providers/ThemeProvider.jsx)
  - [src/app/routes/pages/Dashboard.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Dashboard.jsx)
  - [src/app/routes/pages/Projects.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Projects.jsx)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [src/app/routes/pages/Settings.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/Settings.jsx)
  - [src/app/routes/pages/NotFound.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/NotFound.jsx)
  - [src/app/routes/pages/HomePortal.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/HomePortal.jsx)
  - [src/app/routes/pages/home/PricingSection.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/home/PricingSection.jsx) ← NEW
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Await further directions.
---

### Session 56 — 2026-07-03
- Did: Completed all pending UI bugs and code quality issues from the frontend improvements audit. Fixed React hook violations in `conversationStore.js` and removed layout shifting caused by `Math.random()` in `GeneratePreview.jsx`. Added missing `aria-label`s for accessibility to icon-only buttons across `HomePortal.jsx`, `GeneratePreview.jsx`, `TechPicker.jsx`, `Projects.jsx`, and all wizard steps. Also set `alt=""` for purely decorative generated preview images. The requested pricing page modifications (Pro $5, Ultra $20, coming soon, no popular tags) were verified as complete in the new `PricingSection.jsx`.
- Changed:
  - `src/components/conversation/conversationStore.js`
  - `src/features/generator/GeneratePreview.jsx`
  - `src/app/routes/pages/HomePortal.jsx`
  - `src/features/generator/TechPicker.jsx`
  - `src/app/routes/pages/Projects.jsx`
  - `src/features/generator/steps/EducationStep.jsx`
  - `src/features/generator/steps/ExperienceStep.jsx`
  - `src/features/generator/steps/OpenSourceStep.jsx`
  - `src/features/generator/steps/ProjectsStep.jsx`
  - `src/features/generator/steps/LanguagesStep.jsx`
  - `src/features/generator/steps/StatsStep.jsx`
  - `src/features/generator/steps/StreakStep.jsx`
  - `src/features/generator/steps/TrophiesStep.jsx`
  - `brain/memory.md`
- Next: Await further requests.
---

### Session 57 — 2026-07-03
- Did: Created a checkpoint per the user's request. Also resolved a Vite compilation syntax error in `MarkdownRenderer.jsx` caused by a missing closing parenthesis on `React.memo()`.
- Changed:
  - `src/components/common/MarkdownRenderer.jsx`
  - `brain/memory.md`
- Next: Await further tasks or requests.
---

### Session 58 — 2026-07-20
- Did: Resolved the git merge conflict in `server/routes/generateProject.js` caused by remote Supabase cache updates vs local SQLite code, completed the merge commit, and pushed the workflow additions to `origin/main`.
- Changed:
  - `server/routes/generateProject.js`
  - `brain/memory.md`
- Next: Await user request.
---

### Session 60 — 2026-08-04 (God-Level Multi-Agent Upgrade)
- Did: Upgraded the README Forge project to God-Level status across frontend, backend, security guardrails, algorithms, and input/output:
  1. **Multi-Agent DAG Graph Orchestrator Engine:** Built stateful DAG framework (`server/services/ai/agentGraph/`) featuring 6 specialized sub-agents: Planner, Architecture Specialist (ASCII flow charts), Setup Specialist, Features Specialist, Visual Stylist, and Critique & Guardrails Agent.
  2. **PageRank File Centrality Algorithm:** Created graph importance ranking algorithm (`fileImportance.js`) to prioritize key entrypoints and imports.
  3. **Security & Input Guardrails:** Implemented secret/token scrubber, prompt injection firewall (`inputSanitizer.js`), markdown AST syntax validator, and auto-repair engine (`markdownValidator.js`).
  4. **Real-time SSE Event Stream:** Added Server-Sent Events endpoint `/api/generate/agent-stream` and connected it to the POST handler.
  5. **1-Click GitHub Export:** Added `/api/projects/export-github` endpoint and `GitHubExporter.jsx` modal to directly commit README.md to GitHub repos via OAuth.
  6. **God-Level UI Suite:** Added `AgentGraphVisualizer.jsx` (live DAG node graph & quality radar), `BadgeConfigurator.jsx` (interactive Shields.io generator), `SectionOrganizer.jsx` (modular template builder), and integrated all into `ProjectBuilder.jsx`.
  7. **Vitest Test Suite:** Added unit test suite in `tests/agentGraph/agentGraph.test.js`.
- Changed:
  - [server/services/ai/agentGraph/graphEngine.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/graphEngine.js) ← NEW
  - [server/services/ai/agentGraph/agentOrchestrator.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/agentOrchestrator.js) ← NEW
  - [server/services/ai/agentGraph/agents/plannerAgent.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/agents/plannerAgent.js) ← NEW
  - [server/services/ai/agentGraph/agents/architectureAgent.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/agents/architectureAgent.js) ← NEW
  - [server/services/ai/agentGraph/agents/setupAgent.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/agents/setupAgent.js) ← NEW
  - [server/services/ai/agentGraph/agents/featuresAgent.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/agents/featuresAgent.js) ← NEW
  - [server/services/ai/agentGraph/agents/visualAgent.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/agents/visualAgent.js) ← NEW
  - [server/services/ai/agentGraph/agents/critiqueAgent.js](file:///D:/CODE/github_readme_builder/server/services/ai/agentGraph/agents/critiqueAgent.js) ← NEW
  - [server/services/ai/algorithms/fileImportance.js](file:///D:/CODE/github_readme_builder/server/services/ai/algorithms/fileImportance.js) ← NEW
  - [server/services/ai/guardrails/inputSanitizer.js](file:///D:/CODE/github_readme_builder/server/services/ai/guardrails/inputSanitizer.js) ← NEW
  - [server/services/ai/guardrails/markdownValidator.js](file:///D:/CODE/github_readme_builder/server/services/ai/guardrails/markdownValidator.js) ← NEW
  - [src/components/agent/AgentGraphVisualizer.jsx](file:///D:/CODE/github_readme_builder/src/components/agent/AgentGraphVisualizer.jsx) ← NEW
  - [src/components/editor/BadgeConfigurator.jsx](file:///D:/CODE/github_readme_builder/src/components/editor/BadgeConfigurator.jsx) ← NEW
  - [src/components/editor/SectionOrganizer.jsx](file:///D:/CODE/github_readme_builder/src/components/editor/SectionOrganizer.jsx) ← NEW
  - [src/components/editor/GitHubExporter.jsx](file:///D:/CODE/github_readme_builder/src/components/editor/GitHubExporter.jsx) ← NEW
  - [server/routes/generateProject.js](file:///D:/CODE/github_readme_builder/server/routes/generateProject.js)
  - [server/routes/projects.js](file:///D:/CODE/github_readme_builder/server/routes/projects.js)
  - [src/app/routes/pages/ProjectBuilder.jsx](file:///D:/CODE/github_readme_builder/src/app/routes/pages/ProjectBuilder.jsx)
  - [src/components/common/ToggleSwitch.jsx](file:///D:/CODE/github_readme_builder/src/components/common/ToggleSwitch.jsx)
  - [tests/agentGraph/agentGraph.test.js](file:///D:/CODE/github_readme_builder/tests/agentGraph/agentGraph.test.js) ← NEW
  - [brain/decisions.md](file:///D:/CODE/github_readme_builder/brain/decisions.md)
  - [brain/architecture.md](file:///D:/CODE/github_readme_builder/brain/architecture.md)
  - [brain/memory.md](file:///D:/CODE/github_readme_builder/brain/memory.md)
- Next: Done! Project elevated to God-Level status.
---

