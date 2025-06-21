import type { Env as HonoEnv } from 'hono';

//? Hono env config
export interface Env extends HonoEnv {
	// biome-ignore lint/complexity/noBannedTypes:
	Bindings: {};
}
