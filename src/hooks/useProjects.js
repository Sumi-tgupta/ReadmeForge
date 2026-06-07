/**
 * Hook for managing saved projects.
 * Phase 1: In-memory storage.
 * Phase 4: Wired to /api/projects endpoints.
 */
import { useState, useCallback } from 'react';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Phase 4: const data = await api.get('/projects');
      // setProjects(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProject = useCallback(async (project) => {
    const newProject = {
      id: crypto.randomUUID(),
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, []);

  const deleteProject = useCallback(async (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const duplicateProject = useCallback(async (id) => {
    const original = projects.find(p => p.id === id);
    if (!original) return null;
    const duplicate = {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects(prev => [duplicate, ...prev]);
    return duplicate;
  }, [projects]);

  return {
    projects,
    isLoading,
    loadProjects,
    saveProject,
    deleteProject,
    duplicateProject,
  };
}

export default useProjects;
