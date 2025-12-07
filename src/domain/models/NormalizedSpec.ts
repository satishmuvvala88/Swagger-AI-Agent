/**
 * Domain model: NormalizedSpec
 *
 * This file belongs to the domain layer and must not depend on infrastructure
 * libraries (HTTP, filesystem, DB, etc.). It exposes lightweight interfaces
 * and pure helper functions useful to other domain/use-case code.
 */

export interface Operation {
  operationId: string;
  method: string; // GET, POST, PUT, DELETE, etc.
  path: string; // normalized path, e.g. /customers/{id}
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: Array<Record<string, any>>;
  requestBody?: Record<string, any> | null;
  responses?: Record<string, any>;
  security?: Array<Record<string, any>>;
}

export interface NormalizedSpec {
  id: string;
  title: string;
  version?: string;
  servers?: string[];
  tags?: string[];
  operations: Operation[];
  // raw source is optional and kept for debugging or future persistence
  raw?: any;
  createdAt?: string; // ISO timestamp
}

export function createNormalizedSpec(input: {
  id: string;
  title: string;
  version?: string;
  servers?: string[];
  tags?: string[];
  operations?: Operation[];
  raw?: any;
}): NormalizedSpec {
  const now = new Date().toISOString();
  return {
    id: input.id,
    title: input.title,
    version: input.version,
    servers: input.servers || [],
    tags: input.tags || [],
    operations: input.operations || [],
    raw: input.raw,
    createdAt: now,
  };
}

export function summarizeSpec(spec: NormalizedSpec) {
  return {
    specId: spec.id,
    title: spec.title,
    version: spec.version,
    operationCount: Array.isArray(spec.operations) ? spec.operations.length : 0,
  };
}

export function validateNormalizedSpec(candidate: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!candidate) {
    issues.push('spec is empty');
    return { valid: false, issues };
  }

  if (typeof candidate.id !== 'string' || candidate.id.trim() === '') {
    issues.push('missing or invalid `id`');
  }

  if (typeof candidate.title !== 'string' || candidate.title.trim() === '') {
    issues.push('missing or invalid `title`');
  }

  if (!Array.isArray(candidate.operations)) {
    issues.push('`operations` must be an array');
  } else {
    candidate.operations.forEach((op: any, idx: number) => {
      if (!op) {
        issues.push(`operation[${idx}] is empty`);
        return;
      }
      if (typeof op.operationId !== 'string' || op.operationId.trim() === '') {
        issues.push(`operation[${idx}].operationId missing or invalid`);
      }
      if (typeof op.method !== 'string' || op.method.trim() === '') {
        issues.push(`operation[${idx}].method missing or invalid`);
      }
      if (typeof op.path !== 'string' || op.path.trim() === '') {
        issues.push(`operation[${idx}].path missing or invalid`);
      }
    });
  }

  return { valid: issues.length === 0, issues };
}
