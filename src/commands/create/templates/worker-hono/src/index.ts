import { logger } from 'hono/logger';
import type { Env } from './types';
import { Hono } from 'hono';

const app = new Hono<Env>();

app.use('*', logger());

app.get('/', (c) => {
    return c.text('Hello World');
});

export default app;
