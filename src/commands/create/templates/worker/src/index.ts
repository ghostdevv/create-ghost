import { Router, compose } from 'worktop';
import type { Context } from './types';
import * as CORS from 'worktop/cors';
import { start } from 'worktop/cfw';

// Create new Router
const API = new Router<Context>();

API.prepare = compose(
    // Attach global CORS config
    CORS.preflight({
        maxage: 3600 * 6, // 6 hr
        credentials: true,
    }),
);

// Initialize: Module Worker
export default start(API.run);
