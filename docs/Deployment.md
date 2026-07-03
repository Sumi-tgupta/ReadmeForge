# 🚀 Deployment Guide

README Forge is structured to deploy the frontend on **Vercel** and the backend API Gateway on **Render** (or Fly.io).

## Frontend Deployment (Vercel)
The root directory contains `vercel.json` which maps routing rewrites for proxies.

1. Import the root folder `github_readme_builder` on Vercel.
2. Select **Vite** preset.
3. Keep the default Build Command (`npm run build`) and Output Directory (`dist`).
4. Vercel automatically sets up HTTPS/SSL certificate.

---

## Backend Deployment (Render)
The backend runs from the `server/` subdirectory.

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure the following build options:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node index.js`)
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
   - `CORS_ORIGIN`: `https://your-frontend-app.vercel.app`
   - `GITHUB_CLIENT_ID`: `(production client id)`
   - `GITHUB_CLIENT_SECRET`: `(production secret)`
   - `GITHUB_REDIRECT_URI`: `https://your-frontend-app.vercel.app/api/auth/callback`
   - `GEMINI_API_KEY`: `(your Google Gemini API Key)`
   - `JWT_SECRET`: `(secure random string)`
