import type { AppEvent, EventMessage } from "@workdome/shared";

import { eventBus } from "../engine/events/event-bus.ts";

type ClientPort = {
  postMessage(message: EventMessage<AppEvent>): void;
  on(event: "close", listener: () => void): unknown;
};

export async function sendEventsToClient(port: ClientPort) {
  const connection = new AbortController();
  port.on("close", () => connection.abort());
  for await (const event of eventBus.subscribe(connection.signal)) {
    port.postMessage({ type: "event", event });
  }
}
