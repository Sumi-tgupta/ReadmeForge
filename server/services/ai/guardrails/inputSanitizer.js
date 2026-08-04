/**
 * Input Security & Guardrails Engine
 * Scrubs API keys, secrets, tokens, PII emails, and defends against prompt injections.
 */

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/g,                        // OpenAI / generic API key
  /AIzaSy[a-zA-Z0-9_-]{33}/g,                     // Google API key
  /ghp_[a-zA-Z0-9]{36}/g,                         // GitHub Personal Access Token
  /gho_[a-zA-Z0-9]{36}/g,                         // GitHub OAuth Token
  /glpat-[a-zA-Z0-9_-]{20}/g,                    // GitLab Personal Access Token
  /xox[baprs]-[a-zA-Z0-9_-]{10,}/g,               // Slack Tokens
  /AKIA[0-9A-Z]{16}/g,                            // AWS Access Key ID
  /[0-9a-fA-F]{32,64}/g                           // Hex secret tokens (32+ chars)
];

const PROMPT_INJECTION_TRIGGERS = [
  /ignore previous instructions/i,
  /system prompt override/i,
  /disregard above instructions/i,
  /you are now a/i,
  /jailbreak/i,
  /<script>/i
];

export function sanitizeRepositoryContent(content) {
  if (typeof content !== 'string') return '';

  let sanitized = content;

  SECRET_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED_SECRET]');
  });

  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');

  return sanitized;
}

export function detectPromptInjection(userInput) {
  if (typeof userInput !== 'string') return false;
  return PROMPT_INJECTION_TRIGGERS.some(pattern => pattern.test(userInput));
}

export function sanitizeUserInput(userInput) {
  if (typeof userInput !== 'string') return '';
  if (detectPromptInjection(userInput)) {
    return '[FLAGGED_INJECTION_ATTEMPT_REMOVED]';
  }
  return userInput.trim();
}
