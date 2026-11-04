import type { ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

type AppLayoutProps = { children: ReactNode };

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Group orientation="horizontal" className="h-dvh">
      <Panel
        defaultSize="15rem"
        minSize="12rem"
        maxSize="25rem"
        groupResizeBehavior="preserve-pixel-size"
      />
      <Separator className="w-px bg-border" />
      <Panel className="min-w-0">{children}</Panel>
    </Group>
  );
}
