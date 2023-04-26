interface Env {}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {},
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {},
};
