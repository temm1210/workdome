import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UiProvider } from "@workdome/ui";

import { queryClient } from "@/lib/trpc";
import { ColorModeProvider } from "@/providers/color-mode";
import { ServerConnectionProvider } from "@/providers/server-connection";
import "./index.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Missing #root element in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <UiProvider>
      <ColorModeProvider>
        <QueryClientProvider client={queryClient}>
          <ServerConnectionProvider>
            <RouterProvider router={router} />
          </ServerConnectionProvider>
        </QueryClientProvider>
      </ColorModeProvider>
    </UiProvider>
  </StrictMode>,
);
