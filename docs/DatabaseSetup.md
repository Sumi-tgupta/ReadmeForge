# 🗄️ Production Database Configuration Guide

For a production SaaS, selecting and configuring the right database architecture is critical. README Forge is configured out-of-the-box with SQLite (`better-sqlite3`). Below is a guide on how to configure and run SQLite persistently in production, as well as how to migrate to PostgreSQL.

---

## Option 1: SQLite with Persistent Disk Volumes (Recommended)
Since the codebase relies on synchronous SQL queries (for extreme efficiency and query speeds), using **SQLite** with a **Persistent Disk Volume** is the fastest, most reliable deployment strategy on hosting platforms like Render or Fly.io.

### How it works:
Normally, Render Web Services run on ephemeral containers: when the server restarts or redeploys, all local database files are deleted. By attaching a **Render Persistent Disk**, the database file is stored on a dedicated SSD volume that survives restarts, spins, and updates.

### Step-by-Step Render Setup:
1. Open your **Render Dashboard** and select your Web Service.
2. Under the service navigation, go to **Disks**.
3. Click **Add Disk**:
   - **Name**: `readme-forge-db-vol`
   - **Mount Path**: `/app/server/data`
   - **Size**: `1 GB` (More than enough for millions of users and projects)
4. Go to **Environment Variables** and verify or update the variables:
   - `DATABASE_URL`: `sqlite:/app/server/data/readme-forge.db`
5. Save changes. Render will restart the service and mount the volume. The database will now persist permanently across deployments.

---

## Option 2: Migrating to PostgreSQL
If your production scale requires multiple backend instances (horizontal auto-scaling), you must migrate from a single-file SQLite database to a centralized **PostgreSQL** service.

Because SQLite uses **synchronous** queries (`db.prepare().get()`) and PostgreSQL requires **asynchronous** queries (`await client.query()`), the model layer must be refactored.

### Step-by-Step PostgreSQL Implementation:

#### 1. Setup a Managed Database
Provision a database on **Supabase**, **Render PostgreSQL**, or **Neon Tech**. Get your connection string:
```
postgresql://user:password@hostname:5432/readme_forge
```

#### 2. Install Drivers
Install `pg` in the server project:
```bash
cd server
npm install pg
```

#### 3. Update Database Connection (`server/db/connection.js`)
Refactor the connection manager to export both PostgreSQL and SQLite compatibility modes:

```javascript
import pg from 'pg';
import Database from 'better-sqlite3';

let pgPool = null;
let sqliteDb = null;
const isPostgres = process.env.DATABASE_URL?.startsWith('postgres');

export async function initDb() {
  if (isPostgres) {
    pgPool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    console.log('[Database] PostgreSQL Pool Initialized');
  } else {
    // SQLite Fallback
    sqliteDb = new Database(process.env.DATABASE_URL?.replace('sqlite:', '') || './data/readme-forge.db');
    sqliteDb.pragma('journal_mode = WAL');
    console.log('[Database] SQLite Initialized');
  }
}
```

#### 4. Model Conversion Example (`server/models/User.js`)
Convert the schema query layer from synchronous statements to async/await pools:

*Before (SQLite):*
```javascript
export function findByGithubId(githubId) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId);
}
```

*After (PostgreSQL Compatibility):*
```javascript
export async function findByGithubId(githubId) {
  if (isPostgres) {
    const res = await pgPool.query('SELECT * FROM users WHERE github_id = $1', [githubId]);
    return res.rows[0];
  } else {
    return sqliteDb.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId);
  }
}
```
