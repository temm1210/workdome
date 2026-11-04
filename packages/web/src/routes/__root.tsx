import { createRootRoute, Outlet } from "@tanstack/react-router";

import { AppLayout } from "@/components/layouts/app-layout";

export const Route = createRootRoute({
  component: RootRouteComponent,
});

function RootRouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
