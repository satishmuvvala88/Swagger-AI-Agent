import express from 'express';
import bodyParser from 'body-parser';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import apiRouter from '../api/routes/index';

const app = express();

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', apiRouter);

// generic error handler
app.use(errorHandler as any);

export default app;
