import { configDefaults, defineProject, mergeConfig } from "vitest/config";

import shared from "../../vitest.shared.ts";

export default mergeConfig(
  shared,
  defineProject({
    resolve: { tsconfigPaths: true },
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      setupFiles: ["./test-setup.ts"],
    },
  }),
);
