import { getDb } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to format PostgreSQL row to match SQLite outputs
function formatProjectRow(row) {
  if (!row) return null;
  return {
    ...row,
    input_data: row.input_data ? (typeof row.input_data === 'object' ? JSON.stringify(row.input_data) : row.input_data) : '{}',
    is_favorite: row.is_favorite ? 1 : 0
  };
}

export const ProjectModel = {
  /**
   * Fetch all projects owned by a specific user
   */
  getUserProjects: async (userId) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[ProjectModel] getUserProjects error:', error.message);
      return [];
    }
    return (data || []).map(formatProjectRow);
  },

  /**
   * Fetch a single user-owned project configuration
   */
  getProjectById: async (projectId, userId) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[ProjectModel] getProjectById error:', error.message);
      return null;
    }
    return formatProjectRow(data);
  },

  /**
   * Save a new project configuration
   */
  createProject: async (userId, { title, builderType, builderStyle, inputData, generatedMarkdown }) => {
    const supabase = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('projects')
      .insert({
        id,
        user_id: userId,
        title,
        builder_type: builderType || 'profile',
        builder_style: builderStyle || 'wizard',
        input_data: inputData || {},
        generated_markdown: generatedMarkdown || '',
        is_favorite: false,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      console.error('[ProjectModel] createProject error:', error.message);
      throw error;
    }
    return formatProjectRow(data);
  },

  /**
   * Update an existing project configuration
   */
  updateProject: async (projectId, userId, { title, inputData, generatedMarkdown }) => {
    const supabase = getDb();
    const now = new Date().toISOString();

    const updates = { updated_at: now };
    if (title !== undefined) updates.title = title;
    if (inputData !== undefined) updates.input_data = inputData;
    if (generatedMarkdown !== undefined) updates.generated_markdown = generatedMarkdown;

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[ProjectModel] updateProject error:', error.message);
      return null;
    }
    return formatProjectRow(data);
  },

  /**
   * Toggle the favorite status of a project
   */
  toggleFavorite: async (projectId, userId) => {
    const project = await ProjectModel.getProjectById(projectId, userId);
    if (!project) return null;

    const supabase = getDb();
    const newFav = !project.is_favorite;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('projects')
      .update({
        is_favorite: newFav,
        updated_at: now
      })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('[ProjectModel] toggleFavorite error:', error.message);
      return null;
    }
    return formatProjectRow(data);
  },

  /**
   * Duplicate a project configuration
   */
  duplicateProject: async (projectId, userId) => {
    const project = await ProjectModel.getProjectById(projectId, userId);
    if (!project) return null;

    const supabase = getDb();
    const newId = uuidv4();
    const now = new Date().toISOString();
    const newTitle = `${project.title} (Copy)`;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        id: newId,
        user_id: userId,
        title: newTitle,
        builder_type: project.builder_type,
        builder_style: project.builder_style,
        input_data: project.input_data ? JSON.parse(project.input_data) : {},
        generated_markdown: project.generated_markdown,
        is_favorite: false,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      console.error('[ProjectModel] duplicateProject error:', error.message);
      return null;
    }
    return formatProjectRow(data);
  },

  /**
   * Delete a project configuration
   */
  deleteProject: async (projectId, userId) => {
    const supabase = getDb();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.error('[ProjectModel] deleteProject error:', error.message);
      return false;
    }
    return true;
  }
};

export default ProjectModel;
