import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createRequiredContext } from "./create-required-context";

describe("createRequiredContext", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Provider 밖에서 쓰면 훅 이름과 Provider 이름이 담긴 에러가 난다", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const [, useRequiredContext] = createRequiredContext<{ name: string }>({
      hookName: "useTest",
      providerName: "TestProvider",
    });
    expect(() => renderHook(() => useRequiredContext())).toThrow(
      "useTest must be used inside TestProvider",
    );
  });
});
