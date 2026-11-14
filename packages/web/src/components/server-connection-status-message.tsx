import type { ReactNode } from "react";
import { Spinner } from "@workdome/ui";

import type { ConnectionStatus } from "@/providers/server-connection";

export type ServerConnectionStatusMessageProps = { status: ConnectionStatus };

const MESSAGE: Record<ConnectionStatus, ReactNode> = {
  connecting: (
    <>
      <Spinner />
      서버에 연결하는 중
    </>
  ),
  connected: null,
  disconnected: "서버에 연결할 수 없어요",
};

export function ServerConnectionStatusMessage({
  status,
}: ServerConnectionStatusMessageProps) {
  return (
    <div role="status">
      {MESSAGE[status] && (
        <p className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-sm">
          {MESSAGE[status]}
        </p>
      )}
    </div>
  );
}
