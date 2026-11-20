import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Fake workdome global, set before each test file loads its imports
window.workdome = { setColorModeChoice: vi.fn() };

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
