/**
 * Visual & Design Stylist Agent
 * Formats Shields.io badges, header styling, Table of Contents, HTML alignment tags, and responsive layout.
 */

export async function executeVisualAgent(state, log) {
  log('Applying visual styling, Shields.io badges, and markdown aesthetics...');
  
  const repo = state.repository || {};
  const blueprint = state.blueprint || {};
  const { architectureSection, setupSection, featuresSection } = state;

  const repoName = repo.name || repo.repoName || 'Project';
  const owner = repo.owner || 'user';
  const license = repo.license || 'MIT';
  const language = (repo.stack?.languages && repo.stack.languages[0]) || 'JavaScript';

  const badges = [
    `![License](https://img.shields.io/badge/license-${encodeURIComponent(license)}-blue.svg?style=for-the-badge)`,
    `![Language](https://img.shields.io/badge/language-${encodeURIComponent(language)}-brightgreen.svg?style=for-the-badge)`,
    `![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)`,
    `![Build Status](https://img.shields.io/badge/build-passing-success.svg?style=for-the-badge)`
  ].join(' ');

  const tagline = blueprint.tagline || repo.description || 'AI-Powered Platform';

  const header = `<div align="center">\n\n# 🚀 ${repoName}\n\n> **${tagline}**\n\n${badges}\n\n</div>\n\n---`;

  const toc = `## 📖 Table of Contents\n- [Architecture & Design](#️-architecture)\n- [Key Features](#-key-features)\n- [Quick Start](#-quick-start)\n- [Contributing](#-contributing)\n- [License](#-license)\n\n---`;

  const footer = `## 🤝 Contributing\n\nContributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/${owner}/${repoName}/issues).\n\n## 📜 License\n\nDistributed under the **${license}** License. See \`LICENSE\` for details.`;

  const combinedMarkdown = [
    header,
    toc,
    architectureSection || '',
    featuresSection || '',
    setupSection || '',
    footer
  ].filter(Boolean).join('\n\n');

  log('Visual styling & layout assembly complete.');
  return { assembledMarkdown: combinedMarkdown };
}
