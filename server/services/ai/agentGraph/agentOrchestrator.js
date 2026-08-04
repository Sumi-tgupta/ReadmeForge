/**
 * Master Multi-Agent Orchestrator
 * Constructs the Agent Graph DAG and executes the multi-agent workflow for project README generation.
 */

import GraphEngine from './graphEngine.js';
import { calculateFileImportance } from '../algorithms/fileImportance.js';
import { sanitizeRepositoryContent } from '../guardrails/inputSanitizer.js';

import { executePlannerAgent } from './agents/plannerAgent.js';
import { executeArchitectureAgent } from './agents/architectureAgent.js';
import { executeSetupAgent } from './agents/setupAgent.js';
import { executeFeaturesAgent } from './agents/featuresAgent.js';
import { executeVisualAgent } from './agents/visualAgent.js';
import { executeCritiqueAgent } from './agents/critiqueAgent.js';

export async function runMultiAgentREADMEGraph(repositoryData, onEvent = () => {}) {
  const graph = new GraphEngine('god-level-readme-orchestrator');

  if (typeof onEvent === 'function') {
    graph.on('event', onEvent);
  }

  const meta = repositoryData.repository || repositoryData;
  const cleanRepository = {
    name: meta.name || 'Project',
    owner: meta.owner || 'user',
    fullName: meta.owner && meta.name ? `${meta.owner}/${meta.name}` : (meta.fullName || 'user/repo'),
    description: sanitizeRepositoryContent(meta.description || ''),
    license: meta.license || 'MIT',
    defaultBranch: meta.defaultBranch || 'main',
    stack: repositoryData.stack || { languages: [], frameworks: [] },
    features: repositoryData.features || [],
    commands: repositoryData.commands || { install: 'npm install', start: 'npm run dev' },
    structure: repositoryData.structure || []
  };

  const rawTree = repositoryData.tree || repositoryData.structure || [];
  const rankedFiles = calculateFileImportance(rawTree);

  const initialState = {
    repository: cleanRepository,
    rankedFiles
  };

  graph.addNode('planner', {
    name: 'Planner Agent',
    role: 'Architectural Strategist',
    execute: executePlannerAgent,
    dependencies: []
  });

  graph.addNode('architecture', {
    name: 'Architecture Specialist',
    role: 'System Architect & ASCII Specialist',
    execute: executeArchitectureAgent,
    dependencies: ['planner']
  });

  graph.addNode('setup', {
    name: 'Setup Specialist',
    role: 'DevOps & Setup Specialist',
    execute: executeSetupAgent,
    dependencies: ['planner']
  });

  graph.addNode('features', {
    name: 'Features Specialist',
    role: 'Technical Writer & API Specialist',
    execute: executeFeaturesAgent,
    dependencies: ['planner']
  });

  graph.addNode('visual', {
    name: 'Visual Stylist',
    role: 'Markdown & Shields.io Stylist',
    execute: executeVisualAgent,
    dependencies: ['architecture', 'setup', 'features']
  });

  graph.addNode('critique', {
    name: 'Critique & Quality Evaluator',
    role: 'Guardrail Auditor & Auto-Refinement Engine',
    execute: executeCritiqueAgent,
    dependencies: ['visual']
  });

  const finalState = await graph.run(initialState);
  return {
    markdown: finalState.finalMarkdown,
    qualityReport: finalState.qualityReport,
    executionLogs: graph.executionLogs
  };
}
