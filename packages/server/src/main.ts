import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import Fastify from "fastify";

import { appRouter, type AppRouter } from "./router.ts";

const HOST = "127.0.0.1";
const PORT = 4310;
const API_PREFIX = "/api";
const MAX_URL_PARAM_LENGTH = 5000;

const server = Fastify({
  logger: true,
  routerOptions: { maxParamLength: MAX_URL_PARAM_LENGTH },
});

await server.register(fastifyTRPCPlugin, {
  prefix: API_PREFIX,
  trpcOptions: {
    router: appRouter,
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

await server.listen({ host: HOST, port: PORT });
