import { getDb } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

export const UserModel = {
  /**
   * Find a user by their unique GitHub account ID
   */
  findByGithubId: (githubId) => {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId);
  },

  /**
   * Find a user by their internal UUID
   */
  findById: (id) => {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  /**
   * Insert a newly authenticated GitHub user or update their login parameters
   */
  upsertGithubUser: (githubProfile) => {
    const db = getDb();
    const existing = UserModel.findByGithubId(githubProfile.id.toString());

    const now = new Date().toISOString();
    const displayName = githubProfile.name || githubProfile.login;
    const profileUrl = githubProfile.html_url || `https://github.com/${githubProfile.login}`;

    if (existing) {
      // Update profile info & last login
      db.prepare(`
        UPDATE users
        SET display_name = ?, username = ?, email = ?, avatar_url = ?, profile_url = ?, last_login = ?
        WHERE id = ?
      `).run(
        displayName,
        githubProfile.login,
        githubProfile.email || null,
        githubProfile.avatar_url,
        profileUrl,
        now,
        existing.id
      );

      return UserModel.findById(existing.id);
    } else {
      // Create new user profile
      const newId = uuidv4();
      db.prepare(`
        INSERT INTO users (id, github_id, username, display_name, email, avatar_url, profile_url, plan, credits, credits_reset_at, role, created_at, last_login)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 20, ?, ?, ?, ?)
      `).run(
        newId,
        githubProfile.id.toString(),
        githubProfile.login,
        displayName,
        githubProfile.email || null,
        githubProfile.avatar_url,
        profileUrl,
        'free', // Default plan
        now, // Reset credits immediately
        'user', // Default role
        now,
        now
      );

      return UserModel.findById(newId);
    }
  }
};

export default UserModel;
