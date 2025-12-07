import { Request, Response, NextFunction } from 'express';
import Logger from '../../infrastructure/logging/Logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err?.status || 500;
  Logger.error('Error: %s', err?.message || err);
  res.status(status).json({ error: err?.message || 'Internal Server Error' });
}
