import { useEventsSubscription } from "@/queries/events";
import type { UseEventsSubscriptionResult } from "@/queries/events";

import type { ConnectionStatus } from "../types";

const connectionStatus: Record<
  UseEventsSubscriptionResult["status"],
  ConnectionStatus
> = {
  idle: "disconnected",
  connecting: "connecting",
  pending: "connected",
  error: "disconnected",
};

export type UseServerConnectionResult = { status: ConnectionStatus };

export function useServerConnection(): UseServerConnectionResult {
  const subscription = useEventsSubscription();
  return { status: connectionStatus[subscription.status] };
}
