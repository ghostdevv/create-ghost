import type { HonoEnv } from './types';
import { logger } from 'hono/logger';
import { Hono } from 'hono';

const app = new Hono<HonoEnv>();

app.use('*', logger());

app.get('/', (c) => {
	return c.text('Hello World');
});

export default app;
