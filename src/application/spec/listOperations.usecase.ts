import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';

export type OperationSummary = {
  operationId: string;
  method: string;
  path: string;
  tags?: string[];
  summary?: string;
};

export type ListOperationsOptions = {
  tag?: string; // filter by tag name
  method?: string; // filter by HTTP method
};

/**
 * Return list of operations for a given spec.
 * Throws an Error if spec not found.
 */
export async function listOperations(specId: string, specRepo: SpecRepository, options?: ListOperationsOptions): Promise<OperationSummary[]> {
  const spec: NormalizedSpec | undefined = await specRepo.getById(specId);
  if (!spec) {
    throw new Error(`Spec with id ${specId} not found`);
  }

  let ops = spec.operations || [];

  if (options?.tag) {
    const tagLower = options.tag.toLowerCase();
    ops = ops.filter((o) => (o.tags || []).some((t) => t.toLowerCase() === tagLower));
  }

  if (options?.method) {
    const methodUpper = options.method.toUpperCase();
    ops = ops.filter((o) => o.method.toUpperCase() === methodUpper);
  }

  return ops.map((o) => ({
    operationId: o.operationId,
    method: o.method,
    path: o.path,
    tags: o.tags,
    summary: o.summary,
  }));
}

export default { listOperations };
