import type { ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { ColorModeSwitcher } from "@/components/color-mode-switcher";

export type AppLayoutProps = { children: ReactNode };

export function AppLayout({ children }: AppLayoutProps) {
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
        <Panel className="min-w-0">{children}</Panel>
      </Group>
    </div>
  );
}
