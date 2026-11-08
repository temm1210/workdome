import { describe, expect, it } from "vitest";

import { appRouter } from "./router.ts";

describe("events", () => {
  it("signal을 abort하면 구독이 끝난다", async () => {
    const connection = new AbortController();
    const caller = appRouter.createCaller({}, { signal: connection.signal });
    const events = (await caller.events())[Symbol.asyncIterator]();
    const next = events.next();
    connection.abort();
    expect(await next).toEqual({ value: undefined, done: true });
  });

  it("signal 없이 구독하면 에러를 낸다", async () => {
    const caller = appRouter.createCaller({});
    await expect(caller.events()).rejects.toThrow(
      "Subscriptions need an abort signal",
    );
  });
});
