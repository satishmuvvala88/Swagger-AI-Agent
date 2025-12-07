import { Request, Response, NextFunction } from 'express';
import Logger from '../../infrastructure/logging/Logger';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  Logger.info('%s %s', req.method, req.originalUrl);
  next();
}
