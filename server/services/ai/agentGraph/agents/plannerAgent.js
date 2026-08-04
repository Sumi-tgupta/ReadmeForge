/**
 * Planner Agent (Architectural Strategist)
 * Analyzes repo metadata, ranked files, and target audience to design a structural blueprint for the README.
 */

import { executeWithFallback } from '../../modelRouter.js';

export async function executePlannerAgent(state, log) {
  log('Analyzing project structure & dependency topology...');
  
  const repo = state.repository || {};
  const primaryLang = (repo.stack?.languages && repo.stack.languages[0]) || 'JavaScript';
  const detectedStack = [
    ...(repo.stack?.languages || []),
    ...(repo.stack?.frameworks || [])
  ].join(', ') || 'Modern Software Stack';

  const systemPrompt = `You are an elite Software Documentation Strategist.
Design a high-converting, crystal-clear README layout blueprint for the project "${repo.name}".

Project Metadata:
- Repository: ${repo.owner}/${repo.name}
- Description: ${repo.description || 'Software repository'}
- Detected Stack: ${detectedStack}
- Primary Language: ${primaryLang}
- Identified Features: ${Array.isArray(repo.features) ? repo.features.join(', ') : ''}

Output a JSON blueprint object with:
1. "sections": Array of section titles in optimal order (e.g. ["Header", "Overview", "Architecture", "Features", "Installation", "Usage", "Contributing", "License"]).
2. "tagline": A catchy 1-sentence developer-focused value proposition tailored specifically to ${repo.name}.
3. "tone": "Professional & Developer-centric"
4. "targetAudience": "Developers & Software Engineers"`;

  try {
    const rawResponse = await executeWithFallback({
      prompt: systemPrompt,
      systemInstruction: 'Respond only with valid JSON representing the README blueprint.',
      temperature: 0.2
    });

    let blueprint;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      blueprint = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      blueprint = {
        sections: ["Header", "Overview", "Architecture", "Features", "Installation", "Usage", "Contributing", "License"],
        tagline: repo.description || `Production-grade ${repo.name} repository.`,
        tone: 'Developer-centric',
        targetAudience: 'Software Engineers'
      };
    }

    log(`Blueprint generated with ${blueprint.sections.length} core sections.`);
    return { blueprint };
  } catch (err) {
    log(`Planner agent fallback triggered: ${err.message}`);
    return {
      blueprint: {
        sections: ["Header", "Overview", "Architecture", "Features", "Installation", "Usage", "License"],
        tagline: repo.description || `High-performance ${repo.name} project.`,
        tone: 'Developer-centric',
        targetAudience: 'Software Engineers'
      }
    };
  }
}
