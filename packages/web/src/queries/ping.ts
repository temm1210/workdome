import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/lib/trpc";

export function usePingQuery() {
  return useQuery(trpc.ping.queryOptions({ message: "ping" }));
}

export type UsePingQueryResult = ReturnType<typeof usePingQuery>;
