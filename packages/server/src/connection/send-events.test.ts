import { MessageChannel } from "node:worker_threads";

import { describe, expect, it } from "vitest";

import { sendEventsToClient } from "./send-events.ts";

describe("sendEventsToClient", () => {
  it("상대 포트가 닫히면 끝난다", async () => {
    const { port1, port2 } = new MessageChannel();
    const sending = sendEventsToClient(port1);
    port2.close();
    await expect(sending).resolves.toBeUndefined();
  });
});
