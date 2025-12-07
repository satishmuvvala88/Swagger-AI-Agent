import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SpecImportRequestDto, SpecValidateRequestDto } from '../dto/spec.dto';

const SpecSourceUrl = z.object({ type: z.literal('url'), url: z.string().url() });
const SpecSourceFile = z.object({ type: z.literal('file'), path: z.string().min(1) });
const SpecSourceGit = z.object({ type: z.literal('git'), repo: z.string().min(1), ref: z.string().optional(), filePath: z.string().optional() });

const SpecSource = z.union([SpecSourceUrl, SpecSourceFile, SpecSourceGit]);

const SpecImportSchema = z.object({ source: SpecSource });

const SpecValidateSchema = z.object({ specId: z.string().optional(), rawSpec: z.string().optional() }).refine((data) => !!(data.specId || data.rawSpec), {
  message: 'either specId or rawSpec must be provided',
});

function formatZodErrors(err: any) {
  if (!err || !err.errors) return { message: 'validation failed' };
  return { message: 'validation failed', issues: err.errors.map((e: any) => ({ path: e.path, message: e.message })) };
}

export function validateImportBody(req: Request<any, any, SpecImportRequestDto>, res: Response, next: NextFunction) {
  const parse = SpecImportSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json(formatZodErrors(parse.error));
  }
  return next();
}

export function validateValidateBody(req: Request<any, any, SpecValidateRequestDto>, res: Response, next: NextFunction) {
  const parse = SpecValidateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json(formatZodErrors(parse.error));
  }
  return next();
}

export default { validateImportBody, validateValidateBody };

export default { validateImportBody, validateValidateBody };
