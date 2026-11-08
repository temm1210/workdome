import { useSubscription } from "@trpc/tanstack-react-query";

import { queryClient, trpc } from "@/lib/trpc";

export function useEventsSubscription() {
  return useSubscription(
    trpc.events.subscriptionOptions(undefined, {
      // Refetch everything on (re)connect
      onStarted: () => {
        void queryClient.invalidateQueries();
      },
    }),
  );
}

export type UseEventsSubscriptionResult = ReturnType<
  typeof useEventsSubscription
>;
