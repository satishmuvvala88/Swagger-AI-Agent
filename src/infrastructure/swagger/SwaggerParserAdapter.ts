/**
 * Swagger/OpenAPI Parser Adapter (stub)
 *
 * This adapter provides a thin abstraction around an OpenAPI/Swagger parser.
 * In early phases it implements a minimal parser (JSON.parse) and returns a
 * predictable shape. Later this file should be extended to call a proper
 * OpenAPI parser library (e.g., `swagger-parser`, `openapi-schema-parser`,
 * or similar) to fully resolve $ref and produce a normalized AST.
 */

export interface ParsedSpecResult {
  parsed?: any; // the parsed JS object when parsing succeeds
  raw: string; // original spec text
  format: 'json' | 'yaml' | 'unknown';
  warnings?: string[];
}

/**
 * Try to parse the provided spec text. Currently supports JSON; if parsing
 * as JSON fails we mark the format as 'yaml' or 'unknown' and return the raw
 * content so higher layers can decide how to proceed.
 */
export async function parseSpec(rawSpec: string): Promise<ParsedSpecResult> {
  if (typeof rawSpec !== 'string') {
    throw new Error('rawSpec must be a string');
  }

  // Quick check for JSON: if it starts with { or [ then try JSON.parse
  const trimmed = rawSpec.trim();
  const result: ParsedSpecResult = { raw: rawSpec, format: 'unknown', warnings: [] };

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      result.parsed = JSON.parse(rawSpec);
      result.format = 'json';
      return result;
    } catch (err: any) {
      result.warnings!.push(`JSON parse failed: ${err?.message || err}`);
      // fallthrough to attempt YAML detection
    }
  }

  // Minimal YAML detection: YAML often contains ':' characters for mappings
  // and may start with 'openapi' or 'swagger'. This is not a full parser.
  if (/^openapi:\s*\d+/mi.test(trimmed) || /^swagger:\s*\d+/mi.test(trimmed) || /:\s/.test(trimmed)) {
    result.format = 'yaml';
    result.warnings!.push('YAML parsing not implemented; returning raw content.');
    return result;
  }

  // Unknown format — return raw and warning
  result.warnings!.push('Unknown spec format; returning raw content');
  return result;
}

export default { parseSpec };
