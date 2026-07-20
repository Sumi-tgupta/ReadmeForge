/**
 * Low-level Gemini API provider.
 * Single responsibility: send one request, parse response, throw typed errors.
 */

const GEMINI_API_KEY = () => process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 30_000;

// --- Typed Errors ---

export class GeminiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
    this.details = details;
  }
}

export class GeminiRateLimitError extends GeminiError {
  constructor(details) {
    super('Gemini API rate limit exceeded', 429, details);
    this.name = 'GeminiRateLimitError';
  }
}

export class GeminiAuthError extends GeminiError {
  constructor(details) {
    super('Invalid Gemini API key', 401, details);
    this.name = 'GeminiAuthError';
  }
}

/**
 * Gemini can return 403 for both unrecoverable API-key/configuration problems
 * and model-specific permission/availability problems. Only the former should
 * stop the fallback chain.
 */
export function isGeminiConfigurationError(error) {
  const details = error?.details || {};
  const raw = JSON.stringify(details).toLowerCase();

  return [
    'api key not valid',
    'api_key_invalid',
    'apikey_invalid',
    'key invalid',
    'gemini_api_key not configured',
    'permission denied on resource project',
    'service_disabled',
    'api has not been used',
    'generativelanguage.googleapis.com has not been used',
    'billing'
  ].some(fragment => raw.includes(fragment));
}

export class GeminiServerError extends GeminiError {
  constructor(status, details) {
    super(`Gemini server error (${status})`, status, details);
    this.name = 'GeminiServerError';
  }
}

// --- Provider ---

/**
 * Call the Gemini generateContent API.
 * @param {object} options
 * @param {string} options.model - Model name (e.g. 'gemini-2.5-flash-lite')
 * @param {string} options.prompt - User prompt text
 * @param {string} [options.systemPrompt] - System instruction text
 * @param {number} [options.maxOutputTokens=4000]
 * @param {number} [options.temperature=0.8]
 * @returns {Promise<{ text: string, usage: { inputTokens: number, outputTokens: number, model: string } }>}
 */
export async function callGemini({ model, prompt, systemPrompt, maxOutputTokens = 4000, temperature = 0.8 }) {
  const apiKey = GEMINI_API_KEY();
  if (!apiKey) {
    throw new GeminiAuthError({ error: { message: 'GEMINI_API_KEY not configured in server environment' } });
  }

  const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: Math.min(maxOutputTokens, 8000),
        temperature: Math.min(Math.max(temperature, 0), 1),
      },
    };

    if (systemPrompt) {
      body.system_instruction = { parts: [{ text: systemPrompt }] };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error(`[GeminiProvider] API error ${res.status} for model ${model}:`, JSON.stringify(errData).slice(0, 500));

      if (res.status === 429) throw new GeminiRateLimitError(errData);
      if (res.status === 401 || res.status === 403) throw new GeminiAuthError(errData);
      if (res.status >= 500) throw new GeminiServerError(res.status, errData);
      throw new GeminiError(`Gemini API error (${res.status})`, res.status, errData);
    }

    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown code fences that Gemini sometimes wraps around output
    text = text.replace(/^```(?:markdown|md)?\n?/i, '').replace(/\n?```\s*$/i, '');

    const usage = data?.usageMetadata || {};

    return {
      text,
      usage: {
        inputTokens: usage.promptTokenCount || 0,
        outputTokens: usage.candidatesTokenCount || 0,
        model,
      },
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new GeminiError('Gemini API request timed out after 30s', 408);
    }
    // Re-throw typed errors
    if (err instanceof GeminiError) throw err;
    // Wrap unknown errors
    throw new GeminiError(`Network error: ${err.message}`, 0);
  } finally {
    clearTimeout(timeout);
  }
}
