import type { ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { ColorModeSwitcher } from "@/components/color-mode-switcher";
import { ServerConnectionStatusMessage } from "@/components/server-connection-status-message";
import { useServerConnectionStatus } from "@/providers/server-connection";

export type AppLayoutProps = { children: ReactNode };

export function AppLayout({ children }: AppLayoutProps) {
  const serverConnectionStatus = useServerConnectionStatus();
  return (
    <div className="h-dvh">
      <Group orientation="horizontal">
        <Panel
          defaultSize="15rem"
          minSize="12rem"
          maxSize="25rem"
          groupResizeBehavior="preserve-pixel-size"
        >
          <aside className="flex h-full flex-col">
            <div className="shrink-0 border-b border-border p-2">
              <ColorModeSwitcher />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2" />
          </aside>
        </Panel>
        <Separator className="w-0.5 bg-border transition-colors data-[separator=hover]:bg-muted-foreground data-[separator=active]:bg-foreground" />
        <Panel className="relative min-w-0">
          {children}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <ServerConnectionStatusMessage status={serverConnectionStatus} />
          </div>
        </Panel>
      </Group>
    </div>
  );
}
