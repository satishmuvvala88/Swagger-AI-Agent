/**
 * Domain model: Operation
 *
 * Pure domain types describing an API operation after normalization.
 * No external dependencies allowed in domain layer.
 */

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | string;

export interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie' | string;
  required?: boolean;
  schema?: Record<string, any>;
  description?: string;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content?: Record<string, any>; // mediaType -> schema/example
}

export interface ResponseDescriptor {
  description?: string;
  content?: Record<string, any>;
}

export interface SecurityRequirement {
  [name: string]: string[]; // e.g. { oauth2: ['scope1'] }
}

export interface Operation {
  operationId: string;
  method: HttpMethod;
  path: string;
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody | null;
  responses?: Record<string, ResponseDescriptor>;
  security?: SecurityRequirement[];
}

/**
 * Factory for creating a minimal Operation instance.
 */
export function createOperation(input: {
  operationId: string;
  method: HttpMethod;
  path: string;
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody | null;
  responses?: Record<string, ResponseDescriptor>;
  security?: SecurityRequirement[];
}): Operation {
  return {
    operationId: input.operationId,
    method: input.method,
    path: input.path,
    tags: input.tags || [],
    summary: input.summary,
    description: input.description,
    parameters: input.parameters || [],
    requestBody: input.requestBody || null,
    responses: input.responses || {},
    security: input.security || [],
  };
}

/**
 * Lightweight validation for Operation shape. Returns an array of issues (empty if valid).
 */
export function validateOperation(candidate: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!candidate) {
    issues.push('operation is empty');
    return { valid: false, issues };
  }
  if (typeof candidate.operationId !== 'string' || candidate.operationId.trim() === '') {
    issues.push('missing or invalid `operationId`');
  }
  if (typeof candidate.method !== 'string' || candidate.method.trim() === '') {
    issues.push('missing or invalid `method`');
  }
  if (typeof candidate.path !== 'string' || candidate.path.trim() === '') {
    issues.push('missing or invalid `path`');
  }
  if (candidate.parameters && !Array.isArray(candidate.parameters)) {
    issues.push('`parameters` must be an array if provided');
  }
  return { valid: issues.length === 0, issues };
}
