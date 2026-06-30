import { getDb } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

export const ProjectModel = {
  /**
   * Fetch all projects owned by a specific user
   */
  getUserProjects: (userId) => {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM projects
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(userId);
  },

  /**
   * Fetch a single user-owned project configuration
   */
  getProjectById: (projectId, userId) => {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM projects
      WHERE id = ? AND user_id = ?
    `).get(projectId, userId);
  },

  /**
   * Save a new project configuration
   */
  createProject: (userId, { title, builderType, builderStyle, inputData, generatedMarkdown }) => {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO projects (id, user_id, title, builder_type, builder_style, input_data, generated_markdown, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, title, builderType || 'profile', builderStyle || 'wizard', JSON.stringify(inputData), generatedMarkdown || '', now, now);

    return ProjectModel.getProjectById(id, userId);
  },

  /**
   * Update an existing project configuration
   */
  updateProject: (projectId, userId, { title, inputData, generatedMarkdown }) => {
    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE projects
      SET title = COALESCE(?, title),
          input_data = COALESCE(?, input_data),
          generated_markdown = COALESCE(?, generated_markdown),
          updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(title || null, inputData ? JSON.stringify(inputData) : null, generatedMarkdown || null, now, projectId, userId);

    return ProjectModel.getProjectById(projectId, userId);
  },

  /**
   * Toggle the favorite status of a project
   */
  toggleFavorite: (projectId, userId) => {
    const db = getDb();
    const project = ProjectModel.getProjectById(projectId, userId);
    if (!project) return null;

    const newFav = project.is_favorite === 1 ? 0 : 1;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE projects
      SET is_favorite = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(newFav, now, projectId, userId);

    return ProjectModel.getProjectById(projectId, userId);
  },

  /**
   * Duplicate a project configuration
   */
  duplicateProject: (projectId, userId) => {
    const db = getDb();
    const project = ProjectModel.getProjectById(projectId, userId);
    if (!project) return null;

    const newId = uuidv4();
    const now = new Date().toISOString();
    const newTitle = `${project.title} (Copy)`;

    db.prepare(`
      INSERT INTO projects (id, user_id, title, builder_type, builder_style, input_data, generated_markdown, is_favorite, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(newId, userId, newTitle, project.builder_type, project.builder_style, project.input_data, project.generated_markdown, now, now);

    return ProjectModel.getProjectById(newId, userId);
  },

  /**
   * Delete a project configuration
   */
  deleteProject: (projectId, userId) => {
    const db = getDb();
    db.prepare(`
      DELETE FROM projects
      WHERE id = ? AND user_id = ?
    `).run(projectId, userId);
    return true;
  }
};

export default ProjectModel;
