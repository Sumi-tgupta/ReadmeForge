# 📖 Developer Guide

Welcome to the README Forge Developer Guide! This guide details state management patterns, the AI Gateway pipeline, and adding new features.

## 1. State Management Pattern
All state logic for the step-by-step profile generator is contained within `src/hooks/useGenerator.js`. 
- **GeneratorContext**: Exposes active selections, loaded templates, and progressive steps.
- **TopBar / BottomBar**: Listen to context modifications to navigate.
- **Login Resumption**: When a user attempts to save a project without being logged in, `executeWithAuth` suspends progress, opens the Auth modal, and resumes project creation seamlessly after successful login callback.

---

## 2. AI Generation Pipeline
The backend AI Generation pipeline under `server/services/ai/` consists of:

```
Request ──> cache.js (SHA-256 Hit?) ──(Yes)──> Return Cached Markdown
             │
            (No)
             ▼
          requestQueue.js (Deduplicate)
             │
             ▼
          promptOptimizer.js (Stripping spaces)
             │
             ▼
          modelRouter.js (Fallback chain: lite -> flash -> flash-3.5)
```

---

## 3. Adding a New Feature (e.g. Wiki Generator)
To add a new AI-powered document tool in the future without major architectural rewrites:

1. **Feature Flag**: Enable the tool inside [src/app/config/featureFlags.js](file:///D:/CODE/github_readme_builder/src/app/config/featureFlags.js):
   ```javascript
   wikiGenerator: true,
   ```
2. **Add Route**: Map a new route in [src/app/App.jsx](file:///D:/CODE/github_readme_builder/src/app/App.jsx) pointing to a lazy loaded component:
   ```javascript
   const WikiBuilder = lazy(() => import('./routes/pages/WikiBuilder'));
   ```
3. **Register Backend Endpoint**: Add your route inside `server/routes/` and hook it into `server/index.js`.
