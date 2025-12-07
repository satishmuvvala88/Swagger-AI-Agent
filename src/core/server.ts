import app from './app';
import env from './env';
import Logger from '../infrastructure/logging/Logger';

const port = parseInt(env.PORT, 10) || 3000;

app.listen(port, () => {
  Logger.info('Server listening on %d', port);
  // eslint-disable-next-line no-console
  console.log(`Server listening on ${port}`);
});
