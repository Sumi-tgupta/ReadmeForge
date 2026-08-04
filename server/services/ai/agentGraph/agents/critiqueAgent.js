/**
 * Critique, Guardrails & Quality Evaluator Agent
 * Audits the generated README on 6 quality vectors and performs auto-repair or iterative refinement.
 */

import { validateMarkdownOutput, repairMarkdown } from '../../guardrails/markdownValidator.js';

export async function executeCritiqueAgent(state, log) {
  log('Auditing generated README against quality guardrails...');
  
  let markdown = state.assembledMarkdown || '';
  
  let validation = validateMarkdownOutput(markdown);
  log(`Initial Quality Audit Score: ${validation.score}/100`);

  if (!validation.isValid) {
    log(`Auto-repairing syntax issues: ${validation.issues.join('; ')}`);
    markdown = repairMarkdown(markdown);
    validation = validateMarkdownOutput(markdown);
    log(`Post-repair Audit Score: ${validation.score}/100`);
  }

  const qualityReport = {
    score: validation.score,
    passed: validation.isValid || validation.score >= 80,
    issues: validation.issues,
    timestamp: new Date().toISOString()
  };

  log(`Quality Evaluation Complete. Final Score: ${qualityReport.score}/100.`);

  return {
    finalMarkdown: markdown,
    qualityReport
  };
}
