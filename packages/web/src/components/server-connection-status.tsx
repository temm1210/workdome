import type { ConnectionStatus } from "@/hooks/use-server-connection/types";

export type ServerConnectionStatusProps = { status: ConnectionStatus };

const label: Record<ConnectionStatus, string> = {
  connecting: "서버 연결 중",
  connected: "서버 연결됨",
  disconnected: "서버 연결 안 됨",
};

export function ServerConnectionStatus({
  status,
}: ServerConnectionStatusProps) {
  return <p>{label[status]}</p>;
}
