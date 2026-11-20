export type WorkdomeApi = {
  setColorModeChoice: (choice: "system" | "light" | "dark") => void;
};

// Each feature adds the events it emits
export type AppEvent = never;

export type EventMessage<Event> = { type: "event"; event: Event };
