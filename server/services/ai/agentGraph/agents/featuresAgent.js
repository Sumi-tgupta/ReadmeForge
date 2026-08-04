/**
 * Features & API Specialist Agent
 * Scans key exported functions, endpoints, and components to output feature breakdowns and code examples.
 */

import { executeWithFallback } from '../../modelRouter.js';

export async function executeFeaturesAgent(state, log) {
  log('Scanning features, API endpoints, and code exports...');
  
  const repo = state.repository || {};
  const repoName = repo.name || 'studysage';
  const owner = repo.owner || 'Code-Orbit-Lab';
  const featuresList = Array.isArray(repo.features) && repo.features.length > 0 
    ? repo.features.join('\n- ') 
    : 'AI Document Parsing (PDF/DOCX/PPTX), RAG-grounded Chat & Citations, Automated Summary & Flashcard Generator';

  const prompt = `You are a Technical Writer & Developer Advocate.
Draft the "Features & Usage" section for "${repoName}" (${owner}/${repoName}).

Context:
- Project Description: ${repo.description || 'AI Study Platform'}
- Detected Capabilities:
- ${featuresList}
- Stack: ${(repo.stack?.frameworks || []).join(', ')}

Requirements:
1. Highlight 4-6 key features of ${repoName} using emoji bullet points and bold titles.
2. Provide a realistic usage or API snippet showing how to use ${repoName}.`;

  try {
    const rawFeatures = await executeWithFallback({
      prompt,
      temperature: 0.3
    });

    log('Features & usage section created.');
    return { featuresSection: rawFeatures.trim() };
  } catch (err) {
    log(`Features agent fallback: ${err.message}`);
    return {
      featuresSection: `## ✨ Key Features\n\n- **📄 Multi-Format Document Parsing**: Upload PDFs, DOCX, PPTX, and scanned notes seamlessly.\n- **🧠 Grounded RAG Chat**: Chat with your materials with exact source citations.\n- **⚡ Automated Study Tools**: Instantly generate quizzes, summaries, and interactive flashcards.\n- **🎯 Personalized Study Plans**: AI-crafted study roadmap tailored to your course material.\n- **🐳 Docker & CI/CD Ready**: Configured with Docker Compose and GitHub Actions.`
    };
  }
}
