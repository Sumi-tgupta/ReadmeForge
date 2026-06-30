import { Router } from 'express';
import { ProjectModel } from '../models/Project.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Secure all project endpoints with session authentication
router.use(authMiddleware);

/**
 * GET /api/projects
 * List all projects owned by the authenticated user
 */
router.get('/', (req, res, next) => {
  try {
    const projects = ProjectModel.getUserProjects(req.user.id);
    
    // Parse input_data for each project for client convenience
    const parsed = projects.map(p => ({
      ...p,
      input_data: JSON.parse(p.input_data || '{}')
    }));

    res.json(parsed);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/projects/:id
 * Retrieve a single user-owned project
 */
router.get('/:id', (req, res, next) => {
  try {
    const project = ProjectModel.getProjectById(req.params.id, req.user.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.input_data = JSON.parse(project.input_data || '{}');
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/projects
 * Save a new project configuration
 */
router.post('/', (req, res, next) => {
  try {
    const { title, builderType, builderStyle, inputData, generatedMarkdown } = req.body;

    const project = ProjectModel.createProject(req.user.id, {
      title: title || 'Untitled Project',
      builderType,
      builderStyle,
      inputData: inputData || {},
      generatedMarkdown: generatedMarkdown || ''
    });

    project.input_data = JSON.parse(project.input_data || '{}');
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/projects/:id
 * Update an existing project configuration
 */
router.put('/:id', (req, res, next) => {
  try {
    const { title, inputData, generatedMarkdown } = req.body;

    const project = ProjectModel.updateProject(req.params.id, req.user.id, {
      title,
      inputData,
      generatedMarkdown
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    project.input_data = JSON.parse(project.input_data || '{}');
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/projects/:id/favorite
 * Toggle project favorite status
 */
router.post('/:id/favorite', (req, res, next) => {
  try {
    const project = ProjectModel.toggleFavorite(req.params.id, req.user.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    project.input_data = JSON.parse(project.input_data || '{}');
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/projects/:id/duplicate
 * Duplicate project
 */
router.post('/:id/duplicate', (req, res, next) => {
  try {
    const project = ProjectModel.duplicateProject(req.params.id, req.user.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    project.input_data = JSON.parse(project.input_data || '{}');
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/projects/:id
 * Remove a project
 */
router.delete('/:id', (req, res, next) => {
  try {
    const deleted = ProjectModel.deleteProject(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
