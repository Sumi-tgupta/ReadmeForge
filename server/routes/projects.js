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
router.get('/', async (req, res, next) => {
  try {
    const projects = await ProjectModel.getUserProjects(req.user.id);
    
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
router.get('/:id', async (req, res, next) => {
  try {
    const project = await ProjectModel.getProjectById(req.params.id, req.user.id);
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
router.post('/', async (req, res, next) => {
  try {
    const { title, builderType, builderStyle, inputData, generatedMarkdown } = req.body;

    const project = await ProjectModel.createProject(req.user.id, {
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
router.put('/:id', async (req, res, next) => {
  try {
    const { title, inputData, generatedMarkdown } = req.body;

    const project = await ProjectModel.updateProject(req.params.id, req.user.id, {
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
router.post('/:id/favorite', async (req, res, next) => {
  try {
    const project = await ProjectModel.toggleFavorite(req.params.id, req.user.id);
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
router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const project = await ProjectModel.duplicateProject(req.params.id, req.user.id);
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
 * POST /api/projects/export-github
 * Commits generated README directly to user's GitHub repository via GitHub REST API.
 */
router.post('/export-github', async (req, res, next) => {
  try {
    const { repoOwner, repoName, markdown, branch = 'main', commitMessage = 'docs: update README via README Forge' } = req.body;

    if (!repoOwner || !repoName || !markdown) {
      return res.status(400).json({ error: 'Missing required parameters: repoOwner, repoName, and markdown' });
    }

    const githubToken = req.user?.access_token || process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return res.status(401).json({ error: 'GitHub OAuth token required to commit directly to repository.' });
    }

    // 1. Get current README SHA if exists (for updating existing file)
    let fileSha = null;
    try {
      const getFileRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/README.md?ref=${branch}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'README-Forge'
        }
      });
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        fileSha = fileData.sha;
      }
    } catch (e) {
      // File doesn't exist yet, fileSha remains null
    }

    // 2. Put / Commit README.md
    const commitBody = {
      message: commitMessage,
      content: Buffer.from(markdown).toString('base64'),
      branch
    };
    if (fileSha) {
      commitBody.sha = fileSha;
    }

    const commitRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/README.md`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'README-Forge'
      },
      body: JSON.stringify(commitBody)
    });

    if (!commitRes.ok) {
      const errText = await commitRes.text();
      return res.status(commitRes.status).json({ error: `GitHub API error: ${errText}` });
    }

    const commitResult = await commitRes.json();
    return res.json({
      success: true,
      commitUrl: commitResult.commit?.html_url || `https://github.com/${repoOwner}/${repoName}`,
      message: 'README successfully committed to GitHub repository!'
    });

  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/projects/:id
 * Remove a project
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await ProjectModel.deleteProject(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

