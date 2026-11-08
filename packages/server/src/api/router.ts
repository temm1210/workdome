import { initTRPC, TRPCError } from "@trpc/server";

import { appEvents } from "../engine/events/app-events.ts";

const t = initTRPC.create({
  isDev: false,
  sse: {
    ping: { enabled: true, intervalMs: 2000 },
    client: { reconnectAfterInactivityMs: 5000 },
  },
});

export const appRouter = t.router({
  events: t.procedure.subscription(({ signal }) => {
    if (!signal) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Subscriptions need an abort signal",
      });
    }
    return appEvents.subscribe(signal);
  }),
});

export type AppRouter = typeof appRouter;
