import type { QueryStatus } from "@tanstack/react-query";

import { usePingQuery } from "@/queries/ping";

import type { ConnectionStatus } from "../types";

const connectionStatus: Record<QueryStatus, ConnectionStatus> = {
  pending: "connecting",
  success: "connected",
  error: "disconnected",
};

export function useServerConnection() {
  const query = usePingQuery();
  return { status: connectionStatus[query.status] };
}
