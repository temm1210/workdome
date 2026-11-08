import { createContext, use } from "react";

export function createRequiredContext<T>({
  hookName,
  providerName,
}: {
  hookName: string;
  providerName: string;
}) {
  const Context = createContext<T | null>(null);

  function useRequiredContext(): T {
    const value = use(Context);
    if (value === null) {
      throw new Error(`${hookName} must be used inside ${providerName}`);
    }
    return value;
  }

  return [Context, useRequiredContext] as const;
}
