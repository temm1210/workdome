import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import Fastify from "fastify";

import { appRouter, type AppRouter } from "./api/router.ts";
import { handleError, handleNotFound, logError } from "./http/error.ts";

const server = Fastify({
  logger: { redact: ["input.token", "input.password"] },
  // tRPC batch paths exceed the default 100
  routerOptions: { maxParamLength: 5000 },
  frameworkErrors: handleError,
});

server.setErrorHandler(handleError);
server.setNotFoundHandler(handleNotFound);
await server.register(fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: {
    router: appRouter,
    onError: ({ error, req, path, input }) =>
      logError(req.log.child({ path, input }), error),
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

await server.listen({ host: "127.0.0.1", port: 4310 });
