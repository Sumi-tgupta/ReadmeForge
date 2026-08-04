/**
 * Installation & Setup Specialist Agent
 * Scans scripts, dependencies, environment configs, and builds multi-platform setup instructions.
 */

import { executeWithFallback } from '../../modelRouter.js';

export async function executeSetupAgent(state, log) {
  log('Extracting setup scripts, environment variables, and build commands...');
  
  const repo = state.repository || {};
  const cmds = repo.commands || {};
  const installCmd = cmds.install || 'npm install';
  const startCmd = cmds.start || cmds.dev || 'npm run dev';
  const buildCmd = cmds.build || 'npm run build';
  const owner = repo.owner || 'Code-Orbit-Lab';
  const repoName = repo.name || 'studysage';

  const prompt = `You are a DevOps & Developer Experience Engineer.
Write the "Installation & Getting Started" section for "${repoName}" (${owner}/${repoName}).

Repository Details:
- Clone URL: https://github.com/${owner}/${repoName}.git
- Directory Name: ${repoName}
- Install Command: ${installCmd}
- Start Command: ${startCmd}
- Build Command: ${buildCmd}
- Stack: ${(repo.stack?.frameworks || []).join(', ') || (repo.stack?.languages || []).join(', ')}

Requirements:
1. Provide step-by-step prerequisites.
2. Provide step-by-step installation commands for cloning https://github.com/${owner}/${repoName}.git, installing, and starting.
3. Use exact commands (${installCmd}, ${startCmd}).`;

  try {
    const rawSetup = await executeWithFallback({
      prompt,
      temperature: 0.2
    });

    log('Setup & installation guide compiled.');
    return { setupSection: rawSetup.trim() };
  } catch (err) {
    log(`Setup agent fallback: ${err.message}`);
    return {
      setupSection: `## ⚡ Quick Start\n\n### Prerequisites\n- Node.js (v18+) & Python environment\n- Docker & Docker Compose (optional)\n\n### Installation\n\`\`\`bash\n# 1. Clone the repository\ngit clone https://github.com/${owner}/${repoName}.git\ncd ${repoName}\n\n# 2. Install dependencies\n${installCmd}\n\n# 3. Start development server\n${startCmd}\n\`\`\``
    };
  }
}
