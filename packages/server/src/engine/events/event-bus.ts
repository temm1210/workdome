import { EventEmitter, on } from "node:events";

export function createEventBus<Event>() {
  // No listener limit (one listener per subscriber)
  const emitter = new EventEmitter().setMaxListeners(Infinity);

  return {
    publish(event: Event) {
      emitter.emit("published", event);
    },
    async *subscribe(signal: AbortSignal): AsyncGenerator<Event> {
      try {
        for await (const [event] of on(emitter, "published", { signal })) {
          yield event;
        }
      } catch (error) {
        if (signal.aborted) return;
        throw error;
      }
    },
  };
}
