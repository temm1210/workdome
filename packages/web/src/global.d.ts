import type { WorkdomeApi } from "@workdome/shared";

declare global {
  interface Window {
    workdome?: WorkdomeApi;
  }
}
