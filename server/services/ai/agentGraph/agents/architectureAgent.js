/**
 * Architecture Specialist Agent
 * Constructs ASCII data flow diagrams, system architecture explanations, and tech stack component breakdowns.
 */

import { executeWithFallback } from '../../modelRouter.js';

export async function executeArchitectureAgent(state, log) {
  log('Drafting system architecture diagram and tech stack mapping...');
  
  const repo = state.repository || {};
  const owner = repo.owner || 'Code-Orbit-Lab';
  const repoName = repo.name || 'studysage';
  const stackList = [
    ...(repo.stack?.languages || []),
    ...(repo.stack?.frameworks || [])
  ].join(', ') || 'Full Stack Application';

  const treeLines = Array.isArray(repo.structure) ? repo.structure.slice(0, 35).join('\n') : '';

  const prompt = `You are a Principal Software Architect.
Draft the "Architecture & Tech Stack" section for the project "${repoName}" (${owner}/${repoName}).

Context:
- Project Description: ${repo.description || ''}
- Stack: ${stackList}
- Folder Structure:
${treeLines}

Requirements:
1. Create a detailed ASCII flowchart showing component relationships for ${repoName}.
2. Provide a breakdown of key directories from the folder structure.
3. Use clean markdown.`;

  try {
    const rawArchitecture = await executeWithFallback({
      prompt,
      temperature: 0.3
    });

    log('Architecture section completed with ASCII data flow diagram.');
    return { architectureSection: rawArchitecture.trim() };
  } catch (err) {
    log(`Architecture agent fallback: ${err.message}`);
    
    const asciiTreeBlock = treeLines ? `\n\n### 📂 Folder Topology\n\`\`\`\n${treeLines}\n\`\`\`` : '';
    
    return {
      architectureSection: `## 🏗️ Architecture & System Design\n\n\`\`\`\n[ Frontend (React/Next.js) ] ----> [ Backend API (Python/Flask) ] ----> [ AI RAG Engine (Gemini API) ] ----> [ Supabase DB ]\n\`\`\`\n\n- **Frontend**: Next.js & React UI for user chat, document uploads, and quiz interfaces.\n- **Backend & AI Service**: Python/Flask backend handling PDF/DOCX document parsing, embeddings, RAG generation, and flashcards.\n- **Database**: Supabase PostgreSQL for vector storage, persistent user metadata, and study sessions.${asciiTreeBlock}`
    };
  }
}
