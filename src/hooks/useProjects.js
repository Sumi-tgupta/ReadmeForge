/**
 * Hook for managing saved projects via backend APIs.
 */
import { useState, useCallback } from 'react';
import { authApi } from '../services/authApi';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await authApi.getProjects();
      setProjects(data);
      return data;
    } catch (_) {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProject = useCallback(async (project) => {
    setIsLoading(true);
    try {
      let result;
      if (project.id) {
        result = await authApi.updateProject(project.id, project);
      } else {
        result = await authApi.createProject(project);
      }
      await loadProjects();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [loadProjects]);

  const deleteProject = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await authApi.deleteProject(id);
      await loadProjects();
    } finally {
      setIsLoading(false);
    }
  }, [loadProjects]);

  const duplicateProject = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const duplicate = await authApi.duplicateProject(id);
      await loadProjects();
      return duplicate;
    } finally {
      setIsLoading(false);
    }
  }, [loadProjects]);

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
