/**
 * Output Validation & Quality Assurance Guardrail
 * Validates markdown structural integrity, code fence balance, heading hierarchy, and link formatting.
 */

export function validateMarkdownOutput(markdownText) {
  if (typeof markdownText !== 'string' || !markdownText.trim()) {
    return {
      isValid: false,
      score: 0,
      issues: ['Empty markdown payload']
    };
  }

  const issues = [];
  let score = 100;

  const codeFences = (markdownText.match(/```/g) || []).length;
  if (codeFences % 2 !== 0) {
    issues.push('Unmatched triple backticks (```) code fence found.');
    score -= 20;
  }

  if (!/^#\s+.+/m.test(markdownText)) {
    issues.push('Missing top-level H1 header (# Project Title).');
    score -= 15;
  }

  const openDetails = (markdownText.match(/<details>/gi) || []).length;
  const closeDetails = (markdownText.match(/<\/details>/gi) || []).length;
  if (openDetails !== closeDetails) {
    issues.push(`Unclosed HTML <details> tags (${openDetails} open, ${closeDetails} closed).`);
    score -= 15;
  }

  const brokenBadges = (markdownText.match(/!\[.*?\]\(\)/g) || []).length;
  if (brokenBadges > 0) {
    issues.push(`Found ${brokenBadges} empty badge/image link(s).`);
    score -= 10;
  }

  if (markdownText.length < 250) {
    issues.push('Generated README is excessively short (< 250 chars).');
    score -= 25;
  }

  return {
    isValid: score >= 75 && issues.length === 0,
    score: Math.max(0, score),
    issues
  };
}

export function repairMarkdown(markdownText) {
  let repaired = markdownText;

  const codeFences = (repaired.match(/```/g) || []).length;
  if (codeFences % 2 !== 0) {
    repaired += '\n```\n';
  }

  const openDetails = (repaired.match(/<details>/gi) || []).length;
  const closeDetails = (repaired.match(/<\/details>/gi) || []).length;
  if (openDetails > closeDetails) {
    for (let i = 0; i < (openDetails - closeDetails); i++) {
      repaired += '\n</details>';
    }
  }

  return repaired;
}
