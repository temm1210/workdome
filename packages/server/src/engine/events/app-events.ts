import type { AppEvent } from "@workdome/shared";

import { createEventBus } from "./event-bus.ts";

export const appEvents = createEventBus<AppEvent>();
