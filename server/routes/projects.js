import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All project routes require auth
router.use(authMiddleware);

/**
 * GET /api/projects — List user's projects.
 */
router.get('/', (req, res) => {
  const db = getDb();
  const projects = db.prepare(
    'SELECT id, title, template, is_favorite, created_at, updated_at FROM projects WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(req.user.id);
  res.json(projects);
});

/**
 * GET /api/projects/:id — Get a single project with full data.
 */
router.get('/:id', (req, res) => {
  const db = getDb();
  const project = db.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!project) return res.status(404).json({ error: 'Project not found' });

  // Parse JSON stored data
  project.input_data = JSON.parse(project.input_data || '{}');
  res.json(project);
});

/**
 * POST /api/projects — Create a new project.
 */
router.post('/', (req, res) => {
  const { title, inputData, generatedMarkdown, template } = req.body;
  const id = uuidv4();
  const now = new Date().toISOString();
  const db = getDb();

  db.prepare(`
    INSERT INTO projects (id, user_id, title, input_data, generated_markdown, template, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, title || 'Untitled', JSON.stringify(inputData || {}), generatedMarkdown || '', template || 'developer', now, now);

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  project.input_data = JSON.parse(project.input_data || '{}');
  res.status(201).json(project);
});

/**
 * PUT /api/projects/:id — Update a project.
 */
router.put('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const { title, inputData, generatedMarkdown, template, isFavorite } = req.body;
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE projects
    SET title = COALESCE(?, title),
        input_data = COALESCE(?, input_data),
        generated_markdown = COALESCE(?, generated_markdown),
        template = COALESCE(?, template),
        is_favorite = COALESCE(?, is_favorite),
        updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(
    title || null,
    inputData ? JSON.stringify(inputData) : null,
    generatedMarkdown || null,
    template || null,
    isFavorite != null ? (isFavorite ? 1 : 0) : null,
    now,
    req.params.id,
    req.user.id
  );

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  project.input_data = JSON.parse(project.input_data || '{}');
  res.json(project);
});

/**
 * DELETE /api/projects/:id — Delete a project.
 */
router.delete('/:id', (req, res) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

export default router;
