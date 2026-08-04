# 🚀 ReadmeForge

> **Effortlessly generate professional, high-converting README files that clearly communicate your project's value.**

![License](https://img.shields.io/badge/license-None-blue.svg?style=for-the-badge)
![Language](https://img.shields.io/badge/language-JavaScript-brightgreen.svg?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)
![Build Status](https://img.shields.io/badge/build-passing-success.svg?style=for-the-badge)

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Architecture & Tech Stack](#-architecture--tech-stack)
* [Key Features](#-key-features)
* [Quick Start](#-quick-start)
* [Technical Documentation](#-technical-documentation)
* [Contributing](#-contributing)
* [License](#-license)

---

## 📌 Overview

**ReadmeForge** is an AI-powered tool designed to help developers generate polished, structured, and impactful README files in seconds. Instead of spending hours formatting documentation, you can focus on building — while ReadmeForge handles presentation.

It combines modern frontend tooling with AI-driven content generation to deliver high-quality documentation tailored to your project.

---

## 🏗 Architecture & Tech Stack

ReadmeForge is built as a **full-stack application** with a clear separation of concerns:

### Frontend

* ⚡ **React + Vite** — Fast, modern UI development
* 🎨 Clean and responsive interface for seamless UX

### Backend

* 🟢 **Node.js + Express** — Lightweight and scalable API layer
* 🔐 JWT-based authentication system

### AI Integration

* 🤖 **Google Gemini API** — Generates structured README content

### Database

* 🗄 **SQLite** (dev) — Simple and efficient local storage

### DevOps & Tooling

* 🔄 Hot reload for fast development
* 🌐 RESTful API architecture

---

## ✨ Key Features

* 🧠 **AI-Powered README Generation**
  Generate structured README files with sections like features, setup, usage, and more.

* ⚡ **Fast & Developer-Friendly**
  Minimal setup, instant results.

* 🎯 **Customizable Output**
  Tailor README tone, sections, and formatting.

* 🔐 **Authentication Support**
  Secure login via JWT & GitHub OAuth.

* 📦 **Project-Based Organization**
  Manage multiple README drafts easily.

---

## ⚡ Quick Start

### Prerequisites

Ensure the following are installed:

* **Node.js (LTS)** → https://nodejs.org/
* **Git** → https://git-scm.com/

Verify installation:

```bash
node -v
npm -v
git --version
```

---

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Sumi-tgupta/ReadmeForge.git
cd ReadmeForge
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=sqlite:data/readme-forge.db
JWT_SECRET=your-secret
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:5173
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost:3001/api/auth/callback
```

Start backend:

```bash
npm run dev
```

Backend runs on → `http://localhost:3001`

---

### 3. Setup Frontend

```bash
cd ..
npm install
npm run dev
```

Frontend runs on → `http://localhost:5173`

---

## 📚 Technical Documentation

Explore detailed system docs:

* 🗺️ Architecture — `/docs/Architecture.md`
* 🤝 Contributing — `/docs/Contributing.md`
* 🚀 Deployment — `/docs/Deployment.md`
* 📂 Folder Structure — `/docs/FolderStructure.md`
* 📖 Developer Guide — `/docs/DeveloperGuide.md`

---

## 🤝 Contributing

Contributions are welcome.

* Fork the repo
* Create a feature branch
* Submit a pull request

Check issues:
👉 https://github.com/Sumi-tgupta/ReadmeForge/issues

---

## 📜 License

Distributed under the **None** License. See `LICENSE` for details.
