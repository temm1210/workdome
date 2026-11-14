import type { ConnectionStatus } from "./server-connection-context";

export type UseServerConnectionResult = { status: ConnectionStatus };

// No channel to the server yet
export function useServerConnection(): UseServerConnectionResult {
  return { status: "disconnected" };
}
