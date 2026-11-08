import { use } from "react";

import type { ColorMode, ColorModeChoice } from "@/lib/color-mode";

import { ColorModeContext } from "./color-mode-context";
import type { ColorModeContextValue } from "./color-mode-context";

export type { ColorMode, ColorModeChoice };

export type UseColorModeResult = ColorModeContextValue;

export function useColorMode(): UseColorModeResult {
  const value = use(ColorModeContext);
  if (!value) {
    throw new Error("useColorMode must be used inside ColorModeProvider");
  }
  return value;
}
