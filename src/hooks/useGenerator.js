import { useState, useMemo, useCallback, useEffect, createContext, useContext } from 'react';
import { INITIAL_FORM_DATA } from '../constants/formDefaults';
import { SECTION_DEFS } from '../constants/sections';

/**
 * Context for sharing generator state across the component tree.
 * Created by GeneratorProvider in EditorPage, consumed by useGenerator().
 */
export const GeneratorContext = createContext(null);

/**
 * Hook to access generator state. Must be used inside GeneratorProvider.
 */
export function useGenerator() {
  const ctx = useContext(GeneratorContext);
  if (!ctx) throw new Error('useGenerator must be used within GeneratorProvider');
  return ctx;
}

/**
 * The raw hook that creates generator state. Only called once in GeneratorProvider.
 * Manages: form data, section selection, step navigation, and AI generation.
 *
 * Generation now routes through the backend AI gateway (POST /api/generate).
 * No direct Gemini API calls — the API key lives only on the server.
 */
export function useGeneratorState(showToast) {
  // Form state
  const [formData, setFormData] = useState(() => {
    try {
      const saved = window.sessionStorage.getItem('readme_forge_form_data');
      return saved ? JSON.parse(saved) : INITIAL_FORM_DATA;
    } catch (_) {
      return INITIAL_FORM_DATA;
    }
  });
  const [selectedSections, setSelectedSections] = useState(() => {
    try {
      const saved = window.sessionStorage.getItem('readme_forge_selected_sections');
      return saved ? JSON.parse(saved) : ['about'];
    } catch (_) {
      return ['about'];
    }
  });

  // Wizard navigation
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    try {
      const saved = window.sessionStorage.getItem('readme_forge_step_index');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch (_) {
      return 0;
    }
  });
  const [expandedProject, setExpandedProject] = useState(-1);

  // Generation state
  const [generatedMarkdown, setGeneratedMarkdown] = useState(() => {
    return window.sessionStorage.getItem('readme_forge_generated_markdown') || '';
  });
  const [editMarkdown, setEditMarkdown] = useState(() => {
    return window.sessionStorage.getItem('readme_forge_edit_markdown') || '';
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Preview state
  const [previewTab, setPreviewTab] = useState(() => {
    return window.sessionStorage.getItem('readme_forge_preview_tab') || 'preview';
  });
  const [previewSubTab, setPreviewSubTab] = useState(() => {
    return window.sessionStorage.getItem('readme_forge_preview_sub_tab') || 'clean';
  });
  const [ghPreviewDark, setGhPreviewDark] = useState(() => {
    return window.sessionStorage.getItem('readme_forge_gh_preview_dark') === 'true';
  });

  // Sync state changes to sessionStorage to survive OAuth redirect
  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_form_data', JSON.stringify(formData));
    } catch (_) {}
  }, [formData]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_selected_sections', JSON.stringify(selectedSections));
    } catch (_) {}
  }, [selectedSections]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_step_index', currentStepIndex.toString());
    } catch (_) {}
  }, [currentStepIndex]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_generated_markdown', generatedMarkdown);
    } catch (_) {}
  }, [generatedMarkdown]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_edit_markdown', editMarkdown);
    } catch (_) {}
  }, [editMarkdown]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_preview_tab', previewTab);
    } catch (_) {}
  }, [previewTab]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_preview_sub_tab', previewSubTab);
    } catch (_) {}
  }, [previewSubTab]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('readme_forge_gh_preview_dark', ghPreviewDark.toString());
    } catch (_) {}
  }, [ghPreviewDark]);

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Computed steps: basic-info → section-selector → [dynamic sections] → generate
  const steps = useMemo(() => {
    const dynamic = selectedSections.filter(s =>
      SECTION_DEFS.some(d => d.key === s)
    );
    return ['basic-info', 'section-selector', ...dynamic, 'generate'];
  }, [selectedSections]);

  // Guard against step index overflow when sections change
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setCurrentStepIndex(steps.length - 1);
    }
  }, [steps.length, currentStepIndex]);

  // Current step key
  const currentStep = steps[currentStepIndex];

  // --- Form helpers ---

  const updateForm = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSocial = useCallback((platform, value) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [platform]: value },
    }));
  }, []);

  const toggleSection = useCallback((key) => {
    setSelectedSections(prev => {
      if (key === 'about') return prev; // 'about' is required
      return prev.includes(key)
        ? prev.filter(s => s !== key)
        : [...prev, key];
    });
  }, []);

  const toggleTech = useCallback((techKey) => {
    setFormData(prev => ({
      ...prev,
      selectedTechs: prev.selectedTechs.includes(techKey)
        ? prev.selectedTechs.filter(t => t !== techKey)
        : [...prev.selectedTechs, techKey],
    }));
  }, []);

  const toggleLearningTech = useCallback((techKey) => {
    setFormData(prev => ({
      ...prev,
      learningTechs: prev.learningTechs.includes(techKey)
        ? prev.learningTechs.filter(t => t !== techKey)
        : [...prev.learningTechs, techKey],
    }));
  }, []);

  // --- Navigation ---

  const canGoNext = useMemo(() => {
    if (currentStep === 'basic-info') {
      return formData.name.trim() && formData.username.trim();
    }
    return true;
  }, [currentStep, formData.name, formData.username]);

  const goNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1 && canGoNext) {
      setCurrentStepIndex(i => i + 1);
    }
  }, [currentStepIndex, steps.length, canGoNext]);

  const goBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
    }
  }, [currentStepIndex]);

  // Step label for display
  const stepLabel = useMemo(() => {
    if (currentStep === 'basic-info') return 'Basic Info';
    if (currentStep === 'section-selector') return 'Section Selector';
    if (currentStep === 'generate') return 'Generate & Preview';
    const def = SECTION_DEFS.find(d => d.key === currentStep);
    return def?.name || currentStep;
  }, [currentStep]);

  // --- Generation (via backend AI gateway) ---

  const generateReadme = useCallback(async () => {
    if (isGenerating) return; // Prevent double-clicks

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, selectedSections }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = errData.error || 'Generation failed';

        if (res.status === 409) {
          showToast('Generation already in progress. Please wait.');
        } else if (res.status === 429) {
          showToast('AI is busy. Please wait a moment and try again.');
        } else if (res.status === 400) {
          showToast(msg);
        } else {
          showToast('Generation failed. Please try again.');
        }
        return;
      }

      const data = await res.json();
      const text = data.markdown || '';

      setGeneratedMarkdown(text);
      setEditMarkdown(text);

      if (data.cached) {
        showToast('README loaded from cache (instant!)');
      } else {
        showToast('README generated successfully!');
      }
    } catch (err) {
      showToast('Cannot reach server. Is the backend running?');
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, formData, selectedSections, showToast]);

  // --- Reset ---

  const resetAll = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedSections(['about']);
    setCurrentStepIndex(0);
    setGeneratedMarkdown('');
    setEditMarkdown('');
    setConfirmReset(false);
    try {
      window.sessionStorage.removeItem('readme_forge_form_data');
      window.sessionStorage.removeItem('readme_forge_selected_sections');
      window.sessionStorage.removeItem('readme_forge_step_index');
      window.sessionStorage.removeItem('readme_forge_generated_markdown');
      window.sessionStorage.removeItem('readme_forge_edit_markdown');
      window.sessionStorage.removeItem('readme_forge_preview_tab');
      window.sessionStorage.removeItem('readme_forge_preview_sub_tab');
      window.sessionStorage.removeItem('readme_forge_gh_preview_dark');
    } catch (_) {}
    showToast('Data reset successfully');
  }, [showToast]);

  return {
    // Form
    formData,
    updateForm,
    updateSocial,
    selectedSections,
    toggleSection,
    toggleTech,
    toggleLearningTech,

    // Navigation
    steps,
    currentStepIndex,
    currentStep,
    canGoNext,
    goNext,
    goBack,
    stepLabel,

    // Generation
    generatedMarkdown,
    setGeneratedMarkdown,
    editMarkdown,
    setEditMarkdown,
    isGenerating,
    generateReadme,

    // Preview
    previewTab,
    setPreviewTab,
    previewSubTab,
    setPreviewSubTab,
    ghPreviewDark,
    setGhPreviewDark,

    // Projects step
    expandedProject,
    setExpandedProject,

    // Settings
    settingsOpen,
    setSettingsOpen,
    confirmReset,
    setConfirmReset,
    resetAll,
  };
}

export default useGenerator;


