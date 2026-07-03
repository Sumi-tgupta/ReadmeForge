# 📂 Project Folder Structure

A map of the application directory structure:

```
github_readme_builder/
├── dist/                          # Production built static assets
├── docs/                          # Developer reference documentation
├── public/                        # Public static resources (favicons, logos)
├── src/                           # Frontend Client Application
│   ├── app/                       # Global setups, routes, and configs
│   │   ├── config/                # Feature flags, constants, and parameters
│   │   ├── providers/             # Theme, Auth, and Toast Providers
│   │   └── routes/                # Client pages (Home, Builder, Settings, Dashboard)
│   ├── components/                # Modular client elements
│   │   ├── common/                # UI primitives (Buttons, Search, Modals, EmptyStates)
│   │   ├── conversation/          # Conversational Guided Chat Builder UI
│   │   └── editor/                # Layout Wizard panels (TopBar, BottomBar)
│   ├── constants/                 # Wizard steps metadata
│   ├── features/                  # Engagement features (Auth modals, forms)
│   ├── hooks/                     # Custom business logic React Hooks
│   ├── services/                  # Network API request layer
│   └── utils/                     # Formatting utilities, logger, helper functions
│
├── server/                        # Backend API Service
│   ├── auth/                      # GitHub OAuth strategies and fallbacks
│   ├── data/                      # Persistent SQLite Database storage files
│   ├── db/                        # Migrations and SQLite connections
│   ├── middleware/                # Rate limiters and session verification
│   ├── models/                    # DB access layer (Users, Projects, Cache)
│   ├── routes/                    # API Endpoints (/api/auth, /api/generate)
│   ├── services/                  # Business logic services (caching, queue, router)
│   └── utils/                     # Secure hashes and logs
│
├── tests/                         # Test suites
│   ├── common/                # Shared Component unit tests
│   └── e2e/                       # Playwright integration tests
```
