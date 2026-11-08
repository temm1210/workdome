import { createEventBus } from "./event-bus.ts";

// App events sent to the screen (each feature adds the events it emits)
export type AppEvent = never;

export const appEvents = createEventBus<AppEvent>();
