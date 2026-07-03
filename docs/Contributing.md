# 🤝 Contributing Guide

We welcome contributions to README Forge! Follow these guidelines to set up and run the workspace.

## Setup Requirements
1. **Node.js**: v18+ installed.
2. **Git**: Installed for version control.

## Installation & Dev Server
1. Clone the repository and navigate to the project directory:
   ```bash
   cd github_readme_builder
   ```
2. Install dependencies for the frontend and backend:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```
3. Run the development environment:
   - Starts Vite frontend: `npm run dev` (runs on `http://localhost:5173`)
   - Starts Express backend: `cd server && npm run dev` (runs on `http://localhost:3001`)

## Coding Standards & Pull Requests
- **Components**: Place reusable visual elements under `src/components/common/`. Always use Tailwind CSS utilities and inherit theme designs using `useTheme()`.
- **Naming Conventions**: PascalCase for React component files, camelCase for JavaScript utilities, hooks, routes, and services.
- **Git style logs**: Keep pull requests tidy. Ensure the build passes (`npm run build`) before making PR requests.
