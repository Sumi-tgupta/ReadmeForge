/**
 * Server-side prompt optimizer.
 * Builds a compressed, token-optimized prompt from raw form data.
 * Adapted from the frontend promptBuilder.js but with additional server-side optimizations.
 */

/** System prompt — cached as constant, never rebuilt */
export const SYSTEM_PROMPT = `You are an expert GitHub profile README generator. You write clean, well-structured, impressive GitHub profile READMEs in markdown. You know all GitHub README tricks: HTML centering, badge shields, stats cards, skillicons, animated SVGs, trophies, streak counters, visitor badges. You always output ONLY raw markdown — no code fences, no explanation, no preamble. Start directly with the markdown content. CRITICAL: Do NOT include any emojis (such as 🚀, 🏆, 🛠️, etc.) in the generated content under any circumstances. Keep all headings and text strictly professional and textual.`;

/**
 * Section definitions (lightweight server-side copy — no icons needed).
 */
const SECTION_KEYS = new Set([
  'about', 'tech', 'learning', 'projects', 'experience', 'opensource',
  'stats', 'trophies', 'streak', 'languages', 'social', 'education',
  'hobbies', 'support', 'visitor', 'custom',
]);

const SECTION_NAMES = {
  about: 'About Me',
  tech: 'Tech Stack',
  learning: 'Currently Learning',
  projects: 'Projects Showcase',
  experience: 'Work Experience',
  opensource: 'Open Source',
  stats: 'GitHub Stats',
  trophies: 'GitHub Trophies',
  streak: 'Streak Stats',
  languages: 'Top Languages',
  social: 'Social Links',
  education: 'Education & Certifications',
  hobbies: 'Hobbies & Fun Facts',
  support: 'Support',
  visitor: 'Visitor Counter',
  custom: 'Custom Section',
};

/**
 * Build an optimized prompt from form data and selected sections.
 * @param {object} fd - Raw form data from the frontend
 * @param {string[]} selectedSections - Array of section keys
 * @returns {{ prompt: string, systemPrompt: string, estimatedTokens: number }}
 */
