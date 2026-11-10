import type { ReactNode } from "react";

import { ServerConnectionContext } from "./server-connection-context";
import { useServerConnection } from "./use-server-connection";

export type ServerConnectionProviderProps = { children: ReactNode };

export function ServerConnectionProvider({
  children,
}: ServerConnectionProviderProps) {
  const { status } = useServerConnection();
  return (
    <ServerConnectionContext value={status}>{children}</ServerConnectionContext>
  );
}
