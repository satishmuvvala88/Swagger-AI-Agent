import { Request, Response } from 'express';
import { SpecImportRequestDto, SpecValidateRequestDto } from '../dto/spec.dto';
import Logger from '../../infrastructure/logging/Logger';
import InMemorySpecRepository from '../../infrastructure/persistence/InMemorySpecRepository';
import * as IngestUsecase from '../../application/spec/ingestSwagger.usecase';
import * as ValidateUsecase from '../../application/spec/validateSpec.usecase';
import * as ListOpsUsecase from '../../application/spec/listOperations.usecase';
import { summarizeSpec } from '../../domain/models/NormalizedSpec';

// Use a process-level in-memory repository so data persists across requests
const specRepo = new InMemorySpecRepository();

export async function importSpec(req: Request<any, any, SpecImportRequestDto>, res: Response) {
  const source = req.body?.source;
  if (!source || typeof source.type !== 'string') {
    return res.status(400).json({ error: 'missing or invalid source in request body' });
  }

  try {
    const result = await IngestUsecase.ingestSwagger(source as IngestUsecase.SpecSource, specRepo);
    return res.status(201).json({ spec: result.summary });
  } catch (err: any) {
    Logger.error('spec.import error: %s', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Failed to import spec' });
  }
}

export async function validateSpec(req: Request<any, any, SpecValidateRequestDto>, res: Response) {
  const body = req.body || {};

  try {
    const result = await ValidateUsecase.validateSpec({ specId: body.specId, rawSpec: body.rawSpec }, { specRepo });
    return res.status(200).json(result);
  } catch (err: any) {
    Logger.error('spec.validate error: %s', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Failed to validate spec' });
  }
}

export async function getSpec(req: Request, res: Response) {
  const { specId } = req.params;
  try {
    const spec = await specRepo.getById(specId);
    if (!spec) return res.status(404).json({ error: 'spec not found', specId });
    const meta = summarizeSpec(spec);
    // include servers, tags, operation counts
    return res.status(200).json({ ...meta, servers: spec.servers || [], tags: spec.tags || [] });
  } catch (err: any) {
    Logger.error('spec.get error: %s', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Failed to fetch spec' });
  }
}

export async function getOperations(req: Request, res: Response) {
  const { specId } = req.params;
  const { tag, method } = req.query;

  try {
    const options: ListOpsUsecase.ListOperationsOptions = {};
    if (typeof tag === 'string') options.tag = tag;
    if (typeof method === 'string') options.method = method;

    const list = await ListOpsUsecase.listOperations(specId, specRepo, options);
    return res.status(200).json(list);
  } catch (err: any) {
    Logger.error('spec.operations error: %s', err?.message || err);
    if ((err as Error).message?.includes('not found')) return res.status(404).json({ error: err?.message });
    return res.status(500).json({ error: err?.message || 'Failed to list operations' });
  }
}