export function buildOptimizedPrompt(fd, selectedSections) {
  const lines = [];

  lines.push(`Create a GitHub profile README with these details:`);
  lines.push('');
  lines.push(`TONE: ${fd.tone || 'Professional'}`);
  lines.push(`NAME: ${fd.name}`);
  lines.push(`USERNAME: ${fd.username}`);

  // Only include non-empty basic fields
  if (fd.tagline) lines.push(`TAGLINE: ${fd.tagline}`);
  if (fd.location) lines.push(`LOCATION: ${fd.location}`);
  if (fd.email) lines.push(`EMAIL: ${fd.email}`);
  if (fd.website) lines.push(`WEBSITE: ${fd.website}`);
  if (fd.avatarStyle && fd.avatarStyle !== 'github-avatar') {
    lines.push(`AVATAR STYLE: ${fd.avatarStyle}`);
  }

  // Sections to include
  const validSections = selectedSections.filter(s => SECTION_KEYS.has(s));
  lines.push('');
  lines.push(`SECTIONS TO INCLUDE (in this order):`);
  validSections.forEach(s => {
    lines.push(`- ${SECTION_NAMES[s] || s}`);
  });

  // About Me
  if (validSections.includes('about')) {
    const aboutLines = [];
    if (fd.bio) aboutLines.push(`Bio: ${fd.bio}`);
    if (fd.pronouns) aboutLines.push(`Pronouns: ${fd.pronouns}`);
    if (fd.currentFocus) aboutLines.push(`Current focus: ${fd.currentFocus}`);
    if (fd.funFact) aboutLines.push(`Fun fact: ${fd.funFact}`);
    if (fd.openToWork) aboutLines.push(`Open to work: Yes`);
    if (aboutLines.length > 0) {
      lines.push('');
      lines.push(`ABOUT ME:`);
      lines.push(...aboutLines);
    }
  }

  // Tech Stack
  if (validSections.includes('tech') && fd.selectedTechs?.length > 0) {
    lines.push('');
    lines.push(`TECH STACK:`);
    lines.push(`Badge style: ${fd.badgeStyle === 'shields' ? 'shields.io badges (style=for-the-badge)' : 'skillicons.dev icons'}`);
    lines.push(`Technologies: ${fd.selectedTechs.join(', ')}`);
  }

  // Currently Learning
  if (validSections.includes('learning') && fd.learningTechs?.length > 0) {
    lines.push('');
    lines.push(`CURRENTLY LEARNING:`);
    lines.push(`Technologies: ${fd.learningTechs.join(', ')}`);
    if (fd.learningGoal) lines.push(`Goal: ${fd.learningGoal}`);
  }

  // Projects
  if (validSections.includes('projects') && fd.projects?.length > 0) {
    const validProjects = fd.projects.filter(pr => pr.name);
    if (validProjects.length > 0) {
      lines.push('');
      lines.push(`PROJECTS SHOWCASE:`);
      validProjects.forEach((pr, i) => {
        lines.push(`Project ${i + 1}: ${pr.name}`);
        if (pr.description) lines.push(`  Description: ${pr.description}`);
        if (pr.repoUrl) lines.push(`  Repo: ${pr.repoUrl}`);
        if (pr.demoUrl) lines.push(`  Demo: ${pr.demoUrl}`);
        if (pr.tags) lines.push(`  Tags: ${pr.tags}`);
        if (pr.starred) lines.push(`  ⭐ Highlighted project`);
      });
    }
  }

  // Experience
  if (validSections.includes('experience') && fd.experiences?.length > 0) {
    const validExp = fd.experiences.filter(ex => ex.role || ex.company);
    if (validExp.length > 0) {
      lines.push('');
      lines.push(`WORK EXPERIENCE:`);
      validExp.forEach(ex => {
        lines.push(`- ${ex.role} at ${ex.company} (${ex.duration}): ${ex.description}`);
      });
    }
  }

  // Open Source
  if (validSections.includes('opensource')) {
    const ossLines = [];
    if (fd.ossDescription) ossLines.push(fd.ossDescription);
    const validLinks = (fd.ossLinks || []).filter(l => l.label && l.url);
    if (validLinks.length > 0) {
      ossLines.push(`Links:`);
      validLinks.forEach(l => ossLines.push(`- ${l.label}: ${l.url}`));
    }
    if (ossLines.length > 0) {
      lines.push('');
      lines.push(`OPEN SOURCE CONTRIBUTIONS:`);
      lines.push(...ossLines);
    }
  }

  // GitHub Stats
  if (validSections.includes('stats')) {
    lines.push('');
    lines.push(`GITHUB STATS:`);
    lines.push(`Theme: ${fd.statsTheme}`);
    if (fd.showStatsCard === false) lines.push(`Show stats card: No`);
    if (fd.showContribGraph === false) lines.push(`Show contributions graph: No`);
    const hidden = [];
    if (fd.hideStars) hidden.push('stars');
    if (fd.hideCommits) hidden.push('commits');
    if (fd.hidePRs) hidden.push('prs');
    if (fd.hideIssues) hidden.push('issues');
    if (fd.hideContribs) hidden.push('contribs');
    if (hidden.length) lines.push(`Hide: ${hidden.join(', ')}`);
  }

  // Trophies
  if (validSections.includes('trophies')) {
    lines.push('');
    lines.push(`GITHUB TROPHIES: Theme=${fd.trophyTheme}, Rank=${fd.trophyRank}`);
  }

  // Streak
  if (validSections.includes('streak')) {
    lines.push('');
    lines.push(`STREAK STATS: Theme=${fd.streakTheme}, DateFormat=${fd.streakDateFormat}`);
  }

  // Languages
  if (validSections.includes('languages')) {
    lines.push('');
    lines.push(`TOP LANGUAGES: Layout=${fd.langLayout}, Theme=${fd.langTheme}`);
    if (fd.langExcludeRepos) lines.push(`Exclude repos: ${fd.langExcludeRepos}`);
    if (fd.langHideLanguages) lines.push(`Hide languages: ${fd.langHideLanguages}`);
  }

  // Social
  if (validSections.includes('social') && fd.social) {
    const filled = Object.entries(fd.social).filter(([, v]) => v);
    if (filled.length > 0) {
      lines.push('');
      lines.push(`SOCIAL LINKS:`);
      filled.forEach(([k, v]) => {
        lines.push(`${k}: ${v}`);
      });
    }
  }

  // Education
  if (validSections.includes('education')) {
    const eduEntries = (fd.educationEntries || []).filter(e => e.institution);
    const certs = (fd.certifications || []).filter(c => c.name);
    if (eduEntries.length > 0) {
      lines.push('');
      lines.push(`EDUCATION:`);
      eduEntries.forEach(e => {
        lines.push(`- ${e.degree} at ${e.institution} (${e.year})`);
      });
    }
    if (certs.length > 0) {
      lines.push('');
      lines.push(`CERTIFICATIONS:`);
      certs.forEach(c => {
        lines.push(`- ${c.name} by ${c.issuer} (${c.year})${c.url ? ` — ${c.url}` : ''}`);
      });
    }
  }

  // Hobbies
  if (validSections.includes('hobbies')) {
    if (fd.funFacts) {
      lines.push('');
      lines.push(`FUN FACTS:`);
      lines.push(fd.funFacts);
    }
    if (fd.hobbies?.length > 0) {
      lines.push('');
      lines.push(`HOBBIES: ${fd.hobbies.join(', ')}`);
    }
  }

  // Support
  if (validSections.includes('support')) {
    const supports = [];
    if (fd.bmcUsername) supports.push(`Buy Me a Coffee: ${fd.bmcUsername}`);
    if (fd.kofiUsername) supports.push(`Ko-fi: ${fd.kofiUsername}`);
    if (fd.ghSponsors) supports.push(`GitHub Sponsors: ${fd.ghSponsors}`);
    if (fd.patreonUrl) supports.push(`Patreon: ${fd.patreonUrl}`);
    if (supports.length > 0) {
      lines.push('');
      lines.push(`SUPPORT:`);
      supports.forEach(s => lines.push(s));
    }
  }

  // Visitor
  if (validSections.includes('visitor')) {
    lines.push('');
    lines.push(`VISITOR COUNTER: Style=${fd.visitorStyle}, Label=${fd.visitorLabel || 'Profile Views'}`);
  }

  // Custom
  if (validSections.includes('custom')) {
    if (fd.customTitle || fd.customContent) {
      lines.push('');
      lines.push(`CUSTOM SECTION:`);
      if (fd.customTitle) lines.push(`Title: ${fd.customTitle}`);
      if (fd.customContent) lines.push(`Content:\n${fd.customContent}`);
    }
  }

  // Card URL instructions
  lines.push('');
  lines.push(`GITHUB USERNAME FOR CARDS: ${fd.username}`);
  if (validSections.includes('stats')) lines.push(`STATS THEME: ${fd.statsTheme}`);
  if (validSections.includes('streak')) lines.push(`STREAK THEME: ${fd.streakTheme}`);
  if (validSections.includes('languages')) lines.push(`LANGUAGES LAYOUT: ${fd.langLayout}\nLANGUAGES THEME: ${fd.langTheme}`);
  if (validSections.includes('trophies')) lines.push(`TROPHIES THEME: ${fd.trophyTheme}`);

  lines.push('');
  lines.push(`INSTRUCTIONS:`);
  lines.push(`- Use exact image URLs for stats cards, skillicons, shields badges.`);
  lines.push(`- Stats: https://github-readme-stats.vercel.app/api?username=${fd.username}&theme=THEME&show_icons=true`);
  lines.push(`- Streak: https://streak-stats.demolab.com/?user=${fd.username}&theme=THEME`);
  lines.push(`- Langs: https://github-readme-stats.vercel.app/api/top-langs/?username=${fd.username}&theme=THEME&layout=LAYOUT`);
  lines.push(`- Trophies: https://github-profile-trophy.vercel.app/?username=${fd.username}&theme=THEME`);
  lines.push(`- Skillicons: https://skillicons.dev/icons?i=COMMA_SEPARATED_TECHS`);
  lines.push(`- Shields: https://img.shields.io/badge/TECH-COLOR?style=for-the-badge&logo=TECH&logoColor=white`);
  lines.push(`- Visitor badge: https://komarev.com/ghpvc/?username=${fd.username}&label=${encodeURIComponent(fd.visitorLabel || 'Profile Views')}&color=blue`);
  lines.push(`- Center-align header section using HTML <div align="center"> tags.`);
  lines.push(`- For skillicons, chunk techs into rows of max 15 per line.`);
  lines.push(`- For shields.io badges, use style=for-the-badge.`);
  lines.push(`- Make it visually rich but not cluttered.`);
  lines.push(`- Use the selected tone throughout any text sections.`);
  lines.push(`- Wrap social links in centered HTML with icon badges.`);
  lines.push(`- CRITICAL: Do NOT use any emojis anywhere in the generated markdown. Keep the document completely free of emojis.`);
  lines.push(`- Output ONLY raw markdown starting from the very first character. No code fences.`);

  // Compress: remove consecutive blank lines
  const prompt = compressPrompt(lines.join('\n'));
  const estimatedTokens = Math.ceil(prompt.length / 4);

  return {
    prompt,
    systemPrompt: SYSTEM_PROMPT,
    estimatedTokens,
  };
}

/**
 * Compress prompt by removing consecutive blank lines.
 */
function compressPrompt(text) {
  return text
    .split('\n')
    .map(line => line.trimEnd())
    .filter((line, i, arr) => {
      if (!line && i > 0 && !arr[i - 1]) return false;
      return true;
    })
    .join('\n')
    .trim();
}
