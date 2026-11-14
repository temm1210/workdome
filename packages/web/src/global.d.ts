import type { WorkdomeBridge } from "@workdome/core";

declare global {
  interface Window {
    workdome?: WorkdomeBridge;
  }
}
