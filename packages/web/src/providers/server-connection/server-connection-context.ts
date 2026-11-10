import { createRequiredContext } from "@/utils/create-required-context";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export const [ServerConnectionContext, useServerConnectionStatus] =
  createRequiredContext<ConnectionStatus>({
    hookName: "useServerConnectionStatus",
    providerName: "ServerConnectionProvider",
  });
