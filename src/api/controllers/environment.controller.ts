import { Request, Response } from 'express';

export async function createEnvironment(_req: Request, res: Response) {
  res.status(501).json({ message: 'environment.create not implemented yet' });
}

export async function listEnvironmentsForSpec(req: Request, res: Response) {
  const { specId } = req.params;
  res.status(501).json({ message: 'environment.list not implemented yet', specId });
}

export async function getEnvironment(req: Request, res: Response) {
  const { envId } = req.params;
  res.status(501).json({ message: 'environment.get not implemented yet', envId });
}

export async function updateEnvironment(req: Request, res: Response) {
  const { envId } = req.params;
  res.status(501).json({ message: 'environment.update not implemented yet', envId });
}

export async function deleteEnvironment(req: Request, res: Response) {
  const { envId } = req.params;
  res.status(501).json({ message: 'environment.delete not implemented yet', envId });
}
