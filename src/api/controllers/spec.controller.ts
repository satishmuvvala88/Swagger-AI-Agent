import { Request, Response } from 'express';

export async function importSpec(_req: Request, res: Response) {
  // Phase 1: route skeleton — actual ingestion implemented in later phases
  res.status(501).json({ message: 'spec.import not implemented yet' });
}

export async function validateSpec(_req: Request, res: Response) {
  res.status(501).json({ message: 'spec.validate not implemented yet' });
}

export async function getSpec(req: Request, res: Response) {
  const { specId } = req.params;
  res.status(501).json({ message: 'spec.get not implemented yet', specId });
}

export async function getOperations(req: Request, res: Response) {
  const { specId } = req.params;
  res.status(501).json({ message: 'spec.operations not implemented yet', specId });
}
