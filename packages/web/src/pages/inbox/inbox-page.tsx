import { ServerConnectionStatus } from "@/components/server-connection-status";
import { useServerConnectionStatus } from "@/providers/server-connection";

export function InboxPage() {
  const status = useServerConnectionStatus();
  return (
    <>
      <h1>workdome</h1>
      <ServerConnectionStatus status={status} />
    </>
  );
}
