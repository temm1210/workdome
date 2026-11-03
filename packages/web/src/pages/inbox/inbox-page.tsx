import { ServerConnectionStatus } from "@/features/server-connection/components/server-connection-status";
import { useServerConnection } from "@/features/server-connection/hooks/use-server-connection";

export function InboxPage() {
  const { status } = useServerConnection();
  return (
    <>
      <h1>workdome</h1>
      <ServerConnectionStatus status={status} />
    </>
  );
}
