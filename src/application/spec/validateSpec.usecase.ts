import Logger from '../../infrastructure/logging/Logger';
import * as Parser from '../../infrastructure/swagger/SwaggerParserAdapter';
import * as Normalizer from '../../infrastructure/swagger/OpenApiNormalizer';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { validateNormalizedSpec, NormalizedSpec } from '../../domain/models/NormalizedSpec';

export type ValidateInput = { specId?: string; rawSpec?: string };

export type ValidateResult = { valid: boolean; issues: string[]; specId?: string };

/**
 * Validate a spec. If `specId` is provided, fetch from repository and validate the stored NormalizedSpec.
 * If `rawSpec` is provided, parse and normalize it first, then validate the result.
 */
export async function validateSpec(input: ValidateInput, deps: { specRepo?: SpecRepository } = {}): Promise<ValidateResult> {
  Logger.info('validateSpec: starting validation');

  if (input.specId) {
    if (!deps.specRepo) throw new Error('specRepo is required when validating by specId');
    const spec = await deps.specRepo.getById(input.specId);
    if (!spec) {
      return { valid: false, issues: [`spec with id ${input.specId} not found`], specId: input.specId };
    }
    const { valid, issues } = validateNormalizedSpec(spec as NormalizedSpec);
    return { valid, issues, specId: input.specId };
  }

  if (input.rawSpec) {
    try {
      const parsed = await Parser.parseSpec(input.rawSpec);
      const normalized = Normalizer.normalize(parsed);
      const { valid, issues } = validateNormalizedSpec(normalized as NormalizedSpec);
      return { valid, issues, specId: normalized.id };
    } catch (err: any) {
      Logger.error('validateSpec: error parsing/normalizing raw spec: %s', err?.message || err);
      return { valid: false, issues: [err?.message || String(err)] };
    }
  }

  return { valid: false, issues: ['either specId or rawSpec must be provided'] };
}

export default { validateSpec };
