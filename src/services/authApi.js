/**
 * API client services for Auth and Saved Projects CRUD operations.
 */

export const authApi = {
  /**
   * Request GitHub OAuth Authorization URL
   */
  getLoginUrl: async (redirectPath = '/') => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirect: redirectPath })
    });
    if (!res.ok) throw new Error('Failed to get login URL');
    return res.json(); // returns { url }
  },

  /**
   * Fetch current authenticated user session details
   */
  getCurrentUser: async () => {
    const resAuth = await fetch('/api/auth/me');
    if (!resAuth.ok) return { user: null };
    return resAuth.json(); // returns { user }
  },

  /**
   * Terminate active user session
   */
  logout: async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
  },

  /**
   * Check session status
   */
  getStatus: async () => {
    const res = await fetch('/api/auth/status');
    if (!res.ok) return { authenticated: false, user: null };
    return res.json();
  },

  // --- PROJECTS CRUD ---

  /**
   * List all user projects
   */
  getProjects: async () => {
    const res = await fetch('/api/projects');
    if (!res.ok) {
      if (res.status === 401) throw new Error('Unauthorized');
      throw new Error('Failed to load projects');
    }
    return res.json();
  },

  /**
   * Fetch a single project config
   */
  getProject: async (id) => {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) throw new Error('Failed to load project details');
    return res.json();
  },

  /**
   * Save a new project
   */
  createProject: async (projectData) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to save project');
    return res.json();
  },

  /**
   * Update an existing project
   */
  updateProject: async (id, projectData) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  /**
   * Toggle favorite flag on a project
   */
  toggleFavorite: async (id) => {
    const res = await fetch(`/api/projects/${id}/favorite`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to favorite project');
    return res.json();
  },

  /**
   * Duplicate a project configuration
   */
  duplicateProject: async (id) => {
    const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to duplicate project');
    return res.json();
  },

  /**
   * Delete a project
   */
  deleteProject: async (id) => {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  }
};

export default authApi;
