import {
  getTRPCErrorShape,
  transformTRPCResponse,
  TRPCError,
  type TRPC_ERROR_CODE_KEY,
} from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type {
  FastifyBaseLogger,
  FastifyError,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { appRouter } from "../api/router.ts";

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Fastify errors raised before tRPC runs
function toTRPCCode(status: number | undefined): TRPC_ERROR_CODE_KEY {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
    case HTTP_STATUS.URI_TOO_LONG:
      return "BAD_REQUEST";
    case HTTP_STATUS.PAYLOAD_TOO_LARGE:
      return "PAYLOAD_TOO_LARGE";
    case HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE:
      return "UNSUPPORTED_MEDIA_TYPE";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}

export function handleError(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) {
  respondWithError(
    reply,
    new TRPCError({
      code: toTRPCCode(error.statusCode),
      message: error.message,
      cause: error,
    }),
  );
}

export function handleNotFound(request: FastifyRequest, reply: FastifyReply) {
  respondWithError(
    reply,
    new TRPCError({
      code: "NOT_FOUND",
      message: `No route for ${request.url}`,
    }),
  );
}

export function logError(log: FastifyBaseLogger, error: TRPCError) {
  if (getHTTPStatusCodeFromError(error) >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    log.error(error);
  } else {
    log.info(error);
  }
}

function respondWithError(reply: FastifyReply, error: TRPCError) {
  logError(reply.log, error);
  const config = appRouter._def._config;
  const shape = getTRPCErrorShape({
    config,
    error,
    type: "unknown",
    path: undefined,
    input: undefined,
    ctx: undefined,
  });

  reply
    .status(getHTTPStatusCodeFromError(error))
    .send(transformTRPCResponse(config, { error: shape }));
}
