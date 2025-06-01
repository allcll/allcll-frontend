import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.ts';

const server = setupWorker();
server.use(...handlers);

export { server };
