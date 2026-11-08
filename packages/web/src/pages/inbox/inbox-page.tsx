import { ServerConnectionStatus } from "@/components/server-connection-status";
import { useServerConnection } from "@/hooks";

export function InboxPage() {
  const { status } = useServerConnection();
  return (
    <>
      <h1>workdome</h1>
      <ServerConnectionStatus status={status} />
    </>
  );
}
