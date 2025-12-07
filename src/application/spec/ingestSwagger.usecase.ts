import Logger from '../../infrastructure/logging/Logger';
import * as Loader from '../../infrastructure/swagger/SwaggerLoader';
import * as Parser from '../../infrastructure/swagger/SwaggerParserAdapter';
import * as Normalizer from '../../infrastructure/swagger/OpenApiNormalizer';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { NormalizedSpec, summarizeSpec } from '../../domain/models/NormalizedSpec';

export type SpecSource =
  | { type: 'url'; url: string }
  | { type: 'file'; path: string }
  | { type: 'git'; repo: string; ref?: string; filePath?: string };

export interface IngestResult {
  spec: NormalizedSpec;
  summary: { specId: string; title: string; version?: string; operationCount: number };
}

/**
 * Ingest a Swagger/OpenAPI spec from the provided source, normalize it, and persist it.
 * This use-case orchestrates infra adapters and the SpecRepository.
 */
export async function ingestSwagger(source: SpecSource, specRepo: SpecRepository): Promise<IngestResult> {
  Logger.info('ingestSwagger: starting ingestion for source type=%s', source.type);

  let rawContent: string;
  try {
    if (source.type === 'url') {
      rawContent = await Loader.loadFromUrl(source.url);
    } else if (source.type === 'file') {
      rawContent = await Loader.loadFromFile(source.path);
    } else if (source.type === 'git') {
      // git loader is a stub in this phase and will throw until implemented
      rawContent = await Loader.loadFromGit({ repo: source.repo, ref: source.ref, filePath: source.filePath });
    } else {
      throw new Error('Unsupported source type');
    }
  } catch (err: any) {
    Logger.error('ingestSwagger: failed to load spec: %s', err?.message || err);
    throw err;
  }

  // Parse the raw content
  let parsed: Parser.ParsedSpecResult;
  try {
    parsed = await Parser.parseSpec(rawContent);
  } catch (err: any) {
    Logger.error('ingestSwagger: failed to parse spec: %s', err?.message || err);
    throw err;
  }

  // Normalize into domain NormalizedSpec
  let normalized: NormalizedSpec;
  try {
    normalized = Normalizer.normalize(parsed);
  } catch (err: any) {
    Logger.error('ingestSwagger: failed to normalize spec: %s', err?.message || err);
    throw err;
  }

  // Persist spec using repository
  try {
    await specRepo.save(normalized);
  } catch (err: any) {
    Logger.error('ingestSwagger: failed to persist spec: %s', err?.message || err);
    throw err;
  }

  const summary = summarizeSpec(normalized);
  Logger.info('ingestSwagger: completed ingestion for specId=%s', summary.specId);

  return { spec: normalized, summary };
}

export default { ingestSwagger };
