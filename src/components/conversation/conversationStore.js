import { useState, useEffect, useCallback, useRef } from 'react';
import { useGenerator } from '../../hooks/useGenerator';
import { conversationCache } from './conversationCache';
import { ConversationEngine } from './conversationEngine';
import { PROFILE_QUESTIONS, PROJECT_QUESTIONS } from './questionRegistry';

/**
 * Hook to manage conversation state, messages, caching, and navigation command actions.
 * Integrates directly with the parent useGenerator form state.
 */
export function useConversationStore(builderType = 'profile') {
  let generatorContext = null;
  try {
    generatorContext = useGenerator();
  } catch (e) {
    // Context is not available (e.g., in ProjectBuilder)
  }

  const [localFormData, setLocalFormData] = useState({
    name: '',
    username: '',
    tagline: '',
    location: '',
    email: '',
    website: '',
    tone: 'Professional',
    avatarStyle: 'github-avatar',
    bio: '',
    pronouns: '',
    currentFocus: '',
    funFact: '',
    openToWork: false,
    badgeStyle: 'skillicons',
    selectedTechs: [],
    learningTechs: [],
    learningGoal: '',
    projects: [],
    experiences: [],
    educationEntries: [],
    statsTheme: 'default',
    showStatsCard: true,
    showContribGraph: true,
    customTitle: '',
    customContent: '',
    visitorStyle: 'badge',
    social: {
      linkedin: '', twitter: '', instagram: '', youtube: '',
      discord: '', devto: '', hashnode: '', medium: '',
      leetcode: '', hackerrank: '', codepen: '', dribbble: '',
      behance: '', portfolio: '', email: '', buymeacoffee: '',
      kofi: '', patreon: '',
    }
  });

  const generator = generatorContext || {
    formData: localFormData,
    updateForm: (key, val) => setLocalFormData(prev => ({ ...prev, [key]: val })),
    updateSocial: (platform, val) => setLocalFormData(prev => ({
      ...prev,
      social: { ...prev.social, [platform]: val }
    })),
    toggleTech: (techKey) => setLocalFormData(prev => ({
      ...prev,
      selectedTechs: prev.selectedTechs.includes(techKey)
        ? prev.selectedTechs.filter(t => t !== techKey)
        : [...prev.selectedTechs, techKey]
    })),
    toggleLearningTech: (techKey) => setLocalFormData(prev => ({
      ...prev,
      learningTechs: prev.learningTechs.includes(techKey)
        ? prev.learningTechs.filter(t => t !== techKey)
        : [...prev.learningTechs, techKey]
    })),
    generateReadme: async () => {}
  };

  const { formData, updateForm, updateSocial, toggleTech, toggleLearningTech } = generator;

  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [historyPath, setHistoryPath] = useState([]);
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  // Initialize the engine
  const engineRef = useRef(
    new ConversationEngine(
      builderType === 'profile' ? PROFILE_QUESTIONS : PROJECT_QUESTIONS,
      builderType
    )
  );
  const engine = engineRef.current;

  // Generate a greeting based on time of day
  const getGreeting = useCallback(() => {
    const hours = new Date().getHours();
    let timeGreeting = 'Good evening';
    if (hours < 12) timeGreeting = 'Good morning';
    else if (hours < 18) timeGreeting = 'Good afternoon';

    const name = formData.name || '';
    const namePart = name ? `, ${name.split(' ')[0]}` : '';
    if (builderType === 'project') {
      return `${timeGreeting}${namePart}. Let's scan your repository and build a premium README.md together.`;
    }
    return `${timeGreeting}${namePart}. Let's create something you're proud to showcase.`;
  }, [formData.name, builderType]);

  // Save current conversation session to sessionStorage cache
  const saveToCache = useCallback((updatedMessages, updatedQuestionId, updatedPath) => {
    conversationCache.saveSession(builderType, {
      messages: updatedMessages,
      currentQuestionId: updatedQuestionId,
      historyPath: updatedPath,
      formData: generator.formData,
    });
  }, [builderType, generator.formData]);

  // Load and restore a cached session
  const restoreSession = useCallback(() => {
    const cached = conversationCache.loadSession(builderType);
    if (cached) {
      setCurrentQuestionId(cached.currentQuestionId);
      setMessages(cached.messages);
      setHistoryPath(cached.historyPath || []);
      
      // Sync form fields from cache
      if (cached.formData) {
        Object.entries(cached.formData).forEach(([key, val]) => {
          if (key === 'social') {
            Object.entries(val).forEach(([p, v]) => updateSocial(p, v));
          } else {
            updateForm(key, val);
          }
        });
      }
      setShowResumeDialog(false);
    }
  }, [builderType, updateForm, updateSocial]);

  // Discard cached session and reset
  const discardSession = useCallback(() => {
    conversationCache.clearSession(builderType);
    setShowResumeDialog(false);
    startFreshConversation();
  }, [builderType]);

  // Check if cache exists on mount
  useEffect(() => {
    if (conversationCache.hasSession(builderType)) {
      setShowResumeDialog(true);
    } else {
      startFreshConversation();
    }
  }, [builderType]);

  const startFreshConversation = () => {
    const greetingText = getGreeting();
    const initialMsg = {
      id: 'greeting',
      sender: 'assistant',
      text: greetingText,
      timestamp: Date.now(),
      isGreeting: true,
    };
    if (builderType === 'project') {
      setMessages([
        initialMsg,
        {
          id: 'assistant_repoUrl_start',
          sender: 'assistant',
          text: 'What is the URL of the public GitHub repository you want to scan?',
          questionId: 'repoUrl',
          timestamp: Date.now(),
        }
      ]);
      setCurrentQuestionId('repoUrl');
      setHistoryPath(['repoUrl']);
    } else {
      setMessages([initialMsg]);
      setCurrentQuestionId(null);
      setHistoryPath([]);
    }
  };

  // Helper: Append a message to local state and trigger cache save
  const appendMessage = useCallback((msg, nextQId = currentQuestionId, path = historyPath) => {
    setMessages(prev => {
      const nextMsgs = [...prev, msg];
      saveToCache(nextMsgs, nextQId, path);
      return nextMsgs;
    });
  }, [currentQuestionId, historyPath, saveToCache]);

  // Initiate a conversation step (moves to a specific question)
  const askQuestion = useCallback((questionId, prefilledUserMsg = null) => {
    setIsTyping(true);
    const question = engine.getQuestion(questionId);

    // Simulate typing delay 300-700ms for premium natural UX (no AI)
    const delay = 300 + Math.random() * 400;

    setTimeout(() => {
      setIsTyping(false);
      
      const newMessages = [];
      if (prefilledUserMsg) {
        newMessages.push(prefilledUserMsg);
      }

      newMessages.push({
        id: `assistant_${questionId}_${Date.now()}`,
        sender: 'assistant',
        text: question.description || question.label,
        questionId: questionId,
        timestamp: Date.now(),
      });

      setMessages(prev => {
        const nextMsgs = [...prev, ...newMessages];
        saveToCache(nextMsgs, questionId, [...historyPath, questionId]);
        return nextMsgs;
      });
      
      setCurrentQuestionId(questionId);
      setHistoryPath(prev => [...prev, questionId]);
    }, delay);
  }, [engine, historyPath, saveToCache]);

  // Handle command keywords (/back, /skip, /edit, etc.)
  const handleCommand = useCallback((commandText) => {
    const cmd = commandText.trim().toLowerCase();
    
    if (cmd === '/back') {
      if (historyPath.length <= 1) {
        startFreshConversation();
        return true;
      }
      const prevPath = [...historyPath];
      prevPath.pop(); // Remove current
      const prevId = prevPath[prevPath.length - 1];
      
      setHistoryPath(prevPath);
      setCurrentQuestionId(prevId);
      appendMessage({
        id: `cmd_back_${Date.now()}`,
        sender: 'user',
        text: 'Going back...',
        isCommand: true,
      }, prevId, prevPath);
      return true;
    }

    if (cmd === '/skip') {
      const currentQ = engine.getQuestion(currentQuestionId);
      if (currentQ && !currentQ.required) {
        const nextQId = engine.getNextQuestionId(currentQuestionId, generator.formData);
        
        appendMessage({
          id: `cmd_skip_${Date.now()}`,
          sender: 'user',
          text: 'Skipping...',
          isCommand: true,
        });

        if (nextQId && nextQId !== 'done') {
          askQuestion(nextQId);
        } else {
          // Go to preview / review
          askQuestion('review');
        }
        return true;
      }
      return false;
    }

    if (cmd === '/restart') {
      appendMessage({
        id: `cmd_restart_${Date.now()}`,
        sender: 'user',
        text: 'Restarting conversation...',
        isCommand: true,
      });
      discardSession();
      return true;
    }

    return false;
  }, [historyPath, currentQuestionId, engine, generator.formData, askQuestion, appendMessage, discardSession]);

  // Submit user response
  const submitAnswer = useCallback((value, formattedLabel = null) => {
    if (!currentQuestionId) return;

    const question = engine.getQuestion(currentQuestionId);
    if (!question) return;

    // Run validator
    if (question.validator) {
      const validationError = question.validator(value, generator.formData);
      if (validationError !== true) {
        // Render a friendly error response from assistant
        appendMessage({
          id: `error_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ ${validationError}`,
          isError: true,
          timestamp: Date.now()
        });
        return;
      }
    }

    // Save directly to parent form state
    if (question.id === 'selectedTechs') {
      // Tech stack saves separately via selectedTechs array
      // State is already updated live in the picker component
    } else if (question.id === 'learningTechs') {
      // Learning techs are also updated live in component
    } else if (question.id === 'social_links') {
      // Social links are updated in real-time
    } else {
      updateForm(question.id, value);
    }

    // Add user answer bubble to message log
    const userMsg = {
      id: `user_${question.id}_${Date.now()}`,
      sender: 'user',
      text: formattedLabel || (typeof value === 'string' ? value : JSON.stringify(value)),
      timestamp: Date.now()
    };

    const nextQId = engine.getNextQuestionId(currentQuestionId, {
      ...generator.formData,
      [question.id]: value
    });

    if (nextQId && nextQId !== 'done') {
      askQuestion(nextQId, userMsg);
    } else {
      // End of questions, go to review mode
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => {
          const nextMsgs = [...prev, userMsg, {
            id: `assistant_review_${Date.now()}`,
            sender: 'assistant',
            text: 'Everything looks good! Here is a summary of your profile. Click "Generate" to create your README.',
            questionId: 'review',
            timestamp: Date.now()
          }];
          saveToCache(nextMsgs, 'review', [...historyPath, 'review']);
          return nextMsgs;
        });
        setCurrentQuestionId('review');
        setHistoryPath(prev => [...prev, 'review']);
      }, 500);
    }
  }, [currentQuestionId, engine, generator.formData, updateForm, askQuestion, appendMessage, saveToCache, historyPath]);

  return {
    ...generator,
    messages,
    currentQuestionId,
    isTyping,
    historyPath,
    showResumeDialog,
    restoreSession,
    discardSession,
    startConversation: () => askQuestion('name'),
    submitAnswer,
    handleCommand,
    progress: currentQuestionId ? engine.getProgress(currentQuestionId, generator.formData) : { percentage: 0, current: 0, total: 1, remaining: 1, estimatedTimeStr: '' }
  };
}
