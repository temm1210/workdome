import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  retryLink,
  splitLink,
} from "@trpc/client";
import type { TRPCClientError } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@workdome/server";

export const queryClient = new QueryClient();

const apiUrl = "/api";

const isConnectionError = (error: TRPCClientError<AppRouter>) => !error.data;

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: [
        retryLink({
          retry: ({ error }) => isConnectionError(error),
          retryDelayMs: (attempt) => Math.min(1000 * 2 ** (attempt - 1), 5000),
        }),
        httpSubscriptionLink({ url: apiUrl }),
      ],
      false: httpBatchLink({ url: apiUrl }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
