import { usePingQuery } from "@/queries/ping";
import type { UsePingQueryResult } from "@/queries/ping";

import type { ConnectionStatus } from "../types";

const connectionStatus: Record<UsePingQueryResult["status"], ConnectionStatus> =
  {
    pending: "connecting",
    success: "connected",
    error: "disconnected",
  };

export type UseServerConnectionResult = { status: ConnectionStatus };

export function useServerConnection(): UseServerConnectionResult {
  const query = usePingQuery();
  return { status: connectionStatus[query.status] };
}
